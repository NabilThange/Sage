# Recallio - AI Tutor That Never Forgets

An AI-powered study companion built for the hackathon theme "AI Agents That Learn Using Hindsight." Recallio uses persistent memory to personalize learning, adapting to each student's strengths, weaknesses, and study patterns over time.

## 🧠 Core Technology

**Hindsight Cloud** - The nervous system of Recallio. Every interaction is stored as memory, enabling the AI to:
- Remember past struggles and successes
- Adapt teaching style to individual learning patterns
- Provide insights based on accumulated study history
- Target practice toward weak areas

**Groq LLM** - Powers conversational teaching, quiz generation, and content summarization.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API Keys
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your API keys:

**Single Key (Basic):**
```env
GROQ_API_KEY=your_key_here
HINDSIGHT_API_KEY=your_key_here
```

**Multiple Keys (Recommended - Automatic Rotation & Failover):**
```env
GROQ_API_KEY_1=your_first_key
GROQ_API_KEY_2=your_second_key
GROQ_API_KEY_3=your_third_key
```

The system automatically rotates through keys and handles failures. See `docs/KEY_MANAGER.md` for details.

- **Groq API**: https://console.groq.com/keys
- **Hindsight Cloud**: https://hindsight.cloud (promo code: `MEMHACK315`)

### 3. Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000

## 📋 Implementation Status

### ✅ Complete (Features 1-3)
- **App Shell & Auth** - Protected routes, sidebar navigation, dark theme
- **Login System** - Mock auth with demo users (Aryan, Priya)
- **API Infrastructure** - All 10 API routes ready with automatic key rotation:
  - Memory: `/api/memory/retain`, `/api/memory/recall`, `/api/memory/reflect`
  - Onboarding: `/api/onboarding/parse-syllabus`, `/api/onboarding/generate-test`
  - Planner: `/api/planner/chat`
  - Mentor: `/api/mentor/chat`, `/api/mentor/generate-quiz`, `/api/mentor/flashcards`, `/api/mentor/summary`
- **Key Manager** - Automatic API key rotation and failover (supports multiple keys per service)

### 🔲 To Build (Features 4-8)
- **Onboarding** - 8-step Duolingo-style flow (HIGH PRIORITY)
- **Planner** - Chat + Calendar + Scheduler
- **Mentor** - Subject grid + 3-panel study interface
- **Tests** - MCQ quiz interface with timer
- **Profile & Memory Panel** - Analytics + full memory visualization

See `SETUP.md` for detailed implementation guide.

## 🏗️ Architecture

```
Next.js 16 (App Router) + React 19
├── Tailwind CSS v4 (dark-first design)
├── shadcn/ui components (new-york style)
├── Groq LLM (llama-3.3-70b-versatile)
└── Hindsight Cloud (persistent memory)
```

**Key Routes:**
- `/` - Landing page
- `/login` - Name input + demo users
- `/onboarding` - 8-step profile setup (to be built)
- `/planner` - Study schedule chat (to be built)
- `/mentor` - Subject-specific tutoring (to be built)
- `/tests` - Quiz interface (to be built)
- `/profile` - Analytics dashboard (to be built)
- `/memory` - Memory panel (to be built)

## 🎯 How Hindsight Powers Recallio

Every meaningful interaction triggers memory operations:

**retain()** - Store events:
- Onboarding profile data
- Quiz results with mistakes
- Confusion signals during teaching
- Study session summaries
- Schedule preferences

**recall()** - Retrieve context:
- Injected into every AI prompt
- Powers daily briefing card
- Targets quiz questions to weak areas
- Personalizes teaching approach

**reflect()** - Synthesize insights:
- "What should this student focus on?"
- Qualitative proficiency insights
- Test result commentary
- Learning pattern analysis

## 📚 Documentation

- **Setup Guide**: `SETUP.md` - Implementation status & next steps
- **Key Manager**: `docs/KEY_MANAGER.md` - API key rotation & failover system
- **Full Spec**: `CONTEXT/CONTEXT_DOC.MD` - Complete product requirements
- **Design System**: `CONTEXT/DESIGN_SYSTEM.MD` - UI tokens & styling
- **Implementation Plan**: `CONTEXT/implementation_plan.md` - Feature breakdown
- **Agent Guidance**: `AGENTS.md` - Development guidelines

## 🧪 Testing

```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Build verification
npm run build
```

## 🎨 Design System

**Dark-first theme:**
- Background: `#0D0D0F`
- Primary: `#7C6AF5` (violet)
- Success: `#17C964` (green)
- Warning: `#F5A524` (amber)
- Error: `#F31260` (red)

**Fonts:**
- Sans: Plus Jakarta Sans
- Serif: Lora
- Mono: Roboto Mono

## 🔑 Demo Users

Two pre-seeded users for testing:
- **Aryan** - BTech CSE, 12-day streak, rich memory (3 weeks of data)
- **Priya** - Class 12 CBSE, 2-day streak, minimal memory (early-stage)

## 📦 Tech Stack

- Next.js 16 (App Router, RSC)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Groq API
- Hindsight Cloud
- Vercel (deployment)

## 🚢 Deployment

```bash
npm run build
npm run start
```

Deploy to Vercel with environment variables configured.

## 📄 License

Built for hackathon submission.
