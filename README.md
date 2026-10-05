# B2 WordLab

Тренажер синонімів і словосполучень у контексті для підготовки до іспитів рівня B2 (British English). Пояснення українською.

**B2 vocabulary trainer for English exam preparation — synonyms and distractors in context, with explanations in Ukrainian.**

## Features

- **175 questions** across 4 practice modes + a mixed 10-question sprint:
  - Synonyms in context (30) — incl. British vs American English
  - Distractor hunt / odd one out (25) — built on the collocations database
  - Gap fill (86) — make/do, say/tell, borrow/lend, false friends, idioms, phrasal verbs
  - Preposition trap (34) — fixed phrases from the database
- **Instant checking** with per-option explanations in Ukrainian
- **Collocations database** — 179 headwords ("Phrases and collocations database", pp. 203–207), searchable
- **Progress tracking** — accuracy, streaks, per-mode records (localStorage)
- Fully responsive (mobile + desktop), British English content

## Tech stack

React 19 · TypeScript · Vite 7 · Tailwind CSS 3 · React Router 7

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # outputs to dist/
npm run preview # serve the production build locally
```

## Deploy to Vercel

The repo includes `vercel.json` with an SPA rewrite (all routes → `index.html`), so it works out of the box:

```bash
# Option 1: Vercel dashboard — "Import Project" from GitHub, framework: Vite (auto-detected)

# Option 2: CLI
npm i -g vercel
vercel
```

Build command: `npm run build` · Output directory: `dist`
