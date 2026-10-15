import { useState } from 'react'

const questions = [
  ['What does EVE-HEI do?', 'EVE-HEI is a QSLC automation and governance product concept. Public demonstrations use synthetic data; connected live capabilities require separately verified integrations.'],
  ['How does the living calculator work?', 'The calculator applies visible input values and formulas to produce reproducible estimates. Results are demonstrations, not verified account balances, earnings, or investment returns.'],
  ['What is PSI?', 'PSI is a QSLC-branded concept and metric. It is not represented here as a verified tradable coin, audited valuation, or guaranteed return.'],
  ['Can EVE see farther into space than NASA?', 'No verified observational capability supports that claim. Images here are conceptual artwork, not telescope observations or scientific discoveries.'],
  ['How do I purchase?', 'Review the pricing section and use only a verified, live checkout link. A displayed tier does not establish that payment processing is active.'],
]

export function QuestionsAndSpace() {
  const [query, setQuery] = useState('')
  const matching = questions.filter(([q, a]) => (q + a).toLowerCase().includes(query.toLowerCase()))
  return <section id="questions" className="py-16">
    <div className="rounded-3xl border border-purple-400/30 bg-slate-950/80 p-6 sm:p-10">
      <p className="text-xs font-black uppercase tracking-[.25em] text-lime-300">EVE-HEI public learning</p>
      <h2 className="mt-3 text-3xl font-black text-white">Questions, formulas & space concepts</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">Ask by searching the published answers below. This box searches local public FAQ content; it does not transmit questions, collect personal information, or pretend an agent is online.</p>
      <label htmlFor="eve-question" className="mt-6 block text-sm font-bold text-cyan-200">Your question</label>
      <input id="eve-question" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search EVE, PSI, formulas, space or payments" className="mt-2 w-full rounded-xl border border-cyan-300/30 bg-slate-900 p-4 text-white outline-none focus:border-lime-300" />
      <div className="mt-5 grid gap-3">{matching.length ? matching.map(([q,a])=><article key={q} className="rounded-xl border border-slate-700 bg-slate-900/80 p-5"><h3 className="font-bold text-lime-300">{q}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{a}</p></article>) : <p className="text-sm text-slate-300">No published answer matches yet. Contact QSLC using the address in the footer.</p>}</div>
      <div id="space-concepts" className="mt-10">
        <h3 className="text-2xl font-black text-white">EVE conceptual space gallery</h3>
        <p className="mt-2 text-sm text-slate-300">Original CSS-rendered illustrations. Artistic concepts only: not NASA imagery, real-time spacecraft telemetry, or scientific observations.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            ['Matrix Nebula','radial-gradient(circle at 55% 40%, #d946ef, #312e81 35%, #030712 75%)'],
            ['PSI Orbital Study','radial-gradient(circle at 48% 48%, #bef264 0%, #0891b2 18%, #312e81 40%, #030712 75%)'],
            ['Sovereign Event Horizon','radial-gradient(circle at 50% 50%, #020617 0%, #020617 18%, #a855f7 22%, #06b6d4 32%, #020617 72%)'],
          ].map(([title,background])=><figure key={title} className="overflow-hidden rounded-2xl border border-cyan-300/20 bg-slate-900"><div role="img" aria-label={title + ' abstract conceptual artwork'} className="aspect-[4/3]" style={{backgroundImage:background}}/><figcaption className="p-4 text-sm font-semibold text-cyan-200">{title} · Concept illustration</figcaption></figure>)}
        </div>
      </div>
    </div>
  </section>
}
