export async function onRequestGet({ request, env }) {
  const url = new URL(request.url)
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
