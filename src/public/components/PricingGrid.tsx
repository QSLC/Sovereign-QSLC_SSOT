import { Boxes, Check } from 'lucide-react'
import { PUBLIC_OFFERS, formatOfferPrice } from '../catalog'

const checkoutByOffer: Record<string,string> = {
  starter: 'https://buy.stripe.com/aFadR9fB3giJ3Z06PL9sk0i',
  pro: 'https://buy.stripe.com/dRm6oHcoRd6x678fmh9sk0j',
  business: 'https://buy.stripe.com/7sYbJ1agJd6x2UW1vr9sk0k',
  template: 'https://buy.stripe.com/4gM4gzgF79UlfHI7TP9sk0h',
}

function offerHref(id:string, name:string) {
  return checkoutByOffer[id] ?? `mailto:sovereign@quantumsovereignlogisticsco.onmicrosoft.com?subject=${encodeURIComponent(`QSLC ${name} meeting / scope request`)}&body=${encodeURIComponent('Company:\nRequested date/time and time zone:\nProduct/tier:\nObjective:\n')}`
}

export function PricingGrid() {
  const groups = ['Hosted SaaS','Deployment','Enterprise'] as const
  return <section id="pricing" className="section-shell">
    <div className="section-heading"><span className="eyebrow">COMMERCIAL CATALOG</span><h2>Choose the operating layer you need.</h2><p>Hosted SaaS checkout uses verified Stripe LIVE prices. Enterprise and custom scope remains subject to written agreement and review.</p></div>
    {groups.map(group => <div key={group} className="mt-10"><h3 className="text-xl font-black text-cyan-200">{group}</h3><div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{PUBLIC_OFFERS.filter(o=>o.group===group).map(offer => {
      const checkout = checkoutByOffer[offer.id]
      return <article key={offer.id} className="glass-card flex min-h-[300px] flex-col p-6"><Boxes className="text-lime-300"/><h4 className="mt-5 text-2xl font-black">{offer.name}</h4><p className="mt-2 text-3xl font-black text-lime-300">{formatOfferPrice(offer)}</p><p className="mt-3 text-sm text-slate-400">{offer.description}</p><ul className="mt-5 space-y-2 text-sm text-slate-200">{offer.capabilities.map(item=><li key={item} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-cyan-300"/>{item}</li>)}</ul><a href={offerHref(offer.id, offer.name)} target={checkout ? '_blank' : undefined} rel={checkout ? 'noreferrer' : undefined} className="mt-auto pt-6 text-left text-sm font-black text-purple-300" aria-label={checkout ? `Purchase ${offer.name}` : `Request meeting for ${offer.name}`}>{checkout ? 'Purchase / subscribe' : 'Request meeting'} →</a></article>
    })}</div></div>)}
    <p className="mt-5 text-xs leading-5 text-slate-500">A published price is not revenue. QSLC recognizes a sale only after Stripe/provider evidence confirms the required payment state. Taxes, refunds, disputes, payout timing, and fulfillment remain separate states.</p>
  </section>
}
