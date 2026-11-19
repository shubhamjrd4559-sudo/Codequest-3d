---
phase: 1
title: Architecture and Planning
status: approved
approved_at: 2026-11-19
tech_stack: Next.js + Django REST Framework + PostgreSQL
---

# CodeQuest 3D — Architecture and Planning

## Scope and repository audit

This plan is based on the complete CodeQuest 3D master prompt. The project folder was empty when inspected: it contained no application code, configuration, tests, or Git repository. The prompt refers to visual references, but none were present in the inspected project folder or in the prompt text. The design direction below therefore follows the written brief; supplied references can refine it during UI/UX work.

The product is a playful but polished learning platform for programming fundamentals and data structures and algorithms. Students learn through topic lessons, visualizations, quizzes, curated video lectures, and 3D mini-games. Administrators manage users and learning content through a protected dashboard.

## Recommended architecture

Use an independently runnable and deployable JavaScript Next.js frontend and Python Django REST Framework backend, with PostgreSQL as the persistent database. The frontend owns page composition, interaction, visual rendering and client experience. The backend owns identity, permissions, curriculum content, scoring, progress and achievement records. The browser communicates with the backend through versioned JSON endpoints under `/api/v1/`; it never connects directly to PostgreSQL.

Keep both applications organized by feature and responsibility. Store topic, lesson, quiz, game and lecture metadata in the backend so administrators can manage content without editing frontend code. Treat frontend/backend shared concepts as documented API contracts rather than importing backend implementation into the frontend.

## Recommended folder structure

This is a proposed structure, not an implementation of it:

```text
CodeQuest-3D/
├── frontend/
│   ├── app/
│   │   ├── (public)/
│   │   ├── (student)/
│   │   ├── admin/
│   │   └── auth/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── learning/
│   │   ├── dashboard/
│   │   ├── quiz/
│   │   └── games/
│   ├── features/
│   │   ├── auth/ topics/ progress/ quizzes/ lectures/ achievements/
│   ├── games/
│   │   ├── engine/ registry/ scenes/
│   ├── hooks/
│   ├── lib/
│   │   ├── api/ auth/ config/
│   ├── styles/
│   ├── public/
│   │   ├── images/ models/
│   └── tests/
├── backend/
│   ├── config/                    # settings, root URLs, ASGI/WSGI
│   ├── apps/
│   │   ├── accounts/
│   │   ├── catalog/               # topics, lessons, games, levels, lectures
│   │   ├── assessments/           # quizzes, questions, attempts
│   │   ├── learning/              # progress and game attempts
│   │   ├── achievements/
│   │   └── analytics/
│   ├── api/v1/
│   ├── common/
│   ├── tests/
│   └── manage.py
├── docs/
│   ├── architecture/
│   ├── api/
│   └── decisions/
└── infra/
```

Keep the frontend and backend independently runnable. Add deployment configuration only when its requirements are known. Document API contracts and architecture decisions in `docs/`.

## Frontend architecture

Use Next.js and React for routes, page composition, navigation and rendering. Use Tailwind CSS for reusable design tokens and responsive UI components. Use Lucide React for interface icons and Framer Motion for purposeful transitions. Build a consistent visual system for typography, color, spacing, buttons, cards, navigation, badges and forms, guided by the colorful low-poly adventure aesthetic in the brief.

Organize routes into public, authentication, student and admin areas. Student pages include the dashboard, topic/lesson paths, games, quizzes, lectures, achievements and profile. Centralize HTTP behavior in an API client that handles the API base URL, authentication, response parsing and expected errors. Feature-level services/hooks should use this client instead of duplicating request logic in components.

Use backend responses for learner metrics, content, questions, lectures, attempts and progress. Design loading, empty, unavailable and error states alongside successful states; do not show a success result when an API operation failed. Load 3D scenes only when needed and make ordinary dashboard and lesson content usable without the 3D runtime.

## Backend architecture

Use Django REST Framework for JSON APIs, serializers, validation, permissions, pagination and consistent error handling. Suggested Django apps:

| App | Responsibility |
|---|---|
| `accounts` | Custom user, student profile, registration, roles and authentication |
| `catalog` | Topics, lessons, games, levels and video lectures |
| `assessments` | Quizzes, questions, answer submission and quiz attempts |
| `learning` | Lesson/topic progress and game attempts |
| `achievements` | Achievement definitions, rules and awards |
| `analytics` | Aggregated student and administrator reporting |

Use a custom Django user model before creating other migrations. Keep domain rules such as score validation, progress updates and achievement awards in service/domain logic, not scattered across views. Use transactions when a completion action must update multiple related records.

## Database relationship plan

Use PostgreSQL and normalized relationships. The planned models are:

| Model | Relationships and purpose |
|---|---|
| `User` | Authentication identity, unique login identifier, role and active state |
| `StudentProfile` | One-to-one with student user; learner-specific profile/settings |
| `Topic` | Curriculum unit; parent of lessons and related content |
| `Lesson` | Belongs to a topic; explanation, example, C++ sample, visualization metadata and order |
| `Game` | Game type, description and learning objective; associated with topics as appropriate |
| `GameLevel` | Belongs to a game; level configuration, difficulty and order |
| `Quiz` | Belongs to a topic or lesson; difficulty and optional timer configuration |
| `Question` | Belongs to a quiz; prompt, choices, correct-answer data and explanation |
| `QuizAttempt` | Belongs to user and quiz; answers/result, score and timestamps |
| `VideoLecture` | Belongs to a topic or lesson; curated title, description, YouTube identifier and order |
| `UserProgress` | Belongs to user and lesson/topic; completion status and timestamps |
| `GameAttempt` | Belongs to user and game/level; score, outcome, duration and attempt time |
| `Achievement` | Definition, description and award criteria |
| `UserAchievement` | Join record between user and achievement with earned timestamp |

Add appropriate uniqueness constraints, foreign-key deletion behavior, field validation and indexes for common lookups (user, topic, status, difficulty and timestamps). Enforce nonnegative scores/XP and prevent duplicate achievement awards. Attempt and progress records should be authoritative; derived dashboard summaries can be cached later if required.

## API development plan

Use `/api/v1/` as the versioned base path. Planned endpoint groups include:

| Area | Example endpoints |
|---|---|
| Authentication | `POST /auth/register/`, `POST /auth/token/`, `POST /auth/token/refresh/`, `POST /auth/logout/`, `GET /auth/me/` |
| Topics/lessons | `GET /topics/`, `GET /topics/{slug}/`, `GET /topics/{slug}/lessons/`, `GET /lessons/{id}/` |
| Games | `GET /games/`, `GET /games/{slug}/`, `GET /games/{slug}/levels/` |
| Game attempts | `POST /game-attempts/`, `GET /game-attempts/me/` |
| Quizzes | `GET /quizzes/`, `GET /quizzes/{id}/`, `POST /quizzes/{id}/attempts/`, `GET /quiz-attempts/me/` |
| Lectures | `GET /lectures/`, `GET /topics/{slug}/lectures/`, protected admin create/update/delete endpoints |
| Progress | `GET /progress/me/`, `POST /progress/lessons/{id}/complete/`, `GET /dashboard/summary/` |
| Achievements | `GET /achievements/`, `GET /achievements/me/` |
| Administration | Protected topic, lesson, question, game, student and analytics endpoints under `/admin/` |

Finalize schemas and status codes in API documentation before integration. Paginate collections and support appropriate filtering. The initial quiz payload must not reveal answer keys; scoring and explanations should be returned according to the attempt flow. Validate client-reported game outcomes and scores server-side to prevent arbitrary XP or score submissions.

## Authentication and roles

Represent student and admin roles in the custom user model and enforce authorization in backend permissions. Public users can browse content marked public. Students can access learning content and only their own profile, progress and attempts. Admins can manage content and view authorized student reporting. Hiding admin UI controls is not an authorization boundary; the server must reject unauthorized requests.

JWT authentication should support registration, login, refresh and logout. Choose token transport deliberately. For browser clients, secure HttpOnly cookies with suitable Secure and SameSite attributes are preferable to casually storing long-lived tokens in local storage, but require consistent CSRF and CORS configuration. Add password validation and login throttling.

## Learning, quizzes, lectures and progress integration

Make each topic the entry point to a structured learning journey: introduction, simple explanation, real-life example, animated visualization, mini-game, quiz, C++ example, related lecture and completion state. The backend supplies ordered content and persisted state; frontend pages compose the experience and launch the relevant activity.

Record lesson completion, quiz attempts and game attempts through explicit API actions. Dashboard cards should derive from these records: continue learning from incomplete lessons, recent scores from attempts, streaks from activity history, and achievements from earned awards. Keep progress updates consistent when an activity records multiple related effects.

Administrators supply real curated lecture identifiers and metadata. Embed only the identifier stored for that lecture; do not invent IDs or present placeholders as real videos. Include lecture notes, next-lecture links and completion tracking as content becomes available.

## 3D game architecture

Use Three.js through React Three Fiber, with Drei for shared scene utilities. Create a reusable game shell for canvas setup, camera/lighting defaults, resizing, loading, controls, instructions, score display, reset, completion feedback and fallback rendering. Keep games as independently loadable scene modules selected through a game registry.

Each scene should define a learning objective, a small state model, interaction rules, reusable visual elements, scoring/completion events, reset behavior and a fallback interaction. Planned games and learning links:

| Game | Learning focus |
|---|---|
| Logic Builder | Fundamentals, conditions and sequence logic |
| Number Sorting Challenge | Arrays and sorting |
| Stack Tower | Push/pop and LIFO |
| Queue Ticket Counter | Enqueue/dequeue and FIFO |
| Linked List Node Connection | Nodes, pointers, insertion and traversal |
| Tree Traversal Challenge | Tree structure and traversal orders |
| Treasure Search | Linear and binary search strategies |

Keep scenes focused on the lesson. Load a scene and its assets on demand; use lightweight geometry and limit unnecessary effects and objects. Provide touch-friendly controls and a 2D or simplified mode for devices that cannot run the full scene smoothly. Avoid loading all games on dashboard pages.

## Security and privacy considerations

- Keep secrets and database credentials out of source control; use environment configuration and separate development/production settings.
- Restrict CORS to intended frontend origins and configure CSRF consistently with the chosen JWT transport.
- Validate all client input server-side, including answer submissions, scores, identifiers, completion changes and admin edits.
- Enforce object-level permissions so students cannot access another student's records.
- Do not expose quiz answer keys before the appropriate point in an attempt.
- Validate lecture/embed data and avoid accepting arbitrary unsafe embed HTML.
- Use HTTPS and secure cookie settings in production.
- Paginate collections and apply sensible request limits to attempt and content APIs.
- Collect only student information necessary for the product; define privacy and retention expectations before launching to schools.

## Technical challenges and performance risks

- **Low-end/mobile 3D:** limited GPU and memory can cause slow rendering or context loss. Use compact scenes, lazy loading, simplified rendering and a non-3D path.
- **Initial bundle size:** Three.js and assets can slow first load. Keep game code out of landing/dashboard bundles and load only the active scene.
- **Touch usability:** mobile interactions need large targets and must not rely on precision mouse movement.
- **Progress consistency:** attempts, completion and rewards can diverge across separate writes. Define completion events and use transactional updates where needed.
- **Untrusted scores:** the browser can be modified. Design verifiable outcomes and validate them on the backend.
- **Content integrity:** admin edits may create invalid ordering, incomplete topics or broken embeds. Add validations and clear management workflows.
- **JWT configuration:** cookie, CSRF and CORS choices interact. Settle the token strategy before implementing auth.
- **Project breadth:** the full curriculum and seven games are substantial. Prove the integrated flow with a small vertical slice before expanding.
- **Missing visual references:** the written brief is present but referenced images were not found in the inspected project folder; incorporate them when available during Antigravity refinement.

## Phase-wise development roadmap

| Phase | Scope and review checkpoint |
|---|---|
| 1. Architecture and planning | Confirm architecture, data boundaries, API conventions, authentication approach and delivery sequence. |
| 2. Design system and frontend foundation | Refine UI/UX in Antigravity; implement approved tokens, layouts, responsive components and page shells in Next.js. Review reference alignment and responsive behavior. |
| 3. Django backend and database | Establish Django structure, custom user, domain apps, PostgreSQL configuration, initial models/constraints and admin setup. Review relationships and migrations. |
| 4. Authentication and API integration | Implement JWT flows, permissions, API client and protected routes. Review role enforcement and session/error handling. |
| 5. DSA learning modules | Build topic/lesson APIs and learning paths with explanations, examples, C++ samples and completion tracking. Start with a narrow curriculum slice. |
| 6. Reusable 3D game engine | Implement shared shell, loading, controls, reset, completion contract and fallback. Review performance on target devices. |
| 7. Topic-based mini-games | Add games incrementally, each tied to a learning objective and validated attempt record. Review each game before expanding. |
| 8. Quiz and video integration | Add managed questions, scoring, explanations, history, retry flows and curated lecture embeds with completion state. |
| 9. Achievements and analytics | Add reward rules, achievement records, dashboard summaries and admin reports; validate aggregates against source records. |
| 10. Testing and deployment | Add frontend/backend tests and interaction checks, verify performance/security configuration, document deployment and deploy only with explicit authorization. |

Before each major phase, inspect current code, list affected files and prepare an implementation plan. After each phase, report changes and verification results and wait for review before starting the next phase. Do not push to GitHub or deploy without explicit permission.

## Delivery recommendation

Start with one complete vertical slice: a learner registers, opens one topic, completes a lesson, plays its linked game, takes its quiz, and sees the result reflected in progress and the dashboard. This validates the integration contracts early. Expand the topic catalog and game set after the slice is reviewed.

Use Antigravity for UI/UX refinement and Codex for the main repository implementation. Treat approved design and interaction decisions as implementation inputs, and review every phase before proceeding.
