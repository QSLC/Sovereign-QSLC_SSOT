export type BillingCadence = 'monthly' | 'annual' | 'one-time' | 'starting' | 'quote'

export type OfferGroup = 'Hosted SaaS' | 'Deployment' | 'Enterprise'

export interface ProductOffer {
  id: string
  name: string
  group: OfferGroup
  price: number | null
  cadence: BillingCadence
  current: boolean
  description: string
  capabilities: string[]
  cta: 'Explore' | 'Request scope' | 'Contact'
}

export interface DemoMetrics {
  synthetic: true
  automatedHours: number
  throughput: number
  evidenceCoverage: number
  estimatedControlScore: number
}
