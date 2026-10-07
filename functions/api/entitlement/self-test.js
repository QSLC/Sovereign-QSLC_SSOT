export async function onRequestGet({ env }) {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    return json({ ok: false, error: 'webhook_secret_not_configured' }, 503)
  }

  const event = {
    id: 'evt_eve_entitlement_self_test',
    object: 'event',
    type: 'eve.entitlement.self_test',
    data: { object: { id: 'self_test' } },
  }

  const body = JSON.stringify(event)
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const signature = await hmacHex(env.STRIPE_WEBHOOK_SECRET, timestamp + '.' + body)

  const response = await fetch('https://sovereign-qslc-ssot.pages.dev/api/entitlement/stripe-webhook', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'stripe-signature': 't=' + timestamp + ',v1=' + signature,
    },
    body,
  })

  const downstream = await response.text()
  return json({
    ok: response.ok,
    downstream_status: response.status,
    downstream_body: downstream,
  }, response.ok ? 200 : 502)
}

async function hmacHex(secret, payload) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  return [...new Uint8Array(mac)].map(b => b.toString(16).padStart(2, '0')).join('')
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
