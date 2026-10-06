import type { ProductOffer } from './types'

export const PUBLIC_OFFERS: ProductOffer[] = [
  { id:'starter', name:'Starter', group:'Hosted SaaS', price:49, cadence:'monthly', current:true, description:'Core command-center access for small teams.', capabilities:['Managed dashboard','Time tracking','Core automation'], cta:'Explore' },
  { id:'pro', name:'Pro', group:'Hosted SaaS', price:149, cadence:'monthly', current:true, description:'Expanded automation and reporting.', capabilities:['Advanced workflows','Rate rules','Executive reporting'], cta:'Explore' },
  { id:'business', name:'Business', group:'Hosted SaaS', price:499, cadence:'monthly', current:true, description:'Operational control for growing organizations.', capabilities:['Operational alerts','Priority support','Expanded reporting'], cta:'Explore' },
  { id:'template', name:'Starter Command Center Template', group:'Deployment', price:49, cadence:'one-time', current:true, description:'A starter command-center template.', capabilities:['Template files','Setup guide','Demo data'], cta:'Explore' },
  { id:'self-hosted', name:'Self-Hosted License', group:'Deployment', price:499, cadence:'one-time', current:true, description:'Customer-controlled deployment package.', capabilities:['Self-hosted package','Environment guide','Public demo shell'], cta:'Request scope' },
  { id:'custom', name:'Custom Build', group:'Deployment', price:1200, cadence:'starting', current:true, description:'Custom deployment and workflow build.', capabilities:['Custom UI','Workflow design','Integration planning'], cta:'Request scope' },
  { id:'pilot', name:'Executive Pilot', group:'Deployment', price:10000, cadence:'one-time', current:true, description:'Executive onboarding pilot for enterprise evaluation.', capabilities:['2 named seats','1 production-like environment','1 standard integration'], cta:'Contact' },
  { id:'core', name:'Enterprise Core', group:'Enterprise', price:120000, cadence:'annual', current:true, description:'Enterprise governance and automation foundation.', capabilities:['Multi-user operations','Dedicated environment','Approved integrations'], cta:'Contact' },
  { id:'scale', name:'Enterprise Scale', group:'Enterprise', price:250000, cadence:'annual', current:true, description:'Expanded environments, integrations, and control.', capabilities:['Expanded seats','Multi-environment','Priority governance support'], cta:'Contact' },
  { id:'sovereign', name:'Sovereign Platform', group:'Enterprise', price:500000, cadence:'annual', current:true, description:'Top-tier dedicated platform and governance support.', capabilities:['Up to 50 named seats','Up to 5 environments','Up to 12 approved integrations'], cta:'Contact' },
]

export function formatOfferPrice(offer: ProductOffer) {
  if (offer.price === null || offer.cadence === 'quote') return 'Custom quote'
  const value = `$${offer.price.toLocaleString('en-US')}`
  if (offer.cadence === 'monthly') return `${value}/mo`
  if (offer.cadence === 'annual') return `${value}/yr`
  if (offer.cadence === 'starting') return `Starting at ${value}`
  return `${value} one-time`
}
