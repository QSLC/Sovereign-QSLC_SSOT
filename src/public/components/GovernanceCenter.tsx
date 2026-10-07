import { BadgeCheck, BookOpenCheck, Building2, Coins, Fingerprint, Scale, ShieldCheck } from 'lucide-react'

const rules = [
  [Scale,'Evidence before claims','Public claims must be truthful, supportable, and traceable. Internal QSLC status never substitutes for an external filing, approval, patent, publication, payout, or provider verification.'],
  [Fingerprint,'IP provenance','QSLC maintains a separate provenance record for human conception, corporate rights, formula lineage, and AI-assisted tooling. EVE-1010 and other AI systems are tools/project identities, not natural-person patent inventors.'],
  [Coins,'PSI separation','PSI is presented separately from QSLC books, software subscriptions, corporate equity, dividends, revenue rights, profit-sharing, lending, and guaranteed returns.'],
  [BookOpenCheck,'Publishing controls','KDP disclosures, IP labels, formula provenance, and patent/trademark language must match verified records and current platform requirements.'],
  [ShieldCheck,'Privacy boundary','Banking, payroll, credentials, private SSOT, owner evidence, private device telemetry, and confidential implementation details remain outside the public site.'],
  [Building2,'Corporate governance','QSLC may adopt internal operating rules, product standards, approval gates, records, and controls, but those internal rules do not override law, contracts, platform terms, or regulator requirements.'],
  [BadgeCheck,'Automation boundary','Automation may execute low-risk pre-approved actions where provider permissions allow it, but must stop for consent, signatures, identity verification, conflicting evidence, or unsupported public claims.'],
] as const

export function GovernanceCenter() {
  return <section id="governance" className="section-shell">
    <div className="section-heading">
      <span className="eyebrow">GOVERNANCE CENTER</span>
      <h2>Evidence first. Public claims second.</h2>
      <p>QSLC EVE uses a documented governance baseline so product, publishing, digital-asset, privacy, and automation claims are separated from unverified assumptions.</p>
    </div>
    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {rules.map(([Icon,title,copy]) => <article key={title} className="glass-card p-6">
        <Icon className="text-cyan-300"/>
        <h3 className="mt-4 text-xl font-black">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-400">{copy}</p>
      </article>)}
    </div>
    <div className="mt-6 rounded-2xl border border-purple-400/20 bg-purple-400/5 p-5 text-sm leading-6 text-slate-300">
      Internal governance documents are operating controls, not government approvals or legal opinions. Where law or platform rules require external filing, consent, identity verification, licensed advice, or provider approval, that external step remains controlling.
      <div className="mt-3"><a className="font-black text-cyan-300" href="/ip-provenance.html">Read IP Provenance & AI Assistance</a> · <a className="font-black text-cyan-300" href="mailto:eve@qslc-hei.com?subject=EVE-1010%20Provenance%20Inquiry">Contact EVE provenance desk</a></div>
    </div>
  </section>
}
