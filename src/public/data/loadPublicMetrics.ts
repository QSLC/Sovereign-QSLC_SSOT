import { sanitizePrivateSnapshot, type PublicMetricsSnapshot } from '../../contracts/publicMetrics'

const FALLBACK: PublicMetricsSnapshot = {
  generatedAt: null,
  sourceStatus: 'demo',
  freshness: 'synthetic',
  synthetic: true,
  metrics: [],
}

export async function loadPublicMetrics(): Promise<PublicMetricsSnapshot> {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}public-metrics.json`, { cache:'no-store' })
    if (!response.ok) return FALLBACK
    return sanitizePrivateSnapshot(await response.json())
  } catch {
    return FALLBACK
  }
}
