import { useEffect, useRef, useState } from 'react'
import { Mic, MicOff, Navigation, Volume2 } from 'lucide-react'

type SpeechRecognitionAlternativeLike = { transcript: string }
type SpeechRecognitionResultLike = ArrayLike<SpeechRecognitionAlternativeLike>
type SpeechRecognitionResultsLike = ArrayLike<SpeechRecognitionResultLike>
type SpeechRecognitionResultEventLike = Event & { results: SpeechRecognitionResultsLike }

interface BrowserSpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  onend: (() => void) | null
  onerror: ((event: Event) => void) | null
  onresult: ((event: SpeechRecognitionResultEventLike) => void) | null
  start(): void
  stop(): void
}

type SpeechRecognitionConstructor = new () => BrowserSpeechRecognition

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

const routes = [
  { label: 'Observatory', target: '#observatory', aliases: ['observatory', 'space science'] },
  { label: 'Status', target: '#status', aliases: ['status', 'health'] },
  { label: 'Mission flow', target: '#qds44-flow', aliases: ['mission', 'mission flow', 'qds 44'] },
  { label: 'Pricing', target: '#pricing', aliases: ['pricing', 'plans', 'tiers'] },
  { label: 'Calculator', target: '#calculator', aliases: ['calculator', 'living calculator', 'savings model'] },
  { label: 'Books', target: '#books', aliases: ['books', 'book', 'publishing', 'kdp status'] },
  { label: 'Star map', target: '#topology', aliases: ['star map', 'system map', 'topology'] },
  { label: 'Gallery', target: '#gallery', aliases: ['gallery', 'visuals'] },
  { label: 'Apps', target: '#base44-constellation', aliases: ['apps', 'applications'] },
  { label: 'Governance', target: '#governance', aliases: ['governance', 'evidence'] },
  { label: 'Learning', target: '#learning', aliases: ['learning', 'lessons'] },
  { label: 'Questions', target: '#questions', aliases: ['questions', 'help'] },
  { label: 'Meeting', target: '#meeting', aliases: ['meeting', 'contact'] },
  { label: 'PSI notice', target: '#psi', aliases: ['psi', 'digital asset notice'] },
]

const suggestions = [
  { label: 'Explore the observatory', command: 'open observatory' },
  { label: 'Check public status', command: 'open status' },
  { label: 'Walk through a mission', command: 'open mission flow' },
  { label: 'Compare product tiers', command: 'open pricing' },
  { label: 'Try the living calculator', command: 'open calculator' },
  { label: 'Browse book information', command: 'open books' },
  { label: 'View the system star map', command: 'open star map' },
  { label: 'See the visual gallery', command: 'open gallery' },
  { label: 'Explore application demos', command: 'open apps' },
  { label: 'Review governance', command: 'open governance' },
]

const phases = [
  ['1 · Capture', 'Inputs, source IDs and evidence are collected.'],
  ['2 · Validate', 'Rules check schema, freshness, ownership and permission.'],
  ['3 · Calculate', 'Versioned formulas transform approved inputs.'],
  ['4 · Review', 'Evidence gates reject missing or contradictory claims.'],
  ['5 · Publish', 'Only public-safe, consented outputs reach customers.'],
]

