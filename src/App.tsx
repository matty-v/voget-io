import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Box,
  Database,
  Github,
  Layers3,
  Linkedin,
  Mail,
  Menu,
  Network,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { runKioskCommand, type KioskCommand } from "./kyberGateway";
import MermaidDiagram from "./MermaidDiagram";

type Navigate = (
  event: React.MouseEvent<HTMLAnchorElement>,
  path: string,
) => void;

type CareerBeat = {
  company: string;
  title: string;
  detail: string;
  acquiredBy?: string;
  current?: boolean;
};

const career: CareerBeat[] = [
  {
    company: "Lockheed Martin",
    title: "Systems / Software Engineer",
    detail:
      "Satellites, identity and access management, and intelligence systems.",
  },
  {
    company: "Cherwell",
    acquiredBy: "Ivanti",
    title: "Team Lead / Senior Engineer",
    detail: "IT service management, .NET, and machine learning.",
  },
  {
    company: "Stoplight",
    acquiredBy: "SmartBear",
    title: "Engineering Manager / Staff Engineer",
    detail: "API design, DevOps, and microservices.",
  },
  {
    company: "Ambassador Labs",
    acquiredBy: "Gravitee",
    title: "VP Engineering / Director of Technology",
    detail: "Zero-to-one products, Kubernetes, and API gateways.",
  },
  {
    company: "Gravitee",
    title: "Director of Engineering",
    detail: "Agent management gateways and AI developer enablement.",
    current: true,
  },
];

const dispatches = [
  {
    title: "Kyber",
    detail: "Explore the live platform site",
    kind: "LIVE SITE",
    href: "https://kyber.voget.io",
  },
  {
    title: "Snapdex",
    detail: "A product shipped by the Falcon Dev Team",
    kind: "LIVE SITE",
    href: "https://snapdex.ai",
  },
  {
    title: "Kyber source",
    detail: "Follow development on GitHub",
    kind: "SOURCE",
    href: "https://github.com/matty-v/kyber",
  },
  {
    title: "Writing",
    detail: "Technical notes and project updates",
    kind: "COMING SOON",
  },
];

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="Matt Voget home">
      <img src="/profile.jpeg" alt="Matt Voget" />
      <span>/</span>
      <time>{new Date().getFullYear()}</time>
    </a>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <Brand />
      <nav className="side-nav">
        <a className="active" href="#top">
          <Network /> Index
        </a>
        <a href="#kyber">
          <Box /> Kyber
        </a>
        <a href="#journey">
          <Layers3 /> Journey
        </a>
        <a href="#dispatches">
          <Database /> Dispatches
        </a>
        <a href="mailto:matt.voget@gmail.com">
          <Mail /> Contact
        </a>
      </nav>
      <div className="side-footer">
        <a href="https://github.com/matty-v" target="_blank" rel="noreferrer">
          GitHub <ArrowUpRight />
        </a>
        <a
          href="https://www.linkedin.com/in/matthew-voget-47a225a1/"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn <ArrowUpRight />
        </a>
        <a href="mailto:matt.voget@gmail.com">
          Email <ArrowUpRight />
        </a>
        <p>&copy; {new Date().getFullYear()} Matt Voget</p>
        <span>Lovingly built by 🤖</span>
      </div>
    </aside>
  );
}

function MobileHeader() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);
  return (
    <header className="mobile-header">
      <Brand />
      <span className="availability">
        <i /> Available
      </span>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
      {open && (
        <nav className="mobile-menu">
          <a href="#kyber" onClick={() => setOpen(false)}>
            Kyber
          </a>
          <a href="#journey" onClick={() => setOpen(false)}>
            Journey
          </a>
          <a href="#dispatches" onClick={() => setOpen(false)}>
            Dispatches
          </a>
          <a href="mailto:matt.voget@gmail.com">Contact</a>
        </nav>
      )}
    </header>
  );
}

const agentActions = {
  about: {
    command: "/about",
    label: "Tell me a little about yourself",
    skill: "glyph-about",
  },
  features: {
    command: "/features",
    label: "What are some features of Kyber?",
    skill: "kyber-features",
  },
  architecture: {
    command: "/architecture",
    label: "Describe Kyber's architecture",
    skill: "kyber-architecture",
  },
  contact: {
    command: "/contact",
    label: "Get in touch with Matt",
    skill: "contact-matt",
  },
  joke: {
    command: "/joke",
    label: "Tell me a joke",
    skill: "kyber-joke",
  },
} as const;

