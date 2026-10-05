import { Activity, BarChart3, Boxes, Cpu, Database, LockKeyhole, Network, Radar, ShieldCheck, Sparkles } from 'lucide-react'

const tiers = [
  ['Access', 'Starter deployment', ['API integration', 'Guided onboarding', 'Core automation']],
  ['Professional', 'Operations dashboard', ['Dashboards', 'Workflow automation', 'Reporting']],
  ['Enterprise', 'Automation suite', ['Multi-system orchestration', 'Analytics', 'Governance controls']],
  ['Sovereign', 'Advanced control plane', ['Private administration', 'Security controls', 'Custom deployment']],
]

const telemetry = [42, 68, 51, 84, 73, 92, 64, 88, 76, 96, 81, 90]

function App() {
  return (
    <main className="min-h-screen bg-[#030611] text-slate-100 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_20%_10%,#1d4ed855,transparent_28%),radial-gradient(circle_at_80%_20%,#a855f733,transparent_24%),radial-gradient(circle_at_50%_90%,#06b6d433,transparent_30%)]" />
      <div className="relative max-w-7xl mx-auto px-5 py-8 md:px-10">
        <nav className="flex items-center justify-between border border-cyan-400/20 bg-slate-950/70 backdrop-blur rounded-2xl px-5 py-4">
          <div><p className="text-lime-300 font-black tracking-[.2em]">QSLC</p><p className="text-xs text-slate-400">Sovereign Automation Engine</p></div>
          <a href="https://qslc-hei.com" className="rounded-xl border border-lime-300/50 px-4 py-2 text-sm font-bold text-lime-300">Secure Admin</a>
        </nav>

        <section className="grid lg:grid-cols-[1.05fr_.95fr] gap-8 items-center py-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-lime-300/30 bg-lime-300/10 px-4 py-2 text-xs font-bold tracking-widest text-lime-300"><Activity size={14}/> PUBLIC CAPABILITY DEMO</div>
            <h1 className="mt-6 text-5xl md:text-7xl font-black leading-[.95]">Sovereign<br/><span className="text-lime-300">Command Center</span></h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-300">A public, non-sensitive view of QSLC automation capabilities. Private SSOT, banking, payroll, credentials and owner controls are excluded from this application.</p>
            <div className="mt-8 flex flex-wrap gap-3"><a href="#tiers" className="rounded-xl bg-lime-300 px-5 py-3 font-black text-slate-950">Explore packages</a><a href="#demo" className="rounded-xl border border-cyan-300/30 px-5 py-3 font-bold">View demo telemetry</a></div>
          </div>
          <div className="relative aspect-square max-w-xl mx-auto w-full rounded-full border border-cyan-300/20 grid place-items-center shadow-[0_0_80px_#06b6d433]">
            <div className="absolute inset-[9%] rounded-full border border-purple-400/30 animate-[spin_20s_linear_infinite]"/><div className="absolute inset-[22%] rounded-full border border-lime-300/30 animate-[spin_14s_linear_infinite_reverse]"/>
            <Radar className="w-40 h-40 text-cyan-300 opacity-80"/><div className="absolute top-[18%] left-[20%] w-3 h-3 rounded-full bg-lime-300 shadow-[0_0_20px_#bef264]"/><div className="absolute bottom-[25%] right-[17%] w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_20px_#c084fc]"/>
            <p className="absolute bottom-[12%] text-xs tracking-[.3em] text-cyan-200">SYSTEM TOPOLOGY • DEMO</p>
          </div>
        </section>

        <section id="demo" className="grid md:grid-cols-3 gap-4">
          {[['Automation Fabric','Workflow routing and orchestration',Network],['Data Intelligence','Source-aware metrics and reporting',Database],['Security Boundary','Owner-only administrative separation',ShieldCheck]].map(([title,copy,Icon]) => { const I=Icon as typeof Network; return <article key={title as string} className="rounded-2xl border border-cyan-400/20 bg-slate-950/70 p-6"><I className="text-cyan-300"/><h2 className="mt-5 text-xl font-black">{title as string}</h2><p className="mt-2 text-sm text-slate-400">{copy as string}</p></article>})}
        </section>

        <section className="mt-6 rounded-3xl border border-purple-400/20 bg-slate-950/80 p-6 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold tracking-[.25em] text-purple-300">EXAMPLE TELEMETRY</p><h2 className="mt-2 text-3xl font-black">Automation throughput</h2><p className="mt-2 text-sm text-slate-400">Synthetic demonstration data — not customer, payroll, banking or SSOT records.</p></div><BarChart3 className="text-purple-300"/></div>
          <div className="mt-8 h-52 flex items-end gap-2">{telemetry.map((v,i)=><div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-cyan-600 to-lime-300 opacity-80" style={{height:`${v}%`}} title={`Demo sample ${i+1}: ${v}`}/>)}</div>
        </section>

        <section id="tiers" className="py-16"><div className="flex items-center gap-3"><Sparkles className="text-lime-300"/><h2 className="text-3xl font-black">Capability packages</h2></div><p className="mt-3 text-slate-400">Public feature examples. Commercial scope and pricing require an approved current offer.</p>
          <div className="mt-7 grid md:grid-cols-2 xl:grid-cols-4 gap-4">{tiers.map(([name,tag,features])=><article key={name as string} className="rounded-2xl border border-slate-700 bg-slate-950/70 p-6 hover:border-lime-300/50 transition"><Boxes className="text-lime-300"/><h3 className="mt-5 text-2xl font-black">{name as string}</h3><p className="text-sm text-cyan-200 mt-1">{tag as string}</p><ul className="mt-5 space-y-3 text-sm text-slate-300">{(features as string[]).map(f=><li key={f} className="flex gap-2"><span className="text-lime-300">◆</span>{f}</li>)}</ul></article>)}</div>
        </section>

        <section className="grid md:grid-cols-2 gap-4 pb-12"><div className="rounded-2xl border border-cyan-400/20 p-6 bg-slate-950/70"><Cpu className="text-cyan-300"/><h3 className="mt-4 font-black text-xl">What visitors can see</h3><p className="mt-2 text-slate-400 text-sm">Product capabilities, synthetic demonstrations, architecture concepts, package features and non-sensitive public status.</p></div><div className="rounded-2xl border border-purple-400/20 p-6 bg-slate-950/70"><LockKeyhole className="text-purple-300"/><h3 className="mt-4 font-black text-xl">What stays private</h3><p className="mt-2 text-slate-400 text-sm">Personal data, payroll, checks, banking, credentials, private SSOT values, administrative actions and owner-only evidence.</p></div></section>
        <footer className="border-t border-slate-800 py-7 text-xs text-slate-500">Quantum Sovereign Logistics Corp • Public capability gateway • No private financial or personal records displayed</footer>
      </div>
    </main>
  )
}

export default App
