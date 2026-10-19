import { Bot, GalleryHorizontalEnd, Images, Network, ShieldCheck, Sparkles } from 'lucide-react'

const scenes = [
  [Bot,'EVE Command Core','Voice, agent, orchestration, and executive interaction visual language.'],
  [ShieldCheck,'Sovereign Data Vault','SSOT, evidence, governance, anti-lockout, recovery, and security.'],
  [Network,'System Matrix','Source -> validation -> SSOT -> calculation -> visualization -> approval -> audit.'],
  [Images,'Content Studio','AI-assisted books, visuals, education, campaign assets, and weekly content generation.'],
  [Sparkles,'PSI Research Lab','Research/theory visualization kept separate from verified financial and operational facts.'],
  [GalleryHorizontalEnd,'Executive Twin','CEO view across finance, operations, security, governance, and automation health.'],
] as const

export function VisualGallery() {
  return <section id="gallery" className="section-shell">
    <div className="section-heading">
      <span className="eyebrow">VISUAL GALLERY</span>
      <h2>Show the architecture without giving away the private core.</h2>
      <p>These public-safe scenes explain what QSLC EVE can do while private SSOT data, credentials, payroll, banking, proprietary formulas, and owner evidence remain protected.</p>
    </div>
    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {scenes.map(([Icon,title,copy],index) => <article key={title} className="glass-card relative min-h-[250px] overflow-hidden p-6">
        <div className="pointer-events-none absolute inset-0 opacity-70" style={{background:`radial-gradient(circle at ${20+(index%3)*22}% 25%, rgba(34,211,238,.28), transparent 30%), radial-gradient(circle at 80% 70%, rgba(168,85,247,.24), transparent 34%), linear-gradient(145deg, rgba(2,6,23,.4), rgba(15,23,42,.88))`}}/>
        <svg viewBox="0 0 360 180" role="img" aria-label={`${title} architecture illustration`} className="relative z-10 mb-6 w-full rounded-xl border border-cyan-300/20 bg-slate-950">
          <defs><linearGradient id={`scene-${index}`}><stop stopColor="#22d3ee"/><stop offset="1" stopColor="#a855f7"/></linearGradient></defs>
          {[0,1,2].map(n => <g key={n}><path d={`M 72 ${40+n*50} Q 150 ${40+n*50} 208 90`} fill="none" stroke={`url(#scene-${index})`} strokeWidth="3"/><rect x="20" y={24+n*50} width="82" height="32" rx="8" fill="#172554" stroke="#22d3ee"/><text x="61" y={44+n*50} textAnchor="middle" fill="#e0f2fe" fontSize="11">{['INPUT','VALIDATE','EVIDENCE'][n]}</text></g>)}
          <circle cx="244" cy="90" r="40" fill="#3b0764" stroke="#bef264" strokeWidth="3"/>
          <circle cx="244" cy="90" r="29" fill="none" stroke="#c084fc" strokeWidth="2"/>
          <text x="244" y="95" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">{['EVE','SSOT','FLOW','STUDIO','PSI','CEO'][index]}</text>
          <path d="M 286 90 H 329" stroke="#bef264" strokeWidth="3"/><circle cx="332" cy="90" r="7" fill="#bef264"/>
        </svg>
        <div className="relative z-10 flex h-full min-h-[200px] flex-col">
          <Icon size={30} className="text-cyan-300"/>
          <div className="mt-auto">
            <h3 className="text-2xl font-black text-white">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">{copy}</p>
          </div>
        </div>
      </article>)}
    </div>
    <p className="mt-4 text-xs leading-5 text-slate-500">Visual concepts are presentation assets. A graphic is never evidence of revenue, system health, account balance, patent status, or provider connection.</p>
  </section>
}
