import { useState } from 'react'
import { ArrowRight, CheckCircle2, Download, LockKeyhole, ShieldCheck } from 'lucide-react'

type DemoEvent = { id: string; source: 'QDS-44-SAMPLE'; classification: 'SYNTHETIC'; observed_at: string; baseline_hours: number; automated_hours: number; labor_rate_usd: number }
type Mission = { id: string; title: string; status: 'DRAFT_DEMO'; created_at: string }

const STEPS = ['Microsoft identity', 'QSLC dashboard', 'QDS-44 event', 'Living Calculator v1', 'Quantum Core QDI', 'AI Navigator', 'Create mission', 'Audit + evidence']
const dollars = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n)
const safe = (n: number, max: number) => Number.isFinite(n) ? Math.min(max, Math.max(0, n)) : 0

/** Public training path only. No identity assertion, provider read, SSOT write, or backend mutation. */
export function Qds44MissionFlow() {
  const [event, setEvent] = useState<DemoEvent | null>(null)
  const [mission, setMission] = useState<Mission | null>(null)
  const [baseline, setBaseline] = useState(40)
  const [automated, setAutomated] = useState(12)
  const [rate, setRate] = useState(30)
  const [evidence, setEvidence] = useState(80)
  const hoursSaved = Math.min(safe(baseline, 100000), safe(automated, 100000))
  const estimatedValue = hoursSaved * safe(rate, 100000)
  // Illustrative transparent index, not a proprietary/scientific or provider-backed QDI.
  const demoQdi = Math.round((safe(evidence, 100) * 0.6) + ((safe(baseline, 100000) > 0 ? hoursSaved / safe(baseline, 100000) : 0) * 40))
  const recommendation = demoQdi >= 70 ? 'Pilot the workflow with a human approval gate.' : 'Improve evidence coverage and test a smaller pilot first.'
  const makeEvent = () => {
    setEvent({ id: `QDS44-SAMPLE-${Date.now()}`, source: 'QDS-44-SAMPLE', classification: 'SYNTHETIC', observed_at: new Date().toISOString(), baseline_hours: 40, automated_hours: 12, labor_rate_usd: 30 })
    setBaseline(40); setAutomated(12); setRate(30); setEvidence(80); setMission(null)
  }
  const makeMission = () => {
    if (!event) return
    setMission({ id: `DEMO-MISSION-${Date.now()}`, title: 'Validate QDS-44 operational pilot', status: 'DRAFT_DEMO', created_at: new Date().toISOString() })
  }
  const downloadAudit = () => {
    if (!event || !mission) return
    const audit = { schema: 'qslc.qds44.public-demo.v1', classification: 'SYNTHETIC', exported_at: new Date().toISOString(), identity: { state: 'NOT_AUTHENTICATED', provider: 'Microsoft Entra ID', note: 'Public demo does not sign in.' }, event, calculator: { baseline_hours: safe(baseline, 100000), automated_hours: hoursSaved, labor_rate_usd: safe(rate, 100000), estimated_monthly_value_usd: estimatedValue }, qdi: { kind: 'ILLUSTRATIVE', score: demoQdi, evidence_coverage_pct: safe(evidence, 100), formula: '0.6 * evidence_coverage_pct + 40 * automated_hours / baseline_hours' }, navigator: { recommendation, source: 'deterministic demo rule; not an AI model response' }, mission, governance: { state: 'DRAFT_DEMO', provider_write: false, approval: 'NOT_GRANTED', external_evidence: false } }
    const blob = new Blob([JSON.stringify(audit, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${mission.id}.json`; anchor.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return <section id="qds44-flow" className="section-shell" aria-labelledby="qds44-title">
    <div className="section-heading"><span className="eyebrow">QDS-44 • GOVERNED DEMONSTRATION</span><h2 id="qds44-title">From an event to an auditable mission.</h2><p>Try the complete interaction using synthetic inputs. Connected data, Microsoft sign-in, AI inference, mission writes, and permanent evidence storage require a separately authenticated private backend.</p></div>
    <div className="mt-6 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100"><LockKeyhole className="mr-2 inline-block h-4 w-4"/> PUBLIC DEMO ONLY — no Microsoft session, customer data, live QDS-44 feed, bank data, or SSOT write is claimed.</div>
    <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{STEPS.map((step, i) => <div key={step} className="rounded-xl border border-cyan-300/20 bg-slate-950/70 p-3 text-xs"><span className="font-black text-cyan-300">{String(i + 1).padStart(2, '0')}</span><p className="mt-1 font-semibold text-slate-200">{step}</p></div>)}</div>
    <div className="mt-6 grid gap-4 lg:grid-cols-2">
      <article className="glass-card p-6"><h3 className="text-xl font-black">1. Identity + event intake</h3><p className="mt-2 text-sm text-slate-400">Microsoft Entra sign-in: <strong className="text-amber-200">not active in this public demo</strong>. Private role checks must happen server-side before connected events are enabled.</p><button type="button" onClick={makeEvent} className="primary-cta mt-5">Load QDS-44 sample event <ArrowRight className="ml-2 inline-block h-4 w-4"/></button><p className="mt-3 text-xs text-slate-400">Connected event: locked until authenticated provider, consent, and source provenance are verified.</p>{event && <p className="mt-3 break-all text-xs text-lime-300"><CheckCircle2 className="mr-1 inline-block h-4 w-4"/> Synthetic event loaded: {event.id}</p>}</article>
      <article className="glass-card p-6"><h3 className="text-xl font-black">2. Living Calculator v1</h3><p className="mt-2 text-sm text-slate-400">Change the training inputs to see deterministic results. No financial values are asserted as actual QSLC performance.</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{([['Baseline hours / month', baseline, setBaseline, 100000], ['Automated hours / month', automated, setAutomated, 100000], ['Labor rate ($/hour)', rate, setRate, 100000], ['Evidence coverage (%)', evidence, setEvidence, 100]] as const).map(([label, value, setter, max]) => <label key={label} className="text-xs text-slate-300">{label}<input className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-white" type="number" min="0" max={max} value={value} onChange={e => setter(safe(Number(e.target.value), max))}/></label>)}</div><p className="mt-4 text-2xl font-black text-lime-300">{dollars(estimatedValue)} <span className="text-sm font-normal text-slate-400">illustrative monthly labor value</span></p></article>
      <article className="glass-card p-6"><h3 className="text-xl font-black">3. QDI + Navigator</h3><p className="mt-3 text-4xl font-black text-cyan-300">{demoQdi}<span className="text-sm font-normal text-slate-400"> / 100 demo index</span></p><p className="mt-2 text-xs text-slate-400">Illustrative QDI = 60% evidence coverage + 40% automated-hours ratio. Not a validated quantum model or live AI response.</p><p className="mt-4 rounded-xl bg-cyan-400/10 p-4 text-sm text-cyan-100">{recommendation}</p></article>
      <article className="glass-card p-6"><h3 className="text-xl font-black">4. Mission + evidence</h3><p className="mt-2 text-sm text-slate-400">Creates a local training draft only. A real mission needs authenticated authorization, server-side validation, and an append-only audit record.</p><button type="button" disabled={!event} onClick={makeMission} className="primary-cta mt-5 disabled:cursor-not-allowed disabled:opacity-40">Create demo mission</button>{mission && <div className="mt-4"><p className="break-all text-sm text-lime-300"><ShieldCheck className="mr-2 inline-block h-4 w-4"/>{mission.id} • {mission.status}</p><button type="button" onClick={downloadAudit} className="secondary-cta mt-3"><Download className="mr-2 inline-block h-4 w-4"/> Download audit JSON</button></div>}</article>
    </div><p className="mt-5 text-xs leading-6 text-slate-400">Production acceptance gates: Entra authentication and role validation → provider-signed or explicitly labeled sample event → versioned calculator → governed QDI → AI recommendation with model/version provenance → authorized mission creation → immutable evidence/audit persistence. Until each gate passes, production state remains UNKNOWN or BLOCKED.</p>
  </section>
}
