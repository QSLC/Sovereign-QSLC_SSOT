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
  const body=await request.json().catch(()=>null);
  if(!body||typeof body!=='object'||Array.isArray(body))return json({ok:false,error:'body_must_be_object',queued:false},400);
  const requestSha=await sha256({operation:'base44_queue',body});
  const existing=await env.DB.prepare('SELECT request_sha256, response_json FROM idempotency_keys WHERE key = ?1').bind(key).first();
  if(existing){
    if(existing.request_sha256!==requestSha)return json({ok:false,error:'idempotency_key_conflict',queued:false},409);
    return json({...JSON.parse(existing.response_json||'{}'),idempotent_replay:true});
  }
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
export default {async fetch(request,env){try{const u=new URL(request.url),p=u.pathname,m=request.method.toUpperCase(),host=u.hostname.toLowerCase();
const isAdmin=host==='admin.qslc-hei.com';
if(!isAdmin){if(m==='GET'&&p==='/health')return json({ok:true,system:'QSLC_PUBLIC_EDGE',host,timestamp:new Date().toISOString()});if(m==='GET')return proxyPublic(u);return json({ok:false,error:'public_read_only'},405);}
const version=await env.SSOT_KV?.get('qslc_ssot.version')||'UNKNOWN';const sha=await env.SSOT_KV?.get('qslc_ssot.sha256')||'';const lock=JSON.parse(await env.SSOT_KV?.get('write_lock.json')||'{"write_lock":false}');const csv=await env.SSOT_KV?.get('qslc_ssot.csv')||'date,day,workstream,total_screen_time_hours,productivity_hours,other_hours,utilities_hours,unclassified_hours,hourly_rate,gross,source,verification_status,ssot_role\n';
if(m==='GET'&&(p==='/'||p==='/dashboard'))return new Response('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>QSLC Admin</title></head><body style="font-family:system-ui;background:#0a0e1a;color:#e8eefc;padding:28px"><h1>QSLC EVE Admin</h1><p>Owner access is protected by Cloudflare Access. Agent runtime and SSOT synchronization require verification.</p><ul><li><a style="color:#7dd3fc" href="/api/agent/status">Agent status</a></li><li><a style="color:#7dd3fc" href="/ssot/version">SSOT version</a></li><li><a style="color:#7dd3fc" href="/metrics/summary">Metrics summary</a></li><li><a style="color:#7dd3fc" href="/eve/brief">EVE brief</a></li></ul></body></html>',{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}});
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
if(m==='POST'&&p==='/ssot/write')return writeMetric(request,env,version,!!lock.write_lock);
if(m==='POST'&&p==='/base44/queue')return queueCommand(request,env);
if(m==='POST'&&p==='/d1/sync')return json({ok:false,error:'d1_sync_not_implemented',synced:false},501);
if(m==='GET')return json({ok:false,error:'not_found',path:p},404);return json({ok:false,error:'method_not_allowed'},405);
}catch(e){return json({ok:false,error:'worker_exception',detail:String(e?.message||e)},500);}}};
