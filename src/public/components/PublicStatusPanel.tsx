import { useEffect, useState } from 'react'
import type { PublicMetricsSnapshot } from '../../contracts/publicMetrics'
import { loadPublicMetrics } from '../data/loadPublicMetrics'

const initial: PublicMetricsSnapshot = { generatedAt:null, sourceStatus:'unavailable', freshness:'unavailable', synthetic:false, metrics:[] }

export function PublicStatusPanel(){
  const [snapshot,setSnapshot]=useState(initial)
  useEffect(()=>{ void loadPublicMetrics().then(setSnapshot) },[])
  return <section className="section-shell" id="status"><div className="section-heading"><span className="eyebrow">PUBLIC METRICS CONTRACT</span><h2>Source state is visible, not implied.</h2><p>Only allowlisted public fields can render here. Private SSOT fields are excluded before the UI sees them.</p></div><div className="mt-8 grid gap-4 md:grid-cols-3">{snapshot.metrics.length ? snapshot.metrics.map(metric=><article key={metric.id} className="glass-card p-6"><p className="text-xs uppercase tracking-[.18em] text-slate-500">{metric.label}</p><p className="mt-3 text-4xl font-black text-white">{metric.value}</p><p className="mt-2 text-xs text-cyan-300">{metric.unit ?? 'value'} • {snapshot.freshness}</p></article>) : <article className="glass-card p-6 md:col-span-3"><p className="text-sm font-bold text-amber-200">Public metrics unavailable. No private fallback is permitted.</p></article>}</div><p className="mt-4 text-xs text-slate-500">Source: {snapshot.sourceStatus} • Freshness: {snapshot.freshness} • Synthetic: {snapshot.synthetic ? 'yes' : 'no'}</p></section>
}
