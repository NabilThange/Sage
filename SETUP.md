# Recallio Setup Guide

## What's Been Implemented

### ✅ Feature 1: App Shell, Layout & Route Protection (COMPLETE)
- `app/(app)/layout.tsx` - Authenticated layout with providers
- `components/app/app-shell.tsx` - Layout wrapper with sidebar + memory drawer
- `components/app/app-sidebar.tsx` - Navigation sidebar
- `components/app/protected-route.tsx` - Auth guard with onboarding check
- `providers/auth-provider.tsx` - Auth context (localStorage-based)
- `providers/memory-provider.tsx` - Memory context (Hindsight API wrappers)

### ✅ Feature 2: Mock Auth & Login (COMPLETE)
- `app/(app)/login/page.tsx` - Login page with demo user pills (Aryan, Priya)
- Auth flow: Login → checks onboarding → redirects to `/planner` or `/onboarding`

### ✅ Feature 3: API Routes (COMPLETE)
All 10 API routes have been created:

**Memory APIs:**
- `app/api/memory/retain/route.ts` - Store events in Hindsight
- `app/api/memory/recall/route.ts` - Retrieve relevant memories
- `app/api/memory/reflect/route.ts` - Synthesize insights

**Onboarding APIs:**
- `app/api/onboarding/parse-syllabus/route.ts` - PDF → subjects/chapters JSON
- `app/api/onboarding/generate-test/route.ts` - Generate 6 pre-test questions

**Planner APIs:**
- `app/api/planner/chat/route.ts` - Memory-backed chat for schedule planning

**Mentor APIs:**
- `app/api/mentor/chat/route.ts` - Subject-specific AI tutor
- `app/api/mentor/generate-quiz/route.ts` - Generate quizzes targeting weak areas
- `app/api/mentor/flashcards/route.ts` - Generate flashcard pairs
- `app/api/mentor/summary/route.ts` - Generate topic summaries

**Helper Libraries:**
- `lib/hindsight.ts` - Hindsight SDK wrapper (retain, recall, reflect)
- `lib/groq.ts` - Groq SDK wrapper (chat completion, syllabus parsing)

---

## Setup Instructions

### 1. Install Dependencies

The project already has most dependencies. You may need to add:

```bash
# If using the actual Hindsight SDK (check their docs for package name)
# npm install @hindsight-cloud/sdk

# If using Groq SDK
# npm install groq-sdk
```

### 2. Configure Environment Variables

Copy the example file and add your API keys:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your API keys:

**Single Key (Basic):**
```env
GROQ_API_KEY=your_groq_api_key_here
HINDSIGHT_API_KEY=your_hindsight_api_key_here
HINDSIGHT_API_URL=https://api.hindsight.cloud
```

**Multiple Keys (Recommended for Production):**
```env
# Groq keys - automatic rotation and failover
GROQ_API_KEY_1=your_first_groq_key
GROQ_API_KEY_2=your_second_groq_key
GROQ_API_KEY_3=your_third_groq_key

# Hindsight keys - automatic rotation and failover
HINDSIGHT_API_KEY_1=your_first_hindsight_key
HINDSIGHT_API_KEY_2=your_second_hindsight_key
HINDSIGHT_API_URL=https://api.hindsight.cloud
```

**Key Manager Features:**
- ✅ Automatic rotation through multiple keys (round-robin)
- ✅ Automatic failover when a key fails
- ✅ Temporary blocking of failed keys (1 minute cooldown)
- ✅ Exponential backoff retry logic
- ✅ Real-time key status monitoring

**Get API Keys:**
- Groq: https://console.groq.com/keys
- Hindsight: https://hindsight.cloud (use promo code: `MEMHACK315`)

**Monitor Key Status:**
Visit http://localhost:3000/api/admin/key-status to see real-time status of all keys

### 3. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

---

## What Still Needs to Be Built

### 🔲 Feature 4: Onboarding Flow (8 Steps)
**Priority: HIGH** - This is the next critical feature

Pages to build:
- `app/(app)/onboarding/page.tsx` - Main onboarding flow

