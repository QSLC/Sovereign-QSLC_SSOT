import { useMemo, useState } from 'react'
import { Calculator, Gauge, ShieldCheck, Timer } from 'lucide-react'
import { calculateDemoMetrics } from '../demo/livingCalculator'

export function LivingCalculatorDemo() {
  const [workflows,setWorkflows] = useState(40)
  const [operators,setOperators] = useState(12)
  const [evidenceRate,setEvidenceRate] = useState(88)
  const metrics = useMemo(()=>calculateDemoMetrics({workflows,operators,evidenceRate}),[workflows,operators,evidenceRate])
  const cards = [
    ['Automated hours',metrics.automatedHours,Timer],
    ['Throughput index',metrics.throughput,Gauge],
    ['Evidence coverage',`${metrics.evidenceCoverage}%`,ShieldCheck],
    ['Control score',metrics.estimatedControlScore,Calculator],
  ] as const
  return <section id="calculator" className="section-shell"><div className="section-heading"><span className="eyebrow">SYNTHETIC LIVING CALCULATOR</span><h2>Change the inputs. Watch the operating model respond.</h2><p className="demo-warning">SYNTHETIC DEMO — NOT QSLC FINANCIAL DATA</p></div><div className="mt-8 grid gap-6 lg:grid-cols-[.8fr_1.2fr]"><div className="glass-card p-6 space-y-6">{[["Workflows",workflows,setWorkflows,1,250],["Operators",operators,setOperators,1,100],["Evidence rate",evidenceRate,setEvidenceRate,0,100]].map(([label,value,setter,min,max])=><label key={label as string} className="block"><span className="flex justify-between text-sm font-bold"><span>{label as string}</span><span className="text-lime-300">{value as number}</span></span><input className="mt-3 w-full accent-lime-300" type="range" min={min as number} max={max as number} value={value as number} onChange={e=>(setter as (value:number)=>void)(Number(e.target.value))}/></label>)}</div><div className="grid gap-4 sm:grid-cols-2">{cards.map(([label,value,Icon])=><article key={label} className="glass-card p-6"><Icon className="text-cyan-300"/><p className="mt-6 text-xs uppercase tracking-[.2em] text-slate-500">{label}</p><p className="mt-2 text-4xl font-black text-white">{value}</p><p className="mt-2 text-xs text-slate-500">Synthetic training output</p></article>)}</div></div></section>
}
