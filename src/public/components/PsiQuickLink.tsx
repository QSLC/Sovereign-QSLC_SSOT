import { ExternalLink, QrCode, ShieldAlert } from 'lucide-react'

const PSI_CONTRACT = '7Avu2LscLpCNNDR8szDowyck3MCBecpCf1wHyjU3pump'
const PUMP_URL = `https://pump.fun/coin/${PSI_CONTRACT}`
const SOLSCAN_URL = `https://solscan.io/token/${PSI_CONTRACT}`

export function PsiQuickLink() {
  return <section id="psi" className="section-shell">
    <div className="section-heading">
      <span className="eyebrow">PSI QUICK LINK</span>
      <h2>Verify the token before you interact.</h2>
      <p>Use the contract address, Pump page, and Solana explorer together. QSLC does not promise price appreciation, bonding-curve graduation, liquidity, yield, revenue rights, or profit.</p>
    </div>
    <div className="mt-8 grid gap-5 lg:grid-cols-[.72fr_1.28fr]">
      <article className="glass-card grid place-items-center p-6 text-center">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAcIAAAHCAQAAAABUY/ToAAADoElEQVR4nO2cXYrjMBCEq9aGPCqQA+Qo8s2GOdLewD5KDrAgPQZkeh8kWbZ3ll2GyeZnqx9CEvvDFjTlUrdkGj4X07dPgoBIkSJFihQpUuTjkSzR5z85RBLAnP8tp8Z61vAl1xT5YqQ3M7MAcIg9MB07yx8AUJOrMzMz25L3uFuRD0nGRV8wE3BX8u3Sw0aXYGbXLEZNqp51nCL/AZnVJ/YAXAIHAJjYl2+3uabIlyKL8ATkzKnZZL+WkR7hbkU+EunMbAQAfyHJcwLgUjZK8KGcZWbp664p8qXIiSR5BDigM/jLweAvRYeyz95P055ynCJvQGaLvH5SuQRDnInpCBpiO7B9nj3XOEXejkSerpe5fZnM21gfYzZWK2Qjuvy4yzP88bnGKfJ2ZMkIa/nibCkDddtvCfBBOSRyHyUj0Bl86HIiZR2CS1l98ok5fQKqQD3XOEXejqw6FBalaT8DAB+6Mi/zAchSpRwSuY5Sdp4GEP77qTQ34K4EnIGlbJ16Q+zSmnyucYq8Hbn4oYRaJOpqpShb7G7zaKtuSTokskbWIfqxMyASBhdAADBEwBBP+URD7EG4uYcf73W3Ih+RXPmhUpO2tdyUU0JtgoyAPLXIbRQdAkBDPCUDOqMPc2+IpwSguCACB6MPp2qKnmucIm9HLjoEwG9MUZmhWW3BojZj5YdEbmNVRRyXUmJu1LekaR+mub3I35AugYO75oVoNkYyN17Lso/1ssYvu6bI1yDXOmS1Tp0r1s1Tjyj9snZAOiRyS9qYdSiBb5e6umM6zsxrrN8CqlvCrLUfIndR261p+Zmq8LjSh21+qK1Lkw6JXKLZ5JIgoSVSaZXVzhlQfLZySOQ6Wt9+3ZSvEgQ0F1SPSodEbmNdjt737bu1p26lIemQyA9Ib2YkD8vsfSZ5nLlaPzSdEzhE7XMVuY/ih8J6W9DGCpW6Y80mze1F7qJuW3UGIB6MZel9XpOfg+VjJuACqL69yE3YNmoZCMU/t2++HpUOifyAbO/9WG3feCdZ2mdx2fGKzjjc+W5FPha53xtUVwilWiTKHqmTDon8E9nmW87qOxviweqrZGZiIlnF6N53K/KxyUhiOpthOqelOl3bsu9n07NM5F+RsUfZb+/M+BZmlr2vQT1XkbvYzu0BeAMI94Pw3/Oa/ATEk9Ff+kS4YLzf3Yp8YLK994NHAP5yMBvdlRzyTrMEwF1po/yQyH1Q7zgXKVKkSJEiRf7n5E8jGSSC6PW8lQAAAABJRU5ErkJggg==" alt="QR code for the PSI token Pump.fun page" className="w-full max-w-[250px] rounded-2xl bg-white p-3"/>
        <p className="mt-4 flex items-center gap-2 text-xs font-black tracking-widest text-cyan-200"><QrCode size={15}/> SCAN TO VERIFY</p>
      </article>
      <article className="glass-card p-7">
        <h3 className="text-2xl font-black">PSI / Primary Sovereign Index</h3>
        <p className="mt-4 break-all rounded-xl border border-slate-800 bg-slate-950/70 p-4 font-mono text-xs text-slate-300">{PSI_CONTRACT}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a className="primary-cta" href={PUMP_URL} target="_blank" rel="noreferrer">Open on Pump <ExternalLink size={15}/></a>
          <a className="secondary-cta" href={SOLSCAN_URL} target="_blank" rel="noreferrer">Verify on Solscan <ExternalLink size={15}/></a>
        </div>
        <div className="mt-6 flex gap-3 rounded-xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm leading-6 text-amber-100">
          <ShieldAlert className="mt-0.5 shrink-0"/>
          <p>Digital assets are speculative and can lose all value. Pump bonding-curve and PumpSwap mechanics are controlled by the platform/protocol, not by QSLC. This page is informational and does not offer investment advice or a guaranteed market outcome.</p>
        </div>
      </article>
    </div>
  </section>
}
