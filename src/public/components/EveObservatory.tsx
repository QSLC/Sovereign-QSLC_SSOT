import { useMemo, useState } from 'react'
import { ArrowUpRight, Eye, Radio, ShieldCheck, Telescope } from 'lucide-react'

type Observatory = {
  id: string
  name: string
  agency: string
  band: string
  observes: string
  instrument: string
  source: string
  x: number
  y: number
  color: string
}

const OBSERVATORIES: Observatory[] = [
  { id: 'webb', name: 'James Webb', agency: 'NASA / ESA / CSA', band: 'Near + mid infrared', observes: 'Early galaxies, stellar nurseries and exoplanet atmospheres', instrument: 'NIRCam · NIRSpec · MIRI · NIRISS', source: 'https://science.nasa.gov/mission/webb/', x: 24, y: 25, color: '#67e8f9' },
  { id: 'hubble', name: 'Hubble', agency: 'NASA / ESA', band: 'Ultraviolet · visible · near infrared', observes: 'Galaxies, nebulae and planetary atmospheres', instrument: 'WFC3 · ACS · COS · STIS', source: 'https://science.nasa.gov/mission/hubble/', x: 65, y: 21, color: '#c4b5fd' },
  { id: 'chandra', name: 'Chandra', agency: 'NASA', band: 'X-ray', observes: 'Black-hole environments, supernova remnants and hot gas', instrument: 'ACIS · HRC · transmission gratings', source: 'https://chandra.harvard.edu/', x: 82, y: 42, color: '#fb7185' },
  { id: 'tess', name: 'TESS', agency: 'NASA', band: 'Optical brightness / transit photometry', observes: 'Brightness dips that may indicate transiting exoplanets', instrument: 'Four wide-field cameras', source: 'https://science.nasa.gov/mission/tess/', x: 18, y: 62, color: '#bef264' },
  { id: 'alma', name: 'ALMA', agency: 'International partnership', band: 'Millimeter · submillimeter radio', observes: 'Cold gas, dust and planet-forming disks', instrument: 'Interferometric radio antenna array', source: 'https://www.almaobservatory.org/', x: 46, y: 74, color: '#fbbf24' },
  { id: 'euclid', name: 'Euclid', agency: 'ESA', band: 'Visible · near infrared', observes: 'Galaxy shapes, cosmic structure and dark-energy surveys', instrument: 'VIS · NISP', source: 'https://www.esa.int/Science_Exploration/Space_Science/Euclid', x: 77, y: 75, color: '#5eead4' },
]

const stars = Array.from({ length: 155 }, (_, i) => {
  const a = (i * 73.27 + 19.1) % 100
  const b = (i * 47.71 + 8.3) % 100
  return { x: a, y: b, r: i % 11 === 0 ? 1.4 : i % 5 === 0 ? 0.85 : 0.4, opacity: i % 7 === 0 ? 0.95 : 0.38 + (i % 4) * 0.11 }
})

