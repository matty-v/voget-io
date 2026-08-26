import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUpRight, Box, CalendarClock, Database, Github, KeyRound, Layers3, Linkedin, Mail, Menu, MessageSquare, Network, ShieldCheck, UserRound, X } from 'lucide-react'

type Navigate = (event: React.MouseEvent<HTMLAnchorElement>, path: string) => void

const career = [
  { company: 'Lockheed Martin', title: 'Systems / Software Engineer', detail: 'Satellites, identity and access management, and intelligence systems.' },
  { company: 'Cherwell', title: 'Team Lead / Senior Engineer', detail: 'IT service management, .NET, and machine learning.' },
  { company: 'Stoplight', title: 'Engineering Manager / Staff Engineer', detail: 'API design, DevOps, and microservices.' },
  { company: 'Ambassador Labs', title: 'VP Engineering / Director of Technology', detail: 'Zero-to-one products, Kubernetes, and API gateways.' },
  { company: 'Gravitee', title: 'Director of Engineering', detail: 'Agent management gateways and AI developer enablement.', current: true },
]

const dispatches = [
  { title: 'Kyber', detail: 'Explore the live platform site', kind: 'LIVE SITE', href: 'https://kyber.voget.io' },
  { title: 'Snapdex', detail: 'A product shipped by the Falcon Dev Team', kind: 'LIVE SITE', href: 'https://snapdex.ai' },
  { title: 'Kyber source', detail: 'Follow development on GitHub', kind: 'SOURCE', href: 'https://github.com/matty-v/kyber' },
  { title: 'Writing', detail: 'Technical notes and project updates', kind: 'COMING SOON', href: '#dispatches' },
]

function Brand() {
  return <a className="brand" href="#top" aria-label="Matt Voget home"><img src="/profile.jpeg" alt="Matt Voget" /><span>/</span><time>{new Date().getFullYear()}</time></a>
}

function Sidebar() {
  return <aside className="sidebar" aria-label="Primary navigation">
    <Brand />
    <nav className="side-nav">
      <a className="active" href="#top"><Network /> Index</a><a href="#kyber"><Box /> Kyber</a><a href="#journey"><Layers3 /> Journey</a><a href="#dispatches"><Database /> Dispatches</a><a href="mailto:matt.voget@gmail.com"><Mail /> Contact</a>
    </nav>
    <div className="side-footer">
      <a href="https://github.com/matty-v" target="_blank" rel="noreferrer">GitHub <ArrowUpRight /></a><a href="https://www.linkedin.com/in/matthew-voget-47a225a1/" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight /></a><a href="mailto:matt.voget@gmail.com">Email <ArrowUpRight /></a><p>&copy; {new Date().getFullYear()} Matt Voget</p><span>Lovingly built by 🤖</span>
    </div>
  </aside>
}

function MobileHeader() {
  const [open, setOpen] = useState(false)
  return <header className="mobile-header">
    <Brand /><span className="availability"><i /> Available</span>
    <button type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    {open && <nav className="mobile-menu"><a href="#kyber" onClick={() => setOpen(false)}>Kyber</a><a href="#journey" onClick={() => setOpen(false)}>Journey</a><a href="#dispatches" onClick={() => setOpen(false)}>Dispatches</a><a href="mailto:matt.voget@gmail.com">Contact</a></nav>}
  </header>
}

function Architecture() {
  const capabilities = [{ label: 'Identity', icon: ShieldCheck }, { label: 'Scheduling', icon: CalendarClock }, { label: 'Secrets', icon: KeyRound }, { label: 'Memory', icon: Database }, { label: 'Channels', icon: MessageSquare }]
  return <div className="architecture" aria-label="Kyber architecture: operator to control plane to isolated agent pods">
    <div className="architecture-node operator"><UserRound /><span>Operator</span></div><ArrowDown className="flow-arrow" aria-hidden="true" />
    <div className="control-plane"><p>Control plane</p><div className="capabilities">{capabilities.map(({ label, icon: Icon }) => <span key={label}><Icon /> {label}</span>)}</div></div><ArrowDown className="flow-arrow" aria-hidden="true" />
    <div className="agent-pods">{[1, 2, 'N'].map((pod) => <div className="architecture-node" key={pod}><Box /><span>Agent pod {pod}</span></div>)}</div>
    <div className="runtime-strip"><span>Kubernetes</span><span>CRDs</span><span>OCI</span><span>gRPC</span></div>
  </div>
}

