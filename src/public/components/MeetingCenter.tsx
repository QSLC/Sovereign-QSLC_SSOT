import { CalendarDays, HelpCircle, ShieldCheck } from 'lucide-react'

const workMailbox = 'sovereign@quantumsovereignlogisticsco.onmicrosoft.com'

export function MeetingCenter() {
  const meetingHref = `mailto:${workMailbox}?subject=${encodeURIComponent('QSLC EVE one-on-one / demo request')}&body=${encodeURIComponent('Name:\nCompany:\nRequested date/time and time zone:\nProduct/tier:\nObjective:\n')}`
  const questionHref = `mailto:${workMailbox}?subject=${encodeURIComponent('QSLC EVE product question')}&body=${encodeURIComponent('Name:\nCompany:\nProduct/tier (if known):\nQuestion:\n')}`
  return <section id="meeting" className="section-shell">
    <div className="section-heading">
      <span className="eyebrow">MEETINGS & QUESTIONS</span>
      <h2>Talk to QSLC without exposing private systems.</h2>
      <p>Meeting requests and product questions go to the monitored QSLC work mailbox. QSLC reviews content and recipient details before a calendar invitation is created.</p>
    </div>
    <div className="mt-8 grid gap-4 md:grid-cols-2">
      <article className="glass-card p-6">
        <CalendarDays className="text-lime-300"/>
        <h3 className="mt-4 text-xl font-black">Request a one-on-one</h3>
        <p className="mt-3 text-sm leading-6 text-slate-400">Send your company, preferred date/time and time zone, tier, and objective. No attendee is invited automatically from the public page.</p>
        <a className="primary-cta mt-5 inline-flex" href={meetingHref}>Request meeting</a>
      </article>
      <article className="glass-card p-6">
        <HelpCircle className="text-cyan-300"/>
        <h3 className="mt-4 text-xl font-black">Ask a product question</h3>
        <p className="mt-3 text-sm leading-6 text-slate-400">Use for demos, integrations, deployment, licensing, training, product tiers, and the Living Calculator.</p>
        <a className="secondary-cta mt-5 inline-flex" href={questionHref}>Email a question</a>
      </article>
    </div>
    <div className="mt-4 flex items-start gap-3 rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-5 text-xs leading-6 text-cyan-100">
      <ShieldCheck size={16} className="mt-1 shrink-0"/>
      <p>Do not send Social Security numbers, bank details, passwords, API keys, recovery keys, authentication codes, completed I-9 identity documents, or other restricted evidence through this public contact path.</p>
    </div>
  </section>
}
