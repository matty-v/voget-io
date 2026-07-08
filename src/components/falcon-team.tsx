import { useEffect, useState } from 'react'

type Agent = { glyph: string; name: string; role: string; ac: string }
type Ticket = { id: string; title: string; lines: string[] }
type Row = { key: string; who: string; color: string; msg: string; ok: boolean; t: string }

const AGENTS: Agent[] = [
  { glyph: 'Y', name: 'Yoda', role: 'Product', ac: 'var(--accent-cyan)' },
  { glyph: 'L', name: 'Lando', role: 'Dispatch', ac: 'var(--accent-purple)' },
  { glyph: 'H', name: 'Han', role: 'Engineer', ac: 'var(--accent-cyan)' },
  { glyph: 'C', name: 'Chewie', role: 'Review', ac: 'var(--accent-pink)' },
  { glyph: 'A', name: 'Ackbar', role: 'Deploy', ac: 'var(--accent-green)' },
]

const TICKETS: Ticket[] = [
  {
    id: 'SNAP-142',
    title: 'Streak counter on the profile page',
    lines: [
      'wrote 4 acceptance criteria',
      'dispatched → Han',
      'opened PR #487 · +214 / −38',
      'review passed · 0 findings · approved',
      'deployed to prod · 1m 12s',
    ],
  },
  {
    id: 'SNAP-148',
    title: 'De-dup captures on rapid scanning',
    lines: [
      'clarified edge cases · 3 AC',
      'dispatched → Han',
      'opened PR #491 · +96 / −12',
      'requested changes · 1 finding',
      'deployed to prod · 58s',
    ],
  },
  {
    id: 'SNAP-153',
    title: 'Dark mode for the dex grid',
    lines: [
      'scoped acceptance criteria',
      'dispatched → Han',
      'opened PR #494 · +301 / −44',
      'review passed · approved',
      'deployed to prod · 1m 04s',
    ],
  },
  {
    id: 'KYBER-88',
    title: 'Rotate dispatch HMAC keys',
    lines: [
      'hardening AC + threat notes',
      'dispatched → Han',
      'opened PR #262 · +71 / −9',
      'security review · approved',
      'deployed to prod · 1m 40s',
    ],
  },
]

const STAGE_LABELS = [
  '◆ acceptance criteria',
  '◆ dispatching',
  '◆ implementing',
  '◆ reviewing',
  '◆ deploying',
]

const EMPH = /(#\d+|prod|approved|\d+ finding(?:s)?|\d+m \d+s|\d+s)/g

function pad(n: number) {
  return (n < 10 ? '0' : '') + n
}

function clock() {
  const d = new Date()
  return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds())
}

function emphasize(s: string) {
  return s.split(EMPH).map((part, i) =>
    EMPH.test(part) ? <b key={i}>{part}</b> : <span key={i}>{part}</span>,
  )
}

