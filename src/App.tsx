import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUpRight, Box, CalendarClock, Database, Github, KeyRound, Layers3, Linkedin, Mail, Menu, MessageSquare, Network, ShieldCheck, UserRound, X } from 'lucide-react'

type Navigate = (event: React.MouseEvent<HTMLAnchorElement>, path: string) => void

const projects = [
  { index: '001', name: 'Kyber', status: 'active', focus: 'Kubernetes-native infrastructure for persistent AI agents', href: '#kyber' },
  { index: '002', name: 'Falcon Dev Team', status: 'operational', focus: 'A multi-agent software team running on Kyber', href: '#signal' },
  { index: '003', name: 'Snapdex', status: 'shipped', focus: 'A Pokédex app delivered by the Falcon Dev Team', href: 'https://snapdex.ai' },
]

const signals = [
  { title: 'Kyber platform', detail: 'Active development', kind: 'SYSTEM' },
  { title: 'Falcon Dev Team', detail: 'End-to-end canary completed', kind: 'WORKFLOW' },
  { title: 'Agent identities', detail: 'Persistent and versioned', kind: 'STATE' },
  { title: 'Workloads', detail: 'Isolated on Kubernetes', kind: 'RUNTIME' },
]

function Brand() {
  return <a className="brand" href="#top" aria-label="Matt Voget home"><strong>MV</strong><span>/</span><time>{new Date().getFullYear()}</time></a>
}

function Sidebar() {
  return <aside className="sidebar" aria-label="Primary navigation">
    <Brand />
    <nav className="side-nav">
      <a className="active" href="#top"><Network /> Index</a><a href="#kyber"><Box /> Kyber</a><a href="#projects"><Layers3 /> Projects</a><a href="#signal"><Database /> Signal</a><a href="mailto:matt.voget@gmail.com"><Mail /> Contact</a>
    </nav>
    <div className="side-footer">
      <a href="https://github.com/matty-v" target="_blank" rel="noreferrer">GitHub <ArrowUpRight /></a><a href="https://www.linkedin.com/in/matthew-voget-47a225a1/" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight /></a><p>&copy; {new Date().getFullYear()} Matt Voget</p><span>Built by hand</span>
    </div>
  </aside>
}

function MobileHeader() {
  const [open, setOpen] = useState(false)
  return <header className="mobile-header">
    <Brand /><span className="availability"><i /> Available</span>
    <button type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    {open && <nav className="mobile-menu"><a href="#kyber" onClick={() => setOpen(false)}>Kyber</a><a href="#projects" onClick={() => setOpen(false)}>Projects</a><a href="#signal" onClick={() => setOpen(false)}>Signal</a><a href="mailto:matt.voget@gmail.com">Contact</a></nav>}
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
    <section className="signal" id="signal"><header className="module-heading"><span>Live signal</span></header><div className="signal-list">{signals.map((signal) => <article key={signal.title}><i /><div><strong>{signal.title}</strong><span>{signal.detail}</span></div><small>{signal.kind}</small></article>)}</div><a className="text-link" href="https://github.com/matty-v" target="_blank" rel="noreferrer">View GitHub <ArrowUpRight /></a></section>
  </section>
}

function ProjectIndex() {
  return <section className="project-index" id="projects"><header className="module-heading"><span>Project index</span></header><div className="project-table" role="table" aria-label="Projects"><div className="project-row project-labels" role="row"><span>Idx</span><span>Project</span><span>Status</span><span>Focus</span></div>{projects.map((project) => { const external = project.href.startsWith('http'); return <a className="project-row" role="row" key={project.index} href={project.href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}><span>{project.index}</span><strong>{project.name}</strong><span className="project-status"><i />{project.status}</span><span>{project.focus}</span></a> })}</div></section>
}

function Home() {
  return <><Sidebar /><MobileHeader /><main className="site-main" id="top"><div className="identity-line"><span>Matt Voget / Engineering leader + builder</span><span className="availability"><i /> Available</span></div><section className="hero"><h1>Building durable systems for people and agents.</h1><p>I design and ship infrastructure that stays up, scales out, and earns trust.</p><a href="mailto:matt.voget@gmail.com">matt@voget.io <ArrowUpRight /></a></section><KyberSection /><ProjectIndex /><footer className="site-footer"><div><strong>Matt Voget</strong><p>Engineering leader, systems builder, and creator of Kyber.</p></div><nav aria-label="Social and legal links"><a aria-label="GitHub" href="https://github.com/matty-v" target="_blank" rel="noreferrer"><Github /></a><a aria-label="LinkedIn" href="https://www.linkedin.com/in/matthew-voget-47a225a1/" target="_blank" rel="noreferrer"><Linkedin /></a><a aria-label="Email" href="mailto:matt.voget@gmail.com"><Mail /></a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></nav></footer></main></>
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
