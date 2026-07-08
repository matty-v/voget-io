# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`voget-io` is a single-page personal portfolio site (voget.io) built with Vite + React 19 + TypeScript + Tailwind CSS v3, deployed to Firebase Hosting.

## Commands

```bash
npm run dev          # Vite dev server at http://localhost:5173
npm run build        # tsc -b (typecheck) then vite build → dist/
npm run lint         # ESLint over the repo
npm run test         # Vitest in watch mode
npm run test:run     # Vitest once (used in CI)
npm run test:ui      # Vitest UI
npm run test:e2e     # Playwright e2e (starts dev server automatically)
npm run deploy       # build + firebase deploy (manual; CI normally deploys)
```

Run a single unit test: `npx vitest run src/components/ui/button.test.tsx` (or `npx vitest -t "name"` to filter by test name).
Run a single e2e test: `npx playwright test e2e/home.spec.ts --project=chromium`.

There is no combined "typecheck" script — `npm run build` typechecks via `tsc -b`, and CI runs `npx tsc --noEmit` separately.

## Architecture

- **Client-side routing is hand-rolled** in `src/App.tsx` using the History API (`pushState` + `popstate`) and a `page` state variable — there is no router library. Adding a route means adding a `case` to the `renderContent()` switch and a link that calls the `navigate` helper. Firebase's `rewrites` (in `firebase.json`) send all paths to `index.html` so deep links resolve to the SPA. Routes today: `home`, `privacy`, `terms`.
- **Page content is data-driven** where possible — e.g. the `projects` array near the top of `App.tsx` drives the Projects section. Update that array to change showcased work.
- **UI components follow shadcn/ui conventions** under `src/components/ui/` (`button.tsx`, `card.tsx`): `class-variance-authority` (`cva`) for variants, and the `cn()` helper in `src/lib/utils.ts` (`clsx` + `tailwind-merge`) for className composition. Prefer this pattern for new UI primitives.
- **Import alias**: `@/` maps to `src/` — configured in three places that must stay in sync: `vite.config.ts`, `vitest.config.ts`, and `tsconfig.app.json`.
- **Design system** lives in `src/index.css` as CSS custom properties (`--accent-cyan`, `--accent-purple`, `--accent-pink`, `--bg-primary`, etc.) plus glow/particle/grid background effects. Components reference these via arbitrary-value Tailwind classes like `bg-[var(--accent-cyan)]`. Tailwind theme tokens are in `tailwind.config.js`.

## Testing

- **Unit tests** (Vitest, jsdom, Testing Library): colocated as `*.test.tsx` next to components; global setup in `src/test/setup.ts`. `globals: true` so `describe/it/expect` need no import.
- **E2E tests** (Playwright): in `e2e/`. Config runs chromium/firefox/webkit locally and auto-starts `npm run dev`.

## Deployment

- Firebase Hosting, project `kinetic-object-322814`, hosting target/site `voget-io` (see `.firebaserc` and `firebase.json`; static output from `dist/`).
- **CI/CD** (`.github/workflows/`): push to `main` → `deploy.yml` (typecheck, lint, build, deploy to live channel). PRs → `test.yml` (unit + e2e) and `preview.yml` (deploy to a temporary Firebase preview channel, cleaned up on PR close). All pipelines run typecheck + lint + build, so keep those green before pushing.

## Conventions

- `react-refresh/only-export-components` is enforced by ESLint. A file that exports React components should not also export non-component values, or the lint fails — see `button.tsx`, where `buttonVariants` is exported with an inline `// eslint-disable-next-line` (the established escape hatch when a variants object must be shared).
