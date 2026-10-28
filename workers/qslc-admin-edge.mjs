const json=(body,status=200)=>new Response(JSON.stringify(body,null,2),{status,headers:{'content-type':'application/json','cache-control':'no-store'}});
const csvHeaders={'content-type':'text/csv; charset=utf-8','cache-control':'no-store'};
const metricFields=['date','day','workstream','total_screen_time_hours','productivity_hours','other_hours','utilities_hours','unclassified_hours','hourly_rate','gross','source','verification_status','ssot_role'];
const numericFields=['total_screen_time_hours','productivity_hours','other_hours','utilities_hours','unclassified_hours','hourly_rate','gross'];
async function auth(req,env){const t=req.headers.get('x-qslc-token')||'';return !!env.QSLC_WORKER_TOKEN&&t===env.QSLC_WORKER_TOKEN;}
function parseCSV(csv){const lines=String(csv||'').trim().split('\n');if(lines.length<2)return[];const h=lines[0].split(',');return lines.slice(1).map(line=>{const v=line.split(',');return Object.fromEntries(h.map((k,i)=>[k,v[i]||'']));});}
async function proxyPublic(u){const target=new URL('https://qslc-sovereign-dashboard.pages.dev');target.pathname=u.pathname;target.search=u.search;const r=await fetch(target.toString(),{headers:{'user-agent':'QSLC-Edge-Proxy/2.0'}});const h=new Headers(r.headers);h.set('x-qslc-edge','qslc-hei-site');h.set('cache-control','no-store');return new Response(r.body,{status:r.status,headers:h});}
const canonicalize=value=>{if(Array.isArray(value))return value.map(canonicalize);if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(k=>[k,canonicalize(value[k])]));return value;};
async function sha256(value){const bytes=new TextEncoder().encode(JSON.stringify(canonicalize(value)));const digest=await crypto.subtle.digest('SHA-256',bytes);return [...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,'0')).join('');}
function validateMetric(body){
  if(!body||typeof body!=='object'||Array.isArray(body))return 'body_must_be_object';
  const day=String(body.date||''),match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(day);
  if(!match)return 'date_must_be_iso_day';
  const parsed=new Date(Date.UTC(Number(match[1]),Number(match[2])-1,Number(match[3])));
  if(parsed.toISOString().slice(0,10)!==day)return 'date_must_be_iso_day';
  if(typeof body.source!=='string'||!body.source.trim())return 'source_required';
  if(typeof body.verification_status!=='string'||!body.verification_status.trim())return 'verification_status_required';
  if(typeof body.ssot_role!=='string'||!body.ssot_role.trim())return 'ssot_role_required';
  for(const key of numericFields){if(body[key]!=null&&(!Number.isFinite(body[key])||body[key]<0))return `${key}_must_be_nonnegative_number_or_null`;}
  return null;
}
function metricValues(body){return metricFields.map(key=>body[key]??null);}
async function writeMetric(request,env,version,writeLocked=false){
  if(!env.DB)return json({ok:false,error:'database_unavailable',persisted:false},503);
  const key=request.headers.get('idempotency-key')||'';
  if(!/^[A-Za-z0-9._:-]{8,128}$/.test(key))return json({ok:false,error:'valid_idempotency_key_required',persisted:false},400);
  const body=await request.json().catch(()=>null);
  const requestSha=await sha256(body);
  const existing=await env.DB.prepare('SELECT request_sha256, response_json FROM idempotency_keys WHERE key = ?1').bind(key).first();
  if(existing){
    if(existing.request_sha256!==requestSha)return json({ok:false,error:'idempotency_key_conflict',persisted:false},409);
    const saved=JSON.parse(existing.response_json||'{}');
    return json({...saved,idempotent_replay:true});
  }
  const validation=validateMetric(body);
  if(validation)return json({ok:false,error:validation,persisted:false},400);
  if(writeLocked)return json({ok:false,error:'write_lock enabled',persisted:false},423);
  const now=new Date().toISOString();
  const response={ok:true,persisted:true,idempotent_replay:false,date:body.date,version};
  const upsert=`INSERT INTO ssot_metrics (${metricFields.join(',')}, ssot_version, ssot_sha256, mirrored_at)
    VALUES (${metricFields.map((_,i)=>`?${i+1}`).join(',')}, ?14, ?15, ?16)
    ON CONFLICT(date) DO UPDATE SET ${metricFields.slice(1).map(k=>`${k}=excluded.${k}`).join(',')}, ssot_version=excluded.ssot_version, ssot_sha256=excluded.ssot_sha256, mirrored_at=excluded.mirrored_at`;
  try{
    await env.DB.batch([
      env.DB.prepare('INSERT INTO idempotency_keys(key, request_sha256, response_json, created_at) VALUES(?1, ?2, ?3, ?4)').bind(key,requestSha,JSON.stringify(response),now),
      env.DB.prepare("INSERT INTO audit_log(created_at, actor, action, object_path, previous_sha256, new_sha256, notes) VALUES(?1, 'qslc-admin-edge', 'ssot_write', ?2, (SELECT ssot_sha256 FROM ssot_metrics WHERE date = ?3), ?4, ?5)").bind(now,`ssot_metrics/${body.date}`,body.date,requestSha,JSON.stringify({idempotency_key:key,verification_status:body.verification_status,source:body.source})),
      env.DB.prepare(upsert).bind(...metricValues(body),version,requestSha,now)
    ]);
  }catch(error){
    const raced=await env.DB.prepare('SELECT request_sha256, response_json FROM idempotency_keys WHERE key = ?1').bind(key).first();
    if(raced?.request_sha256===requestSha)return json({...JSON.parse(raced.response_json||'{}'),idempotent_replay:true});
    if(raced)return json({ok:false,error:'idempotency_key_conflict',persisted:false},409);
    throw error;
  }
  return json(response);
}
async function queueCommand(request,env){
  if(!env.DB)return json({ok:false,error:'database_unavailable',queued:false},503);
  const key=request.headers.get('idempotency-key')||'';
  if(!/^[A-Za-z0-9._:-]{8,128}$/.test(key))return json({ok:false,error:'valid_idempotency_key_required',queued:false},400);
  const body=await limitedJson(request);
  if(!body||typeof body!=='object'||Array.isArray(body))return json({ok:false,error:'body_must_be_object',queued:false},400);
  const requestSha=await sha256({operation:'base44_queue',body});
  const existing=await env.DB.prepare('SELECT request_sha256, response_json FROM idempotency_keys WHERE key = ?1').bind(key).first();
  if(existing){
    if(existing.request_sha256!==requestSha)return json({ok:false,error:'idempotency_key_conflict',queued:false},409);
    return json({...JSON.parse(existing.response_json||'{}'),idempotent_replay:true});
  }
  if(!['status','brain_status','wake','natural_language_request'].includes(body.command_type))return json({ok:false,error:'unsupported_command',queued:false},400);
  if(body.command_type==='natural_language_request'&&!['status','eve status','status full','brain status','find brain','eve_wake1010'].includes(String(body.command||'').trim().toLowerCase()))return json({ok:false,error:'unsupported_command',queued:false},400);
  const now=new Date().toISOString(),jobId=crypto.randomUUID();
  const response={ok:true,queued:true,job_id:jobId,status:'queued',idempotent_replay:false};
  try{
    await env.DB.batch([
      env.DB.prepare('INSERT INTO idempotency_keys(key, request_sha256, response_json, created_at) VALUES(?1, ?2, ?3, ?4)').bind(key,requestSha,JSON.stringify(response),now),
      env.DB.prepare("INSERT INTO command_queue(created_at, source, command_type, payload_json, status, job_id) VALUES(?1, ?2, ?3, ?4, 'queued', ?5)").bind(now,body.source||'base44',body.command_type||'unknown',JSON.stringify(body),jobId),
      env.DB.prepare("INSERT INTO audit_log(created_at, actor, action, object_path, previous_sha256, new_sha256, notes) VALUES(?1, 'qslc-admin-edge', 'command_queued', ?2, NULL, ?3, ?4)").bind(now,`command_queue/${jobId}`,requestSha,JSON.stringify({idempotency_key:key,source:body.source||'base44',command_type:body.command_type||'unknown'}))
    ]);
  }catch(error){
    const raced=await env.DB.prepare('SELECT request_sha256, response_json FROM idempotency_keys WHERE key = ?1').bind(key).first();
    if(raced?.request_sha256===requestSha)return json({...JSON.parse(raced.response_json||'{}'),idempotent_replay:true});
    if(raced)return json({ok:false,error:'idempotency_key_conflict',queued:false},409);
    throw error;
  }
  return json(response,202);
}
async function limitedJson(request){
  const reader=request.body?.getReader();if(!reader)return null;
  const parts=[];let size=0;
  for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>16384){await reader.cancel();const error=new Error('payload_too_large');error.status=413;throw error;}parts.push(value);}
  const bytes=new Uint8Array(size);let offset=0;for(const part of parts){bytes.set(part,offset);offset+=part.length;}
  try{return JSON.parse(new TextDecoder().decode(bytes));}catch{return null;}
}
async function deliverCommand(request,env,path,method){
  if(!await auth(request,env))return json({ok:false,error:'unauthorized'},401);
  if(!env.DB)return json({ok:false,error:'database_unavailable'},503);
  const now=new Date().toISOString();
  if(path==='/commands/claim'&&method==='POST'){
    const body=await limitedJson(request);
    if(!body||!/^[a-zA-Z0-9._:-]{3,80}$/.test(body.worker_id||''))return json({ok:false,error:'worker_id_required'},400);
    await env.DB.prepare("UPDATE command_queue SET status='failed', processed_at=?1, lease_token=NULL WHERE status='processing' AND lease_until<=?1 AND attempts>=3").bind(now).run();
    const token=crypto.randomUUID(),until=new Date(Date.now()+120000).toISOString();
    const job=await env.DB.prepare(`UPDATE command_queue SET status='processing', attempts=attempts+1, lease_token=?1, lease_until=?2
      WHERE id=(SELECT id FROM command_queue WHERE (status='queued' OR (status='processing' AND lease_until<=?3)) AND attempts<3 AND command_type IN ('status','brain_status','wake','natural_language_request') ORDER BY id LIMIT 1)
      RETURNING job_id, command_type, payload_json, attempts, lease_token, lease_until`).bind(token,until,now).first();
    return json({ok:true,job:job?{...job,payload:JSON.parse(job.payload_json),payload_json:undefined}:null});
  }
  const match=/^\/commands\/([0-9a-f-]{36})(\/result)?$/.exec(path);
  if(!match)return json({ok:false,error:'not_found'},404);
  const id=match[1];
  if(!match[2]&&method==='GET'){
    const job=await env.DB.prepare('SELECT job_id, command_type, status, attempts, created_at, processed_at, result_json FROM command_queue WHERE job_id=?1').bind(id).first();
    if(!job)return json({ok:false,error:'not_found'},404);
    return json({ok:true,job:{...job,result:job.result_json?JSON.parse(job.result_json):null,result_json:undefined}});
  }
  if(match[2]&&method==='POST'){
    const body=await limitedJson(request);
    if(!body||typeof body.ok!=='boolean'||typeof body.lease_token!=='string'||!body.result||typeof body.result!=='object'||Array.isArray(body.result))return json({ok:false,error:'invalid_result'},400);
    const status=body.ok?'completed':'failed',result=JSON.stringify(body.result);
    const results=await env.DB.batch([
      env.DB.prepare("INSERT INTO audit_log(created_at,actor,action,object_path,notes) SELECT ?1,'eve-local-consumer',?2,?3,?4 WHERE EXISTS (SELECT 1 FROM command_queue WHERE job_id=?5 AND status='processing' AND lease_token=?6 AND lease_until>?1)").bind(now,'command_'+status,'command_queue/'+id,JSON.stringify({job_id:id}),id,body.lease_token),
      env.DB.prepare("UPDATE command_queue SET status=?1, processed_at=?2, result_json=?3, lease_token=NULL, lease_until=NULL WHERE job_id=?4 AND status='processing' AND lease_token=?5 AND lease_until>?2").bind(status,now,result,id,body.lease_token)
    ]);
    if(!results[1]?.meta?.changes)return json({ok:false,error:'lease_conflict'},409);
    return json({ok:true,job_id:id,status});
  }
  return json({ok:false,error:'method_not_allowed'},405);
}
export default {async fetch(request,env){try{const u=new URL(request.url),p=u.pathname,m=request.method.toUpperCase(),host=u.hostname.toLowerCase();
const isAdmin=host==='admin.qslc-hei.com';
if(!isAdmin){if(m==='GET'&&p==='/health')return json({ok:true,system:'QSLC_PUBLIC_EDGE',host,timestamp:new Date().toISOString()});if(m==='GET')return proxyPublic(u);return json({ok:false,error:'public_read_only'},405);}
if(p.startsWith('/commands/'))return await deliverCommand(request,env,p,m);
const version=await env.SSOT_KV?.get('qslc_ssot.version')||'UNKNOWN';const sha=await env.SSOT_KV?.get('qslc_ssot.sha256')||'';const lock=JSON.parse(await env.SSOT_KV?.get('write_lock.json')||'{"write_lock":false}');const csv=await env.SSOT_KV?.get('qslc_ssot.csv')||'date,day,workstream,total_screen_time_hours,productivity_hours,other_hours,utilities_hours,unclassified_hours,hourly_rate,gross,source,verification_status,ssot_role\n';
if(m==='GET'&&(p==='/'||p==='/dashboard'))return new Response("<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>EVE 1010 · Owner command</title><style>\n:root{color-scheme:dark}body{margin:0;background:#090d1b;color:#eef4ff;font:16px system-ui,sans-serif}main{max-width:900px;margin:auto;padding:30px 18px}h1{color:#b8ff83}section{padding:18px;margin:16px 0;border:1px solid #465079;border-radius:16px;background:#151b31}input,textarea,button{font:inherit;border-radius:8px;padding:12px;box-sizing:border-box}textarea,input{background:#090f22;border:1px solid #677697;color:white;width:100%}textarea{min-height:110px}button{background:#bdff82;color:#101323;font-weight:700;cursor:pointer;border:0}a{color:#a2daff}small{color:#b8c4d7}pre{white-space:pre-wrap;overflow-wrap:anywhere}label{display:block;margin:12px 0}\n</style></head><body><main><h1>EVE · Owner Command Center</h1><p>Submit status, brain status, or EVE_WAKE1010 and receive a durable queue receipt. <b>Queued is not completed.</b> This console is intended to be restricted by Cloudflare Access.</p>\n<section><h2>1 · Evidence & connection status</h2><button id=\"check\" type=\"button\">Check current status</button><pre id=\"health\" aria-live=\"polite\">Not checked</pre><small>Green requires actual operational evidence; no simulated telemetry.</small></section>\n<section><h2>2 · Submit command</h2><form id=\"form\"><label>Request<textarea id=\"command\" minlength=\"4\" maxlength=\"4000\" required placeholder=\"status\"></textarea></label><label>Owner gateway token (required by current backend)<input id=\"token\" type=\"password\" autocomplete=\"off\" required placeholder=\"Enter only on the Cloudflare Access-protected owner page\"></label><button type=\"submit\">Send command to verified queue</button></form><pre id=\"result\" aria-live=\"polite\"></pre><small>Token is held only in this page's memory; it is not saved to browser storage. Never use a token in a public app or screenshot. A worker must separately process queue jobs; a receipt alone does not mean EVE executed your instruction.</small></section>\n<section><h2>3 · Owner tools</h2><p><a href=\"/api/agent/status\">Agent status</a> · <a href=\"/ssot/version\">SSOT version</a> · <a href=\"/metrics/summary\">Metrics</a> · <a href=\"/eve/brief\">Brief</a></p><p>For Google AI Studio, use the same authenticated command gateway through a server-side integration. Never embed owner gateway credentials in client-side code.</p></section></main>\n<script>\nconst $=id=>document.getElementById(id);\n$('check').onclick=async()=>{try{const [h,a]=await Promise.all([fetch('/api/health',{credentials:'same-origin',cache:'no-store'}),fetch('/api/agent/status',{credentials:'same-origin',cache:'no-store'})]);$('health').textContent=JSON.stringify({gateway:await h.json(),agent:await a.json()},null,2)}catch(e){$('health').textContent='FAILED: '+e.message}};\n$('form').onsubmit=async e=>{e.preventDefault();const command=$('command').value.trim();const token=$('token').value;if(!command||!token)return;$('result').textContent='Sending…';const key='eve-'+crypto.randomUUID();const body={source:'owner_dashboard',command_type:'natural_language_request',command,submitted_at:new Date().toISOString()};try{const response=await fetch('/base44/queue',{method:'POST',credentials:'same-origin',headers:{'content-type':'application/json','x-qslc-token':token,'idempotency-key':key},body:JSON.stringify(body)});const reply=await response.json();$('result').textContent=JSON.stringify({http_status:response.status,...reply},null,2);if(response.ok&&reply.queued)$('command').value='';}catch(error){$('result').textContent='FAILED: '+error.message;}};\n</script></body></html>",{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','content-security-policy':"default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'"}});
if(m==='GET'&&(p==='/health'||p==='/api/health'))return json({ok:true,system:'QSLC_EVE_SOVEREIGN_CONSOLE',version,sha,write_lock:!!lock.write_lock,timestamp:new Date().toISOString()});
if(m==='GET'&&p==='/api/agent/status')return json({ok:true,agent:'EVE',status:'unverified',version,sha,write_lock:!!lock.write_lock,ssot_connected:version!=='UNKNOWN'&&!!sha,cloudflare_status:'request_served',runtime_heartbeat:'unverified',timestamp:new Date().toISOString()});
if(m==='GET'&&p==='/ssot/version')return json({version,sha,write_lock:!!lock.write_lock});
if(m==='GET'&&p==='/ssot/read')return new Response(csv,{headers:csvHeaders});
if(m==='GET'&&p==='/payroll/export')return new Response(csv,{headers:{...csvHeaders,'content-disposition':'attachment; filename=paychex_manual_upload.csv'}});
if(m==='GET'&&p==='/metrics/summary'){const rows=parseCSV(csv);const gross=rows.reduce((s,r)=>s+(parseFloat(r.gross)||0),0),hours=rows.reduce((s,r)=>s+(parseFloat(r.total_screen_time_hours)||0),0);return json({ok:true,version,sha,payroll_periods:rows.length,total_gross:gross.toFixed(2),total_screen_time_hours:hours.toFixed(2),verification_status:rows[0]?.verification_status||'NO_DATA'});}
if(m==='GET'&&p==='/eve/brief')return json({ok:true,brief:'Cloudflare admin edge online; SSOT gateway available.',version,sha,write_lock:!!lock.write_lock});
if(['/ssot/lock','/ssot/unlock','/ssot/write','/base44/queue','/d1/sync'].includes(p)&&!(await auth(request,env)))return json({ok:false,error:'unauthorized'},401);
if(m==='POST'&&p==='/ssot/lock'){await env.SSOT_KV?.put('write_lock.json',JSON.stringify({write_lock:true,updated_at:new Date().toISOString()}));return json({ok:true,write_lock:true});}
if(m==='POST'&&p==='/ssot/unlock'){await env.SSOT_KV?.put('write_lock.json',JSON.stringify({write_lock:false,updated_at:new Date().toISOString()}));return json({ok:true,write_lock:false});}
if(m==='POST'&&p==='/ssot/write')return await writeMetric(request,env,version,!!lock.write_lock);
if(m==='POST'&&p==='/base44/queue')return await queueCommand(request,env);
if(m==='POST'&&p==='/d1/sync')return json({ok:false,error:'d1_sync_not_implemented',synced:false},501);
if(m==='GET')return json({ok:false,error:'not_found',path:p},404);return json({ok:false,error:'method_not_allowed'},405);
}catch(e){return json({ok:false,error:e.status===413?'payload_too_large':'worker_exception'},e.status===413?413:500);}}};

