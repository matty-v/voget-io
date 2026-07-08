import { useEffect, useRef, useState } from 'react'

type Agent = { glyph: string; name: string; role: string; blurb: string; ac: string }
type Card = { id: string; title: string; col: number }

const AGENTS: Agent[] = [
  { glyph: 'Y', name: 'Yoda', role: 'Product', blurb: 'Turns intent into crisp acceptance criteria.', ac: 'var(--accent-cyan)' },
  { glyph: 'O', name: 'Obi-Wan', role: 'Architect', blurb: 'Plans the approach and threat-models the risky bits.', ac: 'var(--accent-cyan)' },
  { glyph: 'L', name: 'Lando', role: 'Orchestrator', blurb: 'Routes every ticket to the right agent.', ac: 'var(--accent-purple)' },
  { glyph: 'H', name: 'Han', role: 'Engineer', blurb: 'Ships features test-first.', ac: 'var(--accent-purple)' },
  { glyph: 'K', name: 'Luke', role: 'Engineer', blurb: 'Ships features test-first.', ac: 'var(--accent-purple)' },
  { glyph: 'B', name: 'Boba-Fett', role: 'QA', blurb: 'Hunts regressions and perf cliffs.', ac: 'var(--accent-pink)' },
  { glyph: 'C', name: 'Chewie', role: 'Review', blurb: 'Reviews for correctness and security.', ac: 'var(--accent-pink)' },
  { glyph: 'A', name: 'Ackbar', role: 'Deploy', blurb: 'Ships to prod and verifies it went out.', ac: 'var(--accent-green)' },
]

const COLUMNS = [
  { name: 'Triage', owner: 'Yoda', ac: 'var(--accent-cyan)' },
  { name: 'Building', owner: 'Han', ac: 'var(--accent-purple)' },
  { name: 'In review', owner: 'Chewie', ac: 'var(--accent-pink)' },
  { name: 'Shipped', owner: 'Ackbar', ac: 'var(--accent-green)' },
]
const LAST = COLUMNS.length - 1

const SEED: Card[] = [
  { id: 'SNAP-151', title: 'Dark mode for the dex grid', col: 0 },
  { id: 'SNAP-148', title: 'De-dup rapid-scan captures', col: 1 },
  { id: 'SNAP-142', title: 'Streak counter on the profile page', col: 2 },
  { id: 'SNAP-139', title: 'Trade-request notifications', col: 3 },
]

const BACKLOG = [
  'Offline capture queue',
  'Shiny variant badges',
  'Profile share cards',
  'Search the dex by attribute',
  'Batch import from camera roll',
  'Weekly recap digest',
  'Haptics on a new capture',
]

export function FalconTeam() {
  const [cards, setCards] = useState<Card[]>(SEED)
  const [paused, setPaused] = useState(false)
  const seq = useRef(160)
  const backlogPtr = useRef(0)

  useEffect(() => {
    if (paused) return
    const timer = setTimeout(() => {
      setCards((prev) => {
        const next = [...prev]
        const shippedIdx = next.findIndex((c) => c.col >= LAST)
        if (shippedIdx !== -1) {
          // a shipped ticket clears the board; a fresh one enters triage
          next.splice(shippedIdx, 1)
          const title = BACKLOG[backlogPtr.current % BACKLOG.length]
          backlogPtr.current += 1
          seq.current += 1
          next.push({ id: 'SNAP-' + seq.current, title, col: 0 })
          return next
        }
        // otherwise advance the furthest-along ticket one column forward
        let lead = -1
        let leadCol = -1
        next.forEach((c, i) => {
          if (c.col < LAST && c.col > leadCol) {
            leadCol = c.col
            lead = i
          }
        })
        if (lead !== -1) next[lead] = { ...next[lead], col: next[lead].col + 1 }
        return next
      })
    }, 1900)
    return () => clearTimeout(timer)
  }, [cards, paused])

  return (
    <section id="team" className="team">
      <div className="team-head">
        <h3 className="team-sub">Who's on the team</h3>
      </div>
      <div className="roster">
        {AGENTS.map((a) => (
          <div key={a.name} className="roster-card" style={{ ['--ac' as string]: a.ac }}>
            <span className="roster-glyph">{a.glyph}</span>
            <div className="roster-meta">
              <span className="roster-name">{a.name}</span>
              <span className="roster-role">{a.role}</span>
            </div>
            <p className="roster-blurb">{a.blurb}</p>
          </div>
        ))}
      </div>

      <div className="team-head team-head-board">
        <h3 className="team-sub">Live work</h3>
        <span className="team-spacer" />
        <span className="team-live-tag">
          <span className="team-live-dot" /> building now
        </span>
        <button className="team-btn" onClick={() => setPaused((p) => !p)} aria-label="Pause or resume the board">
          {paused ? '▶ resume' : '⏸ pause'}
        </button>
      </div>

      <div className="kanban">
        {COLUMNS.map((col, ci) => (
          <div key={col.name} className="kan-col" style={{ ['--ac' as string]: col.ac }}>
            <div className="kan-col-head">
              <span className="kan-col-name">{col.name}</span>
              <span className="kan-col-owner">{col.owner}</span>
            </div>
            <div className="kan-col-body">
              {cards
                .filter((c) => c.col === ci)
                .map((c) => (
                  <div key={c.id} className={'kan-card' + (ci === LAST ? ' shipped' : '')}>
                    <span className="kan-card-id">{c.id}</span>
                    <span className="kan-card-title">{c.title}</span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <p className="team-note">// illustrative, sanitized view &mdash; wiring live GitHub activity next</p>
    </section>
  )
}
