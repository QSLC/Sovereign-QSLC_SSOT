import type { PublicMetricsSnapshot } from '../contracts/publicMetrics'
import type { PublicReport } from './reportTypes'

export function buildPublicReport(snapshot: PublicMetricsSnapshot, retentionVerified = false): PublicReport {
  const verifiedCurrent = snapshot.sourceStatus === 'verified' && snapshot.freshness === 'fresh' && !snapshot.synthetic
  return {
    generatedAt: snapshot.generatedAt,
    sourceStatus: snapshot.sourceStatus,
    freshness: snapshot.freshness,
    synthetic: snapshot.synthetic,
    verifiedCurrent,
    retentionPolicy: retentionVerified ? 'verified' : 'configurable',
    summary: snapshot.metrics.map(({label,value,unit}) => ({label,value,...(unit ? {unit} : {})})),
  }
}
