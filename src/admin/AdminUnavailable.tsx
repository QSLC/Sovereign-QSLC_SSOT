import { LockKeyhole } from 'lucide-react'

export function AdminUnavailable() {
  return <main className="grid min-h-screen place-items-center bg-[#030611] p-6 text-slate-100"><section className="max-w-lg rounded-2xl border border-purple-400/30 bg-slate-950 p-8 text-center"><LockKeyhole className="mx-auto text-purple-300"/><h1 className="mt-5 text-2xl font-black">Protected admin surface unavailable</h1><p className="mt-3 text-sm leading-6 text-slate-400">Authentication and authorization are required. No private SSOT, evidence, integration, deployment, financial, payroll, or owner command content is rendered in this state.</p></section></main>
}
