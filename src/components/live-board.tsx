import { useEffect, useState } from 'react'
import styles from './live-board.module.css'

// Public sanitized feed, regenerated in-cluster every 30 min and uploaded to GCS.
const FEED_URL = 'https://storage.googleapis.com/voget-io-live/board.json'

type Shipped = { repo: string; id: string; date: string }
type Board = {
  generatedAt?: string
  allTimeShipped: number
  weeklyThroughput: number
  /**
   * Total tokens the team consumed per shipped issue, over a rolling 7 days.
   *
   * This replaced a dollar figure. The agents run on a Claude subscription, not
   * per-token API billing, so pricing their tokens produced a number that read
   * as money and wasn't. Tokens are what we actually measure, so tokens are what
   * we show.
   *
   * Optional because the feed briefly served only the old field; the fallback
   * below covers the gap. Safe to make required once a deployed feed has carried
   * it for a full cache cycle.
   */
  tokensPerIssue?: number
  /**
   * What the last 7 days of team activity WOULD cost at Anthropic's published
   * API rates. The fleet runs on a Claude subscription, so this is a
   * cost-to-produce figure, not an invoice — every surface that shows it has to
   * say so, or it's misleading.
   */
  costPerIssue?: number
  weeklyCost?: number
  outputTokensPerIssue?: number
  lastShipped: Shipped[]
  weeklyShipped: number[]
}

/**
 * Last-known-good feed from localStorage, or the first-visit fallback.
 * Never throws — a blocked or corrupt store just means we start from FALLBACK.
 */
function readCachedBoard(): Board {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY)
    if (!raw) return FALLBACK
    const cached = JSON.parse(raw) as Board
    return cached && typeof cached.allTimeShipped === 'number' ? cached : FALLBACK
  } catch {
    return FALLBACK
  }
}

/** 98_958_000 → "99M". Tokens run to billions; raw digits are unreadable. */
function formatTokens(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `${Math.round(n / 1e6)}M`
  if (n >= 1e3) return `${Math.round(n / 1e3)}K`
  return String(n)
}

/** 253032 → "$253K". */
function formatUsd(n: number): string {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `$${Math.round(n / 1e3)}K`
  return `$${Math.round(n)}`
}

// localStorage key for the last successful feed (last-known-good), so a returning
// visitor — or one whose fetch fails — sees recent real numbers instead of a stale
// hardcoded snapshot that never moves.
// Bumped v1 → v2 when the cost tile became a token tile. A cached v1 payload has
// no tokensPerIssue, so a returning visitor would render the static fallback until
// the first fetch landed. Changing the key retires those entries outright.
const CACHE_KEY = 'voget-board-v2'

// First-visit fallback (used only before the very first successful fetch, when there's
// no cached last-known-good yet). Kept roughly current so even this never shows a wildly
// stale number; the live feed + the localStorage cache take over immediately after.
const FALLBACK: Board = {
  allTimeShipped: 207,
  weeklyThroughput: 36,
  tokensPerIssue: 99_000_000,
  costPerIssue: 63,
  weeklyCost: 4_866,
  lastShipped: [
    { repo: 'snapdex', id: '548', date: 'Jul 13' },
    { repo: 'snapdex', id: '547', date: 'Jul 13' },
    { repo: 'snapdex', id: '543', date: 'Jul 13' },
    { repo: 'snapdex', id: '539', date: 'Jul 13' },
    { repo: 'snapdex', id: '526', date: 'Jul 13' },
  ],
  weeklyShipped: [12, 57, 70, 29, 36], // oldest -> newest
}

// Build the line/area chart geometry from the weekly values (viewBox 0 0 300 118).
function chartGeometry(values: number[]) {
  const n = Math.max(values.length, 1)
  const max = Math.max(...values, 1)
  const step = n > 1 ? 280 / (n - 1) : 0
  const pts = values.map((v, i) => [10 + i * step, 95 - (v / max) * 80] as const)
  const line = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const last = pts[pts.length - 1] ?? [10, 94]
  const first = pts[0] ?? [10, 94]
  const area = `M${line.replace(/ /g, ' L')} L${last[0].toFixed(1)},94 L${first[0].toFixed(1)},94 Z`
  return { pts, line, area }
}

