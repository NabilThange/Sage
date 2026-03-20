# Navigation Flow - Recallio

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                    LANDING PAGE (/)                              │
│  - Hero Section with "Start free trial" CTA → /login            │
│  - CTA Section with "Start building free" CTA → /login          │
│  - Navigation bar (top)                                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    [User clicks CTA]
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    LOGIN PAGE (/login)                           │
│  - Name input field                                              │
│  - "Get Started" button → /onboarding (new user)                │
│  - Demo user pills:                                              │
│    • Aryan → /planner (demo user, onboarding complete)          │
│    • Priya → /planner (demo user, onboarding complete)          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    [User enters name or clicks demo]
                              ↓
        ┌─────────────────────┴─────────────────────┐
        ↓                                           ↓
   NEW USER                                   DEMO USER
   (custom name)                              (Aryan/Priya)
        ↓                                           ↓
┌──────────────────────────────┐    ┌──────────────────────────────┐
│  ONBOARDING (/onboarding)    │    │  PLANNER (/planner)          │
│  8-Step Flow:                │    │  - Daily briefing card       │
│  1. Name confirm             │    │  - Chat interface            │
│  2. Education level          │    │  - Scheduler panel           │
│  3. Curriculum               │    │  - Calendar panel            │
│  4. Semester                 │    │  - Quick action chips        │
│  5. Syllabus upload          │    │                              │
│  6. Subject confirm          │    │  Sidebar Navigation:         │
│  7. Topics known             │    │  • Planner (active)          │
│  8. Profile reveal           │    │  • Mentor                    │
│     ↓ retain() fires         │    │  • Tests                     │
│     ↓ Navigates to /planner  │    │  • Profile                   │
└──────────────────────────────┘    │  • Memory (🧠 icon)          │
        ↓                           │  • Logout                    │
        └─────────────────────┬─────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    PLANNER (/planner)                            │
│  - Default post-login dashboard                                 │
│  - Memory-backed chat with Groq                                 │
│  - Daily briefing (recall + reflect)                            │
│  - Scheduler with clickable tasks → /mentor/[subject]           │
│  - Calendar with exam dates                                     │
└─────────────────────────────────────────────────────────────────┘
        ↓                    ↓                    ↓
        ↓                    ↓                    ↓
   [Click Mentor]      [Click Tests]        [Click Profile]
        ↓                    ↓                    ↓
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ MENTOR (/mentor) │  │ TESTS (/tests)   │  │PROFILE(/profile) │
│ - Subject grid   │  │ - Mode selection │  │ - Proficiency    │
│ - Proficiency %  │  │ - Quiz config    │  │   bars           │
│ - Last studied   │  │ - Timer          │  │ - Test history   │
│ - Weak areas     │  │ - MCQ interface  │  │ - Streak counter │
│                  │  │ - Results screen │  │ - XP display     │
│ [Click subject]  │  │ - AI insight     │  │ - View Memory    │
│      ↓           │  │ - retain() fires │  │   button         │
└──────────────────┘  └──────────────────┘  └──────────────────┘
        ↓                    ↓                    ↓
┌──────────────────────────────────────────────────────────────────┐
│         MENTOR/[SUBJECT] (/mentor/[subject])                     │
│  3-Panel Layout:                                                 │
│  - Left: Sources panel + Hindsight history                       │
│  - Center: Memory-backed chat with AI tutor                      │
│  - Right: Studio (Flashcards, Summary, Mind Map, Slide Deck)    │
│           + Pomodoro timer + Quiz launch button                  │
│                                                                  │
│  [Click Quiz button] → /tests (Mentor-assigned mode)            │
│  [Pomodoro complete] → retain() fires                           │
└──────────────────────────────────────────────────────────────────┘
        ↓
