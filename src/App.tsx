import { useEffect, useState } from 'react'
import { Github, Linkedin, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FalconTeam } from '@/components/falcon-team'
import { KyberDiagram } from '@/components/kyber-diagram'
import { SnapdexShowcase } from '@/components/snapdex-showcase'

function Particles() {
  useEffect(() => {
    const container = document.getElementById('particles')
    if (!container || container.children.length > 0) return

    const particleCount = 30
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')
      particle.className = 'particle'
      particle.style.left = Math.random() * 100 + '%'
      particle.style.top = Math.random() * 100 + '%'
      const duration = 15 + Math.random() * 25
      particle.style.animationDuration = duration + 's'
      particle.style.animationDelay = Math.random() * 10 + 's'
      const drift = (Math.random() - 0.5) * 100
      particle.style.setProperty('--particle-drift', drift + 'px')
      const size = 1 + Math.random() * 2
      particle.style.width = size + 'px'
      particle.style.height = size + 'px'
      container.appendChild(particle)
    }
  }, [])

  return <div className="particles" id="particles" />
}

function Background() {
  return (
    <>
      <div className="gradient-backdrop" />
      <div className="grid-overlay" />
      <Particles />
      <div className="scanline" />
      <div className="corner-accent top-left" />
      <div className="corner-accent bottom-right" />
    </>
  )
}

function Hero() {
  return (
    <section className="space-y-6 text-center py-16">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        <span className="text-foreground">Matt </span>
        <span className="glow-cyan">Voget</span>
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
        I lead engineering teams, but still love to build!
        Passionate about good architecture, managing functional teams, and creating software that solves problems.
      </p>
      <div className="flex gap-4 justify-center">
        <Button variant="default" asChild className="bg-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)]/80 text-black font-medium">
          <a href="#work">My Work</a>
        </Button>
        <Button variant="outline" asChild className="border-[var(--accent-purple)]/50 hover:border-[var(--accent-purple)] hover:bg-[var(--accent-purple)]/10">
          <a href="#contact">Get in Touch</a>
        </Button>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="space-y-6 text-center py-6">
      <h2 className="text-2xl font-semibold tracking-tight">
        <span className="glow-cyan">Get in Touch</span>
      </h2>
      <p className="text-muted-foreground font-light">
        Feel free to reach out for collaborations, a Snapdex invite, or just a friendly hello
      </p>
      <div className="flex gap-4 justify-center">
        <Button variant="outline" size="icon" asChild className="border-[var(--accent-cyan)]/30 hover:border-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)]/10 hover:text-[var(--accent-cyan)]">
          <a href="https://github.com/matty-v" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Github className="h-5 w-5" />
          </a>
        </Button>
        <Button variant="outline" size="icon" asChild className="border-[var(--accent-purple)]/30 hover:border-[var(--accent-purple)] hover:bg-[var(--accent-purple)]/10 hover:text-[var(--accent-purple)]">
          <a href="https://www.linkedin.com/in/matthew-voget-47a225a1/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <Linkedin className="h-5 w-5" />
          </a>
        </Button>
        <Button variant="outline" size="icon" asChild className="border-[var(--accent-pink)]/30 hover:border-[var(--accent-pink)] hover:bg-[var(--accent-pink)]/10 hover:text-[var(--accent-pink)]">
          <a href="mailto:matt.voget@gmail.com" aria-label="Email">
            <Mail className="h-5 w-5" />
          </a>
        </Button>
      </div>
    </section>
  )
}

