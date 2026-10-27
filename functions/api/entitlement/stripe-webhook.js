import { DIRECT_PRODUCTS_BY_LINK, recordEvent } from '../../_lib/calculator.js'

export async function onRequestPost({ request, env }) {
  const body = await request.text()
  const header = request.headers.get('stripe-signature') || ''

  if (!(await verifyStripeSignature(header, body, env.STRIPE_WEBHOOK_SECRET))) {
    return json({ ok: false, error: 'invalid_signature' }, 400)
  }

  let event
  try {
    event = JSON.parse(body)
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400)
  }

  // D1 provides the durable, unique event receipt. KV alone is eventually consistent and
  // cannot safely coordinate concurrent Stripe retries, so fail closed without D1.
  if (!env.CALCULATOR_DB) return json({ ok: false, error: 'event_store_unavailable' }, 503)
  const receipt = await recordEvent(env.CALCULATOR_DB, event)
  if (!receipt.accepted && !receipt.duplicate) {
    return json({ received: true, ignored: true, reason: receipt.reason })
  }

  // D1 commits the event receipt before the KV side effect. If KV fails, Stripe
  // retries the same event ID; a duplicate receipt must repair the missing
  // entitlement rather than returning 200 and permanently losing access.
  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    const session = event.data?.object || {}
    const product = DIRECT_PRODUCTS_BY_LINK[session.payment_link]

    if (product && (session.payment_status === 'paid' || session.payment_status === 'no_payment_required')) {
      if (!env.ENTITLEMENTS?.get || !env.ENTITLEMENTS?.put) {
        return json({ ok: false, error: 'entitlement_store_unavailable' }, 503)
      }
      const key = 'session:' + session.id
      try {
        // Sequential replays are no-ops; a missing KV value is recoverable.
        if (!(await env.ENTITLEMENTS.get(key))) {
          await env.ENTITLEMENTS.put(key, JSON.stringify({
            session_id: session.id,
            product,
            payment_link: session.payment_link,
            payment_status: session.payment_status,
            customer: session.customer || null,
            customer_email: session.customer_details?.email || session.customer_email || null,
            amount_total: session.amount_total,
            currency: session.currency,
            created: session.created,
            recorded_at: new Date().toISOString(),
          }))
        }
      } catch {
        // Never acknowledge a signed paid event while its entitlement is absent.
        return json({ ok: false, error: 'entitlement_store_unavailable' }, 503)
      }
    }
  }

  return json({ received: true, duplicate: receipt.duplicate })
}

async function verifyStripeSignature(header, body, secret) {
  if (!secret) return false

  const entries = header.split(',').map(part => part.split('='))
  const timestamp = entries.find(([key]) => key === 't')?.[1]
  const signatures = entries.filter(([key]) => key === 'v1').map(([, value]) => value)

  if (!timestamp || !signatures.length) return false

  const age = Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp))
  if (!Number.isFinite(age) || age > 300) return false

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )

  const mac = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(timestamp + '.' + body),
  )

  const expected = [...new Uint8Array(mac)]
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')

  return signatures.some(signature => timingSafeEqual(expected, signature))
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    },
  })
}
