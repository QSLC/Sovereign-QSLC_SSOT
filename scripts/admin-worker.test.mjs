import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../workers/qslc-admin-edge.mjs';

const token=crypto.randomUUID();
function mockDb(){
  const keys=new Map(),metrics=new Map(),audit=[];
  const statement=sql=>({
    bind(...args){this.args=args;return this},
    async first(){
      if(sql.startsWith('SELECT request_sha256'))return keys.get(this.args[0])||null;
      if(sql.startsWith('SELECT ssot_sha256')){const row=metrics.get(this.args[0]);return row?{ssot_sha256:row[14]}:null;}
      return null;
    },
    async run(){
      if(sql.startsWith('INSERT INTO idempotency_keys')){if(keys.has(this.args[0]))throw new Error('UNIQUE');keys.set(this.args[0],{request_sha256:this.args[1],response_json:this.args[2]});}
      if(sql.startsWith('INSERT INTO ssot_metrics'))metrics.set(this.args[0],this.args);
      if(sql.startsWith('INSERT INTO audit_log'))audit.push(this.args);
      return {success:true};
    }
  });
  return {keys,metrics,audit,prepare:statement,async batch(statements){for(const s of statements)await s.run();return statements.map(()=>({success:true}))}};
}
const metric={date:'2026-10-20',day:'Tuesday',workstream:'MP-40',total_screen_time_hours:null,productivity_hours:null,other_hours:null,utilities_hours:null,unclassified_hours:null,hourly_rate:null,gross:null,source:'jira:MP-40',verification_status:'SOURCE_BACKED',ssot_role:'governance'};
const req=(path,method='GET',body,headers={})=>new Request('https://admin.qslc-hei.com'+path,{method,headers:{'x-qslc-token':token,...headers},body:body===undefined?undefined:JSON.stringify(body)});
const baseEnv=db=>({QSLC_WORKER_TOKEN:token,SSOT_KV:{get:async()=>null},DB:db});

test('unauthorized write is rejected',async()=>{const r=await worker.fetch(new Request('https://admin.qslc-hei.com/ssot/write',{method:'POST'}),baseEnv(mockDb()));assert.equal(r.status,401)});
test('missing database cannot claim persistence',async()=>{const r=await worker.fetch(req('/ssot/write','POST',metric,{'idempotency-key':'mp40-test-0001'}),baseEnv());assert.equal(r.status,503)});
test('valid idempotency key is required',async()=>{const r=await worker.fetch(req('/ssot/write','POST',metric),baseEnv(mockDb()));assert.equal(r.status,400)});
test('source-backed metric is persisted with audit evidence',async()=>{const db=mockDb();const r=await worker.fetch(req('/ssot/write','POST',metric,{'idempotency-key':'mp40-test-0002'}),baseEnv(db));const v=await r.json();assert.equal(r.status,200);assert.equal(v.persisted,true);assert.equal(v.idempotent_replay,false);assert.equal(db.metrics.size,1);assert.equal(db.audit.length,1)});
test('identical retry replays without a second write',async()=>{const db=mockDb(),request=()=>req('/ssot/write','POST',metric,{'idempotency-key':'mp40-test-0003'});await worker.fetch(request(),baseEnv(db));const r=await worker.fetch(request(),baseEnv(db));const v=await r.json();assert.equal(v.idempotent_replay,true);assert.equal(db.metrics.size,1);assert.equal(db.audit.length,1)});
test('reused key with different payload conflicts',async()=>{const db=mockDb(),headers={'idempotency-key':'mp40-test-0004'};await worker.fetch(req('/ssot/write','POST',metric,headers),baseEnv(db));const r=await worker.fetch(req('/ssot/write','POST',{...metric,source:'jira:MP-41'},headers),baseEnv(db));assert.equal(r.status,409)});
test('missing provenance is rejected',async()=>{const db=mockDb();const r=await worker.fetch(req('/ssot/write','POST',{...metric,source:''},{'idempotency-key':'mp40-test-0005'}),baseEnv(db));assert.equal(r.status,400);assert.equal(db.metrics.size,0)});
test('calendar-invalid dates are rejected',async()=>{const db=mockDb();const r=await worker.fetch(req('/ssot/write','POST',{...metric,date:'2026-02-31'},{'idempotency-key':'mp40-test-date'}),baseEnv(db));assert.equal(r.status,400);assert.equal(db.metrics.size,0)});
test('unknown hours remain nullable',async()=>{const db=mockDb();const r=await worker.fetch(req('/ssot/write','POST',metric,{'idempotency-key':'mp40-test-0006'}),baseEnv(db));assert.equal(r.status,200);assert.equal(db.metrics.get(metric.date)[3],null)});
test('updated metric audit links the predecessor hash',async()=>{const db=mockDb();await worker.fetch(req('/ssot/write','POST',metric,{'idempotency-key':'mp40-test-prev-1'}),baseEnv(db));await worker.fetch(req('/ssot/write','POST',{...metric,source:'jira:MP-40-update'},{'idempotency-key':'mp40-test-prev-2'}),baseEnv(db));assert.equal(db.audit.length,2);assert.equal(db.audit[1][2],db.audit[0][3]);});
test('write lock allows completed replay but rejects a new write',async()=>{const db=mockDb(),env={...baseEnv(db),SSOT_KV:{get:async key=>key==='write_lock.json'?'{"write_lock":true}':null}},headers={'idempotency-key':'mp40-test-lock-1'};const unlocked=baseEnv(db);await worker.fetch(req('/ssot/write','POST',metric,headers),unlocked);const replay=await worker.fetch(req('/ssot/write','POST',metric,headers),env);assert.equal(replay.status,200);assert.equal((await replay.json()).idempotent_replay,true);const blocked=await worker.fetch(req('/ssot/write','POST',{...metric,date:'2026-10-21'},{'idempotency-key':'mp40-test-lock-2'}),env);assert.equal(blocked.status,423);});
test('reserved sync must not claim success',async()=>{const r=await worker.fetch(req('/d1/sync','POST'),baseEnv(mockDb()));assert.equal(r.status,501)});
test('missing source does not report operational agent',async()=>{const r=await worker.fetch(req('/api/agent/status'),baseEnv(mockDb()));const v=await r.json();assert.equal(v.status,'unverified');assert.equal(v.ssot_connected,false)});
test('missing database cannot claim queue success',async()=>{const r=await worker.fetch(req('/base44/queue','POST'),baseEnv());assert.equal(r.status,503)});
