export const TIERS_BY_LINK = {
  plink_1UOBYhGx1CvHyKS2SSkXLnNH: 'starter',
  plink_1UOBYjGx1CvHyKS2kQPuwDXM: 'pro',
  plink_1UOBYlGx1CvHyKS2iN3qXVpc: 'business',
}
export const TIERS_BY_PRICE = {
  price_1U1SXgGx1CvHyKS2bIEopIuZ: 'starter',
  price_1UGqPfGx1CvHyKS2RBou35pV: 'pro',
  price_1UGqPgGx1CvHyKS2969375gG: 'business',
}
export const FORMULA_VERSION = 'operational-1.0.0'
export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {status, headers: {'content-type':'application/json', 'cache-control':'no-store', 'x-content-type-options':'nosniff', ...headers}})
}
export function sameOrigin(request) {
  return request.headers.get('origin') === new URL(request.url).origin
}
export async function digest(value) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2,'0')).join('')
}
export async function accessForOrder(db, order, now = Math.floor(Date.now()/1000)) {
  if (!order?.paid) return null
  const rows = (await db.prepare('SELECT kind,payload FROM calculator_events WHERE subject=? ORDER BY created DESC,priority DESC,id DESC').bind(order.subscription).all()).results
  const state = rows.find(r => r.kind === 'subscription')
  if (!state) return null
  const sub = JSON.parse(state.payload)
  const items = sub.items?.data || []
  const tier = items.length === 1 ? TIERS_BY_PRICE[items[0].price?.id] : null
  const end = sub.current_period_end || items[0]?.current_period_end || 0
  // Fail closed on missing state, changed/unrecognized plans, payment failures, and elapsed periods.
  const invoice = rows.find(r => r.kind === 'invoice')
  const invoiceState = invoice ? JSON.parse(invoice.payload) : null
  const paymentOk = !invoiceState || invoiceState.paid === true
  if (sub.status !== 'active' || sub.pause_collection || end <= now || !tier || !paymentOk) return null
  return {customer:order.customer, subscription:order.subscription, tier, period_end:end}
}
export async function authenticate(request, env) {
  if (!env.CALCULATOR_DB) return null
  const value = request.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith('__Host-eve_access='))?.slice(18)
  if (!value || !/^[a-f0-9]{64}$/.test(value)) return null
  const login = await env.CALCULATOR_DB.prepare('SELECT session FROM calculator_access WHERE token_hash=? AND expires>?').bind(await digest(value),Math.floor(Date.now()/1000)).first()
  if (!login) return null
  const order = await env.CALCULATOR_DB.prepare('SELECT * FROM calculator_orders WHERE session=?').bind(login.session).first()
  return accessForOrder(env.CALCULATOR_DB, order)
}
export async function recordEvent(db, event) {
  if (!event?.id || !Number.isInteger(event.created) || event.livemode !== true) return
  const object = structuredClone(event.data?.object || {})
  let subject, kind, priority = 0
  if (event.type.startsWith('customer.subscription.')) {
    subject = object.id; kind = 'subscription'
    if (event.type === 'customer.subscription.deleted') object.status = 'canceled'
    priority = object.status === 'active' ? 0 : 1
  } else if (['invoice.paid','invoice.payment_failed'].includes(event.type)) {
    subject = object.subscription || object.parent?.subscription_details?.subscription
    kind = 'invoice'; priority = event.type === 'invoice.payment_failed' ? 1 : 0
    object.paid = event.type === 'invoice.paid' && object.status === 'paid'
  } else if (event.type.startsWith('checkout.session.')) {
    const tier = TIERS_BY_LINK[object.payment_link]
    if (!tier || !object.id || !object.customer || !object.subscription) return
    subject = object.subscription; kind = 'checkout'
  } else return
  if (!subject) return
  const statements = [db.prepare('INSERT OR IGNORE INTO calculator_events(id,subject,kind,created,priority,payload) VALUES(?,?,?,?,?,?)').bind(event.id,subject,kind,event.created,priority,JSON.stringify(object))]
  if (kind === 'checkout') {
    const paid = ['checkout.session.completed','checkout.session.async_payment_succeeded'].includes(event.type) && object.payment_status === 'paid'
    statements.push(db.prepare('INSERT INTO calculator_orders(session,customer,subscription,tier,paid,created) VALUES(?,?,?,?,?,?) ON CONFLICT(session) DO UPDATE SET paid=excluded.paid,created=excluded.created WHERE excluded.created>calculator_orders.created OR (excluded.created=calculator_orders.created AND excluded.paid<calculator_orders.paid)').bind(object.id,object.customer,object.subscription,TIERS_BY_LINK[object.payment_link],Number(paid),event.created))
  }
  await db.batch(statements)
}
export function calculate(input) {
  const keys = ['hours','hourlyRate','revenue','expenses','automatedHours','evidenceCount','recordCount']
  if (!input || typeof input !== 'object' || keys.some(k => typeof input[k] !== 'number' || !Number.isFinite(input[k]) || input[k]<0 || input[k]>1e9)) throw new Error('All inputs must be finite nonnegative numbers up to 1 billion.')
  if (!Number.isInteger(input.evidenceCount) || !Number.isInteger(input.recordCount) || input.evidenceCount>input.recordCount || input.automatedHours>input.hours) throw new Error('Evidence counts must be integers within record count; automated hours cannot exceed hours.')
  const money = n => Math.round((n+Number.EPSILON)*100)/100
  const laborCost = money(input.hours*input.hourlyRate)
  const totalCost = money(laborCost+input.expenses)
  const profit = money(input.revenue-totalCost)
  return {laborCost,totalCost,profit,marginPercent:input.revenue===0?null:money(profit/input.revenue*100),estimatedTimeValue:money(input.automatedHours*input.hourlyRate),evidenceCoverage:input.recordCount===0?null:money(input.evidenceCount/input.recordCount*100)}
}
