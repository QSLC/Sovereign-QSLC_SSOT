import { useMemo, useState } from 'react'
import { Calculator, Gauge, ShieldCheck, Timer } from 'lucide-react'
import { calculateDemoMetrics } from '../demo/livingCalculator'

export function LivingCalculatorDemo() {
  const [workflows, setWorkflows] = useState(40)
  const [operators, setOperators] = useState(12)
  const [evidenceRate, setEvidenceRate] = useState(88)

  const metrics = useMemo(
    () => calculateDemoMetrics({ workflows, operators, evidenceRate }),
    [workflows, operators, evidenceRate],
  )

  const cards = [
    ['Automated hours', metrics.automatedHours, Timer],
    ['Throughput index', metrics.throughput, Gauge],
    ['Evidence coverage', `${metrics.evidenceCoverage}%`, ShieldCheck],
    ['Control score', metrics.estimatedControlScore, Calculator],
  ] as const

  return (
    <section id="calculator" className="section-shell">
      <div className="section-heading">
        <span className="eyebrow">SYNTHETIC LIVING CALCULATOR</span>
        <h2>Living Calculator: see how operating decisions scale.</h2>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, Icon]) => (
          <article key={label} className="glass-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[.2em] text-slate-400">{label}</p>
              <Icon className="text-cyan-300" />
            </div>
            <p className="mt-4 text-3xl font-black text-white">{value}</p>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <label className="block text-sm font-bold text-slate-200">
          Workflows
          <input
            type="range"
            min="0"
            max="100"
            value={workflows}
            onChange={(e) => setWorkflows(Number(e.target.value))}
            className="mt-2 block w-full"
          />
          <span className="mt-2 block text-xs text-slate-400">{workflows}</span>
        </label>

        <label className="block text-sm font-bold text-slate-200">
          Operators
          <input
            type="range"
            min="0"
            max="50"
            value={operators}
            onChange={(e) => setOperators(Number(e.target.value))}
            className="mt-2 block w-full"
          />
          <span className="mt-2 block text-xs text-slate-400">{operators}</span>
        </label>

        <label className="block text-sm font-bold text-slate-200">
          Evidence rate
          <input
            type="range"
            min="0"
            max="100"
            value={evidenceRate}
            onChange={(e) => setEvidenceRate(Number(e.target.value))}
            className="mt-2 block w-full"
          />
          <span className="mt-2 block text-xs text-slate-400">{evidenceRate}%</span>
        </label>
      </div>
    </section>
  )
}