function updatedAgo(iso?: string): string {
  if (!iso) return ''
  const ms = Date.now() - Date.parse(iso)
  if (!Number.isFinite(ms) || ms < 0) return ''
  const m = Math.floor(ms / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  return h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`
}

export function LiveBoard({ onNavigate }: { onNavigate?: (e: React.MouseEvent<HTMLAnchorElement>, path: string) => void }) {
  // Start from the last successful fetch (better than a stale hardcoded snapshot)
  // while the live feed loads or if it's unreachable.
  //
  // Read via a lazy initializer rather than inside the effect: a synchronous
  // setState in an effect body causes a cascading re-render, which the
  // react-hooks/set-state-in-effect lint rule rejects. The initializer runs once,
  // before first paint, so there's no second render and no flash of fallback data.
  // This app renders client-side only, so there's no hydration mismatch to guard.
  const [board, setBoard] = useState<Board>(readCachedBoard)
  const [live, setLive] = useState(false)

  useEffect(() => {
    let active = true
    const load = () => {
      fetch(FEED_URL, { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
        .then((d: Board) => {
          if (!active || !d || typeof d.allTimeShipped !== 'number') return
          setBoard(d)
          setLive(true)
          try {
            window.localStorage.setItem(CACHE_KEY, JSON.stringify(d))
          } catch {
            /* ignore — no/blocked localStorage */
          }
        })
        .catch(() => {
          /* keep last-known-good (cache) or the first-visit fallback */
        })
    }
    load()
    const t = setInterval(load, 5 * 60 * 1000) // refresh view every 5 min
    return () => {
      active = false
      clearInterval(t)
    }
  }, [])

  const geo = chartGeometry(board.weeklyShipped)
  const ago = updatedAgo(board.generatedAt)
  // Fall back per-field: an older cached payload may carry some of these and not
  // others, and a half-rendered economics block is worse than a slightly stale one.
  const weeklyCost = board.weeklyCost ?? FALLBACK.weeklyCost!
  const tokensPerIssue = board.tokensPerIssue ?? FALLBACK.tokensPerIssue!
  const outputTokens = board.outputTokensPerIssue ?? 247_000

  return (
    <section className={`py-10 ${styles.wrap}`}>
      {onNavigate && (
        <a href="/" onClick={(e) => onNavigate(e, '/')} className={styles.back}>
          &larr; Home
        </a>
      )}

      <div className={styles.head}>
        <h1>
          <span className={styles.glow}>Falcon Dev Team</span> Dashboard
        </h1>
        <span className={styles.live}>
          <span className={styles.liveDot} />
          {live ? 'live' : 'snapshot'}
        </span>
        <span className={styles.updated}>snapdex{ago ? ` · updated ${ago}` : ''}</span>
      </div>

      {/* 1,2,3 — KPI row */}
      <div className={`${styles.grid} ${styles.kpis}`}>
        <div className={`${styles.kpi} ${styles.card}`}>
          <div className={styles.kpiLabel}>Issues shipped &middot; all&#8209;time</div>
          <div className={`${styles.kpiValue} ${styles.cy}`}>{board.allTimeShipped}</div>
          <div className={styles.kpiSub}>since the team came online</div>
        </div>
        <div className={`${styles.kpi} ${styles.card}`}>
          <div className={styles.kpiLabel}>Weekly throughput</div>
          <div className={`${styles.kpiValue} ${styles.gr}`}>
            {board.weeklyThroughput}
            <small> / wk</small>
          </div>
          <div className={styles.kpiSub}>last 7 days</div>
        </div>
        <div className={`${styles.kpi} ${styles.card}`}>
          <div className={styles.kpiLabel}>Cost / issue</div>
          <div className={`${styles.kpiValue} ${styles.am}`}>
            {formatUsd(board.costPerIssue ?? FALLBACK.costPerIssue!)}
          </div>
          <div className={styles.kpiSub}>at published API rates</div>
        </div>
      </div>

      {/*
        The economics claim. Deliberately structured so every number is followed
        by the thing that qualifies it — a peer audience will poke at this, and
        the qualifiers are what make it hold up rather than what weakens it.
      */}
      <div className={`${styles.card} ${styles.econ}`}>
        <div className={styles.econLead}>
          Eight agents running a full SDLC — triage, architecture, implementation, review, deploy.
        </div>
        <div className={styles.econFigures}>
          <div>
            <strong>{formatUsd(weeklyCost)}</strong>
            <span> / week</span>
          </div>
          <div>
            <strong>{formatUsd(weeklyCost * 52)}</strong>
            <span> / year run&#8209;rate</span>
          </div>
          <div>
            <strong>{board.weeklyThroughput}</strong>
            <span> issues / week</span>
          </div>
        </div>
        <div className={styles.econClaim}>
          Roughly one senior engineer&rsquo;s fully&#8209;loaded cost — for the output of a team.
          <strong> One human reviews and merges every change.</strong>
        </div>

        <details className={styles.method}>
          <summary>How this is measured</summary>
          <ul>
            <li>
              Every assistant message the eight agents produced in the last 7 days, priced at
              Anthropic&rsquo;s <em>published</em> API rates for the model that actually produced it
              (Opus-tier $5/$25 per million in/out, cache reads 0.1&times;, cache writes 1.25&times;).
            </li>
            <li>
              <strong>This is a cost-to-produce figure, not a bill.</strong> The agents run on a
              Claude subscription, so nobody was invoiced this — it&rsquo;s what the same work would
              cost billed per token.
            </li>
            <li>
              It counts <em>everything</em>: triage, architecture, code review, deploy verification,
              scheduled jobs, and work that never shipped — divided only by issues that did ship. An
              upper bound on cost-per-issue, not a best case.
            </li>
            <li>
              About 99% of the tokens are cache reads — context re-sent on each turn. They bill at a
              tenth of input rate but there are a great many, so they dominate. Included because on
              the API you would genuinely pay them. ({formatTokens(tokensPerIssue)} tokens per issue,{' '}
              {formatTokens(outputTokens)} of it newly generated.)
            </li>
            <li>
              The year figure is a <em>run-rate</em> — the current 7-day rate annualised, not a year
              of measured history. Cost data is only trustworthy from 21 July 2026, when a gap in the
              transcript archive was fixed.
            </li>
            <li>
              An earlier version of this figure counted the same message more than once, because the
              archive stores overlapping snapshots. Fixed 26 July 2026; messages are now deduplicated
              by their API message id.
            </li>
          </ul>
        </details>
      </div>

      {/* last shipped + rolling weekly */}
      <div className={`${styles.grid} ${styles.row2}`}>
        <div className={styles.card}>
          <div className={styles.wtitle}>Last 5 shipped</div>
          <div className={styles.ship}>
            {board.lastShipped.map((s) => (
              <div key={s.repo + s.id} className={styles.srow}>
                <span className={styles.srepo}>{s.repo}</span>
                <span className={styles.sid}>#{s.id}</span>
                <span className={styles.sdate}>{s.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.wtitle}>
            Shipped per week <span className={styles.sub}>last 5 weeks</span>
          </div>
          <div className={styles.lg}>
            <svg
              viewBox="0 0 300 118"
              preserveAspectRatio="none"
              role="img"
              aria-label={`Issues shipped per week over the last five weeks: ${board.weeklyShipped.join(', ')}`}
            >
              <defs>
                <linearGradient id="lgfill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity=".28" />
                  <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* faint gridlines */}
              <line x1="10" y1="18" x2="290" y2="18" stroke="rgba(100,150,255,.08)" strokeWidth="1" />
              <line x1="10" y1="56" x2="290" y2="56" stroke="rgba(100,150,255,.08)" strokeWidth="1" />
              <line x1="10" y1="94" x2="290" y2="94" stroke="rgba(100,150,255,.10)" strokeWidth="1" />
              {/* area */}
              <path d={geo.area} fill="url(#lgfill)" />
              {/* line */}
              <polyline
                points={geo.line}
                fill="none"
                stroke="var(--accent-cyan)"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 5px rgba(0,212,255,.5))' }}
              />
              {/* dots */}
              {geo.pts.map(([x, y], i) => {
                const isLast = i === geo.pts.length - 1
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={isLast ? 3.4 : 2.6}
                    fill={isLast ? 'var(--accent-cyan)' : 'var(--bg-primary)'}
                    stroke={isLast ? 'var(--bg-primary)' : 'var(--accent-cyan)'}
                    strokeWidth={isLast ? 1.5 : 1.8}
                    style={isLast ? { filter: 'drop-shadow(0 0 6px var(--accent-cyan))' } : undefined}
                  />
                )
              })}
            </svg>
            <div className={styles.lgx}>
              <span>5w</span>
              <span>4w</span>
              <span>3w</span>
              <span>2w</span>
              <span>now</span>
            </div>
          </div>
        </div>
      </div>

      <p className={styles.note}>// real data from the Snapdex repo + agent token usage, sanitized &middot; refreshes every 30 min</p>
    </section>
  )
}
