import { Fragment } from 'react'
import styles from './falcon-team.module.css'

type Agent = { glyph: string; name: string; role: string; does: string; ac: string; skills: string[] }

// Mirrors design/falcon-team-section.mockup.html — one issue traveling top to
// bottom through the team, in handoff order.
const AGENTS: Agent[] = [
  {
    glyph: 'L',
    name: 'Lando',
    role: 'Orchestrator',
    does: 'routes the issue to the right agent',
    ac: 'var(--accent-purple)',
    skills: ['/classify-intent', '/dispatch', '/recover-stalls'],
  },
  {
    glyph: 'Y',
    name: 'Yoda',
    role: 'Product',
    does: 'turns it into clear acceptance criteria',
    ac: 'var(--accent-cyan)',
    skills: ['/triage', '/acceptance-criteria', '/file-spec'],
  },
  {
    glyph: 'O',
    name: 'Obi-Wan',
    role: 'Architect',
    does: 'plans the approach, flags the risks',
    ac: 'var(--accent-cyan)',
    skills: ['/plan', '/spec', '/threat-model'],
  },
  {
    glyph: 'H',
    name: 'Han',
    role: 'Engineer',
    does: 'builds it test-first, opens the PR',
    ac: 'var(--accent-purple)',
    skills: ['/implement', '/tdd', '/test'],
  },
  {
    glyph: 'C',
    name: 'Chewie',
    role: 'Review',
    does: 'reviews for correctness & security',
    ac: 'var(--accent-pink)',
    skills: ['/review', '/security-review'],
  },
  {
    glyph: 'B',
    name: 'Boba-Fett',
    role: 'QA',
    does: 'hunts regressions before ship',
    ac: 'var(--accent-pink)',
    skills: ['/repro-bug', '/perf-test', '/test-e2e'],
  },
  {
    glyph: 'A',
    name: 'Ackbar',
    role: 'Deploy',
    does: "ships to prod & verifies it's live",
    ac: 'var(--accent-green)',
    skills: ['/deploy-to-dev', '/deliver-deploy', '/verify-operational'],
  },
]

/** Decorative connector arrow between flow steps — no semantic content. */
function Conn() {
  return <div className={styles.conn} aria-hidden="true" />
}

export function FalconTeam() {
  return (
    <div className={styles.wrap}>
      <div className={styles.flow}>
        {AGENTS.map((agent, i) => (
          <Fragment key={agent.name}>
            <div className={styles.agent} style={{ ['--ac' as string]: agent.ac }}>
              <div className={styles.ahead}>
                <span className={styles.aglyph}>{agent.glyph}</span>
                <span className={styles.aname}>{agent.name}</span>
                <span className={styles.arole}>{agent.role}</span>
                <span className={styles.adoes}>{agent.does}</span>
              </div>
              <div className={styles.askills}>
                {agent.skills.map((skill) => (
                  <span key={skill} className={styles.skill}>
                    <span className={styles.cmd}>{skill}</span>
                  </span>
                ))}
              </div>
            </div>
            {i < AGENTS.length - 1 && <Conn />}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
