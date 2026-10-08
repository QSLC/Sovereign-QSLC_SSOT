import {authenticate,calculate,FORMULA_VERSION,json,sameOrigin} from '../_lib/calculator.js'
export async function onRequest({request,env}) {
  if (!['GET','POST','DELETE'].includes(request.method)) return json({error:'method_not_allowed'},405)
  if (request.method !== 'GET' && !sameOrigin(request)) return json({error:'origin_not_allowed'},403)
  const access=await authenticate(request,env)
  if (!access) return json({error:'paid_access_required'},401)
  if (request.method === 'DELETE') return json({ok:true},200,{'set-cookie':'__Host-eve_access=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'})
  if (request.method === 'GET') {
    const runs=await env.CALCULATOR_DB.prepare('SELECT id,created,source,inputs,results,formula_version FROM calculator_runs WHERE customer=? ORDER BY created DESC LIMIT 50').bind(access.customer).all()
    return json({tier:access.tier,period_end:access.period_end,runs:runs.results.map(r=>({...r,inputs:JSON.parse(r.inputs),results:JSON.parse(r.results)}))})
  }
  const text=await request.text()
  if (text.length>4096) return json({error:'input_too_large'},413)
  let data,results
  try {
    data=JSON.parse(text)
    if (typeof data.source!=='string' || data.source.trim().length<3 || data.source.length>120) throw new Error('Provide a source label of 3–120 characters.')
    results=calculate(data.inputs)
  } catch(e) {return json({error:e.message},400)}
  const quota={starter:100,pro:1000,business:10000}[access.tier]
  const id=crypto.randomUUID(),created=new Date().toISOString(), month=created.slice(0,7)
  // Quota check and insertion are a single SQL statement to prevent concurrent bypass.
  const saved=await env.CALCULATOR_DB.prepare('INSERT INTO calculator_runs(id,customer,created,source,inputs,results,formula_version) SELECT ?,?,?,?,?,?,? WHERE (SELECT count(*) FROM calculator_runs WHERE customer=? AND substr(created,1,7)=?)<?').bind(id,access.customer,created,data.source.trim(),JSON.stringify(data.inputs),JSON.stringify(results),FORMULA_VERSION,access.customer,month,quota).run()
  if (!saved.meta.changes) return json({error:'monthly_calculation_limit_reached'},429)
  return json({id,created,source:data.source.trim(),inputs:data.inputs,results,formula_version:FORMULA_VERSION,classification:'customer_supplied_unverified'})
}
