import { useEffect, useState } from 'react'

type Inputs = {hours:number;hourlyRate:number;revenue:number;expenses:number;automatedHours:number;evidenceCount:number;recordCount:number}
type Run = {id:string;created:string;source:string;inputs:Inputs;results:Record<string,number|null>;formula_version:string}
const initial:Inputs={hours:0,hourlyRate:0,revenue:0,expenses:0,automatedHours:0,evidenceCount:0,recordCount:0}
const labels:Record<keyof Inputs,string>={hours:'Work hours',hourlyRate:'Hourly rate (USD)',revenue:'Revenue (USD)',expenses:'Other costs (USD)',automatedHours:'Automated hours',evidenceCount:'Records with evidence',recordCount:'Total records'}
export function CalculatorWorkspace() {
  const [status,setStatus]=useState('Checking purchased access…')
  const [tier,setTier]=useState('')
  const [inputs,setInputs]=useState(initial)
  const [source,setSource]=useState('')
  const [runs,setRuns]=useState<Run[]>([])
  const [busy,setBusy]=useState(false)
  const [automatic,setAutomatic]=useState(false)
  const [changed,setChanged]=useState(false)
  useEffect(()=>{
    let stopped=false
    const controller=new AbortController()
    async function load() {
      if (location.hostname==='qslc.github.io') {setStatus('Open the secure calculator on qslc-hei.com to use purchased access.');return}
      try {
        let response=await fetch('/api/calculator',{signal:controller.signal})
        const session=new URLSearchParams(location.search).get('session_id')
        if (!response.ok && session) {
          for(let attempt=0;attempt<10;attempt++) {
            const claim=await fetch('/api/entitlement/claim',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({session_id:session}),signal:controller.signal})
            if(claim.ok) {response=await fetch('/api/calculator',{signal:controller.signal});break}
            const data=await claim.json()
            if(data.error!=='awaiting_verified_payment_and_subscription') {throw new Error(data.error)}
            if(attempt<9) await new Promise(resolve=>setTimeout(resolve,2000))
          }
        }
        if(!response.ok) {if(!stopped)setStatus('Paid access is not confirmed. Payment and subscription must both be verified.');return}
        const data=await response.json()
        if(!stopped) {setTier(data.tier);setRuns(data.runs);setStatus('Access confirmed. Calculations are saved privately with their source and formula version.')}
        if(session) {const url=new URL(location.href);url.searchParams.delete('session_id');url.searchParams.delete('purchase');history.replaceState(null,'',url)}
      }catch(e){if(!stopped)setStatus(e instanceof Error?e.message:'Unable to confirm access.')}
    }
    void load()
    return ()=>{stopped=true;controller.abort()}
  },[])
  useEffect(()=>{
    if(!tier || !automatic || !changed || source.trim().length<3 || busy)return
    const timer=setTimeout(()=>{void save()},1200)
    return ()=>clearTimeout(timer)
    async function save(){
      setBusy(true);setChanged(false)
      try{
        const response=await fetch('/api/calculator',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({inputs,source})})
        const data=await response.json()
        if(!response.ok)throw new Error(data.error)
        setRuns(old=>[data,...old].slice(0,50));setStatus('Calculation saved. Inputs remain customer supplied; source evidence is not independently verified.')
      }catch(e){setStatus(e instanceof Error?e.message:'Calculation failed.')}
      finally{setBusy(false)}
    }
  },[tier,automatic,changed,source,inputs,busy])
  async function saveNow(){
    setBusy(true);setChanged(false)
    try{
      const response=await fetch('/api/calculator',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({inputs,source})})
      const data=await response.json()
      if(!response.ok)throw new Error(data.error)
      setRuns(old=>[data,...old].slice(0,50));setStatus('Calculation saved with source and formula version.')
    }catch(e){setStatus(e instanceof Error?e.message:'Calculation failed.')}
    finally{setBusy(false)}
  }
  function exportRuns(){
    const link=document.createElement('a')
    const url=URL.createObjectURL(new Blob([JSON.stringify(runs,null,2)],{type:'application/json'}))
    link.href=url;link.download='eve-calculation-history.json';link.click();URL.revokeObjectURL(url)
  }
  return <section id="workspace" className="section-shell"><div className="section-heading"><span className="eyebrow">PRIVATE CALCULATOR WORKSPACE</span><h2>Your inputs. Saved calculations.</h2><p role="status">{status}</p></div>
    {!tier?<a className="secondary-cta mt-5 inline-block" href="https://qslc-hei.com/#workspace">Open secure workspace</a>:<div className="glass-card mt-6 space-y-5 p-6">
      <p>Purchased tier: <strong>{tier}</strong>. USD calculations use operational formulas v1.0.0. Estimated time value is a scenario, not realized savings.</p>
      <label className="block">Source / reporting period<input className="block w-full rounded bg-slate-900 p-3" value={source} maxLength={120} onChange={e=>{setSource(e.target.value);setChanged(true)}} placeholder="Example: customer timesheet, October 2026"/></label>
      <div className="grid gap-4 sm:grid-cols-2">{(Object.keys(labels) as (keyof Inputs)[]).map(key=><label key={key}>{labels[key]}<input type="number" min="0" max="1000000000" step={key.endsWith('Count')?'1':'0.01'} className="block w-full rounded bg-slate-900 p-3" value={inputs[key]} onChange={e=>{setInputs(old=>({...old,[key]:Number(e.target.value)}));setChanged(true)}}/></label>)}</div>
      <label className="flex gap-2"><input type="checkbox" checked={automatic} onChange={e=>setAutomatic(e.target.checked)}/>Automatically calculate and save when inputs change</label>
      <div className="flex flex-wrap gap-4"><button type="button" className="primary-cta" disabled={busy} onClick={()=>void saveNow()}>{busy?'Saving…':'Calculate and save'}</button><button type="button" className="secondary-cta" onClick={exportRuns}>Export history</button><button type="button" className="secondary-cta" onClick={()=>void fetch('/api/calculator',{method:'DELETE'}).then(r=>{if(r.ok){setTier('');setRuns([]);setStatus('Signed out.')}})}>Sign out</button></div>
      <p className="text-sm text-slate-400">External workbook / SharePoint synchronization is not connected. This workspace accepts your entered numbers and keeps saved results private to your purchase. Access stays in this browser; account recovery and cross-device sign-in are pending.</p>
      {runs.map(run=><article key={run.id} className="rounded border border-slate-700 p-4"><p>{run.created} · {run.source} · {run.formula_version}</p><div className="grid gap-2 sm:grid-cols-3">{Object.entries(run.results).map(([key,value])=><p key={key}>{key}: <strong>{value===null?'Not defined':value.toLocaleString()}</strong></p>)}</div></article>)}
    </div>}
  </section>
}
