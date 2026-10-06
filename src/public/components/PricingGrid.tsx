import { Boxes, Check } from 'lucide-react'
import { PUBLIC_OFFERS, formatOfferPrice } from '../catalog'

export function PricingGrid() {
  const groups = ['Hosted SaaS','Deployment','Enterprise'] as const
  return <section id="pricing" className="section-shell">
    <div className="section-heading"><span className="eyebrow">COMMERCIAL CATALOG</span><h2>Choose the operating layer you need.</h2><p>Current public pricing. Enterprise and custom scope remains subject to written agreement.</p></div>
    {groups.map(group => <div key={group} className="mt-10"><h3 className="text-xl font-black text-cyan-200">{group}</h3><div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{PUBLIC_OFFERS.filter(o=>o.group===group).map(offer => <article key={offer.id} className="glass-card flex min-h-[300px] flex-col p-6"><Boxes className="text-lime-300"/><h4 className="mt-5 text-2xl font-black">{offer.name}</h4><p className="mt-2 text-3xl font-black text-lime-300">{formatOfferPrice(offer)}</p><p className="mt-3 text-sm text-slate-400">{offer.description}</p><ul className="mt-5 space-y-2 text-sm text-slate-200">{offer.capabilities.map(item=><li key={item} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-cyan-300"/>{item}</li>)}</ul><button type="button" className="mt-auto pt-6 text-left text-sm font-black text-purple-300" aria-label={`${offer.cta} ${offer.name}`}>{offer.cta} →</button></article>)}</div></div>)}
  </section>
}
