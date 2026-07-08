import styles from './kyber-diagram.module.css'

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
