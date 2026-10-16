import { BookOpen, ExternalLink, Download, Check, BarChart3 } from 'lucide-react'
import { useState } from 'react'
import { sovereignSeries } from '../sovereignSeries'

type Review = { id: string; editorial: boolean; metadata: boolean; upload: boolean }
const freshReview = (): Review[] => sovereignSeries.map(b => ({ id: b.id, editorial: false, metadata: false, upload: false }))
function loadReview(): Review[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem('qslc-six-book-review-v2') ?? 'null')
    if (Array.isArray(value) && value.length === 6 && value.every((v, i) => v?.id === sovereignSeries[i].id && ['editorial','metadata','upload'].every(k => typeof v[k] === 'boolean'))) return value
  } catch { /* The public catalog remains usable without browser storage. */ }
  return freshReview()
}

export function BooksStore() {
  const [review, setReview] = useState<Review[]>(loadReview)
  const [notice, setNotice] = useState('')
  const totalWords = sovereignSeries.reduce((sum, b) => sum + b.words, 0)
  function toggle(id: string, key: 'editorial' | 'metadata' | 'upload') {
    const next = review.map(r => r.id === id ? { ...r, [key]: !r[key] } : r)
    setReview(next)
    try { localStorage.setItem('qslc-six-book-review-v2', JSON.stringify(next)); setNotice('Personal checklist saved in this browser.') }
    catch { setNotice('Browser storage unavailable. Export a copy to retain your checklist.') }
  }
  function exportReview() {
    const blob = new Blob([JSON.stringify({ schema: 'qslc.kdp-review.v2', exported_at: new Date().toISOString(), public_manifest: '/publishing-manifest.json', personal_checklist_only: true, review }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'qslc-kdp-bookshelf-review.json'; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return <section id="books" className="section-shell">
    <div className="section-heading">
      <span className="eyebrow">THE SOVEREIGN SERIES · REVISED SIX-VOLUME EDITION</span>
      <h2>One civilization. Six stages of evolution.</h2>
      <p>Origins become intelligence. Intelligence needs truth. Truth supports value, disciplined execution, and the next enterprise. These concise manuscript drafts replace the earlier book catalog.</p>
    </div>
    <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4">
      {[[6,'Revised volumes'],[110,'Distinct chapters'],[totalWords.toLocaleString(),'Manuscript words'],[135,'PDF pages']].map(([value,label]) => <div key={label} className="glass-card p-5"><strong className="text-3xl text-lime-300">{value}</strong><p className="mt-2 text-sm text-slate-400">{label}</p></div>)}
    </div>
    <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {sovereignSeries.map(b => <article key={b.id} className="glass-card flex flex-col overflow-hidden">
        <a href={b.preview} className="block bg-purple-950/20 p-5"><img src={b.cover} alt={`${b.title} — front cover by Antwan White`} width={640} height={960} loading="lazy" className="mx-auto h-80 w-auto rounded-lg object-contain shadow-xl" /></a>
        <div className="flex flex-1 flex-col p-6"><div className="flex items-center justify-between gap-3"><BookOpen className="text-cyan-300"/><span className="text-xs font-black tracking-widest text-lime-300">{b.number} / {b.theme}</span></div>
        <h3 className="mt-4 text-2xl font-black">{b.title}</h3><p className="mt-2 text-purple-200">{b.subtitle}</p><p className="mt-4 text-sm leading-6 text-slate-400">{b.description}</p>
        <p className="my-5 text-xs text-slate-300">{b.chapters} chapters · {b.words.toLocaleString()} words · {b.pdf_pages} PDF pages</p>
        <a className="primary-cta mt-auto" href={b.preview}>Explore volume & sample <ExternalLink size={15}/></a><p className="mt-3 text-xs text-slate-400">Concise draft · Amazon publication unverified</p></div>
      </article>)}
    </div>
    <div className="mt-8 grid gap-5 lg:grid-cols-2">
      <article className="glass-card p-6"><BarChart3 className="text-cyan-300"/><h3 className="mt-4 text-xl font-black">How the series is built</h3><p className="mt-2 text-sm text-slate-400">Measured word counts from the current manuscript files. Bar lengths compare volume size, not quality or sales.</p>
        <div className="mt-6 space-y-5">{sovereignSeries.map(b => <div key={b.id}><div className="mb-2 flex justify-between gap-3 text-sm"><span>{b.number} · {b.theme}</span><span>{b.words.toLocaleString()} words</span></div><div className="h-3 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-300" style={{width:`${100*b.words/8000}%`}} /></div></div>)}</div>
      </article>
      <article className="glass-card p-6"><h3 className="text-xl font-black">The civilization arc</h3><ol className="mt-5 space-y-4">{sovereignSeries.map(b => <li key={b.id} className="flex gap-4"><span className="text-lg font-black text-lime-300">{b.number}</span><div><strong>{b.theme}</strong><p className="mt-1 text-sm leading-6 text-slate-400">{b.description}</p></div></li>)}</ol></article>
    </div>
    <article id="kdp-bookshelf" className="glass-card mt-8 scroll-mt-24 p-6 md:p-8">
      <span className="eyebrow">KDP BOOKSHELF TRACKER</span><h3 className="mt-3 text-2xl font-black">See what is created, reviewed, and published.</h3>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">All six covers and manuscript formats are created. Editorial approval, KDP submission, ASINs, and live Amazon listings remain unverified. This tracker does not connect to or change your Amazon KDP account.</p>
      <div className="mt-5 flex flex-wrap gap-3"><a href="https://kdp.amazon.com/bookshelf" target="_blank" rel="noreferrer" className="secondary-cta">Open Amazon KDP Bookshelf <ExternalLink size={15}/></a><a href="/publishing-manifest.json" className="secondary-cta">View current publishing data</a><button type="button" className="secondary-cta" onClick={exportReview}>Export personal checklist <Download size={15}/></button></div>
      <div className="mt-7 overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><caption className="mb-4 text-left text-xs text-slate-400">Public edition status comes from the release catalog. Checkboxes below are personal review notes saved only in this browser.</caption><thead><tr className="border-b border-slate-700 text-xs text-slate-400"><th className="p-3">Volume</th><th className="p-3">Files / cover</th><th className="p-3">Amazon status</th><th className="p-3">Personal editorial check</th><th className="p-3">Personal metadata check</th><th className="p-3">Personal upload check</th></tr></thead><tbody>{sovereignSeries.map(b => {const row=review.find(r=>r.id===b.id);return <tr key={b.id} className="border-b border-slate-800"><th className="p-3 font-medium">{b.number} · {b.title}</th><td className="p-3 text-lime-300"><Check className="inline" size={15}/> Created</td><td className="p-3 text-amber-200">Not verified live<br/><span className="text-xs text-slate-400">No verified ASIN</span></td>{(['editorial','metadata','upload'] as const).map(k=><td key={k} className="p-3"><input type="checkbox" aria-label={`${b.title} personal ${k} check`} checked={row?.[k]??false} onChange={()=>toggle(b.id,k)} className="h-5 w-5 accent-lime-300"/></td>)}</tr>})}</tbody></table></div>
      <p className="mt-4 text-sm text-lime-300" role="status">{notice}</p><p className="mt-4 text-xs leading-6 text-slate-400">Earlier book and bundle purchase links are removed from this revised bookshelf. New purchase links require matching product details and fulfillment verification. A checked personal box does not verify a retailer submission or sale.</p>
    </article>
  </section>
}
