import { useState } from 'react'

const sources = [
 {name:'ISS live Earth camera',url:'https://www.nasa.gov/live/',type:'Live stream portal',desc:'NASA-hosted live ISS video. Availability depends on station communications; this site does not operate the camera.'},
 {name:'NASA Eyes: ISS orbit',url:'https://eyes.nasa.gov/apps/earth/#/satellites/iss?rate=1',type:'Interactive visualization',desc:'NASA-hosted orbit visualization with its own source and time controls.'},
 {name:'NASA Earth imagery',url:'https://worldview.earthdata.nasa.gov/',type:'Satellite observations',desc:'NASA Worldview satellite layers; observation timestamps differ by product.'},
 {name:'USGS volcano activity',url:'https://www.usgs.gov/programs/VHP',type:'Scientific monitoring',desc:'USGS volcano monitoring and alerts; not QSLC-owned sensors.'},
 {name:'NOAA weather',url:'https://www.weather.gov/',type:'Forecasts and alerts',desc:'Official weather forecasts and alerts; not a QSLC forecast model.'},
 {name:'NASA mission updates',url:'https://www.nasa.gov/news/',type:'News source',desc:'Official space mission news; source publication times vary.'},
]
export function SpaceMissionWall(){
 const [motion,setMotion]=useState(true)
 return <section id="mission-wall" className="py-14">
  <div className="relative isolate overflow-hidden rounded-3xl border border-cyan-400/40 bg-[#030616] p-6 shadow-[0_0_90px_#7c3aed33] sm:p-10">
   <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70" style={{background:'radial-gradient(ellipse at 72% 30%, #7c3aed88 0%, #312e8166 24%, transparent 55%), radial-gradient(ellipse at 28% 70%, #0891b266, transparent 55%), repeating-radial-gradient(circle at 70% 42%, transparent 0 23px, #67e8f922 24px 25px, transparent 26px 50px)'}}/>
   <div className="relative">
    <p className="text-xs font-black uppercase tracking-[.25em] text-lime-300">EVE-HEI · Spatial mission wall</p>
    <h2 className="mt-3 text-3xl font-black text-white">Real sources. Immersive interface.</h2>
    <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-200">These links open real external science and weather resources. The animated background is original CSS artwork—not live telemetry, an actual camera feed, or proof of QSLC space-sensing capabilities.</p>
    <div className="mt-6 flex flex-wrap items-center gap-3">
     <button type="button" onClick={()=>setMotion(v=>!v)} aria-pressed={motion} className="rounded-xl border border-lime-300 px-4 py-2 font-bold text-lime-200">{motion?'Pause visual motion':'Resume visual motion'}</button>
     <a href="https://github.com/QSLC/Sovereign-QSLC_SSOT" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-cyan-300 px-4 py-2 font-bold text-cyan-200">View source repository ↗</a>
    </div>
    <div className="mt-7 grid gap-4 md:grid-cols-3">
    {sources.map((source,i)=><a key={source.name} href={source.url} target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-2xl border border-cyan-300/30 bg-slate-950/80 p-5 transition hover:border-lime-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime-300">
      <div aria-hidden="true" className={'relative mb-4 h-36 overflow-hidden rounded-xl border border-white/10 '+(motion?'motion-safe:animate-pulse':'')} style={{animationDuration:(3+i)+'s',backgroundImage:`radial-gradient(circle at ${25+i*9}% ${30+i*5}%, #bef264aa 0%, transparent 10%),radial-gradient(circle at 65% 48%, #06b6d4bb 0%, #7c3aed88 22%, #020617 65%)`}}/>
      <span className="text-[11px] font-black uppercase tracking-widest text-lime-300">{source.type}</span>
      <h3 className="mt-2 text-xl font-black text-white">{source.name} ↗</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">{source.desc}</p>
      <p className="mt-3 text-xs text-cyan-300">Source: {new URL(source.url).hostname}</p>
    </a>)}
    </div>
    <p className="mt-5 text-xs text-slate-400">External data is not mirrored, modified, or represented as QSLC-owned. Visit each provider for live status and timestamps. Motion honors the device's reduced-motion setting.</p>
   </div>
  </div>
 </section>
}
