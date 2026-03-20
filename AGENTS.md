# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Next.js, localhost:3000)
npm run build     # Production build
npm run lint      # ESLint
npm run start     # Start production server (after build)
```

There is no test command configured. TypeScript build errors are suppressed (`ignoreBuildErrors: true` in `next.config.mjs`) — use `tsc --noEmit` to manually typecheck.

## What This Project Is

**Recallio** — an AI tutor web app for students, built for the hackathon theme "AI Agents That Learn Using Hindsight." The full product spec is in `CONTEXT/CONTEXT_DOC.MD` (read it before working on any feature). The `CONTEXT/DESIGN_SYSTEM.MD` file contains the target CSS variable tokens and font configuration for the dark-first Recallio UI.

The code currently contains only a **landing page** (`app/page.tsx` assembles components from `components/landing/`). The actual Recallio app routes (`/login`, `/onboarding`, `/planner`, `/mentor`, `/tests`, `/profile`, `/memory`) are entirely unbuilt.

## Architecture

### Stack
- **Next.js 16** with App Router and React Server Components enabled (`"rsc": true` in `components.json`)
- **React 19**
- **Tailwind CSS v4** — uses `@import 'tailwindcss'` in `app/globals.css` (no `tailwind.config.ts` file)
- **shadcn/ui** (new-york style) — all primitive components live in `components/ui/`
- **Groq LLM** (`qwen3-32b`) — chat, question generation, PDF parsing
- **Hindsight Cloud (Vectorize)** — the core differentiator; persistent per-user memory via `retain()`, `recall()`, `reflect()`
- **Mock auth** — `localStorage` only; no real auth system

### Planned Route Structure
```
/                    Landing page
/login               Name input + demo user pills → sets localStorage userId
/onboarding          8-step flow (Duolingo-style, tap-to-select cards)
/planner             Chat + Calendar + Scheduler (default post-login)
/mentor              Subject grid
/mentor/[subject]    3-panel: Sources · Chat · Studio
/tests               MCQ test interface
/profile             Proficiency bars + test history
/memory              Full Hindsight memory panel (also a sidebar drawer)
```

### Hindsight Memory System
Each user gets an isolated memory bank: `bankId = user_${userId}`. Three operations power all personalisation:
- **`retain(bankId, content)`** — write a natural-language event to memory (fires after quizzes, Pomodoro check-ins, schedule changes, onboarding, re-explain signals)
- **`recall(bankId, query)`** — retrieve relevant memories; injected into system prompts before every LLM call
- **`reflect(bankId, question)`** — synthesise qualitative insights from accumulated memory; used for Daily Briefing Card, profile insights, test result commentary

The Memory Panel (`/memory`) is the primary judge-facing demo screen — it renders all 4 Hindsight memory types (World, Experiences, Observations, Opinions) and is the proof that the AI learned.

### API Routes (to be created under `app/api/`)
| Route | Purpose |
|---|---|
| `/api/onboarding/parse-syllabus` | PDF text → subjects + chapters JSON via Groq |
| `/api/onboarding/generate-test` | Subject + chapters → 6 adaptive pre-test questions |
| `/api/planner/chat` | recall() → Groq → response + schedule diff |
| `/api/mentor/chat` | Subject-specific AI tutor with Hindsight context |
| `/api/mentor/generate-quiz` | Quiz targeting weak areas from recall() |
| `/api/mentor/flashcards` | Topic content → flashcard pairs |
| `/api/mentor/summary` | Topic content → written summary |
| `/api/memory/retain` | Proxy to Hindsight retain() |
| `/api/memory/recall` | Proxy to Hindsight recall() |
| `/api/memory/reflect` | Proxy to Hindsight reflect() |

### Mock Auth Pattern
```ts
// On login:
const userId = `user_${name.toLowerCase()}_${Date.now()}`
localStorage.setItem('recallio_userId', userId)
// → if Hindsight has onboarding data for this userId: redirect /planner
// → else: redirect /onboarding
```
Two pre-seeded demo users should exist in Hindsight: **Aryan** (3 weeks of rich memory) and **Priya** (early-stage, minimal memory) — used for live demos.

### Proficiency Calculation
- Phase 1 (no tests): 100% × onboarding self-assessment
- Phase 2 (1–2 tests): 30% × onboarding + 70% × test average, labelled "Early estimate"
- Phase 3 (3+ tests): 30% × onboarding + 70% × test average

## Design System

### Current Landing Page Tokens (`app/globals.css`)
- **Palette**: Neutral/warm light-only theme (`oklch` values)
- **Fonts**: `Instrument Sans` (sans/body), `Instrument Serif` (display — use class `.font-display`), `JetBrains Mono` (mono)
- **Custom utilities**: `.font-display`, `.text-stroke`, `.marquee` / `.marquee-reverse`, `.noise-overlay`, `.hover-lift`, `.letter-spin`, `.animate-char-in`, `.border-sketch`, `.line-reveal`

### Target Recallio UI (from `CONTEXT/DESIGN_SYSTEM.MD`)
The actual app must use a **dark-first** design:
- Background `#0D0D0F`, surfaces `#161618` / `#1F1F22`
- Primary accent: `#7C6AF5` violet
- Secondary: `#F5A524` amber (XP/streak), `#17C964` green (success), `#F31260` red (error)
- Fonts: **Plus Jakarta Sans** (sans), **Lora** (serif), **Roboto Mono** (mono) — replace the current Instrument fonts in `layout.tsx`
- Border radius: cards `12px`, buttons `8px`, pills `20px`
- The `CONTEXT/DESIGN_SYSTEM.MD` contains the complete CSS variable block ready to paste into `globals.css`

### shadcn/ui Configuration
- Style: `new-york`, base color: `neutral`, CSS variables: `true`
- Add components: `npx shadcn@latest add <component-name>`
- Path alias `@/` resolves to the project root (e.g. `@/components/ui/button`)
- `cn()` utility is at `lib/utils.ts`

## Key Constraints
- `next.config.mjs` has `images: { unoptimized: true }` — safe for Vercel free tier
- Landing page components (`components/landing/`) are a placeholder/template for "Optimus" branding; the actual Recallio app UI will be built separately in new route folders
- `@react-three/fiber` and `three` are installed (used for `AnimatedSphere` / `AnimatedTetrahedron` on the landing page); note `expo`, `expo-gl`, `react-native` are also in `package.json` but are not used — they can be removed
