const PRODUCT_BY_LINK = {
  'plink_1UNipIGx1CvHyKS26Sm9X2vZ': 'book-01',
  'plink_1UNipNGx1CvHyKS2qbVJf1ym': 'book-02',
  'plink_1UNipSGx1CvHyKS2sTExcIpE': 'book-03',
  'plink_1UNipXGx1CvHyKS2oxJnmmVp': 'book-04',
  'plink_1UNiqEGx1CvHyKS2UjJeX97o': 'book-05',
  'plink_1UNipoGx1CvHyKS2MBevO2Kg': 'book-06',
  'plink_1UNiq9Gx1CvHyKS2N03F3fju': 'book-07',
  'plink_1UNi9IGx1CvHyKS2xiw4DDTY': 'vault',
  'plink_1UNixyGx1CvHyKS2TM06Dv7t': 'starter-template'
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (request.method === 'GET' && url.pathname.endsWith('/health')) {
      return json({
        ok: true,
        service: 'eve-entitlement',
        kv_bound: Boolean(env.ENTITLEMENTS),
        webhook_secret_configured: Boolean(env.STRIPE_WEBHOOK_SECRET),
      })
    }

    if (request.method === 'GET' && url.pathname.endsWith('/verify')) {
      const sessionId = url.searchParams.get('session_id') || ''
      const product = url.searchParams.get('product') || ''
      if (!sessionId.startsWith('cs_')) {
        return json({ authorized: false, reason: 'missing_or_invalid_session' }, 400)
      }
      const raw = await env.ENTITLEMENTS.get('session:' + sessionId)
      if (!raw) return json({ authorized: false, reason: 'not_found' }, 404)
      const entitlement = JSON.parse(raw)
      const authorized = !product || entitlement.product === product || entitlement.product === 'vault'
      return json({
        authorized,
        product: entitlement.product,
        payment_status: entitlement.payment_status,
        created: entitlement.created,
      }, authorized ? 200 : 403)
    }

    if (request.method === 'POST' && url.pathname.endsWith('/stripe-webhook')) {
      const body = await request.text()
      const signature = request.headers.get('stripe-signature') || ''
      if (!(await verifyStripeSignature(signature, body, env.STRIPE_WEBHOOK_SECRET))) {
        return json({ ok: false, error: 'invalid_signature' }, 400)
      }

      let event
      try {
        event = JSON.parse(body)
      } catch {
        return json({ ok: false, error: 'invalid_json' }, 400)
      }

      if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
        const session = event.data?.object || {}
        const product = PRODUCT_BY_LINK[session.payment_link]
        if (product && (session.payment_status === 'paid' || session.payment_status === 'no_payment_required')) {
          await env.ENTITLEMENTS.put('session:' + session.id, JSON.stringify({
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
      }

      return json({ received: true })
    }

    return json({ ok: false, error: 'not_found' }, 404)
  },
}

async function verifyStripeSignature(header, body, secret) {
  if (!secret) return false
  const entries = header.split(',').map(part => part.split('='))
  const timestamp = entries.find(([k]) => k === 't')?.[1]
  const signatures = entries.filter(([k]) => k === 'v1').map(([,v]) => v)
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
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(timestamp + '.' + body))
  const expected = [...new Uint8Array(mac)].map(b => b.toString(16).padStart(2, '0')).join('')
  return signatures.some(sig => timingSafeEqual(expected, sig))
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
