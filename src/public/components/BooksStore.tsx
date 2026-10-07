import { BookOpen, ExternalLink, Mail, ShieldCheck, Sparkles } from 'lucide-react'

const books = [
  ['01','The Sovereign Architect: The 1010 Protocol','$7.99 digital','https://book.stripe.com/5kQfZh1Kd3vXcvw7TP9sk0a'],
  ['02','EVE-1010: Sovereign Intelligence Field Guide','$9.99 digital','https://book.stripe.com/dRm6oH1KdfeFgLMfmh9sk0b'],
  ['03','Conscious Energy Continuum','$8.99 digital','https://book.stripe.com/7sYfZhdsVfeFgLMa1X9sk0c'],
  ['04','The Living Calculator','$12.99 digital','https://book.stripe.com/aFa5kD1KdaYp8fg1vr9sk0d'],
  ['05','QSLC Sovereign Operations Manual','$12.99 digital','https://book.stripe.com/bJeaEXcoR8Qh534fmh9sk0g'],
  ['06','Building Alone With AI','$9.99 digital','https://book.stripe.com/dRmdR9dsV4A19jkeid9sk0e'],
  ['07','EVE-1010 Live Ledger Workbook','$6.99 digital','https://book.stripe.com/aFa7sL74x3vXbrsgql9sk0f'],
] as const

export function BooksStore() {
  return <section id="books" className="section-shell">
    <div className="section-heading">
      <span className="eyebrow">EVE-1010 FOUNDER SERIES</span>
      <h2>Read the system. Test the system. Build from evidence.</h2>
      <p>Seven public-safe volumes covering the founder story, EVE architecture, CEC theory, formula lineage, sovereign operations, one-person AI leverage, and a live reader ledger.</p>
    </div>

    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {books.map(([n,title,price,buy]) => <article key={n} className="glass-card flex min-h-[260px] flex-col p-6">
        <div className="flex items-center justify-between gap-3"><BookOpen className="text-cyan-300"/><span className="text-xs font-black tracking-[.25em] text-lime-300">BOOK {n}</span></div>
        <h3 className="mt-5 text-xl font-black">{title}</h3>
        <p className="mt-3 text-sm font-bold text-purple-200">{price}</p><a className="primary-cta mt-auto pt-6" href={buy} target="_blank" rel="noreferrer">Buy digital book <ExternalLink size={15}/></a>
      </article>)}
    </div>

    <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
      <article className="glass-card p-7">
        <Sparkles className="text-lime-300"/>
        <h3 className="mt-4 text-2xl font-black">EVE-1010 Sovereign Systems Digital Vault</h3>
        <p className="mt-3 text-slate-300">Complete seven-volume digital bundle plus Live Ledger companion resources. Individual digital prices total $69.93; the $59.99 Vault saves $9.94.</p>
        <p className="mt-5 text-4xl font-black text-lime-300">$59.99</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a className="primary-cta" href="https://book.stripe.com/28EcN59cFd6x2UW5LH9sk09" target="_blank" rel="noreferrer">Buy & open Reader Vault <ExternalLink size={15}/></a>
          <a className="secondary-cta" href="mailto:qslc1010@qslc-hei.com?subject=EVE-1010%20Books">Ask about the series <Mail size={15}/></a>
        </div>
      </article>
      <article className="glass-card p-7">
        <ShieldCheck className="text-cyan-300"/>
        <h3 className="mt-4 text-xl font-black">Publishing boundary</h3>
        <p className="mt-3 text-sm leading-6 text-slate-400">Public books use sanitized examples, formula provenance labels, and public-safe system diagrams. Private SSOT, banking, payroll, credentials, owner evidence, and confidential implementation data remain outside the public product.</p>
        <p className="mt-4 text-sm text-slate-300">Public contact: <a className="font-black text-cyan-300" href="mailto:qslc1010@qslc-hei.com">qslc1010@qslc-hei.com</a></p>
      </article>
    </div>
  </section>
}
