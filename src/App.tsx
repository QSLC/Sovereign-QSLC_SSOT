import { Activity, LockKeyhole, Radar, ShieldCheck, Sparkles } from 'lucide-react'
import { BooksStore } from './public/components/BooksStore'
import { DailySignal } from './public/components/DailySignal'
import { EvidenceGateDemo } from './public/components/EvidenceGateDemo'
import { LearningStudio } from './public/components/LearningStudio'
import { GovernanceCenter } from './public/components/GovernanceCenter'
import { HiringCenter } from './public/components/HiringCenter'
import { LivingCalculatorDemo } from './public/components/LivingCalculatorDemo'
import { MeetingCenter } from './public/components/MeetingCenter'
import { PricingGrid } from './public/components/PricingGrid'
import { PsiQuickLink } from './public/components/PsiQuickLink'
import { PublicStatusPanel } from './public/components/PublicStatusPanel'
import { SystemStarMap } from './public/components/SystemStarMap'

function App() {
  return <main className="min-h-screen overflow-hidden bg-[#030611] text-slate-100">
    <div className="pointer-events-none fixed inset-0 opacity-60 bg-[radial-gradient(circle_at_20%_10%,#1d4ed855,transparent_30%),radial-gradient(circle_at_80%_20%,#a855f744,transparent_28%),radial-gradient(circle_at_50%_90%,#06b6d433,transparent_34%)]" />
    <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 md:px-10">
      <nav className="sticky top-3 z-30 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cyan-400/20 bg-slate-950/80 px-4 py-3 backdrop-blur-xl">
        <div><p className="font-black tracking-[.2em] text-lime-300">QSLC EVE</p><p className="text-[11px] text-slate-500">Sovereign Command Center</p></div>
        <div className="flex flex-wrap gap-2 text-xs font-bold"><a href="#status" className="nav-chip">Status</a><a href="#pricing" className="nav-chip">Pricing</a><a href="#calculator" className="nav-chip">Calculator</a><a href="#topology" className="nav-chip">Star Map</a><a href="#learning" className="nav-chip">Learn</a><a href="#books" className="nav-chip">Books</a><a href="#meeting" className="nav-chip">Meeting</a><a href="#psi" className="nav-chip">PSI</a><a href="#governance" className="nav-chip">Governance</a><a href="#hiring" className="nav-chip">Hiring</a></div>
      </nav>

      <section className="grid items-center gap-10 py-14 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
        <div><div className="inline-flex items-center gap-2 rounded-full border border-lime-300/30 bg-lime-300/10 px-4 py-2 text-xs font-black tracking-widest text-lime-300"><Activity size={14}/> PUBLIC PRODUCT EXPERIENCE</div><h1 className="mt-6 text-5xl font-black leading-[.92] sm:text-6xl md:text-7xl">Control the work.<br/><span className="bg-gradient-to-r from-lime-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent">Prove the state.</span></h1><p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">An enterprise-grade public demonstration of QSLC EVE automation, governance, learning, and product tiers. Private SSOT, payroll, banking, credentials, owner evidence, and administrative actions are excluded.</p><div className="mt-8 flex flex-wrap gap-3"><a href="#pricing" className="primary-cta">Explore products</a><a href="#calculator" className="secondary-cta">Run synthetic demo</a></div><div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">{[['10','Offers'],['6','Governance states'],['100%','Synthetic demos'],['0','Private records']].map(([v,l])=><div key={l} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"><p className="text-2xl font-black text-white">{v}</p><p className="text-xs text-slate-500">{l}</p></div>)}</div></div>
        <div className="relative mx-auto grid aspect-square w-full max-w-xl place-items-center rounded-full border border-cyan-300/20 shadow-[0_0_90px_#06b6d433]"><div className="orbit absolute inset-[7%] rounded-full border border-purple-400/30"/><div className="orbit-reverse absolute inset-[20%] rounded-full border border-lime-300/30"/><Radar className="h-36 w-36 text-cyan-300 opacity-80 sm:h-44 sm:w-44"/><span className="absolute left-[18%] top-[20%] h-3 w-3 rounded-full bg-lime-300 shadow-[0_0_20px_#bef264]"/><span className="absolute bottom-[22%] right-[17%] h-2.5 w-2.5 rounded-full bg-purple-400 shadow-[0_0_20px_#c084fc]"/><p className="absolute bottom-[11%] text-[10px] font-black tracking-[.28em] text-cyan-200 sm:text-xs">LIVE-STYLE • SYNTHETIC TOPOLOGY</p></div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">{[[ShieldCheck,'Evidence Governance','No Evidence = No Approval is taught as an explicit state flow.'],[Sparkles,'Interactive Learning','Users can explore products, demos, and architecture without exposing private systems.'],[LockKeyhole,'Protected Boundary','Owner/admin operations remain outside the public product surface.']].map(([Icon,title,copy])=>{const I=Icon as typeof ShieldCheck;return <article key={title as string} className="glass-card p-6"><I className="text-cyan-300"/><h2 className="mt-5 text-xl font-black">{title as string}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{copy as string}</p></article>})}</section>

      <DailySignal />
      <PublicStatusPanel />
      <PricingGrid />
      <BooksStore />
      <MeetingCenter />
      <PsiQuickLink />
      <GovernanceCenter />
      <LivingCalculatorDemo />
      <EvidenceGateDemo />
      <SystemStarMap />
      <LearningStudio />
      <HiringCenter />

      <footer className="mt-10 border-t border-slate-800 py-8 text-xs leading-6 text-slate-500">Quantum Sovereign Logistics Corp • qslc-hei.com • Books & product contact: qslc1010@qslc-hei.com • <a href="/terms.html" className="text-cyan-300">Terms</a> • <a href="/privacy.html" className="text-cyan-300">Privacy</a> • <a href="/refunds.html" className="text-cyan-300">Refunds</a> • <a href="/digital-asset-notice.html" className="text-cyan-300">Digital Asset Notice</a> • Public QSLC EVE capability gateway • Synthetic demonstrations are not financial, payroll, banking, or private SSOT records.</footer>
    </div>
  </main>
}

export default App
