import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Pause, Play, ShieldCheck } from 'lucide-react'

const scenes = [
  { name: 'The Event Horizon', kind: 'Black-hole observatory', accent: '#f4c76d', summary: 'Accretion disk and gravitational lensing — AI-inspired conceptual artwork.' },
  { name: 'Planetary Voyage', kind: 'Planetary systems', accent: '#b0ff53', summary: 'A cinematic planetary exploration concept, not live NASA imagery.' },
  { name: 'Sovereign Star Atlas', kind: 'Star maps', accent: '#aa74ff', summary: 'Navigation constellations and research overlays, not observational star data.' },
  { name: 'Fleet Beyond Earth', kind: 'Spacecraft and logistics', accent: '#f4c76d', summary: 'Future fleet and spacecraft architecture concept art.' },
  { name: 'Intelligence Blueprint', kind: 'Technology sectors', accent: '#b0ff53', summary: 'Conceptual systems, security and automation blueprints.' },
  { name: 'Storm Observatory', kind: 'Earth and atmospheric systems', accent: '#aa74ff', summary: 'Stylized storm visualization, not a real-time weather feed.' },
] as const

function indexForUtcDay() {
  return Math.floor(Date.now() / 86400000) % scenes.length
}

export function VisualGallery() {
  const [selected, setSelected] = useState(indexForUtcDay)
  const [motion, setMotion] = useState(false)
  useEffect(() => {
    const timer = window.setInterval(() => setSelected(indexForUtcDay()), 3600000)
    return () => window.clearInterval(timer)
  }, [])
  const active = scenes[selected]
  const change = (direction: number) => setSelected(current => (current + direction + scenes.length) % scenes.length)
  return <section id="gallery" className="section-shell">
    <div className="section-heading">
      <span className="eyebrow">QSLC — EVE-HEI — VISUAL OBSERVATORY</span>
      <h2>Every dimension, one sovereign visual identity.</h2>
      <p>Explore daily rotating cinematic concepts for planetary systems, black holes, star maps, spacecraft, blueprints, and atmospheric intelligence. All illustrations are conceptual, not a live scientific feed.</p>
    </div>
    <div className="mt-8 overflow-hidden rounded-3xl border border-purple-400/30 bg-[#05030d] shadow-[0_0_50px_rgba(126,34,206,.16)]">
      <div className="relative flex min-h-[350px] flex-col justify-between overflow-hidden p-5 sm:min-h-[480px] sm:p-8" style={{background:'radial-gradient(ellipse at 47% 44%, #6123a1 0%,#240d4f 21%,#090617 53%,#020108 90%)'}}>
        <div className="pointer-events-none absolute inset-0" aria-hidden="true" style={{backgroundImage:'radial-gradient(circle at 12% 28%,#fff 0 1px,transparent 2px),radial-gradient(circle at 73% 17%,#beff5a 0 1px,transparent 2px),radial-gradient(circle at 80% 77%,#fff 0 1px,transparent 2px),radial-gradient(circle at 34% 82%,#be9fff 0 2px,transparent 3px)',backgroundSize:'127px 131px,197px 233px,97px 177px,251px 247px'}}/>
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[190px] w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-[275px] sm:w-[275px]" style={{background:'radial-gradient(circle at 36% 28%,#f4c76d 0%,#9b52f7 16%,#1a0b41 55%,#020109 72%)',boxShadow:'0 0 52px 17px #8534d355, 0 0 0 2px #beff5a50'}} aria-hidden="true"/>
        <div className={`pointer-events-none absolute left-1/2 top-1/2 h-[95px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-2 border-[#beff5a] sm:h-[130px] sm:w-[530px] ${motion ? 'animate-[spin_35s_linear_infinite]' : ''}`} style={{transform:'translate(-50%,-50%) rotate(-24deg)',boxShadow:'0 0 17px #b0ff5360'}} aria-hidden="true"/>
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[260px] w-[140px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-[#b989ff] sm:h-[370px] sm:w-[190px]" style={{transform:'translate(-50%,-50%) rotate(25deg)'}} aria-hidden="true"/>
        <div className="relative z-10 flex items-start justify-between gap-4"><div><p className="text-xs font-black tracking-[.32em] text-lime-300">EVE DAILY SIGNAL · {String(selected + 1).padStart(2,'0')}</p><p className="mt-2 text-xs tracking-widest text-purple-200">{active.kind}</p></div><span className="rounded-lg border border-lime-400/50 bg-black/70 px-3 py-2 text-right text-[9px] font-black tracking-widest text-lime-200"><ShieldCheck size={15} className="mb-1 ml-auto"/>QSLC GOVERNANCE<br/>CONCEPT ART</span></div>
        <div className="relative z-10 mt-48 sm:mt-72"><h3 className="max-w-lg text-3xl font-black text-white sm:text-5xl">{active.name}</h3><p className="mt-3 max-w-xl text-sm text-purple-100">{active.summary}</p><div className="mt-5 flex items-center justify-between"><p className="text-xs font-black tracking-[.3em] text-[#f4c76d]">Ψ · QSLC — EVE-HEI</p><span className="text-[11px] text-slate-300">QSLC © {new Date().getUTCFullYear()}</span></div></div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-purple-400/20 p-4"><div className="flex gap-2"><button type="button" aria-label="Previous gallery scene" onClick={() => change(-1)} className="rounded-xl border border-purple-300/30 p-3 text-white"><ArrowLeft size={18}/></button><button type="button" aria-label="Next gallery scene" onClick={() => change(1)} className="rounded-xl border border-purple-300/30 p-3 text-white"><ArrowRight size={18}/></button><button type="button" aria-label={motion ? 'Pause orbit motion' : 'Play orbit motion'} onClick={() => setMotion(v => !v)} className="rounded-xl border border-purple-300/30 p-3 text-white">{motion ? <Pause size={18}/> : <Play size={18}/>}</button></div><p className="text-xs text-slate-400">Theme changes by UTC day · Select any scene · Illustrated, not live telemetry</p></div>
      <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3">{scenes.map((scene,i)=><button type="button" key={scene.name} onClick={() => setSelected(i)} aria-pressed={selected===i} className={`rounded-xl border px-3 py-3 text-left text-sm transition ${selected===i?'border-lime-300 bg-lime-300/10 text-white':'border-purple-300/20 text-slate-300 hover:border-purple-300/60'}`}><span className="mb-1 block text-xs" style={{color:scene.accent}}>0{i+1}</span>{scene.name}</button>)}</div>
    </div>
    <p className="mt-4 text-xs leading-5 text-slate-500">Visuals are CSS-rendered interactive concepts and branded illustrations, not actual NASA images or live storm maps. Automated external image creation, publishing, and sales require a separately verified authorized pipeline.</p>
  </section>
}