export function EveCommandExperience() {
  const [command, setCommand] = useState('')
  const [message, setMessage] = useState('Ready. Type a public navigation command or choose a suggested next step.')
  const [speaking, setSpeaking] = useState(false)
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null)

  useEffect(() => () => {
    recognitionRef.current?.stop()
    window.speechSynthesis?.cancel()
  }, [])

  function runCommand(value = command) {
    const normalized = value.trim().toLowerCase().replace(/[.,!?]/g, '')
    const route = routes.find(item => item.aliases.some(alias => normalized.includes(alias)))
    if (!route) {
      setMessage('No matching public navigation skill. Try “open calculator”, “open star map”, “open books” or choose a suggestion below.')
      return
    }

    const destination = document.querySelector(route.target)
    if (!destination) {
      setMessage(`The ${route.label} section is not available on this page.`)
      return
    }
    destination.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setMessage(`Opened ${route.label}. EVE public navigation only moves within this website; it does not access accounts or execute external actions.`)
  }

  function startVoiceInput() {
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition
    if (!Recognition) {
      setMessage('Voice input is not supported by this browser. You can still type a command or choose a suggested step.')
      return
    }

    recognitionRef.current?.stop()
    const recognition = new Recognition()
    recognition.lang = navigator.language || 'en-US'
    recognition.continuous = false
    recognition.interimResults = false
    recognition.onresult = event => {
      const transcript = event.results[0]?.[0]?.transcript?.trim()
      setListening(false)
      if (!transcript) {
        setMessage('No speech was recognized. Try again or enter a command by typing.')
        return
      }
      setCommand(transcript)
      runCommand(transcript)
    }
    recognition.onerror = () => {
      setListening(false)
      setMessage('Voice input did not complete. Check microphone permission and browser support, or type a command instead.')
    }
    recognition.onend = () => setListening(false)

    try {
      recognition.start()
      recognitionRef.current = recognition
      setListening(true)
      setMessage('Listening for a public navigation command. Your browser may ask for microphone permission.')
    } catch (error) {
      if (error instanceof DOMException) {
        setMessage(`Voice input could not start (${error.name}). Check microphone permission, then try again.`)
        return
      }
      throw error
    }
  }

  function stopVoiceInput() {
    recognitionRef.current?.stop()
    setListening(false)
    setMessage('Voice input stopped.')
  }

  function speakResult() {
    if (!('speechSynthesis' in window)) {
      setMessage('Voice playback is unavailable in this browser.')
      return
    }
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(message)
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  return <section id="command" className="py-16">
    <div className="rounded-3xl border border-cyan-300/30 bg-slate-950/90 p-6 shadow-[0_0_75px_#7c3aed22] sm:p-10">
      <p className="text-xs font-black tracking-[.25em] text-lime-300">QSLC · EVE-HEI INTERACTIVE COMMAND CENTER</p>
      <h2 className="mt-3 text-3xl font-black text-white">One command. Clear evidence.</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">EVE public navigation helps visitors find the existing calculators, product information, learning material and evidence demonstrations. These browser-only navigation skills do not connect to private accounts, external tools or owner operations.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <input aria-label="EVE public command" value={command} onChange={event => setCommand(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') runCommand() }} placeholder="open calculator" className="min-w-0 flex-1 rounded-xl border border-cyan-400/30 bg-slate-900 p-4 text-white outline-none focus:border-lime-300" />
        <button type="button" onClick={() => runCommand()} className="rounded-xl bg-lime-300 px-6 py-3 font-black text-slate-950"><Navigation className="mr-2 inline" size={16} />Run</button>
        <button type="button" onClick={listening ? stopVoiceInput : startVoiceInput} aria-pressed={listening} className="rounded-xl border border-cyan-300/40 px-5 py-3 font-bold text-cyan-100">
          {listening ? <><MicOff className="mr-2 inline" size={16} />Stop listening</> : <><Mic className="mr-2 inline" size={16} />Speak a command</>}
        </button>
        <button type="button" onClick={speakResult} className="rounded-xl border border-purple-400/50 px-5 py-3 font-bold text-purple-200"><Volume2 className="mr-2 inline" size={16} />{speaking ? 'Speaking…' : 'Hear result'}</button>
      </div>
      <p aria-live="polite" className="mt-3 text-sm text-cyan-200">{message}</p>
      <p className="mt-2 text-xs leading-5 text-slate-500">Voice input starts only when selected and may be processed by your browser or its speech provider under their privacy terms. This page does not save or send the transcript. Microphone permission can be revoked in browser settings.</p>

      <div className="mt-8 rounded-2xl border border-cyan-300/20 bg-slate-900/60 p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><p className="text-xs font-black tracking-[.2em] text-cyan-200">GUIDED NEXT STEPS</p><h3 className="mt-2 text-xl font-black text-white">Choose where to explore</h3></div>
          <span className="text-xs text-slate-400">10 public navigation suggestions · no external actions</span>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {suggestions.map((suggestion, index) => <button key={suggestion.command} type="button" onClick={() => { setCommand(suggestion.command); runCommand(suggestion.command) }} className="rounded-xl border border-slate-700 bg-slate-950/80 p-3 text-left text-sm text-slate-200 transition hover:border-cyan-300/50 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime-300"><span className="mr-2 text-xs font-black text-purple-300">{String(index + 1).padStart(2, '0')}</span>{suggestion.label}</button>)}
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-5">{phases.map(([title, copy], index) => <article key={title} className="rounded-xl border border-purple-400/30 bg-gradient-to-b from-purple-950/60 to-slate-900 p-4"><div className="mb-4 h-2 rounded-full bg-slate-700"><div className="h-2 rounded-full bg-gradient-to-r from-lime-300 via-cyan-400 to-purple-500" style={{ width: `${(index + 1) * 20}%` }} /></div><h3 className="font-black text-lime-300">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-300">{copy}</p></article>)}</div>
      <p className="mt-4 text-xs text-slate-400">Workflow bars illustrate sequence, not measured completion. This public command center is not an autonomous agent and does not claim live telemetry or external integrations.</p>
      <div id="newsletter" className="mt-10 rounded-2xl border border-lime-300/30 p-5">
        <h3 className="text-xl font-black">QSLC updates &amp; product newsletter</h3>
        <p className="mt-2 text-sm text-slate-300">Request product updates by email. This opens your email app; it does not silently enroll you or store contact details.</p>
        <a className="mt-4 inline-block rounded-xl bg-purple-500 px-5 py-3 font-bold text-white" href="mailto:qslc1010@qslc-hei.com?subject=QSLC%20Newsletter%20Opt-in&amp;body=Please%20subscribe%20me%20to%20QSLC%20product%20updates.%20I%20consent%20to%20receiving%20these%20emails.">Request newsletter</a>
      </div>
    </div>
  </section>
}
