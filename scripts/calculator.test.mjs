import test from 'node:test'
import assert from 'node:assert/strict'
import {DatabaseSync} from 'node:sqlite'
import {readFileSync} from 'node:fs'
import {createHmac} from 'node:crypto'
import {recordEvent,accessForOrder,authenticate,calculate} from '../functions/_lib/calculator.js'
import {onRequestPost as claim} from '../functions/api/entitlement/claim.js'
import {onRequestPost as webhook} from '../functions/api/entitlement/stripe-webhook.js'
import {onRequest as calculator} from '../functions/api/calculator.js'
const now=Math.floor(Date.now()/1000)
const sid=`cs_live_${'a'.repeat(24)}`
function setup(){
  const sqlite=new DatabaseSync(':memory:');sqlite.exec(readFileSync(new URL('../migrations/0001_calculator.sql',import.meta.url),'utf8'))
  const db={prepare(sql){let args=[];return {bind(...values){args=values;return this},async first(){return sqlite.prepare(sql).get(...args)||null},async all(){return {results:sqlite.prepare(sql).all(...args)}},async run(){const r=sqlite.prepare(sql).run(...args);return {meta:{changes:Number(r.changes)}}}}},async batch(items){sqlite.exec('BEGIN');try{const r=[];for(const s of items)r.push(await s.run());sqlite.exec('COMMIT');return r}catch(e){sqlite.exec('ROLLBACK');throw e}}}
  return {db,sqlite,env:{CALCULATOR_DB:db,STRIPE_WEBHOOK_SECRET:'local-fixture-only',ENTITLEMENTS:{put:async()=>{}}}}
}
function event(id,type,object,created=now){return {id,type,created,livemode:true,data:{object}}}
const orderEvent=event('evt_order','checkout.session.completed',{id:sid,customer:'cus_fixture',subscription:'sub_fixture',payment_link:'plink_1UOBYhGx1CvHyKS2SSkXLnNH',payment_status:'paid'})
const sub={id:'sub_fixture',status:'active',items:{data:[{price:{id:'price_1U1SXgGx1CvHyKS2bIEopIuZ'},current_period_end:now+3600}]}}
const request=(path,body,cookie)=>new Request(`https://qslc-hei.com${path}`,{method:'POST',headers:{origin:'https://qslc-hei.com','content-type':'application/json',...(cookie?{cookie}:{})},body:JSON.stringify(body)})
async function provision(env){await recordEvent(env.CALCULATOR_DB,orderEvent);await recordEvent(env.CALCULATOR_DB,event('evt_sub','customer.subscription.created',sub))}
test('real operational math handles zero denominators and rejects impossible counts',()=>{
  assert.deepEqual(calculate({hours:10,hourlyRate:75,revenue:1000,expenses:50,automatedHours:2,evidenceCount:8,recordCount:10}),{laborCost:750,totalCost:800,profit:200,marginPercent:20,estimatedTimeValue:150,evidenceCoverage:80})
  assert.equal(calculate({hours:0,hourlyRate:0,revenue:0,expenses:0,automatedHours:0,evidenceCount:0,recordCount:0}).marginPercent,null)
  assert.throws(()=>calculate({hours:1,hourlyRate:1,revenue:1,expenses:1,automatedHours:2,evidenceCount:1,recordCount:1}))
})
test('verified webhook → one-time access → private saved calculation → history',async()=>{
  const {env,sqlite}=setup()
  for(const ev of [orderEvent,event('evt_sub','customer.subscription.created',sub)]){
    const body=JSON.stringify(ev),signature=createHmac('sha256',env.STRIPE_WEBHOOK_SECRET).update(`${now}.${body}`).digest('hex')
    const response=await webhook({env,request:new Request('https://qslc-hei.com/api/entitlement/stripe-webhook',{method:'POST',headers:{'stripe-signature':`t=${now},v1=${signature}`},body})})
    assert.equal(response.status,200)
  }
  const claimed=await claim({env,request:request('/api/entitlement/claim',{session_id:sid})});assert.equal(claimed.status,200)
  const cookie=claimed.headers.get('set-cookie').split(';')[0]
  assert.ok(claimed.headers.get('set-cookie').includes('HttpOnly'))
  assert.ok(await authenticate(new Request('https://qslc-hei.com/api/calculator',{headers:{cookie}}),env))
  assert.equal((await claim({env,request:request('/api/entitlement/claim',{session_id:sid})})).status,409)
  const saved=await calculator({env,request:request('/api/calculator',{source:'Customer report / October',inputs:{hours:10,hourlyRate:75,revenue:1000,expenses:50,automatedHours:2,evidenceCount:8,recordCount:10}},cookie)})
  assert.equal(saved.status,200);assert.equal((await saved.json()).results.profit,200)
  sqlite.prepare('INSERT INTO calculator_runs VALUES(?,?,?,?,?,?,?)').run('other','cus_other','2026-10-08','other-source','{}','{}','1')
  const history=await calculator({env,request:new Request('https://qslc-hei.com/api/calculator',{headers:{cookie}})})
  assert.equal((await history.json()).runs.length,1)
  sqlite.close()
})
test('failed payment, cancellation, unknown price, expired period and unsigned payload deny access',async()=>{
  const {env,db}=setup();await provision(env)
  const order=await db.prepare('SELECT * FROM calculator_orders WHERE session=?').bind(sid).first()
  assert.ok(await accessForOrder(db,order))
  await recordEvent(db,event('evt_fail','invoice.payment_failed',{subscription:'sub_fixture',status:'open'},now+2))
  assert.equal(await accessForOrder(db,order),null)
  await recordEvent(db,event('evt_renew','invoice.paid',{subscription:'sub_fixture',status:'paid'},now+3));assert.ok(await accessForOrder(db,order))
  await recordEvent(db,event('evt_cancel','customer.subscription.deleted',sub,now+5));assert.equal(await accessForOrder(db,order),null)
  await recordEvent(db,event('evt_old','customer.subscription.updated',sub,now+1));assert.equal(await accessForOrder(db,order),null)
  assert.equal((await webhook({env,request:new Request('https://qslc-hei.com/api/entitlement/stripe-webhook',{method:'POST',body:JSON.stringify(orderEvent)})})).status,400)
  assert.equal((await calculator({env,request:request('/api/calculator',{})})).status,401)
  assert.equal((await calculator({env,request:new Request('https://qslc-hei.com/api/calculator',{method:'POST',headers:{origin:'https://other.example'},body:'{}'})})).status,403)
})
test('events may arrive before checkout; duplicates are idempotent; test events cannot grant live access',async()=>{
  const {env,db}=setup()
  await recordEvent(db,event('evt_sub','customer.subscription.created',sub))
  await recordEvent(db,orderEvent);await recordEvent(db,orderEvent)
  assert.equal((await db.prepare('SELECT count(*) AS n FROM calculator_events').first()).n,2)
  assert.ok(await accessForOrder(db,await db.prepare('SELECT * FROM calculator_orders WHERE session=?').bind(sid).first()))
  await recordEvent(db,{...event('evt_test','customer.subscription.deleted',sub),livemode:false})
  assert.equal((await db.prepare('SELECT count(*) AS n FROM calculator_events').first()).n,2)
  assert.equal(await accessForOrder(db,{paid:1,subscription:'missing'}),null)
  assert.equal(await accessForOrder(db,{paid:0,subscription:'sub_fixture'}),null)
  assert.equal(await accessForOrder(db,{paid:1,subscription:'sub_fixture'},now+7200),null)
})
