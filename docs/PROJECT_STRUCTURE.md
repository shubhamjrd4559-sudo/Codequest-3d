# 📁 CodeQuest 3D — Project Structure & File Reference

This document provides a detailed directory map and architectural breakdown of the **CodeQuest 3D** repository.

---

## 📑 Table of Contents

- [Root Directory Layout](#-root-directory-layout)
- [Backend Structure (`backend/`)](#-backend-structure-backend)
- [Frontend Structure (`frontend/`)](#-frontend-structure-frontend)
- [Documentation Structure (`docs/`)](#-documentation-structure-docs)
- [Community & Workflows (`.github/`)](#-community--workflows-github)

---

## 🌳 Root Directory Layout

```text
CodeQuest-3D/
├── backend/                  # Django REST Framework API application
├── frontend/                 # Next.js 14 App Router web client
├── docs/                     # Architectural, setup, and developer documentation
├── .github/                  # GitHub issue templates and PR templates
├── .gitignore                # Global git ignore configuration
├── CONTRIBUTING.md            # Contributor guidelines and workflow
├── CODE_OF_CONDUCT.md        # Contributor Covenant Code of Conduct
├── SECURITY.md               # Security vulnerability reporting protocol
├── CHANGELOG.md              # Historical release notes and phase log
├── LICENSE                   # MIT open-source license
└── README.md                 # Project introduction and quick-start guide
```

---

## 🐍 Backend Structure (`backend/`)

```text
backend/
├── apps/                               # Domain-specific Django applications
│   ├── accounts/                       # Identity & Authentication
│   │   ├── models.py                   # User (custom AbstractUser) & StudentProfile
│   │   ├── views.py                    # Login, Register, Refresh, Logout, Me views
│   │   ├── serializers.py              # User & profile serializers
│   │   └── urls.py                     # /api/v1/auth/* routes
│   │
│   ├── achievements/                   # Badges & Rewards
│   │   ├── models.py                   # Achievement & UserAchievement models
│   │   ├── views.py                    # AchievementViewSet
│   │   ├── serializers.py              # Achievement serializers
│   │   └── urls.py                     # /api/v1/achievements/* routes
│   │
│   ├── analytics/                      # Reporting & Insights
│   │   ├── views.py                    # LeaderboardView & UserHeatmapView
│   │   ├── serializers.py              # Aggregated metrics serializers
│   │   └── urls.py                     # /api/v1/leaderboard/ & /api/v1/user/heatmap/
│   │
│   ├── assessments/                    # Quizzes & Assessments
│   │   ├── models.py                   # Quiz, Question, DailyQuestion, QuizAttempt, DailyQuizAttempt
│   │   ├── views.py                    # DailyQuestionView, DailyQuizSubmitView, QuizViewSet
│   │   ├── serializers.py              # Quiz submission & scoring serializers
│   │   └── urls.py                     # /api/v1/quizzes/* routes
│   │
│   ├── catalog/                        # Curriculum Metadata
│   │   ├── models.py                   # Topic, Lesson, Game, GameLevel, VideoLecture
│   │   ├── views.py                    # Viewsets for topics, lessons, games, lectures
│   │   ├── serializers.py              # Catalog serialization
│   │   └── urls.py                     # /api/v1/topics/, /api/v1/lessons/, etc.
│   │
│   └── learning/                       # Learning Modules & Progression
│       ├── models.py                   # LearningModule, LearningChapter, LessonProgress, GameAttempt
│       ├── views.py                    # LearningPathView, LessonDetailView, BookmarkToggleView
│       ├── serializers.py              # Progression serializers
│       └── urls.py                     # /api/v1/learning/* routes
│
├── config/                             # Django Project Configuration
│   ├── settings.py                     # Core settings, database, CORS, JWT config
│   ├── urls.py                         # Root API router (/api/v1/*)
│   ├── asgi.py                         # ASGI interface
│   └── wsgi.py                         # WSGI interface
│
├── daily_questions.json                # 200 pre-seeded C++ & DSA daily questions fixture
├── quiz_data.json                      # Topic quiz curriculum seed data fixture
├── fix_and_seed.py                     # Database seeder for topics, lessons, and quizzes
├── seed_daily_questions.py             # Database seeder for daily questions
├── manage.py                           # Django CLI executable
├── .env.example                        # Template for backend environment variables
└── db.sqlite3                          # Local development database (SQLite)
```

---

## ⚛️ Frontend Structure (`frontend/`)

```text
frontend/
├── app/                                # Next.js 14 App Router
│   ├── (auth)/                         # Unauthenticated Auth Route Group
│   │   ├── login/page.tsx              # Student login view
│   │   ├── register/page.tsx           # Student signup view
│   │   └── layout.tsx                  # Auth shell with floating islands & logo
│   │
│   ├── (public)/                       # Public Landing Page Route Group
│   │   └── page.tsx                    # Landing page with 3D hero, features, and CTA
│   │
│   ├── (student)/                      # Authenticated Student Route Group
│   │   ├── dashboard/page.tsx          # Student command center & summary stats
│   │   ├── learning/                   # Learning Path & Lesson Reader
│   │   │   ├── page.tsx                # Curriculum roadmap overview
│   │   │   └── lessons/[lessonId]/     # Interactive lesson reader view
│   │   ├── mini-games/                 # 3D Mini-Games Arcade
│   │   │   ├── page.tsx                # Arcade game portal & cards
│   │   │   └── [slug]/page.tsx         # Dedicated 3D game canvas shell
│   │   ├── quizzes/                    # Gamified Topic Quizzes
│   │   │   ├── page.tsx                # Quiz topic index
│   │   │   └── [slug]/page.tsx         # Candy Crush level map & quiz runner
│   │   ├── leaderboard/page.tsx        # Global Top 20 XP leaderboard
│   │   ├── achievements/page.tsx       # Unlocked & locked badges grid
│   │   ├── profile/page.tsx            # User profile & 365-day Activity Heatmap
│   │   ├── videos/page.tsx             # DSA video concept help library
│   │   └── layout.tsx                  # Student layout with glowing top sidebar
│   │
│   ├── fonts/                          # Local typography assets (Geist Sans, Geist Mono)
│   ├── layout.tsx                      # Root layout, AuthProvider, and HTML head
│   └── globals.css                     # Global styles and Tailwind base imports
│
├── components/                         # Reusable Component Library
│   ├── characters/                     # 3D Characters & Procedural Art
│   │   ├── BoyCharacter.tsx            # Animated 3D student character
│   │   ├── RobotMascot.tsx             # Floating AI robot mascot
│   │   └── FloatingIsland.tsx          # Background procedural floating islands
│   │
│   ├── dashboard/                      # Dashboard UI Modules
│   │   └── QuickQuizSection.tsx        # Daily Quiz card and submission logic
│   │
│   ├── games/                          # Arcade Game Shell
│   │   ├── GameShell.tsx               # 3D WebGL canvas container & HUD controls
│   │   └── gameCatalog.ts              # Game metadata, descriptions, and scene links
│   │
│   ├── illustrations/                  # Isometric & Thematic Illustrations
│   │   ├── Array3DStage.tsx            # 3D visual array stage
│   │   ├── HeroCharacter.tsx           # Hero section character artwork
│   │   ├── HeroScene3D.tsx             # Interactive 3D hero scene
│   │   └── StatCardIcons.tsx           # Custom glowing stat card iconography
│   │
│   ├── profile/                        # Profile Components
│   │   └── ActivityHeatmap.tsx         # 365-day horizontal-scrolling contribution graph
│   │
│   ├── quiz/                           # Gamified Quiz Modules
│   │   ├── ConfettiBurst.tsx           # Lightweight canvas confetti trigger
│   │   ├── GamifiedQuiz.tsx            # Interactive MCQ questions runner
│   │   ├── LevelMap.tsx                # Candy Crush 4-tier level path
│   │   ├── QuizCardArtwork.tsx         # Glassmorphic card illustrations
│   │   ├── QuizHUD.tsx                 # Top bar: Hearts, timer, XP, progress
│   │   └── TopicQuizRunner.tsx         # Quiz attempt lifecycle controller
│   │
│   └── ui/                             # Design System Atom Primitives
│       ├── Badge.tsx                   # Glassmorphic pill badge
│       ├── Button.tsx                  # Glowing neon button with variant support
│       ├── Card.tsx                    # Glassmorphic frosted card container
│       ├── Input.tsx                   # Styled cosmic form input
│       ├── MobileNav.tsx               # Responsive mobile navigation menu
│       ├── NavigationBar.tsx           # Top navigation bar with glowing branding
│       └── Sidebar.tsx                 # Student view top navigation with active indicators
│
├── games/                              # Interactive 3D Three.js / R3F Scenes
│   └── scenes/
│       ├── StackTowerScene.tsx         # LIFO stack push/pop 3D challenge
│       ├── QueueCounterScene.tsx       # FIFO queue customer ticket challenge
│       ├── NumberSortingScene.tsx      # Visual bar comparison & bubble sorting
│       ├── LinkedListScene.tsx         # Memory node pointer chaining
│       ├── TreeTraversalScene.tsx      # Binary tree DFS/BFS branch traversal
│       ├── TreasureSearchScene.tsx     # 3D grid binary search challenge
│       └── LogicBuilderScene.tsx       # Boolean logic gate wiring puzzle
│
├── lib/                                # Utilities & Network Layer
│   ├── api/                            # API Services & Client
│   │   ├── client.ts                   # Axios client with JWT refresh queue
│   │   ├── auth.ts                     # Auth API service calls
│   │   ├── dashboard.ts                # Dashboard metrics service calls
│   │   ├── learning.ts                 # Learning path & lessons service calls
│   │   ├── leaderboard.ts              # Leaderboard API calls
│   │   ├── achievements.ts             # Achievements API calls
│   │   └── types.ts                    # Shared TypeScript data models
│   └── utils.ts                        # Tailwind class merge utility (`cn`)
│
├── context/                            # React Context Providers
│   └── AuthContext.tsx                 # Global authentication and session state
│
├── design-system/                      # Theme & Token Specifications
│   └── tokens.ts                       # Core color palette, shadows, and spacing tokens
│
├── public/                             # Public Static Media
│   ├── images/                         # Artwork, backgrounds, and thumbnails
│   └── favicon.ico                     # Platform favicon
│
├── tailwind.config.ts                  # Tailwind configuration with cosmic theme tokens
├── tsconfig.json                       # TypeScript compiler options
└── package.json                        # Node dependencies and scripts
```

---

## 📚 Documentation Structure (`docs/`)

```text
docs/
├── ARCHITECTURE.md                     # High-level architecture, ER diagrams, data flow
├── FEATURES.md                         # Complete feature catalog and status matrix
├── SETUP.md                            # Comprehensive local setup and troubleshooting
├── DEVELOPMENT.md                      # Engineering guidelines, Git flow, and standards
├── PROJECT_STRUCTURE.md                # Comprehensive repository layout (this file)
├── ROADMAP.md                          # Release history, milestones, and future phases
├── PROJECT_IDEA.md                     # Foundational master prompt & curriculum vision
├── README.md                           # Documentation directory index
├── api/
│   ├── endpoints.md                    # REST API endpoint specifications
│   └── models.md                       # Data model definitions and relationships
└── images/                             # Verified screenshots and architecture diagrams
    ├── landing_hero.png
    ├── dashboard.png
    ├── activity_heatmap.png
    ├── leaderboard.png
    ├── achievements.png
    └── learning_topic.png
```

---

## 👥 Community & Workflows (`.github/`)

```text
.github/
├── ISSUE_TEMPLATE/
│   ├── bug_report.md                   # Structured bug report submission template
│   └── feature_request.md              # Structured feature proposal template
└── PULL_REQUEST_TEMPLATE.md            # Pull request review and testing checklist
```