function SectionHeading({ title, badge, badgeColor, children }: { title: string; badge?: string; badgeColor?: string; children: React.ReactNode }) {
  return (
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <h3 className="text-xl font-semibold tracking-tight text-foreground">{title}</h3>
        {badge && (
          <span
            className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md"
            style={{
              color: badgeColor,
              background: `color-mix(in srgb, ${badgeColor} 10%, transparent)`,
              border: `1px solid color-mix(in srgb, ${badgeColor} 25%, transparent)`,
            }}
          >
            {badge}
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground font-light max-w-2xl mx-auto">{children}</p>
    </div>
  )
}

function MyWork() {
  return (
    <section id="work" className="space-y-16">
      <div className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          <span className="glow-purple">My Work</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-2 font-light">
          A platform for autonomous AI dev teams &mdash; and the product they're building on it
        </p>
      </div>

      <div className="space-y-8">
        <SectionHeading title="Kyber" badge="Private" badgeColor="var(--accent-cyan)">
          A Kubernetes-native platform that runs autonomous agents as a real software team &mdash; dispatch, persistent
          memory, code review, and deploy built into the fabric.
        </SectionHeading>
        <KyberDiagram />
      </div>

      <div className="space-y-8">
        <SectionHeading title="The Falcon Dev Team">
          Eight agents, each with a role a human team would recognize &mdash; shipping real software on Kyber,
          autonomously.
        </SectionHeading>
        <FalconTeam />
      </div>

      <div className="space-y-8">
        <SectionHeading title="Snapdex" badge="Invite-only" badgeColor="var(--accent-purple)">
          The first product the Falcon Dev Team shipped end-to-end.
        </SectionHeading>
        <SnapdexShowcase />
      </div>
    </section>
  )
}

function PrivacyPolicy({ onNavigate }: { onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, path: string) => void }) {
  return (
    <section className="py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight mb-8">
        <span className="glow-cyan">Privacy Policy</span>
      </h1>
      <div className="space-y-6 text-muted-foreground font-light">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>
          This website is a personal portfolio site. We do not collect, store, or process any personal information from visitors.
        </p>
        <p>
          This site does not use cookies, analytics, or any tracking technologies.
        </p>
        <p>
          If you contact me via email, I will only use your information to respond to your inquiry.
        </p>
        <p>
          For questions about this policy, contact me at matt.voget@gmail.com.
        </p>
      </div>
      <div className="mt-8">
        <Button variant="outline" asChild className="border-[var(--accent-cyan)]/50 hover:border-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)]/10">
          <a href="/" onClick={(e) => onNavigate(e, '/')}>Back to Home</a>
        </Button>
      </div>
    </section>
  )
}

function TermsAndConditions({ onNavigate }: { onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, path: string) => void }) {
  return (
    <section className="py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight mb-8">
        <span className="glow-purple">Terms and Conditions</span>
      </h1>
      <div className="space-y-6 text-muted-foreground font-light">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>
          This is a personal portfolio website. By accessing this site, you agree to these terms.
        </p>
        <p>
          All content on this site, including text, graphics, and code samples, is provided for informational purposes only.
        </p>
        <p>
          The projects showcased are my personal work. External links to demos and repositories are provided as-is.
        </p>
        <p>
          This site is provided "as is" without warranties of any kind.
        </p>
        <p>
          For questions, contact me at matt.voget@gmail.com.
        </p>
      </div>
      <div className="mt-8">
        <Button variant="outline" asChild className="border-[var(--accent-purple)]/50 hover:border-[var(--accent-purple)] hover:bg-[var(--accent-purple)]/10">
          <a href="/" onClick={(e) => onNavigate(e, '/')}>Back to Home</a>
        </Button>
      </div>
    </section>
  )
}

function App() {
  const getPageFromPath = () => {
    const path = window.location.pathname.replace(/^\//, '')
    return path || 'home'
  }

  const [page, setPage] = useState(getPageFromPath)

  useEffect(() => {
    const handlePopState = () => {
      setPage(getPageFromPath())
      window.scrollTo(0, 0)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault()
    window.history.pushState({}, '', path)
    setPage(path.replace(/^\//, '') || 'home')
    window.scrollTo(0, 0)
  }

  const renderContent = () => {
    switch (page) {
      case 'privacy':
        return <PrivacyPolicy onNavigate={navigate} />
      case 'terms':
        return <TermsAndConditions onNavigate={navigate} />
      default:
        return (
          <>
            <Hero />
            <Contact />
            <MyWork />
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] relative">
      <Background />
      <main className="container max-w-4xl mx-auto px-4 py-8 space-y-16 relative z-10">
        {renderContent()}
      </main>
      <footer className="border-t border-[var(--accent-cyan)]/10 py-6 text-center text-sm text-muted-foreground relative z-10">
        <p className="font-light">&copy; {new Date().getFullYear()} Matt Voget. Built with React + Tailwind.</p>
        <div className="mt-2 space-x-4">
          <a href="/privacy" onClick={(e) => navigate(e, '/privacy')} className="hover:text-[var(--accent-cyan)] transition-colors">Privacy Policy</a>
          <a href="/terms" onClick={(e) => navigate(e, '/terms')} className="hover:text-[var(--accent-purple)] transition-colors">Terms and Conditions</a>
        </div>
      </footer>
    </div>
  )
}

export default App
