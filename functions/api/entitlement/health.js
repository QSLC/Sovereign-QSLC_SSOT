export async function onRequestGet({ env }) {
  return json({
    ok: true,
    service: 'eve-entitlement',
    kv_bound: Boolean(env.ENTITLEMENTS),
    webhook_secret_configured: Boolean(env.STRIPE_WEBHOOK_SECRET),
  })
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
