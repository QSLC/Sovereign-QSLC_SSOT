import assert from 'node:assert/strict'
import { sanitizePrivateSnapshot } from '../src/contracts/publicMetrics.ts'
import { transitionEvidence } from '../src/governance/evidenceState.ts'
import { buildPublicReport } from '../src/reporting/buildPublicReport.ts'

const sanitized = sanitizePrivateSnapshot({
  generatedAt:'2026-10-06T00:00:00Z', sourceStatus:'verified', freshness:'fresh', synthetic:false,
  metrics:[{id:'safe',label:'Public metric',value:7,unit:'index'}],
  bankAccount:'SHOULD-NOT-SURVIVE', payroll:{gross:99999}, password:'NOPE', privateValue:123,
})
assert.equal(sanitized.metrics.length, 1)
assert.equal('bankAccount' in sanitized, false)
assert.equal('payroll' in sanitized, false)
assert.equal('password' in sanitized, false)

let state = 'pending'
for (const [action,evidenceRef] of [['validate','EV-1'],['dual_approve','EV-2'],['authorize','EV-3']]) {
  const result = transitionEvidence(state, {action, actor:'contract-test', source:'ci', evidenceRef, reason:'regression test'})
  assert.equal(result.accepted, true)
  if (result.accepted) state = result.to
}
assert.equal(state, 'executable')
assert.equal(transitionEvidence('pending',{action:'authorize',actor:'x',source:'ci',evidenceRef:'EV-X',reason:'skip'}).accepted,false)
assert.equal(transitionEvidence('pending',{action:'validate',actor:'x',source:'ci',reason:'missing evidence'}).accepted,false)

const staleReport = buildPublicReport({generatedAt:'2026-10-01T00:00:00Z',sourceStatus:'verified',freshness:'stale',synthetic:false,metrics:[]})
assert.equal(staleReport.verifiedCurrent,false)
assert.equal(staleReport.retentionPolicy,'configurable')

console.log('Governance and public-contract regression checks passed')