export function FalconTeam() {
  const [ticketIdx, setTicketIdx] = useState(0)
  const [stageIdx, setStageIdx] = useState(-1)
  const [rows, setRows] = useState<Row[]>([])
  const [prs, setPrs] = useState(47)
  const [paused, setPaused] = useState(false)

  // Timeline driver. All state changes happen inside timeout callbacks (never
  // synchronously in the effect body), so pausing/resuming just reschedules.
  useEffect(() => {
    if (paused) return
    const t = TICKETS[ticketIdx]
    const logStage = (stage: number) => {
      const a = AGENTS[stage]
      const key = t.id + ':' + stage
      setRows((prev) =>
        prev.length && prev[prev.length - 1].key === key
          ? prev
          : [
              ...prev,
              { key, who: a.name, color: a.ac, msg: t.lines[stage], ok: stage === AGENTS.length - 1, t: clock() },
            ].slice(-9),
      )
    }
    // freshly loaded ticket → start stage 0 and log it
    if (stageIdx === -1) {
      const id = setTimeout(() => {
        logStage(0)
        setStageIdx(0)
      }, 700)
      return () => clearTimeout(id)
    }
    // advance through the pipeline, logging each stage as it begins
    if (stageIdx < AGENTS.length - 1) {
      const id = setTimeout(() => {
        logStage(stageIdx + 1)
        setStageIdx(stageIdx + 1)
      }, 1650)
      return () => clearTimeout(id)
    }
    // last agent finished → mark shipped
    if (stageIdx === AGENTS.length - 1) {
      const id = setTimeout(() => setStageIdx(AGENTS.length), 1650)
      return () => clearTimeout(id)
    }
    // shipped → bump the counter and load the next ticket
    const id = setTimeout(() => {
      setPrs((p) => p + 1)
      setTicketIdx((i) => (i + 1) % TICKETS.length)
      setStageIdx(-1)
    }, 1300)
    return () => clearTimeout(id)
  }, [stageIdx, ticketIdx, paused])

  const t = TICKETS[ticketIdx]
  const shipped = stageIdx >= AGENTS.length
  const lastStage = AGENTS.length - 1
  const clamped = Math.max(0, Math.min(stageIdx, lastStage))
  const packetLeft = stageIdx < 0 ? 10 : 10 + 80 * (clamped / lastStage)
  const fillW = stageIdx < 0 ? 0 : (clamped / lastStage) * 100
  const stageLabel = stageIdx < 0 ? STAGE_LABELS[0] : shipped ? '◆ shipped ✓' : STAGE_LABELS[stageIdx]
  const stageColor = shipped ? 'var(--accent-green)' : stageIdx < 0 ? 'var(--accent-cyan)' : AGENTS[stageIdx].ac

  return (
    <section id="team" className="falcon">
      <p className="falcon-eyebrow">
        <span className="falcon-live" /> Kyber &middot; Falcon Dev Team
      </p>
      <h2 className="falcon-title">
        A team of AI engineers that <span className="falcon-grad">ships on its own</span>.
      </h2>
      <p className="falcon-lede">
        Kyber is a Kubernetes-native platform where autonomous agents run as a real dev team &mdash; product,
        engineering, review, and deploy &mdash; turning ideas into shipped software. Here they are building Snapdex,
        live.
      </p>

      <div className="falcon-now">
        <span className="falcon-now-tag">Now building</span>
        <span className="falcon-now-id">{t.id}</span>
        <span className="falcon-now-title">{t.title}</span>
        <span className="falcon-now-stage" style={{ color: stageColor }}>
          {stageLabel}
        </span>
      </div>

      <div className="falcon-pipe">
        <div className="falcon-track">
          <div className="falcon-fill" style={{ width: fillW + '%' }} />
        </div>
        <div className={'falcon-packet' + (shipped ? ' ship' : '')} style={{ left: packetLeft + '%' }}>
          {t.id}
        </div>
        {AGENTS.map((a, i) => {
          const isActive = i === stageIdx && stageIdx < AGENTS.length
          const isDone = i < stageIdx
          return (
            <div
              key={a.name}
              className={'falcon-node' + (isActive ? ' active' : '') + (isDone ? ' done' : '')}
              style={{ ['--ac' as string]: a.ac }}
            >
              <div className="falcon-orb">{a.glyph}</div>
              <div className="falcon-name">{a.name}</div>
              <div className="falcon-role">{a.role}</div>
            </div>
          )
        })}
      </div>

      <div className="falcon-lower">
        <div className="falcon-card">
          <div className="falcon-hd">
            <h3>Activity</h3>
            <span className="falcon-spacer" />
            <button className="falcon-btn" onClick={() => setPaused((p) => !p)} aria-label="Pause or resume the demo">
              {paused ? '▶ resume' : '⏸ pause'}
            </button>
          </div>
          <div className="falcon-log">
            {rows.map((r) => (
              <div key={r.key} className={'falcon-row' + (r.ok ? ' ok' : '')}>
                <span className="falcon-t">{r.t}</span>
                <span className="falcon-who" style={{ color: r.color }}>
                  {r.who}
                </span>
                <span className="falcon-msg">{emphasize(r.msg)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="falcon-card falcon-stats">
          <div className="falcon-stat">
            <div className="falcon-k">PRs merged &middot; this week</div>
            <div className="falcon-v cy">{prs}</div>
          </div>
          <div className="falcon-stat">
            <div className="falcon-k">Median cycle time</div>
            <div className="falcon-v pu">
              34<small> min</small>
            </div>
          </div>
          <div className="falcon-stat">
            <div className="falcon-k">Human commits</div>
            <div className="falcon-v gr">
              0<small> &mdash; fully autonomous</small>
            </div>
          </div>
        </div>
      </div>

      <p className="falcon-note">// illustrative, sanitized view of a real workflow</p>
    </section>
  )
}
