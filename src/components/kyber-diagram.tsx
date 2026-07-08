import styles from './kyber-diagram.module.css'

// Kyber gem logo, embedded as a data URI (matches the mockup's inline asset).
const KYBER_LOGO =
  'data:image/png;base64,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'

type Fleet = { name: string; usage: string; pct: number }

// Per-agent context budget. Bar turns amber at >= 60%, green below.
const FLEET: Fleet[] = [
  { name: 'Yoda', usage: '308k/1M', pct: 31 },
  { name: 'Lando', usage: '343k/1M', pct: 34 },
  { name: 'Han', usage: '578k/1M', pct: 58 },
  { name: 'Chewie', usage: '671k/1M', pct: 67 },
  { name: 'Ackbar', usage: '824k/1M', pct: 82 },
]

type Pod = { name: string; runtime: string; running?: boolean }

// The three agent pods — one per harness, illustrating a harness-agnostic runtime.
const PODS: Pod[] = [
  { name: 'Yoda', runtime: 'Codex' },
  { name: 'Han', runtime: 'Claude Code', running: true },
  { name: 'Chewie', runtime: 'OpenClaw' },
]

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.ci} aria-hidden="true">
      <path
        fill="currentColor"
        d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.27 1.37.18 1.09 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"
      />
    </svg>
  )
}

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.ci} aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.317 4.37a19.79 19.79 0 00-4.885-1.515.074.074 0 00-.079.037 13.6 13.6 0 00-.608 1.25 18.27 18.27 0 00-5.487 0 12.6 12.6 0 00-.617-1.25.077.077 0 00-.079-.037A19.74 19.74 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.2 14.2 0 001.226-1.994.076.076 0 00-.041-.106 13.1 13.1 0 01-1.872-.892.077.077 0 01-.008-.128 10 10 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01q.181.149.373.292a.077.077 0 01-.006.127 12.3 12.3 0 01-1.873.892.077.077 0 00-.041.107 13.9 13.9 0 001.225 1.993.076.076 0 00.084.028 19.84 19.84 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419s.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418m7.975 0c-1.183 0-2.157-1.085-2.157-2.419s.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418"
      />
    </svg>
  )
}

function SlackIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.ci} aria-hidden="true">
      <path
        fill="currentColor"
        d="M5.042 15.165a2.528 2.528 0 01-2.52 2.523A2.528 2.528 0 010 15.165a2.527 2.527 0 012.522-2.52h2.52zM6.313 15.165a2.527 2.527 0 012.521-2.52 2.527 2.527 0 012.521 2.52v6.313A2.528 2.528 0 018.834 24a2.528 2.528 0 01-2.521-2.522zM8.834 5.042a2.528 2.528 0 01-2.521-2.52A2.528 2.528 0 018.834 0a2.528 2.528 0 012.521 2.522v2.52zM8.834 6.313a2.528 2.528 0 012.521 2.521 2.528 2.528 0 01-2.521 2.521H2.522A2.528 2.528 0 010 8.834a2.528 2.528 0 012.522-2.521zM18.956 8.834a2.528 2.528 0 012.522-2.521A2.528 2.528 0 0124 8.834a2.528 2.528 0 01-2.522 2.521h-2.522zM17.688 8.834a2.528 2.528 0 01-2.523 2.521 2.527 2.527 0 01-2.52-2.521V2.522A2.527 2.527 0 0115.165 0a2.528 2.528 0 012.523 2.522zM15.165 18.956a2.528 2.528 0 012.523 2.522A2.528 2.528 0 0115.165 24a2.527 2.527 0 01-2.52-2.522v-2.522zM15.165 17.688a2.527 2.527 0 01-2.52-2.523 2.526 2.526 0 012.52-2.52h6.313A2.527 2.527 0 0124 15.165a2.528 2.528 0 01-2.522 2.523z"
      />
    </svg>
  )
}

