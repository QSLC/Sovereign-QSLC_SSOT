import { useState } from 'react'
import { ArrowUpRight, Compass, Database, LockKeyhole, Radio, Satellite, ShieldCheck, Sparkles } from 'lucide-react'

type Observatory = {
  id: string; name: string; agency: string; kind: string; band: string; reading: string;
  instruments: string; archive: string; source: string; color: string; x: number; y: number;
}

const observatories: Observatory[] = [
  { id: 'webb', name: 'James Webb Space Telescope', agency: 'NASA / ESA / CSA', kind: 'Space telescope', band: 'Near & mid infrared', reading: 'Infrared light from early galaxies, stars, exoplanet atmospheres and dust-obscured regions.', instruments: 'NIRCam · NIRSpec · MIRI · NIRISS', archive: 'https://mast.stsci.edu/portal/Mashup/Clients/Mast/Portal.html', source: 'MAST science archive', color: '#7dd3fc', x: 26, y: 27 },
  { id: 'hubble', name: 'Hubble Space Telescope', agency: 'NASA / ESA', kind: 'Space telescope', band: 'Ultraviolet · visible · near infrared', reading: 'Imaging and spectra of galaxies, nebulae, stellar populations and planetary atmospheres.', instruments: 'WFC3 · ACS · COS · STIS', archive: 'https://mast.stsci.edu/portal/Mashup/Clients/Mast/Portal.html', source: 'MAST science archive', color: '#c4b5fd', x: 66, y: 21 },
  { id: 'chandra', name: 'Chandra X-ray Observatory', agency: 'NASA / SAO', kind: 'Space telescope', band: 'X-ray', reading: 'High-energy X-ray photons from black holes, supernova remnants and hot gas.', instruments: 'ACIS · HRC · HETG · LETG', archive: 'https://cda.harvard.edu/chaser/', source: 'Chandra Data Archive', color: '#fda4af', x: 76, y: 60 },
  { id: 'alma', name: 'ALMA Observatory', agency: 'ESO / NSF / NINS', kind: 'Ground array', band: 'Millimeter · submillimeter', reading: 'Radio and submillimeter emission from cold gas, dust, star-forming regions and disks.', instruments: 'Interferometric antenna array · spectral line cubes', archive: 'https://almascience.eso.org/alma-data', source: 'ALMA Science Archive', color: '#bef264', x: 34, y: 72 },
  { id: 'vlt', name: 'Very Large Telescope', agency: 'European Southern Observatory', kind: 'Ground observatory', band: 'Optical · infrared', reading: 'Optical/infrared images and spectra of stars, galaxies, planets and transient sources.', instruments: 'MUSE · X-shooter · ESPRESSO · ERIS', archive: 'https://archive.eso.org/scienceportal/', source: 'ESO Science Archive', color: '#fcd34d', x: 13, y: 53 },
]

const stars = Array.from({ length: 105 }, (_, i) => ({
  x: (i * 73 + (i * i * 17) % 181) % 1000,
  y: (i * 131 + (i * i * 11) % 241) % 620,
  r: i % 13 === 0 ? 2 : i % 5 === 0 ? 1.35 : 0.7,
  o: 0.23 + (i % 7) * 0.095,
}))
const pipeline = [
  ['IDENTITY', 'Entra / Access', 'Verification pending'],
  ['OBSERVE', 'Science archives', 'Official source links'],
  ['INTERPRET', 'QDI / Navigator', 'Synthetic demo only'],
  ['AUTHORIZE', 'Mission + evidence', 'Backend not connected'],
]

