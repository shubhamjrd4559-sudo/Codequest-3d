# 📜 Changelog — CodeQuest 3D

All notable changes to the **CodeQuest 3D** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- **In-Browser Code Execution Sandbox:** Interactive C++ / Python editor with WebAssembly compiler.
- **Multiplayer Quiz Battles:** Live 1v1 algorithmic duel arena via WebSockets (Django Channels).
- **Teacher Classroom Portal:** Class rosters, assignment tracking, and analytics heatmaps.
- **PWA Offline Mode:** Service worker caching for offline practice on mobile devices.

---

## [0.1.0-alpha] — 2026-11-24

### Added
- **JWT Authentication Engine:**
  - Standard user registration, token obtain, refresh rotation, and logout endpoints.
  - Server-side token blacklisting for revoked refresh tokens.
  - One-click demo login (`hero@codequest.dev`) on auth views.
- **Interactive Student Command Center:**
  - Real-time stat cards (Level, Total XP, Current Streak, Completed Modules).
  - Quick action "Continue Learning" shortcut card.
- **Daily Quiz Rotation & Streak System:**
  - Database table of 200 date-rotated C++ & DSA conceptual questions.
  - Daily quiz submission API with streak tracking and +15 XP rewards.
- **GitHub-Style Contribution Heatmap:**
  - 365-day horizontal-scrolling contribution graph (`52 weeks × 7 days`).
  - Interactive hover tooltips displaying completion dates.
  - Glowing emerald cells on completed quiz days (`bg-emerald-500`).
- **Gamified 4-Tier Topic Quizzes:**
  - Candy Crush-style visual Level Map (Foundation, Core Logic, Pattern Builder, Grandmaster).
  - Pill-shaped MCQ buttons with distinct neon colors and hover scaling.
  - Multi-particle confetti burst animation on correct answers.
  - Framer Motion shake animation on incorrect selections.
  - Playful Quiz HUD with lives (Hearts ❤️), countdown timer (Hourglass ⏳), and XP counter (Star ⭐).
- **3D Mini-Games Arcade (Three.js & React Three Fiber):**
  - Dedicated 3D game shell container with attempts score tracking (`/api/v1/game-attempts/`).
  - Seven playable algorithmic 3D scenes:
    - *Stack Tower* (LIFO stack push/pop mechanics)
    - *Queue Counter* (FIFO queue ticket challenge)
    - *Number Sorting* (Bubble sort with visual bar swaps)
    - *Linked List* (Pointer linking and node chain updates)
    - *Tree Traversal* (Binary tree DFS/BFS branch navigation)
    - *Treasure Search* (Binary search grid bisection)
    - *Logic Builder* (Boolean logic circuits)
- **Structured Learning Path & Lesson Reader:**
  - Hierarchical curriculum structure (Topics → Modules → Chapters → Lessons).
  - Lesson reader with formatted theory, real-world analogies, and C++ code blocks.
  - Progress completion toggling and lesson bookmarking.
  - Topic search API (`GET /api/v1/learning/search/?q={query}`).
- **Global Leaderboard & Achievements:**
  - Global Top 20 XP rankings with Gold, Silver, and Bronze podium highlights.
  - Unlocked vs locked achievement badges grid with custom iconography and XP rewards.
- **Video Concept Help Library:**
  - Curated DSA video library with real-time topic search, glassmorphic cards, and YouTube links.
- **Cosmic Glassmorphic Design System:**
  - Deep space color palette (`#070814`) with translucent glassmorphic surfaces (`backdrop-blur-2xl`).
  - Neon accents (Purple `#8B5CF6`, Cyan `#06B6D4`, Yellow `#FACC15`, Emerald `#10B981`, Pink `#EC4899`).
  - Procedural 3D Boy Character, AI Robot Mascot, and Floating Island artwork.

### Changed
- **Branding Update (Phase 10.1):**
  - Refactored brand presentation across Sidebar, NavigationBar, and Auth layout.
  - Vertical stacked column layout:
    - Line 1: `CodeQuest` (Bold white)
    - Line 2: `by shubh5585` (Vibrant yellow with active pulsating neon glow)

### Fixed
- Fixed token refresh race condition using Axios failed request queueing in `lib/api/client.ts`.
- Resolved Next.js chunk compilation cache conflicts during concurrent build and dev sessions.
- Corrected question ordering and index constraints in database seed fixtures.
