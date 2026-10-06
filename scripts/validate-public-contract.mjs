import { readFile } from 'node:fs/promises'

const FORBIDDEN = /(bank|routing|account_number|accountNumber|payroll|paycheck|gross_pay|net_pay|password|secret|api[_-]?key|token|credential|private[_-]?value)/i
const ALLOWED_ROOT = new Set(['generatedAt','sourceStatus','freshness','synthetic','metrics'])
const ALLOWED_METRIC = new Set(['id','label','value','unit','status'])

function rejectForbidden(value, path='$') {
  if (!value || typeof value !== 'object') return
  if (Array.isArray(value)) return value.forEach((item,index)=>rejectForbidden(item,`${path}[${index}]`))
  for (const [key,nested] of Object.entries(value)) {
    if (FORBIDDEN.test(key)) throw new Error(`Forbidden public-contract key at ${path}.${key}`)
    rejectForbidden(nested,`${path}.${key}`)
  }
}

export function validatePublicContract(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Public metrics root must be an object')
  rejectForbidden(value)
  for (const key of Object.keys(value)) if (!ALLOWED_ROOT.has(key)) throw new Error(`Unexpected root key: ${key}`)
  if (!Array.isArray(value.metrics)) throw new Error('metrics must be an array')
  for (const metric of value.metrics) {
    if (!metric || typeof metric !== 'object' || Array.isArray(metric)) throw new Error('Each metric must be an object')
    for (const key of Object.keys(metric)) if (!ALLOWED_METRIC.has(key)) throw new Error(`Unexpected metric key: ${key}`)
    if (typeof metric.id !== 'string' || typeof metric.label !== 'string' || !['string','number'].includes(typeof metric.value)) throw new Error('Metric id, label, and value are required')
  }
  return true
}

if (process.argv[1]?.endsWith('validate-public-contract.mjs')) {
  const file = process.argv[2] ?? 'public/public-metrics.json'
  const value = JSON.parse(await readFile(file,'utf8'))
  validatePublicContract(value)
  console.log(`Public contract valid: ${file}`)
}