Components needed:
- `components/onboarding/onboarding-shell.tsx` - Progress bar + step container
- `components/onboarding/step-name-confirm.tsx`
- `components/onboarding/step-education-level.tsx`
- `components/onboarding/step-curriculum.tsx`
- `components/onboarding/step-semester.tsx`
- `components/onboarding/step-syllabus-upload.tsx`
- `components/onboarding/step-subject-confirm.tsx`
- `components/onboarding/step-topics-known.tsx`
- `components/onboarding/step-profile-reveal.tsx`
- `components/shared/tap-card.tsx` - Reusable selection card
- `components/shared/pill-select.tsx` - Multi-select pills

### 🔲 Feature 5: Planner (Chat + Calendar + Scheduler)
Pages: `app/(app)/planner/page.tsx`

### 🔲 Feature 6: Mentor (Subject Grid + 3-Panel)
Pages: `app/(app)/mentor/page.tsx`, `app/(app)/mentor/[subject]/page.tsx`

### 🔲 Feature 7: Tests (MCQ Interface)
Pages: `app/(app)/tests/page.tsx`

### 🔲 Feature 8: Profile + Memory Panel
Pages: `app/(app)/profile/page.tsx`, `app/(app)/memory/page.tsx`

---

## Current State

### What Works Right Now:
1. ✅ Landing page at `/`
2. ✅ Login at `/login` with demo user pills
3. ✅ Auth protection (redirects to login if not authenticated)
4. ✅ All API routes are ready to receive requests
5. ✅ Memory provider hooks (`useMemory()`) available in any component
6. ✅ Auth provider hooks (`useAuth()`) available in any component

### What Happens When You Test:
1. Visit `/` → See landing page
2. Click "Get Started" → Redirects to `/login`
3. Enter name or click demo pill → Sets userId in localStorage
4. Redirects to `/onboarding` (currently a stub page)

### Next Steps:
1. **Build Feature 4 (Onboarding)** - This is the critical path
2. Once onboarding is complete, users can be redirected to `/planner`
3. Then build Features 5-8 in order

---

## API Testing

You can test the API routes directly:

```bash
# Test memory retain
curl -X POST http://localhost:3000/api/memory/retain \
  -H "Content-Type: application/json" \
  -d '{"userId":"test_user","event":"test","content":"Testing memory retention"}'

# Test memory recall
curl -X POST http://localhost:3000/api/memory/recall \
  -H "Content-Type: application/json" \
  -d '{"userId":"test_user","query":"what do you remember?"}'

# Test planner chat
curl -X POST http://localhost:3000/api/planner/chat \
  -H "Content-Type: application/json" \
  -d '{"userId":"test_user","message":"Help me plan my study schedule"}'

# Check API key status
curl http://localhost:3000/api/admin/key-status
```

---

## Mock Mode

If you don't have API keys yet, the system runs in **mock mode**:
- `lib/hindsight.ts` logs to console instead of calling Hindsight API
- `lib/groq.ts` returns placeholder responses
- This lets you build and test the UI without API dependencies

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React Components (Pages)                            │  │
│  │  - Use useAuth() for user state                      │  │
│  │  - Use useMemory() for retain/recall/reflect         │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Providers (Context)                                 │  │
│  │  - AuthProvider: localStorage userId management      │  │
│  │  - MemoryProvider: Wraps API calls                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    Next.js API Routes                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  /api/memory/*     - Hindsight operations            │  │
│  │  /api/planner/*    - Chat with memory context        │  │
│  │  /api/mentor/*     - Teaching + quiz generation      │  │
│  │  /api/onboarding/* - Syllabus parsing + tests        │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Helper Libraries                                    │  │
│  │  - lib/hindsight.ts: retain/recall/reflect           │  │
│  │  - lib/groq.ts: chat completion, parsing             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    External APIs                             │
│  - Groq API (LLM)                                           │
│  - Hindsight Cloud (Memory)                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Troubleshooting

### "Module not found" errors
Run `npm install` to ensure all dependencies are installed.

### API routes return 500 errors
Check that your `.env.local` file exists and has valid API keys.

### TypeScript errors
Run `npx tsc --noEmit` to see all type errors. Note: `ignoreBuildErrors: true` is set in `next.config.mjs`.

### Pages show "coming soon"
This is expected! Only Features 1-3 are complete. Features 4-8 need to be built.

---

## Resources

- **Full Spec:** `CONTEXT/CONTEXT_DOC.MD`
- **Design System:** `CONTEXT/DESIGN_SYSTEM.MD`
- **Implementation Plan:** `CONTEXT/implementation_plan.md`
- **Agent Guidance:** `AGENTS.md`
