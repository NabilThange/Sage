# RECALLIO — Complete Product & Technical Context Document
### *The AI Tutor That Never Forgets.*

> **Hackathon Theme:** AI Agents That Learn Using Hindsight
> **Stack:** Hindsight Cloud (Vectorize) · Groq LLM (qwen3-32b) · Next.js 14 · React · shadcn/ui · Tailwind CSS
> **Promo Code:** MEMHACK315 → $50 Hindsight Cloud credits

---

## Table of Contents

1. [What Is Recallio?](#1-what-is-recallio)
2. [The Big Idea & Core Problem](#2-the-big-idea--core-problem)
3. [Tech Stack & Architecture](#3-tech-stack--architecture)
4. [Hindsight Memory — Complete Integration](#4-hindsight-memory--complete-integration)
5. [The 4 Hindsight Memory Types](#5-the-4-hindsight-memory-types)
6. [Onboarding Flow — Step by Step](#6-onboarding-flow--step-by-step)
7. [Section 1 — Planner](#7-section-1--planner)
8. [Section 2 — Mentor](#8-section-2--mentor)
9. [Section 3 — Tests](#9-section-3--tests)
10. [Section 4 — Profile + Memory Panel](#10-section-4--profile--memory-panel)
11. [UI Screen Layouts & Design System](#11-ui-screen-layouts--design-system)
12. [Proficiency System](#12-proficiency-system)
13. [Mock Auth & Demo Users](#13-mock-auth--demo-users)
14. [User Flow Scenarios](#14-user-flow-scenarios)
15. [Build Order — 6-Hour Sprint](#15-build-order--6-hour-sprint)
16. [What's Fully Built vs. Placeholder](#16-whats-fully-built-vs-placeholder)
17. [Demo Script for Judges](#17-demo-script-for-judges)

---

## 1. What Is Recallio?

Recallio is a web application designed for college and school students. It acts as a personalised AI tutor that:

- **Knows your syllabus** — extracted from your uploaded PDF, structured into subjects → chapters → subtopics
- **Remembers everything** — every topic studied, every mistake made, every test taken — across all sessions, forever
- **Plans your schedule** — around your exam dates, weak areas, and learning patterns
- **Teaches conversationally** — like a real tutor who adapts to your level and remembers your history
- **Tests your understanding** — MCQ quizzes that target your exact weak spots
- **Gets smarter over time** — because it actually learns from your history via Hindsight

> **In one line:** Recallio is a personal AI tutor that never forgets you — and gets better at helping you the longer you use it.

---

## 2. The Big Idea & Core Problem

### The Problem

Most study apps treat every session like it's your first time. Zero memory. You start from scratch every single time. They cannot tell you:

- Which topics you consistently fail across multiple sessions
- That you got the same question type wrong three weeks in a row
- That you study better in the evening, not the morning
- That your OS proficiency has been declining while DS is improving

### The Solution

Recallio uses **Hindsight** — a persistent memory system by Vectorize — to give the AI a true, growing model of every student. The AI doesn't just retrieve what happened. It synthesises patterns and forms opinions about how to help you best.

> **The tutor analogy:** Imagine a tutor who writes detailed notes after every session — what you got right, what confused you, what you skipped. Next time you arrive, they've already read those notes. After a month, they've formed real opinions: *"This student understands theory but always fails application questions."* That is exactly what Recallio does.

---

## 3. Tech Stack & Architecture

### Stack Overview

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js 14 + React | App router, server components, routing |
| UI Components | shadcn/ui + Tailwind CSS | All UI — cards, dialogs, sheets, calendar |
| LLM | Groq (qwen3-32b) | Chat, question generation, teaching, planning |
| Memory | **Hindsight Cloud (Vectorize)** | Persistent per-user memory: retain, recall, reflect |
| PDF Parsing | pdf-parse + Groq | Extract subjects/chapters from uploaded syllabus PDF |
| Auth | localStorage (mocked) | Mock login with pre-seeded demo users |
| Calendar UI | react-big-calendar | Google Calendar-style day view in Planner |
| Deployment | Vercel (free tier) | Instant deploy, auto-deploy on push |

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        RECALLIO FRONTEND                        │
│  Next.js 14  ·  React  ·  shadcn/ui  ·  Tailwind CSS           │
│                                                                 │
│  /login  /onboarding  /planner  /mentor/[subject]               │
│  /tests  /profile  /memory  /api/*                              │
└───────────────────────┬────────────────────┬────────────────────┘
                        │                    │
           ┌────────────▼──────┐    ┌────────▼─────────────┐
           │   GROQ LLM API    │    │   HINDSIGHT CLOUD     │
           │  qwen3-32b model  │    │   (Vectorize)         │
           │  · Planner chat   │    │   retain()            │
           │  · Mentor tutor   │    │   recall()            │
           │  · Quiz generate  │    │   reflect()           │
           │  · PDF parsing    │    │   Per-user bank       │
           └───────────────────┘    └──────────────────────┘
```

### API Routes

| Route | Method | What It Does |
|---|---|---|
| `/api/onboarding/parse-syllabus` | POST | PDF text → subjects + chapters JSON via Groq |
| `/api/onboarding/generate-test` | POST | Subject + chapters → 6 adaptive pre-test questions |
| `/api/planner/chat` | POST | Message + userId → recalls Hindsight → AI response + schedule diff |
| `/api/mentor/chat` | POST | Subject + message + userId → subject-specific AI tutor response |
| `/api/mentor/generate-quiz` | POST | Subject + topic + userId → quiz targeting weak areas |
| `/api/mentor/flashcards` | POST | Topic content → flashcard key/value pairs |
| `/api/mentor/summary` | POST | Topic content → concise written summary |
| `/api/memory/retain` | POST | userId + event + content → writes to Hindsight |
| `/api/memory/recall` | POST | userId + query → returns recalled memories |
| `/api/memory/reflect` | POST | userId + question → synthesised insights from Hindsight |

---

## 4. Hindsight Memory — Complete Integration

Hindsight is the core differentiator of Recallio. It is not a key-value store or a chat history dump. When you call `retain()`, Hindsight uses an LLM internally to extract facts, entities, temporal data, and relationships — building structured, searchable, time-anchored memory across 4 types.

> **Setup:** Each student gets their own isolated memory bank → `bankId = user_${userId}`

### The 3 Operations

#### `retain(bankId, content)`
Store a memory. Input: a natural language string describing what happened. Hindsight extracts structure, normalises it, and distributes it across the 4 memory type networks. Every important student interaction triggers a `retain()` call.

#### `recall(bankId, query)`
Retrieve relevant memories via a natural language query. Uses TEMPR — Hindsight's 4-way retrieval combining semantic search, temporal reasoning, entity lookup, and relationship graphs. Returns the most contextually relevant memories for a given moment.

#### `reflect(bankId, question)`
Reason over all accumulated memories to form synthesised insights. Checks Mental Models → Observations → Raw Facts in priority order. Returns qualitative conclusions with confidence scores. This is where the AI **learns** — not just retrieves.

---

### Complete Hindsight Integration Map

| App Moment | Call | What Gets Stored / Retrieved |
|---|---|---|
| Onboarding complete | `retain()` | Student level, curriculum, semester, subjects, chapters, baseline known topics, pre-test scores |
| App open (return visit) | `recall()` + `reflect()` | Last session, upcoming exams, weak areas → powers daily briefing card + greeting |
| Every planner chat message | `recall()` | Full memory context injected into planner system prompt before every LLM call |
| Planner: exam date mentioned | `retain()` | Exam date, subject, urgency — appears on calendar |
| Planner: stress/preference signal | `retain()` | Student stressed about X / prefers evening / wants to skip weekends |
| Schedule updated or rejected | `retain()` | What changed, whether AI suggestion was accepted/rejected, new schedule state |
| Mentor subject tab opened | `recall()` + `reflect()` | Past interactions with that subject → Hindsight history strip + AI opening message |
| Student asks AI to re-explain | `retain()` | Concept name, subject, chapter — genuine confusion signal, increases weak-area weight |
| Mentor chat session ends | `retain()` | Topics covered, time spent, concepts re-explained |
| Pomodoro session completes | `retain()` | Subject, duration, check-in response (Great / Mixed / Struggled) |
| Quiz question answered wrong | `retain()` | Question text, topic, wrong answer, correct answer, subject, timestamp |
| Test completed | `retain()` | Full test: all Q&As, score, time per question, total time, mode, subject, date |
| Test results shown | `reflect()` | One-sentence qualitative insight displayed on results screen |
| Every 5 interactions | `reflect()` | Auto-synthesises new observations about learning patterns (confidence-scored) |
| Profile opened | `reflect()` | Qualitative insight per subject shown below proficiency bars |
| Memory Panel opened | `recall()` + `reflect()` | All 4 memory types fetched and displayed. Reflect generates live summary. |

---

## 5. The 4 Hindsight Memory Types

Hindsight classifies every retained piece of information into one of four structured memory networks.

| Type | Analogy | Definition | Examples in Recallio |
|---|---|---|---|
| **World** | "The stove is hot" | Objective facts about the student and context | BTech CSE Sem 3. OS exam March 28. Subject has 8 chapters. |
| **Experiences** | "I touched it and got burned" | Direct observations from actual interactions | Scored 4/10 on IOT quiz Ch.3. Studied DS 50 mins. Rejected morning slot. |
| **Observations** | *(auto-synthesised)* | Patterns Hindsight forms from accumulated data — **you don't write these** | "User fails IOT application questions across 3 sessions." "OS improving week-over-week." |
| **Opinions** | "Don't touch the stove — 99% confident" | Beliefs with confidence scores, used by reflect() | "Needs IOT application practice — 0.91" · "Evening sessions more effective — 0.74" |

> **Key insight:** Observations are never written manually by the developer. Hindsight synthesises them automatically from World facts + Experiences over time. This is the "learning" behaviour. The longer a student uses Recallio, the richer and more accurate the Observations become.

---

## 6. Onboarding Flow — Step by Step

The onboarding follows the product plan's data requirements but uses a **Duolingo-style UX**: one full-screen step at a time, tap-to-select cards that auto-advance, animated transitions, and a profile reveal payoff at the end. No boring forms.

> **UX Principle:** Each step does ONE thing. Tapping a card auto-advances whenever possible. The student should feel like the AI is learning about them — not that they're filling out a form.

---

### Step 1 — Name Confirm
Full-screen dark card. `"Hey [name]! Let's build your study profile."` Single large `"Let's Go →"` button. Sets the warm, personal tone. The AI addresses the student by name from this point forward.

---

### Step 2 — Education Level
Four large tap-to-select cards:
- Class 10–12
- Undergraduate
- Postgraduate
- Competitive Exam (JEE / NEET / UPSC etc.)

Tapping auto-advances — no Next button. Selected card gets a violet glow border + checkmark animation (150ms).

---

### Step 3 — Curriculum / Board
*(Replaces the less useful country/state/city question)*

Dynamic options based on Step 2:
- **If Undergraduate:** Engineering / Medical / Commerce / Arts / Other
- **If Class 10–12:** CBSE / ICSE / IB / State Board / Other
- **If Competitive:** JEE / NEET / UPSC / CAT / Other

Same tap-to-select UI. Auto-advances.

---

### Step 4 — Semester / Year
- **Engineering:** Sem 1–8 shown as tap cards
- **Others:** Year 1–4

Replaces open text field — faster and cleaner. Country asked separately only if needed (for timezone), buried in Settings.

---

### Step 5 — Syllabus Upload
- **Primary:** Large drag-and-drop PDF upload zone with animated dotted border
- **Fallback (critical):** `"Or pick a common syllabus →"` — pre-loaded templates: BTech CSE Sem 3, CBSE Class 12 PCM, JEE Mains, etc.
- After upload: animated processing state `"Reading your syllabus... extracting subjects..."` (10–20 seconds)
- Groq receives the PDF text and returns structured JSON: `{ subjects: [{ name, chapters: [{ name, subtopics: [] }] }] }`

---

### Step 6 — Subject Confirmation
Subject cards **animate in one by one** (staggered, 80ms delay):
> *"I found these subjects in your syllabus:"*
> CT · IOT · Data Structures · OS · DBMS · DM

Student can deselect any subject or add one manually. `"These look right →"` to confirm.

---

### Step 7 — Topics Already Known
For each confirmed subject — ONE SUBJECT AT A TIME with `"Subject 2 of 5"` progress indicator:
- Chapters and subtopics shown as **horizontal pill selects** (not boring checkboxes)
- Student taps everything they already know
- This establishes the **onboarding baseline** for the proficiency calculation
- Student can tap `"Skip — I'm starting fresh"` if they know nothing yet

---

### Step 8 — Profile Reveal *(The Payoff Screen)*
Full-screen celebration moment:
> *"Your study profile is ready, [name]!"*

- Animated proficiency bars fill from `0%` to baseline scores per subject (600ms each, staggered)
- Weak area badges appear: `"IOT: Weak in Applications"` / `"OS: Most chapters unknown"`
- Bottom message: *"Your AI now knows your complete study profile — and will remember everything from here."*
- Large CTA: `"Enter Dashboard →"`

**`retain()` fires here** with the complete onboarding data package. This is the baseline memory write — everything else builds on top of it.

---

## 7. Section 1 — Planner

The Planner is the command centre of Recallio. It is a **Claude.ai-style chat interface** where students manage their study schedule. Every message is powered by Hindsight memory — the planner always knows the student's weak areas, exam dates, and past behaviour before it responds.

### Layout

```
┌────────────────────────────────────────────────────────────────────┐
│ Sidebar │        PLANNER CHAT             │ Right Panel            │
│         │                                 │                        │
│ Planner │  ┌── Daily Briefing Card ─────┐ │  ┌── Calendar ──────┐  │
│ Mentor  │  │ 🔥7  Good afternoon, Aryan  │ │  │   March 2026     │  │
│ Tests   │  │ IOT exam in 4 days          │ │  │  20● 28[IOT]     │  │
│ Profile │  │ Weak: VSWR, Antenna Gain    │ │  └──────────────────┘  │
│ 🧠 Mem  │  └─────────────────────────────┘ │                        │
│         │                                 │  ┌── Scheduler ──────┐  │
│         │  AI: How can I help you today?  │  │  TODAY             │  │
│         │                                 │  │  ○ IOT Lesson      │  │
│         │  ┌──────────────────────────┐   │  │  ○ DS Quiz         │  │
│         │  │  Type your message...    │   │  │  ○ OS Revision     │  │
│         │  └──────────────────────────┘   │  └──────────────────┘  │
│         │  [Plan week] [Add exam] [Today] │                        │
└────────────────────────────────────────────────────────────────────┘
```

### Daily Briefing Card
Appears at the top of the Planner on **every return visit**. Powered by `recall()` + `reflect()` firing on app open. Contains:
- 🔥 Streak counter
- Personalised name greeting
- Last subject studied + days since
- Upcoming exam + days remaining
- Current weakest topic

Dismissible. This is **the demo money shot** — the moment that proves Hindsight memory is working across sessions.

### The Planner Chatbot
Before every message, `recall()` fires and injects the student's full memory context into the system prompt. The planner AI responds with personalised, memory-backed advice — never generic.

**Example interaction:**
> *Student:* "What should I study this week?"
>
> *AI:* "You have your IOT exam in 4 days. Based on your last 3 quizzes, you consistently miss application-level questions — specifically VSWR and antenna gain. I'd suggest 2 focused IOT sessions today and tomorrow targeting those topics, then a revision quiz on Thursday. Want me to add that to your schedule?"

### Quick-Action Chips
Below the chat input: `[Plan my week]` `[I have an exam coming up]` `[What should I study today?]` `[Quiz me]`

### Scheduler Panel
- Shows today's planned study tasks (subject, topic, estimated time, mode: Lesson / Quiz / Revision)
- **Clicking any task navigates directly to `/mentor/[subject]` with that exact topic pre-loaded** — one click from plan to studying, no navigation required
- AI suggests schedule changes as a diff card: *"I want to move Physics to tomorrow and add DS tonight. OK?"* → user accepts/rejects → schedule updates with animation
- Every schedule update or rejection → `retain()` fires

### Calendar Panel
- Monthly view showing: exam dates (red), completed sessions (green), scheduled tasks (blue)
- Student says *"My OS exam is April 20th"* in chat → appears on calendar automatically
- Clicking a date expands to day view inline

---

## 8. Section 2 — Mentor

The Mentor is where the actual studying happens. Inspired by **NotebookLM**, it uses a three-panel layout. The crucial difference from NotebookLM: the Mentor AI knows the student's full Hindsight history — so teaching is personalised to their exact weak areas.

### Entry Points
1. **Direct navigation** — click Mentor in sidebar → subject grid view
2. **Via Scheduler** — click a planned task → opens `/mentor/[subject]` with topic pre-loaded

### Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│ Sidebar │ Sources     │   Chat — IOT > Ch.3        │ Studio          │
│         │             │                            │                 │
│         │ syllabus    │ ┌── Hindsight Strip ──────┐│ [Flashcards]    │
│         │ .pdf   ✓    │ │ Last: 3d ago · Weak:    ││                 │
│         │             │ │ VSWR · Score: 62% ↑     ││ [Summary]       │
│         │ [+ Add src] │ └─────────────────────────┘│                 │
│         │             │                            │ [Mind Map] ···  │
│         │ ──────────  │ AI: Welcome back, Aryan.   │                 │
│         │ 🧠 History  │ Last time you struggled    │ [Slide Deck] ···│
│         │ Weak: VSWR  │ with VSWR twice. Want to   │                 │
│         │ Score: 62%  │ start there or move on?    │ [Quiz → Tests]  │
│         │ 3 days ago  │                            │                 │
│         │             │ [Type your message...]     │ ─────────────── │
│         │             │                            │ 🍅 Pomodoro     │
│         │             │ [Module: Ch.3 ▼]           │    25:00 Start  │
└──────────────────────────────────────────────────────────────────────┘
```

### Left Panel — Sources
- Student's uploaded syllabus PDF listed as primary source (auto-loaded from onboarding)
- Option to add extra PDFs or notes for richer context
- **Hindsight History strip** at bottom: last studied date, weak areas, score trend — pulled from `recall()`

### Centre Panel — Chat
- **Module/chapter dropdown** at top — student selects topic to study
- AI teaches conversationally: explains concepts, gives examples, answers follow-ups
- **Opening message powered by `reflect()`** — not generic. Example: *"Welcome back. Last time we covered VSWR and you asked me to re-explain it twice. Want to go deeper before Chapter 4?"*
- When student asks AI to re-explain → `retain()` fires (genuine confusion signal)
- After sufficient teaching, AI prompts: *"Would you like to take a test on what we just covered?"* → bridges to Tests section

### Right Panel — Studio

| Feature | Status | Description |
|---|---|---|
| Flashcards | ✅ Working | Key term / definition pairs generated by Groq for current topic |
| Summary | ✅ Working | Concise written summary of the topic being taught |
| Mind Map | 🔲 Placeholder | Visual concept map — UI shown, not functional |
| Slide Deck | 🔲 Placeholder | Presentation-style breakdown — UI shown, not functional |
| Quiz | ✅ Working | Triggers test generation and navigates to Tests section |

### Pomodoro Timer
Built into the Studio panel. 25min / Short Break / Long Break modes.

**When timer ends:** pop-up check-in appears:
> *"Session done! How was your study?"*
> `😊 Great` `😐 Mixed` `😔 Struggled`

Response stored via `retain()`. This is one of the most natural and valuable memory-write moments in the entire app.

### Subject Grid View (`/mentor`)
Notion-style card grid. Each card shows:
- AI-generated abstract cover image (subject-themed)
- Subject name + chapter count badge
- Last studied date
- Proficiency % bar at bottom
- Hover: *"62% proficiency · 3 weak topics"* overlay fades in

---

## 9. Section 3 — Tests

MCQ quizzes in two modes. All tests feed into both the proficiency calculation and Hindsight memory. The interface is clean, focused, and distraction-free.

### Mode 1 — Student-Designed Test
Student selects: Subject → Module/Topic → Number of questions (5–20) → Time limit.
`recall()` fires first to check past mistakes → questions automatically target weak areas by default.

### Mode 2 — Mentor-Assigned Test
After the Mentor has taught a topic, it prompts: *"Would you like to take a test?"*
If yes: test auto-generates on exactly what was just covered — no configuration needed. Questions specifically target topics the student asked to re-explain.

### Test Interface

```
┌──────────────────────────────────────────────────────────────────────┐
│  Timer: 14:23          Operating Systems               [Submit]      │
│                                                                      │
│  Question 3 of 10                                    ┌──────────┐   │
│                                                      │   3/10   │   │
│  Which scheduling algorithm provides minimum         │    ●     │   │
│  average waiting time for a known set of jobs?       └──────────┘   │
│                                                                      │
│  ┌──────────────────────┐   ┌──────────────────────┐                │
│  │   A.   FCFS          │   │   B.   SJF           │                │
│  └──────────────────────┘   └──────────────────────┘                │
│  ┌──────────────────────┐   ┌──────────────────────┐                │
│  │   C.   Round Robin   │   │   D.   Priority      │                │
│  └──────────────────────┘   └──────────────────────┘                │
│                                                                      │
│  [← Prev]  [1][2][3][4][5][6][7][8][9][10]  [Next →]               │
└──────────────────────────────────────────────────────────────────────┘
```

### Test Rules
- Numbered pill navigation — jump to any question freely
- Answers can be changed at any time while timer is running
- **10 seconds before time runs out:** warning overlay — *"Time is almost up! Submitting in 10 seconds."*
- When timer hits zero: auto-submit

### Results Screen
- Overall score displayed prominently (e.g., 7/10 — 70%)
- Correct vs incorrect breakdown — green ✓ / red ✗ per question
- Full question-by-question review: wrong answers shown with correct answer highlighted
- **`reflect()` fires → one-sentence AI insight displayed:** e.g., *"You consistently miss application-level IOT questions. Your theory is strong — practice applying it."*
- CTA: *"Go back to Mentor to review missed topics?"* → `[Go to Mentor]` + `[Skip]`
- **`retain()` fires immediately** with full test data: all Q&As, score, time, mode, subject, date

---

## 10. Section 4 — Profile + Memory Panel

### Profile Screen

```
┌──────────────────────────────────────────────────────────────────────┐
│ Sidebar │  PROFILE — Aryan Sharma              🔥 12-day streak      │
│         │  BTech CSE Sem 3  ·  2,340 XP                             │
│         │                                                            │
│         │  Proficiency                                               │
│         │  Data Structures   ████████░░  78%                        │
│         │  "Strong in sorting, weak in graph traversal"             │
│         │                                                            │
│         │  Operating Systems ██████░░░░  64%                        │
│         │  "Struggles with memory management numerical problems"     │
│         │                                                            │
│         │  DBMS              ████████░░  81%                        │
│         │  "Strong overall"                                          │
│         │                                                            │
│         │  Comp. Networks    █████░░░░░  55%  (Early estimate)      │
│         │                                                            │
│         │  Test History                                              │
│         │  Apr 18 — OS — 7/10 — 12 mins     [View]                  │
│         │  Apr 16 — DS — 9/10 — 8 mins      [View]                  │
│         │  Apr 14 — DBMS — 6/10 — 15 mins   [View]                  │
│         │                                                            │
│         │                              [🧠 View My Memory]          │
└──────────────────────────────────────────────────────────────────────┘
```

The qualitative insight under each proficiency bar is powered by `reflect()`. It is the most visible proof in the entire app that the AI has formed a real understanding of the student.

---

### 🧠 Memory Panel — The Judge-Facing Demo Screen

Accessible via:
- The `🧠` icon in the left sidebar (opens as a drawer from anywhere in the app)
- The `[View My Memory]` button on the Profile page

On open: `reflect()` fires with *"Summarise what you know about this student's learning journey"* → generates a live summary card at the top.

Below it, all 4 Hindsight memory types are displayed:

---

**🌍 World — Facts about you**
```
• BTech CSE Sem 3. Active subjects: IOT, DS, OS, DBMS, CT, DM.
• IOT exam scheduled March 28, 2026.
• Prefers evening study sessions (7–10pm).
```

**🎯 Experiences — What happened**
```
• IOT Quiz Ch.3 — scored 4/10. Wrong: VSWR, antenna gain, propagation delay.  [Mar 20]
• Studied DS for 50 mins. Check-in: "understood most of binary trees."         [Mar 19]
• Rejected morning DS session. Rescheduled to 8pm.                             [Mar 20]
```

**🔍 Observations — AI-synthesised patterns** *(auto-formed by Hindsight, never hand-coded)*
```
• User understands IOT theory but consistently fails application-level questions.
  Pattern seen across 3 quiz sessions.
• OS scores have improved 3 weeks running (+8%, +12%, +7%). Positive trajectory.
```

**💭 Opinions — What the AI believes about you**
```
• This student needs more application-practice in IOT before the exam.  [0.91 confidence]
• Short evening sessions (25–30 min) more effective than marathon sessions. [0.74 confidence]
```

> **Why this screen wins judges:** The Memory Panel makes invisible AI memory visible and tangible. In 30 seconds a judge can see: what was stored, how it was classified, that observations were auto-synthesised (not hand-coded), and that opinions carry quantified confidence. It proves the entire hackathon theme — *AI Agents That Learn Using Hindsight* — in a single screen.

---

## 11. UI Screen Layouts & Design System

### Design Language

| Property | Value |
|---|---|
| **Theme** | Dark-first. Background `#0D0D0F`. Surfaces `#161618` / `#1F1F22`. |
| **Accent** | `#7C6AF5` violet — primary actions, Hindsight identity |
| **Secondary colors** | `#F5A524` amber (XP/streak) · `#17C964` green (success) · `#F31260` red (error) |
| **Font** | Geist (Vercel) or Inter — modern, excellent dark-mode legibility |
| **Type scale** | Hero: 48–56px · H1: 32px · H2: 24px · Body: 14–16px · Captions: 12px |
| **Weights** | 400 (regular) + 500 (medium). Never 600/700 — too heavy. |
| **Border radius** | Cards: 12px · Buttons: 8px · Pills/chips: 20px (full round) |
| **Components** | shadcn/ui — no custom-built primitives |
| **Motion** | Entry: `fade + translateY(8px) → 0`, 200ms · Wrong answer: shake 3×, 300ms · XP float: 600ms |

### Gamification Layer

| Element | Where | Powered by |
|---|---|---|
| 🔥 Streak counter | Always visible in sidebar | Count of consecutive study days from Hindsight memories |
| ⚡ XP points | Profile page total | Earned per quiz question, per session, per planner interaction |
| 📊 Proficiency bars | Profile + subject hover | 30/70 formula from test history |
| 🏆 Badges | Toast notifications | "First Quiz" · "7-Day Streak" · "Weak Topic Conquered" |

### Page Routes

```
/                    → Landing page (dark hero, single CTA)
/login               → Mock login (name input + 2 demo user pills)
/onboarding          → Multi-step flow (Steps 1–8)
/planner             → Chat + Calendar + Scheduler (default after login)
/mentor              → Subject grid (Notion-style cards)
/mentor/[subject]    → 3-panel: Sources · Chat · Studio
/tests               → Mode selection + test interface
/profile             → Analytics + test history + Memory Panel link
/memory              → Full Memory Panel (also as sidebar drawer)
```

---

## 12. Proficiency System

Proficiency is displayed as a percentage (0–100%) per subject. Calculated dynamically based on how much test data exists.

### Calculation Phases

| Phase | Condition | Formula | Label |
|---|---|---|---|
| Phase 1 | Before any tests | 100% × onboarding self-assessment | *"Based on your self-assessment"* |
| Phase 2 | After 1–2 tests | 30% × onboarding + 70% × test average | *"Early estimate"* |
| Phase 3 | After 3+ tests | 30% × onboarding + 70% × test average | Plain percentage — no label |

### Why 30/70?
Students consistently overestimate what they know when self-reporting. Actual test performance is objective evidence. So test results carry 70% weight. After 3+ tests, the onboarding baseline becomes nearly irrelevant in practice.

### Why 3 Tests Minimum?
A student who scores 100% on their first 5-question quiz (lucky guess, easy questions) shouldn't immediately show 100% proficiency. Three data points provide a reliable picture.

### Hindsight's Contribution
Beyond the percentage, `reflect()` generates a **qualitative insight** shown directly below each proficiency bar on the Profile page.

> Example: *"Strong in theory-based questions, consistently weak in numerical and application problems."*

This makes the percentage feel alive and meaningful rather than just a number.

---

## 13. Mock Auth & Demo Users

### Why Mock Auth?
Real authentication (OAuth, JWTs, sessions) takes 1–2 hours with low demo value. Mock auth using localStorage is faster to build (20 minutes) and actually better for demos — switch users live to show memory isolation.

### Implementation
```
Login page → user enters name → onClick:
  userId = `user_${name.toLowerCase()}_${Date.now()}`
  localStorage.setItem('recallio_userId', userId)
  → if onboarding complete in Hindsight → redirect /planner
  → if new user → redirect /onboarding
```

Each `userId` maps to a separate Hindsight memory bank: `bankId = userId`

### Pre-Seeded Demo Users

| User | Profile | Pre-loaded Memories | Demo Purpose |
|---|---|---|---|
| **Aryan** | BTech CSE Sem 3. 12-day streak. IOT exam in 4 days. | 3 quiz failures on VSWR. Evening preference. IOT: 62%, DS: 78%, OS: 64%. All 4 memory types populated. | Main demo user. Shows returning-user memory experience at full richness. |
| **Priya** | Class 12 CBSE. 2-day streak. Just started. | Onboarding complete. 1 quiz taken. Mostly World facts, minimal Experiences. | Contrast demo. Shows memory isolation + early-stage memory state. |

---

## 14. User Flow Scenarios

### Scenario A — First Day: Brand New Student (Priya)

Priya opens Recallio for the first time. She taps through onboarding — *"Undergraduate → Engineering → Sem 4"*. She uploads her syllabus PDF. The AI reads it in 15 seconds: *"I found 6 subjects."* She confirms 5. She goes through topic checklists — she knows most of Data Structures but almost nothing of Computer Networks. 8 minutes total.

Profile Reveal screen: proficiency bars animate to baseline scores. She enters the Dashboard.

The Planner greets her: *"Good morning, Priya. Do you have any upcoming exams?"* She types: *"OS exam on April 20th."* It appears on the calendar. The AI: *"You have 18 days. Given you've marked most OS topics as unknown, I'd suggest starting with Process Management today. Want me to add a 1-hour lesson?"* She clicks Yes. Task appears in Scheduler.

She clicks the task → taken straight to Mentor, OS → Process Management pre-loaded. 45 minutes of teaching. The AI notices she asked to re-explain CPU scheduling twice → `retain()` fires both times (confusion signals). After the session: *"Ready to test yourself?"* → 10-question quiz → 6/10 → misses all Round Robin questions → `reflect()` insight: *"Strong on FCFS and Priority. Round Robin edge cases are the gap."* → *"Go to Mentor to review Round Robin?"* → She clicks yes.

---

### Scenario B — Returning Student (Aryan, 3 Weeks In) — THE HINDSIGHT DEMO

Aryan opens the app Tuesday morning. The **Daily Briefing Card** appears immediately:
> *🔥 12-day streak. Good morning, Aryan. Last session: IOT · 3 days ago. Weak area: VSWR. IOT exam in 4 days. 3 sessions planned this week.*

Generated entirely by `recall()` + `reflect()` on app open.

He opens the Planner: *"What should I focus on this week?"*

AI responds (memory-backed): *"Your IOT exam is in 4 days. Based on your last 3 quizzes, you consistently miss application-level questions — specifically VSWR and antenna gain. You understand theory well. I suggest 2 focused IOT sessions today and tomorrow, then a revision quiz Thursday. Shall I schedule that?"* He agrees.

He clicks the IOT task in Scheduler → opens `/mentor/IOT`. The Hindsight history strip: *"Last studied: 3 days ago · Weak: VSWR, Antenna Gain · Score trend: ↑ (improving)."* AI opening message (powered by `reflect()`): *"Welcome back, Aryan. Last time we worked on transmission lines and you had questions about VSWR twice. Want to go deeper before Chapter 4?"*

30-minute focused session. Post-Pomodoro check-in: *"Great, finally got VSWR."* → `retain()` fires: *"User reported understanding VSWR after focused session. March 20, 9pm."*

---

### Scenario C — Student Designing Their Own Test (Riya)

Riya wants to self-test before her weekly review. Tests → Subject: Computer Networks → Topic: TCP/IP Model → Questions: 15 → Time: 20 minutes. Test generates in 3 seconds.

Question 7 stumps her — she skips using the numbered pill and comes back at the end. With 45 seconds left: *"Time almost up! Submitting in 10 seconds."* She selects an answer and hits Submit.

Results: 11/15 (73%). `reflect()` insight: *"Strong on OSI layers and basic protocols. Subnetting is the consistent gap across 2 sessions."* Computer Networks proficiency updates: 61% → 65%. *"Go to Mentor for subnetting?"* — She clicks Skip. `retain()` fires with full test data.

---

### Scenario D — Memory Panel: The Judge Demo

During the demo, the presenter logs out of Aryan and logs in as Priya. Priya's dashboard is completely different — different subjects, different greeting, different proficiency. Memory Panel shows only Priya's memories.

Presenter: *"Memory banks are per-user. Complete isolation. Aryan's 3 weeks of learning doesn't affect Priya's AI at all."*

Switch back to Aryan. Open Memory Panel. Show full 4-type breakdown — World facts, Experiences, auto-synthesised Observations, Opinions with confidence scores.

*"None of these Observations were written by a developer. Hindsight formed them automatically from Aryan's 3 weeks of quiz results and study sessions. That is what it means for an AI agent to learn using Hindsight."*

---

## 15. Build Order — 6-Hour Sprint

> **Rule:** Hindsight is not a feature to add at the end. It is the nervous system. Build it first or nothing else has memory.

### Hour 0–1 — Foundation
- [ ] Next.js scaffold (`create-next-app`)
- [ ] Install: `shadcn/ui`, Tailwind, Hindsight SDK, Groq SDK, `pdf-parse`, `react-big-calendar`
- [ ] Connect to Hindsight Cloud → apply promo `MEMHACK315`
- [ ] Test `retain()` + `recall()` end-to-end with dummy data
- [ ] Mock auth: localStorage userId logic + route protection
- [ ] Pre-seed Aryan + Priya demo users into Hindsight
- [ ] GitHub repo + skeleton deploy to Vercel

### Hour 1–2.5 — Onboarding
- [ ] All 8 steps with tap-to-select cards, progress bar, transitions
- [ ] Syllabus PDF upload + Groq parsing → subjects/chapters JSON
- [ ] Pre-loaded syllabus templates (fallback if no PDF)
- [ ] Subject confirmation with staggered card animation
- [ ] Topic checklist — per-subject, pill selects, "Subject X of Y"
- [ ] Profile Reveal screen (animated proficiency bars + weak area badges)
- [ ] `retain()` fires at end with full profile data

### Hour 2.5–3.5 — Mentor
- [ ] Subject grid (`/mentor`) — Notion-style cards with proficiency bars
- [ ] 3-panel layout (`/mentor/[subject]`)
- [ ] Sources panel (syllabus auto-loaded + add more option)
- [ ] Chat with Groq + Hindsight `recall()` injected in system prompt
- [ ] Module/chapter dropdown
- [ ] Hindsight history strip (last studied, weak areas, score trend)
- [ ] `retain()` on re-explain signals (confusion detection)
- [ ] Studio: Flashcards + Summary working; Mind Map + Slide Deck as placeholders
- [ ] Pomodoro timer + post-session check-in → `retain()`

### Hour 3.5–4.5 — Tests
- [ ] Mode selection screen (student-designed + Mentor-assigned)
- [ ] Quiz generation via Groq (targeting weak areas from `recall()`)
- [ ] Full test UI: timer, 4-option MCQ tiles, numbered pill navigation
- [ ] 10-second warning overlay + auto-submit
- [ ] Results screen: Q&A review, `reflect()` insight, "Go to Mentor" CTA
- [ ] `retain()` with full test data on submission

### Hour 4.5–5 — Planner
- [ ] Claude.ai-style chat interface
- [ ] Daily briefing card (`recall()` + `reflect()` on app open)
- [ ] Scheduler panel (today's tasks, clickable → Mentor with topic pre-loaded)
- [ ] Calendar panel (exam dates, sessions)
- [ ] `retain()` on exam dates + preferences mentioned in chat
- [ ] Scheduler → Mentor direct link (one-click topic pre-load)

### Hour 5–5.5 — Profile + Memory Panel
- [ ] Proficiency bars (30/70 formula, phase labels)
- [ ] `reflect()` qualitative insight under each bar
- [ ] Test history log (clickable entries → full Q&A review)
- [ ] Streak counter + XP display
- [ ] 🧠 Memory Panel: all 4 types, live `reflect()` summary

### Hour 5.5–6 — Polish + Submit
- [ ] Fix any broken flows
- [ ] Ensure Aryan + Priya demo users are fully seeded
- [ ] Final deploy to Vercel
- [ ] Record demo video (follow the 5-step script in Section 17)
- [ ] Write GitHub README (explain Hindsight usage prominently)
- [ ] Each team member: article + social media post + video

---

### If You Run Out of Time — Cut in This Order

**Cut first (safe to drop):**
- Mind Map / Slide Deck (already placeholders)
- Calendar drag-and-drop editing
- Profile analytics chart
- Badge/achievement toasts

**Never cut (these are your judging score):**
- All Hindsight calls (retain, recall, reflect)
- The 🧠 Memory Panel
- The Daily Briefing Card
- The Scheduler → Mentor one-click link
- The `reflect()` insight on test results
- The Profile Reveal screen in onboarding

---

## 16. What's Fully Built vs. Placeholder

### ✅ Fully Working
- Complete 8-step onboarding (PDF parsing, subject detection, topic checklist, profile reveal)
- Planner chatbot with daily briefing card, calendar, and scheduler
- Scheduler → Mentor one-click topic pre-load
- Mentor: 3-panel layout, chat teaching, sources panel, Hindsight history strip
- Studio: Flashcards + Summary generation
- Pomodoro timer + post-session check-in → Hindsight write
- Both test modes (student-designed + Mentor-assigned)
- Full test interface (timer, MCQ, pill nav, 10s warning, auto-submit)
- Results screen: Q&A review + `reflect()` insight + "Go to Mentor" CTA
- Profile: proficiency bars, test history, `reflect()` qualitative insights, streak, XP
- 🧠 Memory Panel: all 4 Hindsight memory types, live `reflect()` summary
- All Hindsight calls wired throughout: retain, recall, reflect
- Mock auth with 2 pre-seeded demo users (Aryan + Priya)

### 🔲 UI Placeholder (shown but not functional)
- Studio: Mind Map
- Studio: Slide Deck
- Studio: Infographic
- Calendar drag-and-drop editing
- Profile: historical analytics chart (shows static example)

---

## 17. Demo Script for Judges

*The 5-step sequence that demonstrates every judging criterion in under 5 minutes.*

---

### Step 1 — Fresh Onboarding *(Innovation + UX)*
Open app as new user. Go through the Duolingo-style onboarding — tap cards, upload/select syllabus, AI detects subjects, topic checklist, Profile Reveal screen with animated bars.

> *Narrate:* "Every answer is being retained in Hindsight's memory bank. This baseline never resets."

---

### Step 2 — Take an IOT Quiz *(Technical Implementation)*
Open `/mentor/IOT`. Click Quiz in Studio. Get a few questions wrong.

> *Narrate:* "Aryan just struggled with VSWR and antenna gain. Hindsight wrote this to memory — subject, topic, wrong answers, timestamp. That's `retain()` firing."

---

### Step 3 — Open the Memory Panel *(Use of Hindsight Memory — the money shot)*
Click the 🧠 icon. Show the panel loading. Show the 4-type breakdown.

> *Narrate:* "These Observations were never hand-coded by us. Hindsight synthesised them automatically from Aryan's quiz history. The Opinion — 'needs IOT application practice, 0.91 confidence' — the AI formed that belief itself. This is an AI agent that actually learned something about Aryan."

---

### Step 4 — Hard Refresh *(Persistent Memory — the hard proof)*
Close the browser entirely. Reopen. Log in as Aryan. The Daily Briefing Card appears:
> *🔥 12-day streak. Last session: IOT 3 days ago. Weak area: VSWR. Exam in 4 days.*

> *Narrate:* "Aryan never re-entered his name, his subjects, or his struggles. The AI remembered everything across sessions. That is Hindsight."

---

### Step 5 — Switch to Priya *(Memory Isolation + Real-world Impact)*
Log out. Log in as demo user Priya. Show a completely different dashboard. Open Memory Panel: only Priya's memories — Aryan's history is invisible.

> *Narrate:* "Memory banks are fully isolated per user. Aryan's 3 weeks of learning does not affect Priya's AI at all. Each student gets their own private, growing model. That's the real-world impact — every student gets a tutor that truly knows only them."

---

> **That 5-step sequence covers all 5 judging criteria:**
> - **Innovation (30%)** — Memory Panel showing auto-synthesised AI learning
> - **Use of Hindsight Memory (25%)** — retain, recall, reflect all demonstrated live
> - **Technical Implementation (20%)** — full onboarding, quiz, results, memory UI working end-to-end
> - **User Experience (15%)** — Duolingo onboarding, seamless Scheduler→Mentor flow, dark UI
> - **Real-world Impact (10%)** — visible, tangible, relatable student problem solved

---

*Document prepared for the Hackathon — Theme: AI Agents That Learn Using Hindsight*
*Recallio · Hindsight Cloud (Vectorize) + Groq + Next.js 14*
*Promo code: MEMHACK315*