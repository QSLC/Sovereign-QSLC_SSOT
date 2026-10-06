import { useState } from 'react'
import { CheckCircle2, CircleDashed, LockKeyhole, Snowflake } from 'lucide-react'

const states = ['pending','validated','dual_approved','executable','blocked','frozen'] as const
const copy: Record<(typeof states)[number],string> = {
  pending:'Evidence is being collected. No approval is allowed yet.',
  validated:'Required evidence passed validation.',
  dual_approved:'Two approvals are recorded for the training example.',
  executable:'The simulated operation now meets the evidence gate.',
  blocked:'A required evidence item is missing, so execution is blocked.',
  frozen:'The simulated control plane is administratively frozen.',
}

export function EvidenceGateDemo(){
  const [state,setState]=useState<(typeof states)[number]>('pending')
  const Icon = state==='blocked'?LockKeyhole:state==='frozen'?Snowflake:state==='pending'?CircleDashed:CheckCircle2
  return <section id="evidence" className="section-shell"><div className="section-heading"><span className="eyebrow">EVIDENCE BEFORE APPROVAL</span><h2>Learn the governance flow without touching a real record.</h2><p>Training-only simulation of QSLC evidence states.</p></div><div className="mt-8 grid gap-6 lg:grid-cols-[1fr_.7fr]"><div className="glass-card p-6"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{states.map(item=><button key={item} type="button" onClick={()=>setState(item)} className={`rounded-2xl border px-4 py-4 text-left text-sm font-black ${state===item?'border-lime-300 bg-lime-300/10 text-lime-200':'border-slate-700 bg-slate-950/60 text-slate-300'}`}>{item.replace('_',' ')}</button>)}</div></div><article className="glass-card p-6"><Icon className="text-purple-300"/><p className="mt-5 text-xs uppercase tracking-[.2em] text-slate-500">Current training state</p><h3 className="mt-2 text-3xl font-black text-white">{state.replace('_',' ')}</h3><p className="mt-4 text-sm leading-6 text-slate-300">{copy[state]}</p><p className="mt-5 text-xs font-bold text-cyan-300">No admin mutation • no external write • synthetic state only</p></article></div></section>
}
