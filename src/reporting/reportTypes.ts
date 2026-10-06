import type { SourceFreshness, SourceStatus } from '../contracts/publicMetrics'

export interface PublicReport {
  generatedAt: string | null
  sourceStatus: SourceStatus
  freshness: SourceFreshness
  synthetic: boolean
  verifiedCurrent: boolean
  retentionPolicy: 'configurable' | 'verified'
  summary: Array<{label:string; value:number | string; unit?:string}>
}
