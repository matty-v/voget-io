#!/usr/bin/env node
// Builds a SANITIZED board feed from the (private) Snapdex repo.
//
// Trust boundary: reads a private repo but emits ONLY public-safe fields —
// issue number, derived column, assigned agent, coarse tag. Never emits titles,
// bodies, or branch names. Output: public/data/board.json.
//
// Shows only issues that have an `agent:<name>` label (real agent work); drafts
// and unassigned issues are ignored. The Shipped column is the last 5 closed
// agent issues. PRs are not shown (they carry no agent attribution).
//
// Run:  GH_TOKEN=<token with read access> node scripts/build-board.mjs

import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const REPO = process.env.BOARD_REPO || 'matty-v/snapdex'
const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN
const OUT = 'public/data/board.json'

if (!TOKEN) {
  console.error('build-board: no GH_TOKEN/GITHUB_TOKEN in env')
  process.exit(1)
}

async function gh(path) {
  const res = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github+json', 'User-Agent': 'voget-io-board' },
  })
  if (!res.ok) throw new Error(`GitHub ${path} -> ${res.status}`)
  return res.json()
}

const names = (labels) => (labels || []).map((l) => (typeof l === 'string' ? l : l.name))
const agentOf = (labels) => (names(labels).find((n) => n.startsWith('agent:')) || '').replace('agent:', '') || null
const tagOf = (labels) => {
  const n = names(labels)
  if (n.includes('bug')) return 'bug'
  if (n.includes('deploy:required')) return 'deploy'
  return 'feature'
}
const cap = (a, n) => a.slice(0, n)

function build(openIssues, closedIssues) {
  const cols = { triage: [], building: [], review: [] }
  const agents = new Set()
  const card = (it) => {
    const a = agentOf(it.labels)
    if (a) agents.add(a)
    return { id: String(it.number), kind: 'issue', agent: a, tag: tagOf(it.labels) }
  }

  // open, agent-assigned issues → column by state (drafts/unassigned ignored)
  for (const it of openIssues) {
    if (it.pull_request || !agentOf(it.labels)) continue
    const lbl = names(it.labels)
    if (lbl.includes('deploy:required')) cols.review.push(card(it))
    else if (lbl.includes('ready-for-implementation')) cols.building.push(card(it))
    else cols.triage.push(card(it))
  }

  // Shipped = the last 5 closed, agent-assigned issues (most recent first)
  const shipped = closedIssues
    .filter((it) => !it.pull_request && agentOf(it.labels))
    .sort((a, b) => Date.parse(b.closed_at || 0) - Date.parse(a.closed_at || 0))
    .slice(0, 5)
    .map(card)

  const board = {
    generatedAt: new Date().toISOString(),
    repo: REPO.split('/')[1],
    columns: [
      { key: 'triage', name: 'Triage', cards: cap(cols.triage, 6) },
      { key: 'building', name: 'Building', cards: cap(cols.building, 6) },
      { key: 'review', name: 'In review', cards: cap(cols.review, 6) },
      { key: 'shipped', name: 'Shipped', cards: shipped },
    ],
    stats: { agents: agents.size },
  }
  mkdirSync(dirname(OUT), { recursive: true })
  writeFileSync(OUT, JSON.stringify(board, null, 2) + '\n')
  const total = board.columns.reduce((s, c) => s + c.cards.length, 0)
  console.log(`build-board: wrote ${OUT} — ${total} cards across ${board.columns.length} columns, ${board.stats.agents} agents`)
}

const [openIssues, closedIssues] = await Promise.all([
  gh('/issues?state=open&sort=updated&direction=desc&per_page=60'),
  gh('/issues?state=closed&sort=updated&direction=desc&per_page=30'),
])
build(openIssues, closedIssues)
