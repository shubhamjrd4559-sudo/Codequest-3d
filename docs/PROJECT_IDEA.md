---
title: CodeQuest 3D — Master Project Vision
status: active
author: Shubham
---

# CODEQUEST 3D
## Complete Full-Stack Application Development Master Prompt

Act as a Senior Software Architect, UI/UX Designer, 3D Game Developer, Full-Stack Engineer and Database Architect.

I want to build a complete educational gaming platform named CODEQUEST 3D.

The application must be a professional, fully functional and visually impressive web application that teaches basic programming and Data Structures & Algorithms to school students and beginners through interactive games, 3D animations, puzzles, quizzes and video lectures.

IMPORTANT: The visual references shared in the project brief must guide the design of the entire application, not just the landing page.

--------------------------------------------------
1. CORE TECHNOLOGY STACK
--------------------------------------------------

Frontend:
- Next.js
- JavaScript
- React
- Tailwind CSS
- Three.js
- React Three Fiber
- Drei
- Framer Motion

Backend:
- Python
- Django
- Django REST Framework
- JWT Authentication

Database:
- PostgreSQL

Other:
- Axios
- Lucide React
- Git and GitHub
- REST API architecture

Deployment:
- Vercel for Next.js frontend
- Render or another suitable Python hosting provider for Django
- Managed PostgreSQL database

Use compatible stable package versions. Prefer JavaScript rather than TypeScript for this project.

--------------------------------------------------
2. COMPLETE VISUAL DESIGN DIRECTION
--------------------------------------------------

Use the previously supplied visual references as the main inspiration.

The design should combine:

- Colorful 3D educational game environments.
- Low-poly 3D islands and floating platforms.
- Interactive learning objects.
- Colorful number blocks.
- Animated binary trees.
- Stack and queue visualizations.
- Connected linked-list nodes.
- Premium educational dashboards.
- Modern quiz interfaces.
- Attractive achievement cards.

The overall design should feel like a combination of a modern educational platform and a playful 3D adventure game.

Do not create a generic template website.

Create an original design system with:
- Consistent typography.
- Consistent spacing.
- Color palette.
- Card styles.
- Buttons.
- Navigation.
- Icons.
- Animations.
- Responsive layouts.

Use a professional balance of playful colors and clean layouts.

### NEW UI/UX DIRECTION (CodinGame Inspired Redesign)

The entire frontend UI must be redesigned to feel like a sleek, premium, modern arcade platform inspired by CodinGame.

- **Global:** Use a clean, uncluttered layout with ample whitespace, a sleek font such as Inter or Geist, and smooth Framer Motion animations.
- **Coding UI (Topic Page Left):** Present a premium modern IDE with a VS Code-inspired layout and C++ syntax highlighting.
- **Quiz UI (Topic Page Right and Dashboard):** Use glassmorphic MCQ cards with smooth hover effects and instant green/red neon feedback for correct and incorrect answers.
- **Video Lecture UI (Topic Page Right):** Provide a premium custom video player in a glassmorphic container, with chapter notes and smooth controls.
- **Game HUD (Inside GameShell):** Use translucent, glowing panels for the score, timer, instructions, and reset controls to create a high-end gaming interface.
- **Mini-Games Catalog:** Present interactive Arcade Cards with hover lifts and glowing borders.
- Do not copy CodinGame's branding. Adopt only its sleek layout and design principles to present original CodeQuest 3D content.

--------------------------------------------------
3. LANDING PAGE
--------------------------------------------------

Create a complete landing page containing:

1. Modern navigation bar.
2. 3D animated hero section.
3. Main headline: Learn Coding. Play Games. Build Logic.
4. Start Learning CTA.
5. Explore Game World CTA.
6. Introduction to CodeQuest 3D.
7. Featured learning topics.
8. Interactive game previews.
9. Learning roadmap.
10. How the platform works.
11. Student achievements.
12. Footer.

Use optimized 3D elements without affecting loading performance.

--------------------------------------------------
4. STUDENT DASHBOARD
--------------------------------------------------

Create a complete dashboard with:

- Student profile.
- Welcome message.
- Current XP.
- Level progression.
- Learning streak.
- Completed topics.
- Pending lessons.
- Continue learning.
- Daily challenges.
- Recent game scores.
- Achievement badges.
- Learning progress charts.

All information should eventually come from backend APIs.

--------------------------------------------------
5. DSA LEARNING MODULE
--------------------------------------------------

Create beginner-friendly learning modules:

A. Programming Fundamentals:
- Programming Introduction
- Variables
- Data Types
- Operators
- Conditions
- Loops
- Functions

B. Arrays and Sorting:
- Arrays
- Indexing
- Linear Search
- Binary Search
- Bubble Sort
- Selection Sort
- Insertion Sort

C. Stack and Queue:
- Stack
- Push
- Pop
- Queue
- Enqueue
- Dequeue
- FIFO and LIFO

D. Linked List:
- Node
- Pointer
- Insertion
- Deletion
- Traversal

E. Trees:
- Root
- Parent and Child
- Leaf Node
- Binary Tree
- Preorder
- Inorder
- Postorder

F. Recursion:
- Recursion basics
- Factorial
- Fibonacci

