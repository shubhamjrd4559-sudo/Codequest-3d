# ✨ CodeQuest 3D — Feature Catalog

This document provides a comprehensive technical catalog of all implemented and planned features in **CodeQuest 3D**, detailing their user workflows, API integration, and architectural status.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Implemented Features](#-implemented-features)
  - [1. Authentication & Identity Management](#1-authentication--identity-management)
  - [2. Student Command Dashboard](#2-student-command-dashboard)
  - [3. Daily Quiz & GitHub-Style Heatmap](#3-daily-quiz--github-style-heatmap)
  - [4. Gamified 4-Tier Topic Quizzes](#4-gamified-4-tier-topic-quizzes)
  - [5. 3D Mini-Games Arcade](#5-3d-mini-games-arcade)
  - [6. Structured Learning Path & Lesson Reader](#6-structured-learning-path--lesson-reader)
  - [7. Global Leaderboard & XP Ranking](#7-global-leaderboard--xp-ranking)
  - [8. Achievements & Badges System](#8-achievements--badges-system)
  - [9. Video Concept Help Library](#9-video-concept-help-library)
  - [10. Cosmic Glassmorphic UI & Theme](#10-cosmic-glassmorphic-ui--theme)
- [Planned Features (Roadmap)](#-planned-features-roadmap)
  - [1. In-Browser Code Execution Sandbox](#1-in-browser-code-execution-sandbox)
  - [2. Real-Time Multiplayer Quiz Battles](#2-real-time-multiplayer-quiz-battles)
  - [3. Teacher & Classroom Administration](#3-teacher--classroom-administration)
  - [4. Mobile Application & Offline Caching](#4-mobile-application--offline-caching)
- [Feature Status Matrix](#-feature-status-matrix)

---

## 🧭 Overview

CodeQuest 3D combines educational cognitive pedagogy with modern gaming reward loops. Features are designed to prevent cognitive fatigue by alternating between theoretical reading, tactile 3D simulations, and quick gamified assessments.

---

## 🚀 Implemented Features

### 1. Authentication & Identity Management
- **Endpoints:** `POST /api/v1/auth/register/`, `POST /api/v1/auth/token/`, `POST /api/v1/auth/token/refresh/`, `POST /api/v1/auth/logout/`, `GET /api/v1/auth/me/`
- **Frontend Views:** `/login`, `/register`
- **Features:**
  - Standard email and password registration with client and server password strength checks.
  - JWT token exchange with refresh rotation and server-side token revocation on logout.
  - Pre-seeded **"Use Demo Account"** button (`hero@codequest.dev`) enabling one-click evaluation without registration friction.
  - Persistent auth context with automatic token refresh on 401 status.

### 2. Student Command Dashboard
- **Frontend Route:** `/dashboard`
- **Components:** `components/dashboard/QuickQuizSection.tsx`, `components/ui/Sidebar.tsx`
- **Features:**
  - Real-time stat cards displaying current level, total XP, current streak (days), and completed DSA modules.
  - "Continue Learning" shortcut card pointing directly to the learner's next active lesson.
  - Daily Quiz status card allowing immediate daily challenge participation.
  - Interactive 3D Boy Character, Robot Mascot, and Floating Island artwork.

### 3. Daily Quiz & GitHub-Style Heatmap
- **Endpoints:** `GET /api/v1/quizzes/daily/`, `POST /api/v1/quizzes/daily/submit/`, `GET /api/v1/user/heatmap/`
- **Frontend Views:** `/dashboard` (card), `/profile` (full heatmap)
- **Features:**
  - **Daily Rotation Queue:** 200 curated C++ & DSA conceptual multiple-choice questions seeded in the database.
  - **Streak Engine:** Submitting the correct daily answer awards **+15 XP** and increments the student's active streak.
  - **Contribution Graph:** 365-day horizontal grid (`52 weeks × 7 days`) replicating the GitHub contribution experience.
  - **Visual Feedback:** Empty days appear in dark translucent glass (`bg-white/5`); completed days glow in vibrant neon emerald (`bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]`). Hover tooltips reveal the completion date.

### 4. Gamified 4-Tier Topic Quizzes
- **Endpoints:** `GET /api/v1/quizzes/`, `POST /api/v1/quiz-attempts/`
- **Frontend Views:** `/quizzes/[slug]`, `/topics/[slug]`
- **Components:** `components/quiz/LevelMap.tsx`, `components/quiz/QuizHUD.tsx`, `components/quiz/ConfettiBurst.tsx`
- **Features:**
  - **Candy Crush-Style Level Map:** Four progressive difficulty tiers per topic:
    1. *Level 1: Foundation* — Basic definition and terminology.
    2. *Level 2: Core Logic* — Array indexing, pointer shifts, and basic traversals.
    3. *Level 3: Pattern Builder* — Algorithmic patterns and edge-case handling.
    4. *Level 4: Grandmaster* — Time/space complexity trade-offs and optimization.
  - **Interactive States:** Locked (grey with padlock), Unlocked (pulsing neon glow), and Completed (emerald checkmark).
  - **Dynamic Quiz HUD:** Live countdown timer (Hourglass ⏳), lives counter (Hearts ❤️), XP tally (Star ⭐), and animated progress bar.
  - **Vibrant MCQ Buttons:** Pill-shaped options with neon color coding. Selecting a correct answer triggers a multi-particle confetti burst; selecting an incorrect answer causes a Framer Motion left-to-right shake animation.

### 5. 3D Mini-Games Arcade
- **Endpoints:** `GET /api/v1/games/`, `GET /api/v1/game-levels/`, `POST /api/v1/game-attempts/`
- **Frontend Views:** `/mini-games`, `/mini-games/[slug]`
- **Scenes Implemented:**
  1. **Stack Tower (`StackTowerScene.tsx`):** Demonstrates LIFO operations. Players physically push items onto the tower and pop them to clear obstacles, observing stack overflow limits.
  2. **Queue Counter (`QueueCounterScene.tsx`):** Demonstrates FIFO operations. Learners manage customer queues at a ticket booth, routing arrivals and departures in order.
  3. **Number Sorting (`NumberSortingScene.tsx`):** Demonstrates Bubble Sort and visual comparisons. Interactive bars swap positions in 3D space with highlighted comparison pointers.
  4. **Linked List (`LinkedListScene.tsx`):** Demonstrates pointer linkages. Players connect node memory addresses, update `next` pointers, and insert nodes in the middle of lists.
  5. **Tree Traversal (`TreeTraversalScene.tsx`):** Demonstrates Binary Tree traversals. Learners trace Pre-order, In-order, and Post-order paths across glowing branches.
  6. **Treasure Search (`TreasureSearchScene.tsx`):** Demonstrates Binary Search. Learners bisect 3D terrain grids using low/mid/high pointers to locate hidden chests in logarithmic steps.
  7. **Logic Builder (`LogicBuilderScene.tsx`):** Demonstrates Boolean logic and conditionals. Players configure gates and conditional paths to power algorithmic circuits.

### 6. Structured Learning Path & Lesson Reader
- **Endpoints:** `GET /api/v1/learning/path/`, `GET /api/v1/learning/lessons/{id}/`, `POST /api/v1/learning/lessons/{id}/bookmark/`, `POST /api/v1/lessons/{id}/complete/`
- **Frontend Views:** `/learning`, `/learning/lessons/[lessonId]`
- **Features:**
  - Curriculum organized into Modules → Chapters → Lessons.
  - Comprehensive lesson reader supporting theoretical introductions, syntax-highlighted code blocks, real-world analogies, and interactive visual cards.
  - Instant progress toggling with checkmarks and server-persisted completion status.
  - Bookmarking capability to save challenging lessons for later review.

### 7. Global Leaderboard & XP Ranking
- **Endpoint:** `GET /api/v1/leaderboard/`
- **Frontend View:** `/leaderboard`
- **Features:**
  - Displays the Top 20 learners globally, sorted by `total_xp`.
  - Podium styling for Top 3 learners with Gold, Silver, and Bronze neon badges.
  - Displays user avatar, display name, level badge, and total XP.

### 8. Achievements & Badges System
- **Endpoint:** `GET /api/v1/achievements/`
- **Frontend View:** `/achievements`
- **Features:**
  - Grid of achievement badges with custom icons, descriptions, and XP rewards.
  - Visual distinctions: Unlocked achievements glow with vibrant neon borders; locked achievements appear frosted with padlock overlays.

### 9. Video Concept Help Library
- **Endpoint:** `GET /api/v1/video-lectures/`
- **Frontend View:** `/videos`
- **Features:**
  - Searchable DSA video library organized by topics.
  - Glassmorphic cards featuring YouTube video thumbnails, topic tags, and "Watch Now" modals.

### 10. Cosmic Glassmorphic UI & Theme
- **Design Tokens:** `frontend/design-system/tokens.ts`, `frontend/DESIGN.md`
- **Components:** `components/ui/`
- **Features:**
  - Deep cosmic space palette (`#070814`) with translucent glassmorphic surfaces (`backdrop-blur-2xl`).
  - Neon accent system: Purple (`#8B5CF6`), Cyan (`#06B6D4`), Yellow (`#FACC15`), Emerald (`#10B981`), Pink (`#EC4899`).
  - Signature animated branding: **CodeQuest by shubh5585** with radiant pulsing yellow glow.

---

## 🔮 Planned Features (Roadmap)

### 1. In-Browser Code Execution Sandbox
- **Status:** Planned (Phase 11)
- **Goal:** Allow learners to write real C++ and Python code directly inside the lesson reader, compiling in-browser using WebAssembly (via Clang/Wasm) or a sandboxed backend runner.

### 2. Real-Time Multiplayer Quiz Battles
- **Status:** Planned (Phase 12)
- **Goal:** Enable live 1v1 algorithmic speed duels using WebSockets (Django Channels). Players answer identical questions simultaneously with real-time score updates.

### 3. Teacher & Classroom Administration
- **Status:** Planned (Phase 13)
- **Goal:** Allow educators to create virtual classrooms, assign curated topic quests to student rosters, and monitor class-wide completion heatmaps.

### 4. Mobile Application & Offline Caching
- **Status:** Planned (Phase 14)
- **Goal:** Package CodeQuest 3D as a Progressive Web App (PWA) with offline quiz caching, push notifications for daily streaks, and mobile-optimized touch controls for 3D mini-games.

---

## 📊 Feature Status Matrix

| Feature | Category | Status | API Endpoint(s) | Primary Component / Route |
|---|---|---|---|---|
| JWT Auth & Registration | Core | ✅ Implemented | `/api/v1/auth/*` | `app/(auth)/` |
| Student Dashboard | UI/UX | ✅ Implemented | `/api/v1/dashboard/summary/` | `app/(student)/dashboard` |
| Daily C++ Quiz Engine | Gamification | ✅ Implemented | `/api/v1/quizzes/daily/*` | `components/dashboard/QuickQuizSection.tsx` |
| 365-day Activity Heatmap | Analytics | ✅ Implemented | `/api/v1/user/heatmap/` | `components/profile/ActivityHeatmap.tsx` |
| 4-Tier Topic Quizzes | Curriculum | ✅ Implemented | `/api/v1/quizzes/`, `/api/v1/quiz-attempts/` | `components/quiz/TopicQuizRunner.tsx` |
| 7 3D Mini-Games Scenes | 3D Graphics | ✅ Implemented | `/api/v1/game-attempts/` | `frontend/games/scenes/*` |
| Learning Path & Lessons | Curriculum | ✅ Implemented | `/api/v1/learning/*` | `app/(student)/learning/` |
| Global Top 20 Leaderboard | Social | ✅ Implemented | `/api/v1/leaderboard/` | `app/(student)/leaderboard` |
| Achievements Badges | Gamification | ✅ Implemented | `/api/v1/achievements/` | `app/(student)/achievements` |
| Video Help Library | Content | ✅ Implemented | `/api/v1/video-lectures/` | `app/(student)/videos` |
| Code Execution Sandbox | Compiler | ⏳ Planned | TBD | In-lesson IDE |
| Live Multiplayer Battles | Multiplayer | ⏳ Planned | WebSocket `/ws/battle/` | Battle Arena |
| Teacher Management Portal | Enterprise | ⏳ Planned | `/api/v1/classrooms/*` | `app/teacher/` |
| Mobile PWA Support | Platform | ⏳ Planned | Service Worker API | Manifest & Cache |
