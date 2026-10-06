export type SourceStatus = 'verified' | 'degraded' | 'unavailable' | 'demo'
export type SourceFreshness = 'fresh' | 'stale' | 'unavailable' | 'synthetic'

export interface PublicMetric {
  id: string
  label: string
  value: number | string
  unit?: string
  status?: 'ok' | 'warning' | 'unknown'
}

export interface PublicMetricsSnapshot {
  generatedAt: string | null
  sourceStatus: SourceStatus
  freshness: SourceFreshness
  synthetic: boolean
  metrics: PublicMetric[]
}

const STATUS = new Set<SourceStatus>(['verified','degraded','unavailable','demo'])
const FRESHNESS = new Set<SourceFreshness>(['fresh','stale','unavailable','synthetic'])
const METRIC_STATUS = new Set(['ok','warning','unknown'])

function safeText(value: unknown, max = 120) {
  return typeof value === 'string' ? value.slice(0, max) : null
}

export function sanitizePrivateSnapshot(input: unknown): PublicMetricsSnapshot {
  if (!input || typeof input !== 'object') {
    return { generatedAt:null, sourceStatus:'unavailable', freshness:'unavailable', synthetic:false, metrics:[] }
  }
  const raw = input as Record<string, unknown>
  const sourceStatus = STATUS.has(raw.sourceStatus as SourceStatus) ? raw.sourceStatus as SourceStatus : 'unavailable'
  const freshness = FRESHNESS.has(raw.freshness as SourceFreshness) ? raw.freshness as SourceFreshness : 'unavailable'
  const metrics = Array.isArray(raw.metrics) ? raw.metrics.flatMap((item): PublicMetric[] => {
    if (!item || typeof item !== 'object') return []
    const candidate = item as Record<string, unknown>
    const id = safeText(candidate.id, 64)
    const label = safeText(candidate.label, 100)
    const value = candidate.value
    if (!id || !label || !(['string','number'].includes(typeof value))) return []
    const metric: PublicMetric = { id, label, value: value as number | string }
    const unit = safeText(candidate.unit, 32)
    if (unit) metric.unit = unit
    if (METRIC_STATUS.has(candidate.status as string)) metric.status = candidate.status as PublicMetric['status']
    return [metric]
  }) : []
  return {
    generatedAt: safeText(raw.generatedAt, 40),
    sourceStatus,
    freshness,
    synthetic: raw.synthetic === true,
    metrics,
  }
}
