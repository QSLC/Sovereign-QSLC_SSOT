import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import worker from '../workers/qslc-admin-edge.mjs';

function fixture(){
  const sql=new DatabaseSync(':memory:');
  sql.exec(`CREATE TABLE command_queue(id INTEGER PRIMARY KEY AUTOINCREMENT,created_at TEXT,source TEXT,command_type TEXT,payload_json TEXT,status TEXT,processed_at TEXT,job_id TEXT UNIQUE);
  CREATE TABLE idempotency_keys(key TEXT PRIMARY KEY,request_sha256 TEXT,response_json TEXT,created_at TEXT);
  CREATE TABLE audit_log(id INTEGER PRIMARY KEY,created_at TEXT,actor TEXT,action TEXT,object_path TEXT,previous_sha256 TEXT,new_sha256 TEXT,notes TEXT);`);
  sql.exec(readFileSync(new URL('../migrations/0003_eve_command_leases.sql',import.meta.url),'utf8'));
  const prepare=query=>({args:[],bind(...args){this.args=args;return this},async first(){return sql.prepare(query).get(...this.args)||null},async run(){const r=sql.prepare(query).run(...this.args);return {success:true,meta:{changes:Number(r.changes)}}}});
  const DB={prepare,async batch(statements){sql.exec('BEGIN');try{const out=[];for(const statement of statements)out.push(await statement.run());sql.exec('COMMIT');return out}catch(e){sql.exec('ROLLBACK');throw e}}};
  return {sql,env:{DB,QSLC_WORKER_TOKEN:'fixture-owner-token',SSOT_KV:{get:async()=>null}}};
}
const request=(path,body,headers={})=>new Request('https://admin.qslc-hei.com'+path,{method:body===undefined?'GET':'POST',headers:{'content-type':'application/json','x-qslc-token':'fixture-owner-token',...headers},body:body===undefined?undefined:JSON.stringify(body)});
async function enqueue(env,key='eve-delivery-test-1'){
  const r=await worker.fetch(request('/base44/queue',{source:'verification',command_type:'status'},{'idempotency-key':key}),env);
  assert.equal(r.status,202);return r.json();
}
test('claim requires owner authentication',async()=>{const {env}=fixture();const r=await worker.fetch(request('/commands/claim',{worker_id:'test-worker'},{'x-qslc-token':''}),env);assert.equal(r.status,401)});
test('unsupported commands never enter the executable queue',async()=>{const {env,sql}=fixture();const r=await worker.fetch(request('/base44/queue',{command_type:'shell',command:'remove everything'},{'idempotency-key':'eve-unsupported'}),env);assert.equal(r.status,400);assert.equal(sql.prepare('SELECT count(*) n FROM command_queue').get().n,0)});
test('oversized intake is rejected',async()=>{const {env}=fixture();const r=await worker.fetch(request('/base44/queue',{command_type:'status',padding:'x'.repeat(20000)},{'idempotency-key':'eve-oversized'}),env);assert.equal(r.status,413)});
test('durable receipt, exclusive lease, completion, and exact readback',async()=>{
  const {env,sql}=fixture();const job=await enqueue(env);
  const first=await worker.fetch(request('/commands/claim',{worker_id:'test-worker'}),env);assert.equal(first.status,200);const lease=await first.json();assert.equal(lease.job.job_id,job.job_id);
  const second=await worker.fetch(request('/commands/claim',{worker_id:'other-worker'}),env);assert.equal((await second.json()).job,null);
  const body={lease_token:lease.job.lease_token,ok:true,result:{identity:'EVE-1010',runtime:'fixture'}};
  const done=await worker.fetch(request('/commands/'+job.job_id+'/result',body),env);assert.equal(done.status,200);
  const repeat=await worker.fetch(request('/commands/'+job.job_id+'/result',body),env);assert.equal(repeat.status,409);
  const read=await worker.fetch(request('/commands/'+job.job_id),env);const record=await read.json();assert.equal(record.job.status,'completed');assert.deepEqual(record.job.result,body.result);
  assert.equal(sql.prepare("SELECT count(*) n FROM audit_log WHERE action='command_completed'").get().n,1);
});
test('expired leases retry at most three times and reject stale completion',async()=>{
  const {env,sql}=fixture();const job=await enqueue(env);let first;
  for(let i=0;i<3;i++){const r=await worker.fetch(request('/commands/claim',{worker_id:'test-worker'}),env);assert.equal(r.status,200);const lease=(await r.json()).job;assert.ok(lease);first??=lease;sql.prepare("UPDATE command_queue SET lease_until='2000-01-01T00:00:00.000Z' WHERE job_id=?").run(job.job_id);}
  const r=await worker.fetch(request('/commands/claim',{worker_id:'test-worker'}),env);assert.equal((await r.json()).job,null);
  assert.equal(sql.prepare('SELECT status FROM command_queue WHERE job_id=?').get(job.job_id).status,'failed');
  const stale=await worker.fetch(request('/commands/'+job.job_id+'/result',{lease_token:first.lease_token,ok:true,result:{}}),env);assert.equal(stale.status,409);
});