┌──────────────────────────────────────────────────────────────────┐
│                    MEMORY (/memory)                              │
│  - Full Memory Panel (also accessible via 🧠 sidebar icon)      │
│  - 4 Hindsight memory types:                                     │
│    • World (facts)                                               │
│    • Experiences (events with timestamps)                        │
│    • Observations (auto-synthesised patterns)                    │
│    • Opinions (beliefs with confidence scores)                   │
│  - Live reflect() summary at top                                 │
│  - Judge-facing demo screen                                      │
└──────────────────────────────────────────────────────────────────┘
```

## Navigation Summary

### From Landing Page
- ✅ Hero CTA → `/login`
- ✅ CTA Section → `/login`

### From Login Page
- ✅ Custom name → `/onboarding` (new user)
- ✅ Demo pill (Aryan/Priya) → `/planner` (demo user)

### From Onboarding
- ✅ Step 8 complete → `/planner` (after retain() fires)

### From Planner (Default Dashboard)
- ✅ Sidebar: Mentor → `/mentor`
- ✅ Sidebar: Tests → `/tests`
- ✅ Sidebar: Profile → `/profile`
- ✅ Sidebar: Memory (🧠) → `/memory` (or drawer)
- ✅ Sidebar: Logout → `/login`
- ✅ Scheduler task click → `/mentor/[subject]?topic=X`

### From Mentor (Subject Grid)
- ✅ Subject card click → `/mentor/[subject]`
- ✅ Sidebar navigation to other pages

### From Mentor/[Subject] (3-Panel)
- ✅ Quiz button → `/tests` (Mentor-assigned mode)
- ✅ Sidebar navigation to other pages

### From Tests
- ✅ Results screen "Go to Mentor" CTA → `/mentor`
- ✅ Sidebar navigation to other pages

### From Profile
- ✅ "View My Memory" button → `/memory`
- ✅ Test history row click → Expand Q&A review (inline)
- ✅ Sidebar navigation to other pages

### From Memory
- ✅ Sidebar navigation to other pages
- ✅ Also accessible as drawer from any page via 🧠 icon

## Protected Routes

All routes under `/app/(app)/` are protected:
- ✅ `/login` - Public (no auth required)
- ✅ `/onboarding` - Protected (requires userId, redirects to `/login` if missing)
- ✅ `/planner` - Protected (requires userId + onboarding complete)
- ✅ `/mentor` - Protected (requires userId + onboarding complete)
- ✅ `/mentor/[subject]` - Protected (requires userId + onboarding complete)
- ✅ `/tests` - Protected (requires userId + onboarding complete)
- ✅ `/profile` - Protected (requires userId + onboarding complete)
- ✅ `/memory` - Protected (requires userId + onboarding complete)

## Auth Flow

```
User visits any protected route
    ↓
ProtectedRoute component checks localStorage for userId
    ↓
    ├─ No userId → Redirect to /login
    │
    └─ userId exists → Check onboarding status
        ├─ onboarding NOT complete → Redirect to /onboarding
        └─ onboarding complete → Allow access to requested route
```

## Key Features

✅ **Landing → Login** - CTA buttons link to `/login`
✅ **Login → Onboarding/Planner** - Routes based on user type
✅ **Onboarding → Planner** - Auto-redirect after profile reveal
✅ **Sidebar Navigation** - Access all pages from any authenticated route
✅ **Memory Drawer** - Accessible from any page via 🧠 icon
✅ **Logout** - Returns to `/login`
✅ **Protected Routes** - Auth guard on all app pages
✅ **Deep Linking** - Scheduler tasks pre-load topic in Mentor

## Testing Navigation

```bash
# Test flow:
1. npm run dev
2. Visit http://localhost:3000
3. Click "Start free trial" → Should go to /login
4. Enter name → Should go to /onboarding
5. Complete onboarding → Should go to /planner
6. Click Mentor in sidebar → Should go to /mentor
7. Click subject → Should go to /mentor/[subject]
8. Click Tests in sidebar → Should go to /tests
9. Click Profile in sidebar → Should go to /profile
10. Click Memory icon → Should open drawer or go to /memory
11. Click Logout → Should go to /login
```
