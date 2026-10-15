import { useState } from 'react'
const routes: Record<string,string> = {pricing:'#pricing', calculator:'#calculator', books:'#books', gallery:'#gallery', questions:'#questions', status:'#status', governance:'#governance', learning:'#learning', hiring:'#hiring', psi:'#psi'}
const phases = [
  ['1 · Capture','Inputs, source IDs and evidence are collected.'],
  ['2 · Validate','Rules check schema, freshness, ownership and permission.'],
  ['3 · Calculate','Versioned formulas transform approved inputs.'],
  ['4 · Review','Evidence gates reject missing or contradictory claims.'],
  ['5 · Publish','Only public-safe, consented outputs reach customers.'],
]
export function EveCommandExperience(){
  const [command,setCommand]=useState('')
  const [message,setMessage]=useState('Ready: try “open calculator”, “open books” or “open pricing”.')
  const [speech,setSpeech]=useState(false)
  function run(){
    const target=Object.keys(routes).find(key=>command.toLowerCase().includes(key))
    if(target){document.querySelector(routes[target])?.scrollIntoView({behavior:'smooth'});setMessage('Opened '+target+' section. This command changes navigation only.')}
    else setMessage('No matching public navigation command. Try calculator, books, gallery, questions, pricing or status.')
  }
  function speak(){
    if(!('speechSynthesis' in window)){setMessage('Voice playback is unavailable in this browser.');return}
    window.speechSynthesis.cancel()
    const utterance=new SpeechSynthesisUtterance(message)
    utterance.onstart=()=>setSpeech(true)
    utterance.onend=()=>setSpeech(false)
    window.speechSynthesis.speak(utterance)
  }
  return <section id="command" className="py-16">
    <div className="rounded-3xl border border-cyan-300/30 bg-slate-950/90 p-6 shadow-[0_0_75px_#7c3aed22] sm:p-10">
      <p className="text-xs font-black tracking-[.25em] text-lime-300">QSLC · EVE-HEI INTERACTIVE COMMAND CENTER</p>
      <h2 className="mt-3 text-3xl font-black text-white">One command. Clear evidence.</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">Quantum Sovereign Logistics Corp develops operational automation, audit-ready evidence workflows and decision-support demonstrations. EVE-HEI is the product's agent-oriented interface, not an independently verified autonomous intelligence. This public terminal navigates site sections; it cannot access owner data or execute private operations.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <input aria-label="EVE public command" value={command} onChange={e=>setCommand(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')run()}} placeholder="open calculator" className="min-w-0 flex-1 rounded-xl border border-cyan-400/30 bg-slate-900 p-4 text-white outline-none focus:border-lime-300"/>
        <button type="button" onClick={run} className="rounded-xl bg-lime-300 px-6 py-3 font-black text-slate-950">Run command</button>
        <button type="button" onClick={speak} className="rounded-xl border border-purple-400 px-5 py-3 font-bold text-purple-200">{speech?'Speaking…':'Hear result'}</button>
      </div>
      <p aria-live="polite" className="mt-3 text-sm text-cyan-200">{message}</p>
      <div className="mt-10 grid gap-4 md:grid-cols-5">{phases.map(([title,copy],index)=><article key={title} className="rounded-xl border border-purple-400/30 bg-gradient-to-b from-purple-950/60 to-slate-900 p-4"><div className="mb-4 h-2 rounded-full bg-slate-700"><div className="h-2 rounded-full bg-gradient-to-r from-lime-300 via-cyan-400 to-purple-500" style={{width:(index+1)*20+'%'}}/></div><h3 className="font-black text-lime-300">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-300">{copy}</p></article>)}</div>
      <p className="mt-4 text-xs text-slate-400">The progress bars illustrate workflow order, not measured completion. Speech is browser text-to-speech; no microphone, agent connection or live telemetry is claimed.</p>
      <div id="newsletter" className="mt-10 rounded-2xl border border-lime-300/30 p-5">
        <h3 className="text-xl font-black">QSLC updates & product newsletter</h3>
        <p className="mt-2 text-sm text-slate-300">Request product updates by email. This opens your email app; it does not silently enroll you or store contact details.</p>
        <a className="mt-4 inline-block rounded-xl bg-purple-500 px-5 py-3 font-bold text-white" href="mailto:qslc1010@qslc-hei.com?subject=QSLC%20Newsletter%20Opt-in&body=Please%20subscribe%20me%20to%20QSLC%20product%20updates.%20I%20consent%20to%20receiving%20these%20emails.">Request newsletter</a>
      </div>
    </div>
  </section>
}
