import {accessForOrder,digest,json,sameOrigin} from '../../_lib/calculator.js'
export async function onRequestPost({request,env}) {
  if (!sameOrigin(request)) return json({error:'origin_not_allowed'},403)
  if (!env.CALCULATOR_DB) return json({error:'storage_not_configured'},503)
  let data
  try {data=await request.json()} catch {return json({error:'invalid_json'},400)}
  if (!/^cs_live_[A-Za-z0-9_]{20,}$/.test(data.session_id || '')) return json({error:'invalid_session'},400)
  const order = await env.CALCULATOR_DB.prepare('SELECT * FROM calculator_orders WHERE session=?').bind(data.session_id).first()
  const access = await accessForOrder(env.CALCULATOR_DB,order)
  if (!access) return json({error:'awaiting_verified_payment_and_subscription'},409)
  const bytes=crypto.getRandomValues(new Uint8Array(32))
  const credential=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('')
  const result=await env.CALCULATOR_DB.prepare('INSERT OR IGNORE INTO calculator_access(session,token_hash,expires) VALUES(?,?,?)').bind(data.session_id,await digest(credential),Math.floor(Date.now()/1000)+2592000).run()
  if (!result.meta.changes) return json({error:'already_claimed_use_original_browser'},409)
  return json({authorized:true,tier:access.tier},200,{'set-cookie':`__Host-eve_access=${credential}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000`})
}