export function EveObservatory() {
  const [selectedId, setSelectedId] = useState('webb')
  const [showConnections, setShowConnections] = useState(true)
  const selected = useMemo(() => OBSERVATORIES.find(item => item.id === selectedId) ?? OBSERVATORIES[0], [selectedId])

  return <section id="observatory" className="section-shell" aria-labelledby="observatory-heading">
    <div className="section-heading">
      <span className="eyebrow">EVE UNIVERSE / OBSERVATORY</span>
      <h2 id="observatory-heading">Explore the universe. Inspect the signal.</h2>
      <p>An original, interactive cosmic control room. Select a telescope to explore its observing band, instruments and official mission archive. This visualization is illustrative: live telescope telemetry is not connected.</p>
    </div>
    <div className="mt-7 overflow-hidden rounded-[2rem] border border-cyan-300/30 bg-[#020616] shadow-[0_0_95px_#155e7555]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-950/75 px-5 py-4">
        <div className="flex items-center gap-3"><Telescope className="text-cyan-300" size={23}/><div><p className="text-sm font-black tracking-[.18em] text-white">EVE / DEEP FIELD</p><p className="text-[11px] text-slate-400">Six selectable observatories · original vector sky</p></div></div>
        <div className="flex items-center gap-3"><span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[10px] font-bold tracking-widest text-amber-200">LIVE FEED NOT CONNECTED</span><button type="button" onClick={() => setShowConnections(value => !value)} aria-pressed={showConnections} className="rounded-lg border border-cyan-300/30 px-3 py-2 text-xs text-cyan-100 hover:bg-cyan-300/10">{showConnections ? 'Hide' : 'Show'} paths</button></div>
      </div>
      <div className="grid lg:grid-cols-[minmax(0,1.65fr)_minmax(300px,1fr)]">
        <div className="relative min-h-[390px] overflow-hidden bg-[radial-gradient(ellipse_at_35%_45%,#1d4ed84a,transparent_42%),radial-gradient(ellipse_at_72%_32%,#9333ea44,transparent_40%),radial-gradient(ellipse_at_50%_100%,#0e749066,transparent_50%),linear-gradient(135deg,#030617,#08051b_65%,#02040c)] sm:min-h-[530px]">
          <svg viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
            <defs><radialGradient id="eve-planet"><stop stopColor="#99f6e4"/><stop offset=".3" stopColor="#2563eb"/><stop offset=".7" stopColor="#312e81"/><stop offset="1" stopColor="#050816"/></radialGradient><radialGradient id="eve-halo"><stop stopColor="#22d3ee" stopOpacity=".26"/><stop offset="1" stopColor="#22d3ee" stopOpacity="0"/></radialGradient></defs>
            {stars.map((star, index) => <circle key={index} cx={star.x * 10} cy={star.y * 7} r={star.r} fill="#e0f2fe" opacity={star.opacity}/>)}
            <ellipse cx="505" cy="365" rx="310" ry="265" fill="url(#eve-halo)"/>
            <circle cx="505" cy="365" r="154" fill="url(#eve-planet)" opacity=".95"/>
            <circle cx="505" cy="365" r="184" fill="none" stroke="#67e8f9" strokeOpacity=".27" strokeDasharray="4 12"/>
            <ellipse cx="505" cy="365" rx="330" ry="112" transform="rotate(-26 505 365)" fill="none" stroke="#a5f3fc" strokeOpacity=".3" strokeWidth="2"/>
            <ellipse cx="505" cy="365" rx="370" ry="165" transform="rotate(24 505 365)" fill="none" stroke="#c084fc" strokeOpacity=".25" strokeWidth="2"/>
            {showConnections && OBSERVATORIES.map(telescope => <line key={telescope.id} x1="505" y1="365" x2={telescope.x * 10} y2={telescope.y * 7} stroke={telescope.color} strokeWidth="1.5" strokeOpacity={selected.id === telescope.id ? '.8' : '.2'} strokeDasharray="7 10"/>)}
            <text x="505" y="360" textAnchor="middle" fontSize="31" fontWeight="800" fill="#e0f2fe" letterSpacing="6">EVE</text><text x="505" y="390" textAnchor="middle" fontSize="13" fill="#a5f3fc" letterSpacing="3">OBSERVATORY</text>
          </svg>
          {OBSERVATORIES.map(telescope => <button type="button" key={telescope.id} onClick={() => setSelectedId(telescope.id)} aria-pressed={selectedId === telescope.id} className={`absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-xl border px-2 py-2 text-[10px] font-bold shadow-[0_0_25px_#0009] backdrop-blur-md transition hover:scale-105 sm:px-3 sm:text-xs ${selectedId === telescope.id ? 'border-cyan-200 bg-slate-800/95 text-white ring-2 ring-cyan-300/40' : 'border-white/20 bg-slate-950/75 text-slate-200'}`} style={{ left: `${telescope.x}%`, top: `${telescope.y}%` }}><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: telescope.color, boxShadow: `0 0 16px ${telescope.color}` }}/>{telescope.name}</button>)}
          <div className="absolute bottom-4 left-4 rounded-lg border border-cyan-200/20 bg-slate-950/70 px-3 py-2 text-[10px] uppercase tracking-widest text-cyan-100">Illustrative map · not sky coordinates</div>
        </div>
        <aside className="flex flex-col gap-5 border-t border-cyan-300/15 bg-slate-950/80 p-6 lg:border-l lg:border-t-0" aria-live="polite">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-lime-300"><Radio size={15}/> Observatory selected</div>
          <div><h3 className="text-3xl font-black text-white">{selected.name}</h3><p className="mt-1 text-sm text-cyan-200">{selected.agency}</p></div>
          <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-4"><p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Observing band</p><p className="mt-2 text-lg font-bold text-white">{selected.band}</p></div>
          <div><p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">What it measures / studies</p><p className="mt-2 text-sm leading-6 text-slate-200">{selected.observes}</p></div>
          <div><p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Instruments / method</p><p className="mt-2 text-sm leading-6 text-slate-200">{selected.instrument}</p></div>
          <a href={selected.source} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950 hover:bg-cyan-200">Open official mission source <ArrowUpRight size={17}/></a>
          <div className="flex gap-2 rounded-xl border border-amber-300/20 bg-amber-300/5 p-3 text-xs leading-5 text-amber-100"><Eye size={16} className="mt-0.5 shrink-0"/><span>No live sensor reading, observation timestamp or API data is claimed. Open the mission source for published observations.</span></div>
        </aside>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-slate-950 px-5 py-4 text-xs text-slate-400"><span className="flex items-center gap-2"><ShieldCheck size={15} className="text-lime-300"/> Public science explorer · private QSLC evidence excluded</span><a className="text-cyan-200 hover:underline" href="https://admin.qslc-hei.com/" rel="noopener noreferrer">Protected owner portal ↗</a></div>
    </div>
  </section>
}