type AgentAction = keyof typeof agentActions;
type ChatMessage = {
  id: number;
  speaker: "Glyph" | "You";
  text: string;
  pending?: boolean;
};

const initialChat: ChatMessage[] = [
  {
    id: 0,
    speaker: "Glyph",
    text: "Hi, I'm Glyph. Select an option below to learn more about myself and Kyber.",
  },
];

function LiveAgentDemo() {
  const [activeAction, setActiveAction] = useState<AgentAction | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(initialChat);
  const nextMessageId = useRef(1);
  const chatEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEnd.current?.scrollIntoView?.({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  const runAction = async (action: AgentAction) => {
    const userMessageId = nextMessageId.current++;
    const responseMessageId = nextMessageId.current++;
    setActiveAction(action);
    setMessages((current) =>
      [
        ...current,
        {
          id: userMessageId,
          speaker: "You" as const,
          text: agentActions[action].label,
        },
        {
          id: responseMessageId,
          speaker: "Glyph" as const,
          text: "",
          pending: true,
        },
      ].slice(-6),
    );
    try {
      const result = await runKioskCommand(action as KioskCommand);
      setMessages((current) =>
        current.map((message) =>
          message.id === responseMessageId
            ? { ...message, text: result.response, pending: false }
            : message,
        ),
      );
    } catch {
      setMessages((current) =>
        current.map((message) =>
          message.id === responseMessageId
            ? {
                ...message,
                text: "The live kiosk is temporarily unavailable. Please try again shortly.",
                pending: false,
              }
            : message,
        ),
      );
    } finally {
      setActiveAction(null);
    }
  };

  return (
    <div className="agent-demo" aria-label="Interactive Kyber agent prototype">
      <header className="agent-demo-header">
        <div className="agent-identity">
          <span className="agent-avatar">
            <Sparkles aria-hidden="true" />
          </span>
          <div>
            <strong>Glyph</strong>
            <span>AI agent on Kyber</span>
          </div>
        </div>
      </header>
      <div className="agent-chat" aria-live="polite" aria-atomic="true">
        {messages.map((message) => (
          <div
            className={`chat-message chat-message-${message.speaker === "Glyph" ? "agent" : "user"}`}
            key={message.id}
          >
            <span className="chat-speaker">{message.speaker}</span>
            {message.pending ? (
              <div className="chat-typing" role="status" aria-label="Glyph is working">
                <i />
                <i />
                <i />
                <span>Glyph is working</span>
              </div>
            ) : (
              <div className="chat-content">
                {message.speaker === "Glyph" ? (
                  <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ children, href }) => (
                        <a href={href} target="_blank" rel="noreferrer">{children}</a>
                      ),
                      pre: ({ children }) => <div className="chat-code-block">{children}</div>,
                      code: ({ className, children, ...props }) =>
                        className === "language-mermaid" ? (
                          <MermaidDiagram chart={String(children).replace(/\n$/, "")} />
                        ) : (
                          <code className={className} {...props}>{children}</code>
                        ),
                    }}
                  >
                    {message.text}
                  </Markdown>
                ) : (
                  <p>{message.text}</p>
                )}
              </div>
            )}
          </div>
        ))}
        <div ref={chatEnd} />
      </div>
      <div className="agent-actions" aria-label="Choose a skill for Glyph">
        <p>What would you like Glyph to do?</p>
        {Object.entries(agentActions).map(([key, action]) => (
          <button
            type="button"
            key={key}
            disabled={activeAction !== null}
            onClick={() => runAction(key as AgentAction)}
          >
            <Send aria-hidden="true" />
            <span>
              {activeAction === key ? "Running…" : action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function KyberSection() {
  return (
    <section className="kyber-section" id="kyber">
      <div className="project-card">
        <header className="module-heading">
          <span>Kyber / Active project</span>
        </header>
        <h2>Kyber: Kubernetes-native infrastructure for persistent AI agents.</h2>
        <p className="project-summary">
          Interact with a live AI agent running on the Kyber infrastructure:
          Glyph.
        </p>
        <LiveAgentDemo />
      </div>
      <section className="signal" id="dispatches">
        <header className="module-heading">
          <span>Dispatches</span>
        </header>
        <div className="signal-list">
          {dispatches.map((dispatch) => {
            const content = (
              <>
                <i />
                <div>
                  <strong>{dispatch.title}</strong>
                  <span>{dispatch.detail}</span>
                </div>
                <small>{dispatch.kind}</small>
                {dispatch.href ? (
                  <ArrowUpRight aria-hidden="true" />
                ) : (
                  <span aria-hidden="true">—</span>
                )}
              </>
            );
            return dispatch.href ? (
              <a
                href={dispatch.href}
                target="_blank"
                rel="noreferrer"
                key={dispatch.title}
              >
                {content}
              </a>
            ) : (
              <div className="dispatch-placeholder" key={dispatch.title}>
                {content}
              </div>
            );
          })}
        </div>
      </section>
    </section>
  );
}

function CareerJourney() {
  return (
    <section className="project-index" id="journey">
      <header className="module-heading">
        <span>Career journey</span>
      </header>
      <ol className="career-list">
        {career.map((beat, index) => (
          <li
            className={beat.current ? "current" : undefined}
            key={beat.company}
          >
            <span className="career-index">0{index + 1}</span>
            <div>
              <p>
                <strong>{beat.company}</strong>
                {beat.current && (
                  <em>
                    <i /> Current
                  </em>
                )}
                {beat.acquiredBy && (
                  <small className="acquisition">
                    Acquired by <span>→ {beat.acquiredBy}</span>
                  </small>
                )}
                <span>{beat.title}</span>
              </p>
              <p>{beat.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Home() {
  return (
    <>
      <Sidebar />
      <MobileHeader />
      <main className="site-main" id="top">
        <div className="identity-line">
          <span>Matt Voget / Engineering leader + builder</span>
          <span className="availability">
            <i /> Available
          </span>
        </div>
        <section className="hero">
          <h1>Leading teams and building production software.</h1>
          <p>
            I help engineering organizations turn ambitious ideas into reliable
            products. I also still love to build!
          </p>
        </section>
        <KyberSection />
        <CareerJourney />
        <footer className="site-footer">
          <div>
            <strong>Matt Voget</strong>
            <p>Engineering leader, systems builder, and creator of Kyber.</p>
          </div>
          <nav aria-label="Social and legal links">
            <a
              aria-label="GitHub"
              href="https://github.com/matty-v"
              target="_blank"
              rel="noreferrer"
            >
              <Github />
            </a>
            <a
              aria-label="LinkedIn"
              href="https://www.linkedin.com/in/matthew-voget-47a225a1/"
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin />
            </a>
            <a aria-label="Email" href="mailto:matt.voget@gmail.com">
              <Mail />
            </a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </nav>
        </footer>
      </main>
    </>
  );
}

function LegalPage({
  title,
  onNavigate,
}: {
  title: "Privacy Policy" | "Terms and Conditions";
  onNavigate: Navigate;
}) {
  const privacy = title === "Privacy Policy";
  return (
    <main className="legal-page">
      <a
        className="text-link"
        href="/"
        onClick={(event) => onNavigate(event, "/")}
      >
        &larr; Back to Home
      </a>
      <p className="legal-kicker">Voget.io / Legal</p>
      <h1>{title}</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      {privacy ? (
        <>
          <p>
            This website is a personal portfolio site. We do not collect, store,
            or process personal information from visitors.
          </p>
          <p>
            This site does not use cookies, analytics, or tracking technologies.
          </p>
          <p>
            If you contact me by email, I will use your information only to
            respond.
          </p>
        </>
      ) : (
        <>
          <p>
            This is a personal portfolio website. By accessing it, you agree to
            these terms.
          </p>
          <p>
            Content, graphics, and code samples are provided for informational
            purposes. External project links are provided as-is.
          </p>
          <p>This site is provided without warranties of any kind.</p>
        </>
      )}
      <p>
        Questions:{" "}
        <a href="mailto:matt.voget@gmail.com">matt.voget@gmail.com</a>
      </p>
    </main>
  );
}

function App() {
  const readPage = () => window.location.pathname.replace(/^\//, "") || "home";
  const [page, setPage] = useState(readPage);
  useEffect(() => {
    const handlePopState = () => setPage(readPage());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  const navigate: Navigate = (event, path) => {
    event.preventDefault();
    window.history.pushState({}, "", path);
    setPage(path.replace(/^\//, "") || "home");
    window.scrollTo(0, 0);
  };
  if (page === "privacy")
    return <LegalPage title="Privacy Policy" onNavigate={navigate} />;
  if (page === "terms")
    return <LegalPage title="Terms and Conditions" onNavigate={navigate} />;
  return <Home />;
}

export default App;
