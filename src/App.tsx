import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

const projects = [
  {
    title: "Lifting Tracker",
    description: "Workout logging app to track lifts, log sessions, and monitor progress over time.",
    tech: ["React", "TypeScript", "Tailwind"],
    link: "https://lifting.voget.io",
    github: "https://github.com/matty-v/lifting",
  },
  {
    title: "Google Drive MCP Server",
    description: "MCP server enabling Claude to interact with Google Drive. Browse, search, read, create, and edit files with full OAuth2 authentication.",
    tech: ["TypeScript", "Google Cloud", "OAuth2", "Docker"],
    link: "#",
    github: "https://github.com/matty-v/google-drive-mcp",
  },
  {
    title: "Disc Golf Tracker",
    description: "Track disc golf rounds, scores, and stats across courses.",
    tech: ["React", "TypeScript", "Tailwind"],
    link: "https://disc-golf.voget.io",
    github: "https://github.com/matty-v/disc-golf-tracker",
  },
]

function Hero() {
  return (
    <section className="space-y-6 text-center py-20">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Matt Voget
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        Software engineer building tools that make life easier.
        Passionate about clean code, great UX, and solving real problems.
      </p>
      <div className="flex gap-4 justify-center">
        <Button variant="default" asChild>
          <a href="#projects">View Projects</a>
        </Button>
        <Button variant="outline" asChild>
          <a href="#contact">Get in Touch</a>
        </Button>
      </div>
    </section>
  )
}

function Projects() {
  return (
    <section id="projects" className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Things I've built
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.title} className="flex flex-col">
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs bg-secondary px-2 py-1 rounded-md"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button variant="ghost" size="sm" asChild>
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                  Code
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Demo
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="space-y-6 text-center py-12">
      <h2 className="text-2xl font-bold tracking-tight">Get in Touch</h2>
      <p className="text-muted-foreground">
        Feel free to reach out for collaborations or just a friendly hello
      </p>
      <div className="flex gap-4 justify-center">
        <Button variant="outline" size="icon" asChild>
          <a href="https://github.com/matty-v" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Github className="h-5 w-5" />
          </a>
        </Button>
        <Button variant="outline" size="icon" asChild>
          <a href="https://www.linkedin.com/in/matthew-voget-47a225a1/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <Linkedin className="h-5 w-5" />
          </a>
        </Button>
        <Button variant="outline" size="icon" asChild>
          <a href="mailto:matt.voget@gmail.com" aria-label="Email">
            <Mail className="h-5 w-5" />
          </a>
        </Button>
      </div>
    </section>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-4xl mx-auto px-4 py-8 space-y-16">
        <Hero />
        <Projects />
        <Contact />
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Matt Voget. Built with React + Tailwind.</p>
      </footer>
    </div>
  )
}

export default App