function KyberSection() {
  return <section className="kyber-section" id="kyber">
    <div className="project-card"><header className="module-heading"><span>Kyber / Active project</span></header><h2>Kubernetes-native infrastructure for persistent AI agents.</h2><p className="project-summary">Kyber gives long-running agents durable identity, isolated compute, controlled access to secrets, schedules, and two-way communication channels.</p><Architecture /><div className="facts" aria-label="Kyber facts"><p><span>Runtime</span> / Kubernetes</p><p><span>State</span> / Persistent</p><p><span>Control</span> / Human</p></div></div>
    <section className="signal" id="dispatches"><header className="module-heading"><span>Dispatches</span></header><div className="signal-list">{dispatches.map((dispatch) => <a href={dispatch.href} target={dispatch.href.startsWith('http') ? '_blank' : undefined} rel={dispatch.href.startsWith('http') ? 'noreferrer' : undefined} key={dispatch.title}><i /><div><strong>{dispatch.title}</strong><span>{dispatch.detail}</span></div><small>{dispatch.kind}</small><ArrowUpRight /></a>)}</div></section>
  </section>
}

function CareerJourney() {
  return <section className="project-index" id="journey"><header className="module-heading"><span>Career journey</span></header><ol className="career-list">{career.map((beat, index) => <li className={beat.current ? 'current' : undefined} key={beat.company}><span className="career-index">0{index + 1}</span><div><p><strong>{beat.company}</strong>{beat.current && <em><i /> Current</em>}<span>{beat.title}</span></p><p>{beat.detail}</p></div></li>)}</ol></section>
}

function Home() {
  return <><Sidebar /><MobileHeader /><main className="site-main" id="top"><div className="identity-line"><span>Matt Voget / Engineering leader + builder</span><span className="availability"><i /> Available</span></div><section className="hero"><h1>Leading teams and building production software.</h1><p>I help engineering organizations turn ambitious ideas into reliable products. I also still love to build!</p><a href="mailto:matt.voget@gmail.com">matt.voget@gmail.com <ArrowUpRight /></a></section><KyberSection /><CareerJourney /><footer className="site-footer"><div><strong>Matt Voget</strong><p>Engineering leader, systems builder, and creator of Kyber.</p></div><nav aria-label="Social and legal links"><a aria-label="GitHub" href="https://github.com/matty-v" target="_blank" rel="noreferrer"><Github /></a><a aria-label="LinkedIn" href="https://www.linkedin.com/in/matthew-voget-47a225a1/" target="_blank" rel="noreferrer"><Linkedin /></a><a aria-label="Email" href="mailto:matt.voget@gmail.com"><Mail /></a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></nav></footer></main></>
}

function LegalPage({ title, onNavigate }: { title: 'Privacy Policy' | 'Terms and Conditions'; onNavigate: Navigate }) {
  const privacy = title === 'Privacy Policy'
  return <main className="legal-page"><a className="text-link" href="/" onClick={(event) => onNavigate(event, '/')}>&larr; Back to Home</a><p className="legal-kicker">Voget.io / Legal</p><h1>{title}</h1><p>Last updated: {new Date().toLocaleDateString()}</p>{privacy ? <><p>This website is a personal portfolio site. We do not collect, store, or process personal information from visitors.</p><p>This site does not use cookies, analytics, or tracking technologies.</p><p>If you contact me by email, I will use your information only to respond.</p></> : <><p>This is a personal portfolio website. By accessing it, you agree to these terms.</p><p>Content, graphics, and code samples are provided for informational purposes. External project links are provided as-is.</p><p>This site is provided without warranties of any kind.</p></>}<p>Questions: <a href="mailto:matt.voget@gmail.com">matt.voget@gmail.com</a></p></main>
}

function App() {
  const readPage = () => window.location.pathname.replace(/^\//, '') || 'home'
  const [page, setPage] = useState(readPage)
  useEffect(() => { const handlePopState = () => setPage(readPage()); window.addEventListener('popstate', handlePopState); return () => window.removeEventListener('popstate', handlePopState) }, [])
  const navigate: Navigate = (event, path) => { event.preventDefault(); window.history.pushState({}, '', path); setPage(path.replace(/^\//, '') || 'home'); window.scrollTo(0, 0) }
  if (page === 'privacy') return <LegalPage title="Privacy Policy" onNavigate={navigate} />
  if (page === 'terms') return <LegalPage title="Terms and Conditions" onNavigate={navigate} />
  return <Home />
}

export default App