export function EveObservatory() {
  const [selectedId, setSelectedId] = useState('webb')
  const [tab, setTab] = useState<'explore' | 'spectrum' | 'pipeline'>('explore')
  const [motion, setMotion] = useState(true)
  const selected = observatories.find(item => item.id === selectedId) ?? observatories[0]
  return <section id="observatory" className="relative py-14 sm:py-20" aria-labelledby="eve-observatory-title">
    <div className="relative isolate overflow-hidden rounded-[2rem] border border-cyan-300/30 bg-[#030617] shadow-[0_30px_130px_#020617,0_0_70px_#06b6d422]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-90" style={{ background: 'radial-gradient(ellipse at 25% 27%,#0e749077 0%,transparent 44%),radial-gradient(ellipse at 80% 20%,#7e22ce77 0%,transparent 46%),radial-gradient(ellipse at 62% 78%,#db277744 0%,transparent 39%),linear-gradient(130deg,#020617,#090a27 56%,#020617)' }} />
      <div className="relative border-b border-white/10 px-5 py-6 sm:px-9 sm:py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-300/10 px-3 py-1 text-[11px] font-black tracking-[.2em] text-cyan-200"><Sparkles size={13}/> EVE · ORIGINAL OBSERVATORY INTERFACE</span>
          <a className="inline-flex items-center gap-2 rounded-xl border border-fuchsia-300/40 bg-fuchsia-400/10 px-4 py-2 text-xs font-bold text-fuchsia-100 hover:bg-fuchsia-400/20" href="https://admin.qslc-hei.com/" rel="noopener noreferrer"><LockKeyhole size={15}/> Protected owner portal <ArrowUpRight size={14}/></a>
        </div>
        <h2 id="eve-observatory-title" className="mt-5 max-w-4xl bg-gradient-to-r from-white via-cyan-200 to-fuchsia-300 bg-clip-text text-4xl font-black leading-tight text-transparent sm:text-6xl">The Universe, under one command view.</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200 sm:text-base">Explore telescope capabilities, observation bands and verified scientific archive destinations. Select a beacon to inspect what its instruments measure. The cosmic artwork is original vector illustration; it is not a live sky map or telescope feed.</p>
        <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Observatory views">
          {([['explore','Observatory map'],['spectrum','Spectrum explorer'],['pipeline','EVE mission pipeline']] as const).map(([id,label])=><button key={id} type="button" role="tab" aria-selected={tab===id} onClick={()=>setTab(id)} className={'rounded-xl border px-4 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime-300 '+(tab===id?'border-cyan-300 bg-cyan-300/20 text-white':'border-white/20 bg-slate-950/50 text-slate-300 hover:border-cyan-300/60')}>{label}</button>)}
        </div>
      </div>
      {tab==='explore' && <div role="tabpanel" className="grid gap-0 xl:grid-cols-[1.45fr_1fr]">
        <div className="relative min-h-[390px] overflow-hidden border-b border-white/10 sm:min-h-[520px] xl:border-b-0 xl:border-r" style={{ background: 'radial-gradient(ellipse at 49% 42%,#312e8188 0%,#0e749055 25%,transparent 61%),radial-gradient(ellipse at 76% 65%,#a21caf66 0%,transparent 45%)' }}>
          <svg viewBox="0 0 1000 620" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><radialGradient id="eveNebula"><stop offset="0" stopColor="#a78bfa" stopOpacity=".52"/><stop offset=".52" stopColor="#22d3ee" stopOpacity=".14"/><stop offset="1" stopColor="#020617" stopOpacity="0"/></radialGradient><linearGradient id="eveOrbit"><stop stopColor="#67e8f9" stopOpacity="0"/><stop offset=".5" stopColor="#a5b4fc" stopOpacity=".45"/><stop offset="1" stopColor="#f0abfc" stopOpacity="0"/></linearGradient></defs>
            <ellipse cx="480" cy="305" rx="445" ry="245" fill="url(#eveNebula)" transform="rotate(-18 480 305)"/>
            {stars.map((s,i)=><circle key={i} cx={s.x} cy={s.y} r={s.r} fill={i%3===0?'#a5f3fc':'#fff'} opacity={s.o}/>)}
            {[135,210,290].map((r,i)=><ellipse key={r} cx="480" cy="320" rx={r*1.5} ry={r*.72} fill="none" stroke="url(#eveOrbit)" strokeWidth={i===1?1.8:1} strokeDasharray={i===1?'5 10':undefined} transform="rotate(-22 480 320)"/>) }
            <path d="M170 320 C290 120 570 120 825 380" stroke="#22d3ee" strokeOpacity=".25" strokeWidth="1.5" fill="none" strokeDasharray="6 12"/>
            <circle cx="480" cy="320" r="47" fill="#0e7490" opacity=".2"/><circle cx="480" cy="320" r="20" fill="#67e8f9" opacity=".55"/><circle cx="480" cy="320" r="8" fill="#fff"/>
          </svg>
          {observatories.map(item=><button key={item.id} type="button" aria-pressed={selectedId===item.id} aria-label={'Inspect '+item.name} onClick={()=>setSelectedId(item.id)} style={{left:`${item.x}%`,top:`${item.y}%`,borderColor:item.color,boxShadow:selectedId===item.id?`0 0 32px ${item.color}99`:`0 0 15px ${item.color}55`}} className={'absolute z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-slate-950/85 text-white transition hover:scale-125 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white '+(selectedId===item.id?'scale-125':'')}><Satellite size={20} style={{color:item.color}}/><span className="sr-only">{item.name}</span></button>)}
          <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-3"><span className="rounded-lg border border-cyan-300/20 bg-slate-950/80 px-3 py-2 text-[10px] font-black tracking-[.15em] text-cyan-200">SELECT A TELESCOPE BEACON</span><button type="button" onClick={()=>setMotion(v=>!v)} className="rounded-lg border border-white/20 bg-slate-950/80 px-3 py-2 text-xs text-slate-200">{motion?'Reduce visual motion':'Allow visual motion'}</button></div>
          {motion && <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10 motion-safe:animate-pulse"/>}
        </div>
        <div className="relative flex flex-col justify-between bg-slate-950/65 p-6 sm:p-9" aria-live="polite">
          <div><p className="text-xs font-black tracking-[.22em] text-lime-300">SELECTED OBSERVATORY · {selected.kind.toUpperCase()}</p><h3 className="mt-4 text-3xl font-black text-white">{selected.name}</h3><p className="mt-2 text-sm text-slate-400">{selected.agency}</p>
            <div className="mt-6 rounded-2xl border border-cyan-300/25 bg-cyan-300/5 p-5"><p className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-cyan-300"><Radio size={16}/> What it observes</p><p className="mt-3 text-xl font-bold text-white">{selected.band}</p><p className="mt-3 text-sm leading-7 text-slate-200">{selected.reading}</p></div>
            <p className="mt-6 text-xs font-black uppercase tracking-widest text-fuchsia-300">Instrument families</p><p className="mt-2 text-sm leading-6 text-slate-200">{selected.instruments}</p>
            <p className="mt-6 text-xs font-black uppercase tracking-widest text-lime-300">Observation data status</p><p className="mt-2 text-sm leading-6 text-slate-300">Official archive available externally. No observation ID, live sensor reading or timestamp has been fetched into QSLC. Open the archive to inspect source records.</p>
          </div>
          <a href={selected.archive} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-violet-300 px-5 py-4 font-black text-slate-950 hover:from-lime-300 hover:to-cyan-300"><Database size={18}/> Explore {selected.source} <ArrowUpRight size={17}/></a>
        </div>
      </div>}
      {tab==='spectrum' && <div role="tabpanel" className="p-6 sm:p-10"><p className="max-w-3xl text-sm leading-7 text-slate-300">Different instruments observe different parts of the electromagnetic spectrum. These are capability categories, not measured live values.</p><div className="mt-7 grid gap-4 md:grid-cols-2">{observatories.map(item=><button type="button" key={item.id} onClick={()=>{setSelectedId(item.id);setTab('explore')}} className="rounded-2xl border border-white/15 bg-slate-950/70 p-5 text-left transition hover:border-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"><div className="mb-4 h-2 rounded-full" style={{background:`linear-gradient(90deg,transparent,${item.color},transparent)`}}/><p className="text-lg font-black text-white">{item.name}</p><p className="mt-1 text-sm text-cyan-200">{item.band}</p><p className="mt-3 text-xs text-slate-400">Select to inspect instruments and official archive →</p></button>)}</div></div>}
      {tab==='pipeline' && <div role="tabpanel" className="p-6 sm:p-10"><p className="max-w-3xl text-sm leading-7 text-slate-300">The visual control plane does not bypass authentication, approve missions or claim telemetry. Each step becomes live only after a verified backend integration.</p><div className="mt-7 grid gap-4 md:grid-cols-4">{pipeline.map(([name,detail,status],i)=><article key={name} className="rounded-2xl border border-violet-300/25 bg-slate-950/75 p-5"><div className="flex items-center justify-between"><span className="text-xs font-black text-lime-300">0{i+1}</span><Compass size={18} className="text-cyan-300"/></div><h3 className="mt-5 text-xl font-black text-white">{name}</h3><p className="mt-2 text-sm text-slate-200">{detail}</p><p className="mt-4 text-xs text-amber-300">{status}</p></article>)}</div><a href="https://admin.qslc-hei.com/" className="mt-7 inline-flex items-center gap-2 rounded-xl border border-cyan-300/40 px-5 py-3 font-bold text-cyan-200"><ShieldCheck size={17}/> Go to protected owner sign-in <ArrowUpRight size={16}/></a></div>}
      <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-slate-950/70 px-6 py-4 text-xs text-slate-400 sm:px-9"><span>VISUALS: ORIGINAL SVG · TELEMETRY: NOT CONNECTED · OBSERVATIONS: OFFICIAL EXTERNAL ARCHIVES</span><span>PUBLIC VIEW · NO PRIVATE DATA</span></div>
    </div>
  </section>
}
