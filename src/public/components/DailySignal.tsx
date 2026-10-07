import { CalendarDays, Megaphone, Sparkles } from 'lucide-react'

const daily = [
  ['Founder Log','One founder. One governed source of truth. A system should be able to explain what changed, why it changed, and what evidence supports it.','#books'],
  ['EVE-1010','Natural language is the front door; evidence and permissions are the control plane. Explore the public-safe architecture.','#learning'],
  ['Living Calculator','The useful question is not “how many formulas?” but “which formula, which version, which source, and what decision does it control?”','#calculator'],
  ['Evidence First','No Evidence = No Approval. See how QSLC turns that rule into a visible operating state.','#evidence'],
  ['Sovereign Operations','From logistics to publishing: separate public demos, private records, and owner-only actions before you scale.','#pricing'],
  ['PSI Verification','Verify the contract, understand the platform mechanics, and separate an experimental digital asset from guaranteed financial outcomes.','#psi'],
  ['Digital Vault','Seven EVE-1010 volumes + Live Ledger companion resources. Start with the founder story, then follow the system deeper.','#books'],
] as const

function holidayStamp(d: Date) {
  const m=d.getMonth()+1, day=d.getDate()
  if(m===11 && day===6) return 'EVE-1010 FOUNDER DAY'
  if(m===10 && day===31) return 'EVE-1010 HALLOWEEN SIGNAL'
  if(m===11 && day===11) return 'EVE-1010 VETERANS DAY'
  if(m===12 && day===25) return 'EVE-1010 CHRISTMAS EDITION'
  if((m===12 && day===31)||(m===1 && day===1)) return 'EVE-1010 NEW YEAR SIGNAL'
  return null
}

export function DailySignal() {
  const now=new Date()
  const start=new Date(now.getFullYear(),0,0)
  const day=Math.floor((now.getTime()-start.getTime())/86400000)
  const [title,copy,href]=daily[day%daily.length]
  const stamp=holidayStamp(now)
  return <section id="daily-signal" className="section-shell">
    <div className="glass-card p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="eyebrow flex items-center gap-2"><Megaphone size={14}/> DAILY EVE SIGNAL</span>
        <span className="flex items-center gap-2 text-xs font-black text-purple-200"><CalendarDays size={14}/>{now.toLocaleDateString()}</span>
      </div>
      {stamp && <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-lime-300/30 bg-lime-300/10 px-4 py-2 text-xs font-black tracking-widest text-lime-300"><Sparkles size={14}/>{stamp}</div>}
      <h2 className="mt-5 text-3xl font-black">{title}</h2>
      <p className="mt-3 max-w-4xl text-slate-300">{copy}</p>
      <a className="secondary-cta mt-6 inline-flex" href={href}>Explore today’s signal →</a>
    </div>
  </section>
}
