import { BriefcaseBusiness, CheckCircle2, FileText, ShieldCheck, Users } from 'lucide-react'

const roles = [
  { title: 'Administrative Operations Coordinator', status: 'ONBOARDING', lane: 'Admin • meetings • records • SSOT support', note: 'First-hire operating lane. Employee-specific details remain private.' },
  { title: 'CPA / Payroll / Compliance Support', status: 'PRIORITY', lane: 'Payroll • compliance • funding controls', note: 'Planned professional support role.' },
  { title: 'Senior Full-Stack / Technical Lead', status: 'PLANNED', lane: 'Production • integrations • app reliability', note: 'Activates as sales and operating cash support the position.' },
  { title: 'Data & Automation Engineer', status: 'PLANNED', lane: 'APIs • source-gated automation • SSOT', note: 'Planned after core production path is stable.' },
  { title: 'Business Development Lead', status: 'FUTURE', lane: 'Pilot sales • partnerships • pipeline', note: 'Activates when checkout and fulfillment are proven.' },
]

const forms = [
  ['USCIS Form I-9', 'Employment eligibility verification', 'https://www.uscis.gov/i-9'],
  ['IRS Form W-4', 'Federal withholding certificate', 'https://www.irs.gov/forms-pubs/about-form-w-4'],
  ['WA Paid Sick Leave', 'Washington employee rights and notice information', 'https://lni.wa.gov/workers-rights/leave/paid-sick-leave/'],
  ['WA New Hire Reporting', 'Washington employer reporting information', 'https://www.dshs.wa.gov/esa/division-child-support/new-hire-reporting'],
]

export function HiringCenter() {
  return <section id="hiring" className="section-shell">
    <div className="section-heading">
      <p className="eyebrow">QSLC HIRING CENTER</p>
      <h2>Jobs, onboarding, and paperwork — one governed path.</h2>
      <p>QSLC uses a source-gated hiring workflow. Public pages show openings, instructions, and official forms; identity documents, tax forms, banking details, payroll records, and employee evidence stay in secured provider or HR systems.</p>
    </div>

    <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
      <div className="glass-card p-6">
        <div className="flex items-center gap-3"><BriefcaseBusiness className="text-lime-300"/><h3 className="text-xl font-black">Job tracker</h3></div>
        <div className="mt-5 space-y-3">
          {roles.map((role) => <article key={role.title} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-black text-white">{role.title}</h4>
              <span className="rounded-full border border-cyan-300/25 bg-cyan-300/5 px-3 py-1 text-[10px] font-black tracking-wider text-cyan-200">{role.status}</span>
            </div>
            <p className="mt-2 text-sm text-slate-300">{role.lane}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{role.note}</p>
          </article>)}
        </div>
        <p className="mt-4 text-xs leading-5 text-slate-500">Statuses are planning/onboarding states, not a promise of employment. Compensation, classification, start date, and offer terms are confirmed privately during the formal hiring process.</p>
      </div>

      <div className="space-y-4">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3"><Users className="text-purple-300"/><h3 className="text-xl font-black">Apply / start onboarding</h3></div>
          <p className="mt-3 text-sm leading-6 text-slate-400">Use the public application packet for non-sensitive information. Never email Social Security numbers, identity documents, bank details, passwords, or authentication codes.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a className="primary-cta" href="/hiring.html">Open hiring packet</a>
            <a className="secondary-cta" href="mailto:sovereign@quantumsovereignlogisticsco.onmicrosoft.com?subject=QSLC%20Employment%20Application">Email QSLC HR</a>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3"><FileText className="text-cyan-300"/><h3 className="text-xl font-black">Official paperwork</h3></div>
          <div className="mt-4 space-y-3">
            {forms.map(([name,copy,url]) => <a key={name} href={url} target="_blank" rel="noreferrer" className="block rounded-xl border border-slate-800 p-4 transition hover:border-cyan-300/40">
              <div className="flex items-center gap-2 font-black text-white"><CheckCircle2 size={15} className="text-lime-300"/>{name}</div>
              <p className="mt-1 text-xs text-slate-500">{copy}</p>
            </a>)}
          </div>
        </div>
      </div>
    </div>

    <div className="mt-4 rounded-2xl border border-purple-400/20 bg-purple-400/5 p-5 text-xs leading-6 text-purple-100">
      <div className="flex items-center gap-2 font-black"><ShieldCheck size={15}/> PRIVATE-HR BOUNDARY</div>
      <p className="mt-2 text-purple-200/80">Completed I-9/W-4 documents, identity evidence, direct-deposit information, payroll data, and employee records are not public website content. They must be completed through the secure QSLC/Paychex/HireRight or restricted HR workflow.</p>
    </div>
  </section>
}
