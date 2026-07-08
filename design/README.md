# Design mockups

Approved section mockups for the voget.io revamp (self-contained HTML, not part of the build).
These are the spec — port them into `src/` React components + wire live data when building.

- `kyber-section.mockup.html` — APPROVED Kyber section (2026-07-08): operator comms → Kyber UI
  panel (fleet context-budget bars + Claude Code terminal) → control plane outside the cluster,
  API/Webhook boundary, harness-diverse pods (Codex/Claude Code/OpenClaw), Han running.
  To build: enhanced-B diagram, then the full live fleet console ("Option A") below it.
- `kyber-directions.mockup.html` — the four original directions (A fleet console / B architecture /
  C how-it-works / D capabilities) for reference.
- `falcon-team-section.mockup.html` — APPROVED Falcon Dev Team section (2026-07-08): a vertical
  "one issue flows through the team" graphic — Issue → Lando → Yoda → Obi-Wan → Han → Chewie →
  Boba-Fett → Ackbar → Merged & deployed. Each agent = glyph + name + role + a "what they do" line
  + real skills as slash-command chips (no star).
