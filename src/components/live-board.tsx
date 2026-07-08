import { useEffect, useState } from 'react'

type Card = { id: string; kind: 'issue' | 'pr'; agent: string | null; tag: string }
type Column = { key: string; name: string; cards: Card[] }
type Board = { generatedAt: string; repo: string; columns: Column[]; stats: { shippedThisWeek: number; agents: number } }

const AGENT_COLOR: Record<string, string> = {
  yoda: 'var(--accent-cyan)',
  'obi-wan': 'var(--accent-cyan)',
  lando: 'var(--accent-purple)',
  han: 'var(--accent-purple)',
  luke: 'var(--accent-purple)',
  'boba-fett': 'var(--accent-pink)',
  chewie: 'var(--accent-pink)',
  ackbar: 'var(--accent-green)',
}
const agentColor = (a: string | null) => (a && AGENT_COLOR[a]) || 'var(--accent-cyan)'
const TAG_LABEL: Record<string, string> = { bug: 'bug', feature: 'feature', deploy: 'deploy', draft: 'draft', pr: 'PR' }

// Shown if the live feed can't be reached — clearly-labelled sample data.
const FALLBACK: Board = {
  generatedAt: new Date(0).toISOString(),
  repo: 'snapdex',
  columns: [
    { key: 'triage', name: 'Triage', cards: [{ id: '445', kind: 'issue', agent: null, tag: 'draft' }] },
    { key: 'building', name: 'Building', cards: [{ id: '443', kind: 'issue', agent: 'luke', tag: 'deploy' }] },
    { key: 'review', name: 'In review', cards: [{ id: '446', kind: 'pr', agent: null, tag: 'pr' }] },
    { key: 'shipped', name: 'Shipped', cards: [{ id: '442', kind: 'pr', agent: 'han', tag: 'pr' }] },
  ],
  stats: { shippedThisWeek: 0, agents: 0 },
}

function ago(iso: string): string {
  const ms = Date.now() - Date.parse(iso)
  if (!Number.isFinite(ms) || ms < 0) return 'just now'
  const m = Math.floor(ms / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  return h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`
}

export function LiveBoard({ onNavigate }: { onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, path: string) => void }) {
  const [board, setBoard] = useState<Board | null>(null)
  const [live, setLive] = useState(false)
  const [, force] = useState(0)

  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        const res = await fetch('/data/board.json', { cache: 'no-store' })
        if (!res.ok) throw new Error(String(res.status))
        const data = (await res.json()) as Board
        if (alive) {
          setBoard(data)
          setLive(true)
        }
      } catch {
        if (alive) {
          setBoard((b) => b ?? FALLBACK)
          setLive(false)
        }
      }
    }
    load()
    const poll = setInterval(load, 45000)
    const tick = setInterval(() => force((n) => n + 1), 30000) // refresh "updated Xm ago"
    return () => {
      alive = false
      clearInterval(poll)
      clearInterval(tick)
    }
  }, [])

  const b = board ?? FALLBACK

  return (
    <section className="py-10 space-y-8">
      <div className="lb-head">
        <a href="/" onClick={(e) => onNavigate(e, '/')} className="lb-back">
          &larr; Home
        </a>
        <div className="lb-title-row">
          <h1 className="text-3xl font-semibold tracking-tight">
            <span className="glow-cyan">Live board</span>
          </h1>
          <span className={'lb-live' + (live ? '' : ' off')}>
            <span className="lb-live-dot" />
            {live ? 'live' : 'sample'}
          </span>
        </div>
        <p className="text-sm text-muted-foreground font-light">
          The Falcon Dev Team's real work on <span className="text-foreground">{b.repo}</span>, sanitized &mdash; issue
          and PR numbers only, no titles. {b.stats.shippedThisWeek} shipped this week &middot; {b.stats.agents} agents
          active &middot; updated {ago(b.generatedAt)}
        </p>
      </div>

      <div className="lb-board">
        {b.columns.map((col) => (
          <div key={col.key} className="lb-col">
            <div className="lb-col-head">
              <span className="lb-col-name">{col.name}</span>
              <span className="lb-col-count">{col.cards.length}</span>
            </div>
            <div className="lb-col-body">
              {col.cards.length === 0 && <div className="lb-empty">—</div>}
              {col.cards.map((c) => (
                <div key={c.kind + c.id} className="lb-card" style={{ ['--ac' as string]: agentColor(c.agent) }}>
                  <div className="lb-card-top">
                    <span className={'lb-kind ' + c.kind}>{c.kind === 'pr' ? 'PR' : 'issue'}</span>
                    <span className="lb-cid">#{c.id}</span>
                    <span className="lb-tag">{TAG_LABEL[c.tag] ?? c.tag}</span>
                  </div>
                  {c.agent && (
                    <span className="lb-agent">
                      <span className="lb-agent-dot" />
                      {c.agent}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="lb-note">// live view refreshes every ~45s · sanitized from a private repo</p>
    </section>
  )
}