Every topic must contain:
- Introduction.
- Simple explanation.
- Real-life example.
- Animated visualization.
- Interactive mini-game.
- Quiz.
- C++ code example.
- YouTube lecture integration.
- Completion tracking.

--------------------------------------------------
6. 3D GAME ENGINE
--------------------------------------------------

Use Three.js with React Three Fiber and Drei.

Create a reusable game architecture.

Create independent mini-games:

1. Logic Builder.
2. Number Sorting Challenge.
3. Stack Tower.
4. Queue Ticket Counter.
5. Linked List Node Connection.
6. Tree Traversal Challenge.
7. Treasure Search.

Game requirements:
- 3D interactive objects.
- Smooth animations.
- Beginner-friendly controls.
- Game instructions.
- Score calculation.
- Levels.
- Reset button.
- Completion feedback.
- Performance optimization.

Each game must teach a specific learning objective.

Avoid unnecessary 3D decorations.

Provide fallback visualizations for devices that cannot handle complex 3D scenes.

--------------------------------------------------
7. QUIZ ZONE
--------------------------------------------------

Implement:

- Topic-wise quizzes.
- MCQ questions.
- Easy and medium levels.
- Optional timer.
- Correct answer feedback.
- Incorrect answer explanations.
- Score calculation.
- Quiz history.
- Retry functionality.
- Completion rewards.

Questions should be stored and managed through the backend.

--------------------------------------------------
8. VIDEO LECTURE SECTION
--------------------------------------------------

Create a dedicated video lecture system.

Features:
- Topic-wise video mapping.
- Embedded YouTube player.
- Lecture title.
- Video description.
- Related notes.
- Next lecture.
- Completed lecture status.

Admin should be able to add, update and delete video links.

Do not invent video IDs or use placeholder links as real lectures.

--------------------------------------------------
9. USER AUTHENTICATION
--------------------------------------------------

Implement:
- Registration.
- Login.
- Logout.
- JWT authentication.
- Password validation.
- Protected student routes.
- Role-based permissions.
- Secure token handling.

Include Student and Admin roles.

--------------------------------------------------
10. ADMIN DASHBOARD
--------------------------------------------------

Create a professional admin dashboard.

Admin features:
- Manage users.
- Create and update DSA topics.
- Add lessons.
- Manage quiz questions.
- Manage YouTube lectures.
- Manage game descriptions and levels.
- Review student scores.
- Track learning progress.
- View basic analytics.

All content should be manageable without manually editing frontend code.

--------------------------------------------------
11. DATABASE DESIGN
--------------------------------------------------

Use PostgreSQL.

Create properly related models for:

- User
- StudentProfile
- Topic
- Lesson
- Game
- GameLevel
- Quiz
- Question
- QuizAttempt
- VideoLecture
- UserProgress
- GameAttempt
- Achievement
- UserAchievement

Add appropriate relationships, indexes, constraints and validations.

--------------------------------------------------
12. BACKEND API
--------------------------------------------------

Build clean REST APIs using Django REST Framework.

Separate Django apps logically.

Implement:
- Authentication APIs.
- Topic APIs.
- Lesson APIs.
- Game APIs.
- Quiz APIs.
- Video APIs.
- Progress APIs.
- Achievement APIs.
- Admin APIs.

Add serializers, permissions, pagination and error handling.

Document endpoints.

--------------------------------------------------
13. RESPONSIVE DESIGN
--------------------------------------------------

The complete application must work on:

- Desktop.
- Laptop.
- Tablet.
- Mobile.

Optimize 3D performance for low-end devices.

Use lightweight 3D assets and lazy loading.

Do not load every game scene on the dashboard.

--------------------------------------------------
14. ENGINEERING AND QUALITY RULES
--------------------------------------------------

- Inspect the repository before making changes.
- Preserve existing working files.
- Use reusable components.
- Maintain separation of concerns.
- Keep frontend and backend independent.
- Write maintainable code.
- Add backend and frontend tests.
- Validate all important interactions.
- Do not hardcode production secrets.
- Do not use fake success messages.
- Avoid non-functional buttons.
- Use real API integration.
- Do not replace existing functionality unnecessarily.

--------------------------------------------------
15. DEVELOPMENT WORKFLOW
--------------------------------------------------

Build the project phase by phase.

Phase 1: Architecture and planning.
Phase 2: Design system and frontend.
Phase 3: Django backend and database.
Phase 4: Authentication and API integration.
Phase 5: DSA learning modules.
Phase 6: Reusable 3D game engine.
Phase 7: Topic-based mini-games.
Phase 8: Quiz and video integration.
Phase 9: Achievements and analytics.
Phase 10: Testing and deployment.

Before every major phase:
- Inspect existing code.
- Prepare an implementation plan.
- Identify affected files.
- Explain the approach.

After every phase:
- Run tests.
- Check errors.
- Verify the UI.
- Verify API functionality.
- Provide a completion report.

Do not start the next major phase until the current phase is reviewed.

Do not push to GitHub or deploy without my explicit permission.

--------------------------------------------------
FINAL EXPECTATION
--------------------------------------------------

Deliver a complete, professional, functional and visually consistent educational platform.

The platform must make learning basic programming and DSA enjoyable for school students and beginners.

The 3D game environments, educational animations, dashboards, learning modules, quizzes and backend functionality must work together as one integrated product.

Prioritize learning experience, usability, performance, clean architecture and maintainability.
