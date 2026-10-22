import { AppWindow, Network, Orbit, Radio, Sparkles } from 'lucide-react'

const apps = [
  { name: 'EVE Sovereign Command', role: 'Primary governed command surface', icon: Radio },
  { name: 'QSLC Universe™', role: 'Spatial ecosystem and system visualization', icon: Orbit },
  { name: 'PublishPulse', role: 'Content and publishing operations', icon: Sparkles },
  { name: 'QSLC Navigation Galaxy', role: 'Navigation and cross-system discovery', icon: Network },
  { name: 'NexusHub', role: 'Integration and workspace hub', icon: AppWindow },
]

export function Base44Constellation() {
  return (
    <section id="base44-constellation" className="py-14">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black tracking-[.24em] text-lime-300">BASE44 APP CONSTELLATION</p>
          <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">Five apps. One governed system.</h2>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-slate-400">
          These Base44 applications are presentation and workflow surfaces. Canonical business state remains source-gated by EVE and the QSLC SSOT.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-cyan-300/20 bg-slate-950/75 p-6 shadow-[0_0_90px_#06b6d422] sm:p-10">
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_50%_50%,#06b6d444_0,transparent_38%),linear-gradient(#22d3ee0d_1px,transparent_1px),linear-gradient(90deg,#22d3ee0d_1px,transparent_1px)] [background-size:auto,32px_32px,32px_32px]" />
        <div className="relative grid gap-4 md:grid-cols-5">
          {apps.map(({ name, role, icon: Icon }, index) => (
            <article key={name} className="group rounded-2xl border border-slate-800 bg-slate-950/80 p-5 transition hover:-translate-y-1 hover:border-cyan-300/40 hover:shadow-[0_0_32px_#06b6d422]">
              <div className="mb-4 flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300"><Icon size={21}/></span>
                <span className="text-[10px] font-black tracking-[.18em] text-slate-500">NODE 0{index + 1}</span>
              </div>
              <h3 className="text-base font-black text-white">{name}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-400">{role}</p>
              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-900">
                <div className="h-full rounded-full bg-gradient-to-r from-lime-300 via-cyan-300 to-purple-400" style={{width:`${62 + index * 7}%`}} />
              </div>
            </article>
          ))}
        </div>

        <div className="relative mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-lime-300/20 bg-lime-300/5 p-4"><p className="text-xs font-black text-lime-300">AUTHORITY</p><p className="mt-1 text-sm text-slate-300">EVE + canonical SSOT</p></div>
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-4"><p className="text-xs font-black text-cyan-300">PRESENTATION</p><p className="mt-1 text-sm text-slate-300">Base44 + public domain</p></div>
          <div className="rounded-2xl border border-purple-300/20 bg-purple-300/5 p-4"><p className="text-xs font-black text-purple-300">AUDIT</p><p className="mt-1 text-sm text-slate-300">Provider evidence + history</p></div>
        </div>
      </div>
    </section>
  )
}