export function KyberDiagram() {
  return (
    <div className={styles.wrap}>
      <div className={styles.stage}>
        {/* operator */}
        <div className={`${styles.op} ${styles.card}`}>
          <span className={styles.who}>&#x1F464; You</span>
          <span className={styles.lbl}>talk to agents over</span>
          <span className={`${styles.chip} ${styles.tg}`}>
            <TelegramIcon />
            Telegram
          </span>
          <span className={`${styles.chip} ${styles.dc}`}>
            <DiscordIcon />
            Discord
          </span>
          <span className={`${styles.chip} ${styles.sl}`}>
            <SlackIcon />
            Slack
          </span>
        </div>

        <div className={`${styles.conn} ${styles.both}`} aria-hidden="true" />
        <div className={styles.connlbl}>drive &amp; watch the fleet</div>

        {/* Kyber UI window */}
        <div className={`${styles.kyui} ${styles.card}`}>
          <div className={styles.kyuiBar}>
            <span className={styles.dots}>
              <i />
              <i />
              <i />
            </span>
            <img className={styles.klogo} src={KYBER_LOGO} alt="Kyber logo" />
            <span className={styles.ttl}>
              <b>Kyber</b> &mdash; Agent Fleet Platform
            </span>
            <span className={styles.tabs}>
              <span className={styles.tab}>Fleet</span>
              <span className={`${styles.tab} ${styles.on}`}>Terminal</span>
            </span>
          </div>
          <div className={styles.kyuiBody}>
            <div className={styles.kyuiFleet}>
              <p className={styles.kyuiCap}>Agents &middot; context budget</p>
              {FLEET.map((f) => {
                const amber = f.pct >= 60
                return (
                  <div key={f.name} className={styles.brow}>
                    <div className={styles.bt}>
                      <span className={styles.bn}>{f.name}</span>
                      <span className={styles.bu}>{f.usage}</span>
                      <span className={`${styles.bp} ${amber ? styles.am : styles.gr}`}>{f.pct}%</span>
                    </div>
                    <div className={styles.bar}>
                      <span
                        className={styles.bf}
                        style={{
                          width: `${f.pct}%`,
                          background: amber ? 'var(--amber)' : 'var(--green)',
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className={styles.kyuiTerm}>
              <div className={styles.termTop}>
                &#x2B24; <span className={styles.agent}>agent: Han</span> &middot; claude-code
              </div>
              <pre className={styles.t}>
                <span className={styles.m}>~/dev/snapdex on </span>
                <span className={styles.c}>main</span>
                {'\n'}
                <span className={styles.p}>{'●'}</span> Implementing{' '}
                <span className={styles.c}>SNAP-142</span> &middot; streak counter{'\n'}
                {'  '}
                <span className={styles.m}>{'⎜'} edited profile.tsx, streak.ts</span>
                {'\n'}
                <span className={styles.p}>{'●'}</span> Bash
                <span className={styles.m}>(npm test)</span>
                {'\n'}
                {'  '}
                <span className={styles.m}>{'⎜'}</span>{' '}
                <span className={styles.p}>14 passed</span>
                {'\n'}
                <span className={styles.p}>{'●'}</span> Opened PR{' '}
                <span className={styles.c}>#487</span> &rarr; review:{' '}
                <span className={styles.pk}>Chewie</span>
                {'\n'}
                <span className={styles.a}>{'✓'}</span> approved &middot; deploying&hellip;{' '}
                <span className={styles.cursor} />
              </pre>
            </div>
          </div>
        </div>

        <div className={`${styles.conn} ${styles.both}`} aria-hidden="true" />
        <div className={styles.connlbl}>API / Webhook &middot; interact with the control plane</div>

        {/* control plane — OUTSIDE the cluster */}
        <div className={`${styles.cp} ${styles.card}`}>
          &#x2B22; <b>Control plane</b> &middot; reconciles agents &middot; heals pods
        </div>
        <div className={`${styles.conn} ${styles.dn}`} aria-hidden="true" />
        <div className={styles.connlbl}>reconcile</div>

        {/* Kubernetes cluster with the agent pods */}
        <div className={styles.cluster}>
          <span className={styles.cltab}>Kubernetes cluster</span>
          <span className={styles.gw}>&#x21C5; API / Webhook</span>
          <div className={styles.pods}>
            {PODS.map((pod) => (
              <div key={pod.name} className={`${styles.mpod} ${pod.running ? styles.running : ''}`}>
                <div className={styles.mpodBar}>
                  <i />
                  <i />
                  <i />
                  <span className={styles.pname}>{pod.name} &middot; pod</span>
                  {pod.running && <b className={styles.run}>&#x25CF; running</b>}
                </div>
                <div className={styles.mpodBody}>
                  <div className={`${styles.srow} ${styles.main}`}>
                    <span className={styles.sq} style={{ background: 'var(--cyan)' }} />
                    agent<span className={styles.stag}>{pod.runtime}</span>
                  </div>
                  <div className={styles.srow}>
                    <span className={styles.sq} style={{ background: 'var(--purple)' }} />
                    memory
                  </div>
                  <div className={styles.srow}>
                    <span className={styles.sq} style={{ background: 'var(--green)' }} />
                    status
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
