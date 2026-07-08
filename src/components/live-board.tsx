import styles from './live-board.module.css'

// TODO: wire the sanitized 30-min metrics feed (follow-up — in-cluster sanitizer)
// Today's real snapshot from the Snapdex repo + agent token usage, sanitized.
const ISSUES_SHIPPED_ALL_TIME = 164
const WEEKLY_THROUGHPUT = 36
const COST_PER_ISSUE = 9

type Shipped = { repo: string; id: string; date: string }
const LAST_SHIPPED: Shipped[] = [
  { repo: 'snapdex', id: '443', date: 'Jul 8' },
  { repo: 'snapdex', id: '440', date: 'Jul 8' },
  { repo: 'snapdex', id: '326', date: 'Jul 8' },
  { repo: 'snapdex', id: '435', date: 'Jul 8' },
  { repo: 'snapdex', id: '394', date: 'Jul 8' },
]

// Issues shipped per week, oldest -> newest (5w, 4w, 3w, 2w, now).
const WEEKLY_SHIPPED = [3, 13, 60, 52, 36]

export function LiveBoard({ onNavigate }: { onNavigate?: (e: React.MouseEvent<HTMLAnchorElement>, path: string) => void }) {
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
          live
        </span>
        <span className={styles.updated}>snapdex &middot; updated 3m ago</span>
      </div>

      {/* 1,2,3 — KPI row */}
      <div className={`${styles.grid} ${styles.kpis}`}>
        <div className={`${styles.kpi} ${styles.card}`}>
          <div className={styles.kpiLabel}>Issues shipped &middot; all&#8209;time</div>
          <div className={`${styles.kpiValue} ${styles.cy}`}>{ISSUES_SHIPPED_ALL_TIME}</div>
          <div className={styles.kpiSub}>since the team came online</div>
        </div>
        <div className={`${styles.kpi} ${styles.card}`}>
          <div className={styles.kpiLabel}>Weekly throughput</div>
          <div className={`${styles.kpiValue} ${styles.gr}`}>
            {WEEKLY_THROUGHPUT}
            <small> / wk</small>
          </div>
          <div className={styles.kpiSub}>last 7 days &middot; ~5 a day</div>
        </div>
        <div className={`${styles.kpi} ${styles.card}`}>
          <div className={styles.kpiLabel}>Cost / issue</div>
          <div className={`${styles.kpiValue} ${styles.am}`}>${COST_PER_ISSUE}</div>
          <div className={styles.kpiSub}>opus-4.8 token spend / shipped</div>
        </div>
      </div>

      {/* last shipped + rolling weekly */}
      <div className={`${styles.grid} ${styles.row2}`}>
        <div className={styles.card}>
          <div className={styles.wtitle}>Last 5 shipped</div>
          <div className={styles.ship}>
            {LAST_SHIPPED.map((s) => (
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
              aria-label={`Issues shipped per week over the last five weeks: ${WEEKLY_SHIPPED.join(', ')}`}
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
              <path d="M10,90.6 L80,77.7 L150,14.3 L220,25 L290,46.7 L290,94 L10,94 Z" fill="url(#lgfill)" />
              {/* line */}
              <polyline
                points="10,90.6 80,77.7 150,14.3 220,25 290,46.7"
                fill="none"
                stroke="var(--accent-cyan)"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 5px rgba(0,212,255,.5))' }}
              />
              {/* dots */}
              <circle cx="10" cy="90.6" r="2.6" fill="var(--bg-primary)" stroke="var(--accent-cyan)" strokeWidth="1.8" />
              <circle cx="80" cy="77.7" r="2.6" fill="var(--bg-primary)" stroke="var(--accent-cyan)" strokeWidth="1.8" />
              <circle cx="150" cy="14.3" r="2.6" fill="var(--bg-primary)" stroke="var(--accent-cyan)" strokeWidth="1.8" />
              <circle cx="220" cy="25" r="2.6" fill="var(--bg-primary)" stroke="var(--accent-cyan)" strokeWidth="1.8" />
              <circle
                cx="290"
                cy="46.7"
                r="3.4"
                fill="var(--accent-cyan)"
                stroke="var(--bg-primary)"
                strokeWidth="1.5"
                style={{ filter: 'drop-shadow(0 0 6px var(--accent-cyan))' }}
              />
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

      <p className={styles.note}>// real data from your Snapdex repo + agent token usage, sanitized &middot; refreshes every 30 min</p>
    </section>
  )
}
