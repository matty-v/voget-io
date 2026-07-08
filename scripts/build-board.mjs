#!/usr/bin/env node
// Builds a SANITIZED live-board feed from the (private) Snapdex repo.
//
// Trust boundary: this reads a private repo but emits ONLY public-safe fields —
// issue/PR number, derived column, assigned agent, and a coarse type tag. It
// never emits titles, bodies, or branch names. Output: public/data/board.json.
//
// Run:  GH_TOKEN=<token with read access> node scripts/build-board.mjs
// In CI: a scheduled workflow runs this and redeploys the data.

import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const REPO = process.env.BOARD_REPO || 'matty-v/snapdex'
const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN
const OUT = 'public/data/board.json'
const RECENT_DAYS = 10

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
  if (n.includes('needs-triage') || n.includes('state:draft')) return 'draft'
  return 'feature'
}
const recent = (iso) => iso && Date.now() - Date.parse(iso) < RECENT_DAYS * 864e5

function main(issues, pulls) {
  const cols = { triage: [], building: [], review: [], shipped: [] }
  let shippedThisWeek = 0
  const agents = new Set()

  // real issues (the issues API also returns PRs; skip those here)
  for (const it of issues) {
    if (it.pull_request) continue
    const lbl = names(it.labels)
    const agent = agentOf(it.labels)
    if (agent) agents.add(agent)
    const card = { id: String(it.number), kind: 'issue', agent, tag: tagOf(it.labels) }
    if (it.state === 'closed') {
      if (recent(it.closed_at)) cols.shipped.push(card)
      continue
    }
    if (lbl.includes('ready-for-implementation') || lbl.includes('deploy:required')) cols.building.push(card)
    else cols.triage.push(card)
  }

  // pull requests
  for (const pr of pulls) {
    const agent = agentOf(pr.labels)
    if (agent) agents.add(agent)
    const card = { id: String(pr.number), kind: 'pr', agent, tag: 'pr' }
    if (pr.merged_at) {
      if (recent(pr.merged_at)) {
        cols.shipped.push(card)
        shippedThisWeek++
      }
    } else if (pr.state === 'open') {
      cols.review.push(card)
    }
  }

  const cap = (a, n) => a.slice(0, n)
  const board = {
    generatedAt: new Date().toISOString(),
    repo: REPO.split('/')[1],
    columns: [
      { key: 'triage', name: 'Triage', cards: cap(cols.triage, 6) },
      { key: 'building', name: 'Building', cards: cap(cols.building, 6) },
      { key: 'review', name: 'In review', cards: cap(cols.review, 6) },
      { key: 'shipped', name: 'Shipped', cards: cap(cols.shipped, 6) },
    ],
    stats: { shippedThisWeek, agents: agents.size },
  }
  mkdirSync(dirname(OUT), { recursive: true })
  writeFileSync(OUT, JSON.stringify(board, null, 2) + '\n')
  const total = board.columns.reduce((s, c) => s + c.cards.length, 0)
  console.log(`build-board: wrote ${OUT} — ${total} cards, ${board.stats.shippedThisWeek} shipped/wk, ${board.stats.agents} agents`)
}

const [issues, pulls] = await Promise.all([
  gh('/issues?state=all&sort=updated&direction=desc&per_page=50'),
  gh('/pulls?state=all&sort=updated&direction=desc&per_page=40'),
])
main(issues, pulls)
