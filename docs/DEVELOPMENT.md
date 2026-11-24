# 💻 CodeQuest 3D — Developer Guide & Engineering Standards

This document establishes the coding conventions, Git workflow, testing practices, and engineering standards for contributors working on **CodeQuest 3D**.

---

## 📑 Table of Contents

- [Engineering Principles](#-engineering-principles)
- [Recommended Developer Tooling](#-recommended-developer-tooling)
- [Frontend Coding Standards](#-frontend-coding-standards)
  - [TypeScript Guidelines](#typescript-guidelines)
  - [React & Next.js Patterns](#react--nextjs-patterns)
  - [Tailwind & Design System Usage](#tailwind--design-system-usage)
  - [Three.js & Canvas Boundaries](#threejs--canvas-boundaries)
- [Backend Coding Standards](#-backend-coding-standards)
  - [Python & PEP 8](#python--pep-8)
  - [Django Models & Migrations](#django-models--migrations)
  - [Django REST Framework Conventions](#django-rest-framework-conventions)
  - [Database Query Optimization](#database-query-optimization)
- [Git Workflow & Commit Standards](#-git-workflow--commit-standards)
- [Verification & Quality Checks](#-verification--quality-checks)
- [Pull Request Checklist](#-pull-request-checklist)

---

## 🌟 Engineering Principles

1. **Kid-Friendly Clarity, Industrial-Grade Architecture:** While the user experience is playful and engaging for students in classes 8–12, the underlying code must adhere to production-grade software engineering standards.
2. **Strict Type Safety:** Avoid `any` in TypeScript. All API models and payload interfaces must be fully typed.
3. **No Database Access from Frontend:** The client communicates strictly via `/api/v1/` endpoints. Never expose direct database credentials or internal database keys.
4. **Resilient Offline / Failure Handling:** The UI should never crash on network timeouts; display graceful error cards with retry triggers.

---

## 🛠️ Recommended Developer Tooling

- **IDE:** [Visual Studio Code](https://code.visualstudio.com/)
- **Recommended Extensions:**
  - *Tailwind CSS IntelliSense*
  - *ESLint*
  - *Python (Microsoft)*
  - *Pylance*
  - *Prettier - Code formatter*
  - *GitLens*

---

## ⚛️ Frontend Coding Standards

### TypeScript Guidelines
- Enable strict mode; do not disable `noImplicitAny`.
- Declare shared data contracts in `frontend/lib/api/types.ts`.
- Prefer `interface` for object shapes and `type` for unions/tuples.

### React & Next.js Patterns
- Use **App Router** conventions. Mark components as `"use client"` only when they use React hooks (`useState`, `useEffect`, `usePathname`), client browser APIs, or Framer Motion animations.
- Keep components focused and modular. Separate heavy 3D canvases into their own isolated modules under `frontend/games/scenes/`.
- Dynamic import 3D scenes to prevent server-side WebGL rendering errors:
  ```tsx
  import dynamic from "next/dynamic";

  const StackTowerScene = dynamic(
    () => import("@/games/scenes/StackTowerScene"),
    { ssr: false, loading: () => <SceneLoadingSpinner /> }
  );
  ```

### Tailwind & Design System Usage
- Utilize tokens defined in `frontend/design-system/tokens.ts` and `frontend/DESIGN.md`.
- Avoid arbitrary hardcoded colors when theme tokens exist. Use:
  - Deep surfaces: `bg-[#070814]`, `bg-[#0e112b]/90`
  - Glass borders: `border-white/10`, `border-purple-500/30`
  - Neon accents: `text-cyan-300`, `text-yellow-400`, `bg-purple-600`
- Keep CSS clean using `cn()` utility (`clsx` + `tailwind-merge`).

### Three.js & Canvas Boundaries
- Always clean up meshes, geometries, and materials inside `useEffect` return functions if instantiating custom Three.js objects manually.
- Use `@react-three/drei` helpers (e.g. `OrbitControls`, `Float`, `Text`) rather than reinventing standard controls.
- Maintain a stable 60 FPS target by limiting shadow map resolutions and geometry polygon counts.

---

## 🐍 Backend Coding Standards

### Python & PEP 8
- Write clean, idiomatic Python conforming to PEP 8 standards.
- Use explicit type annotations on public utility functions and service layer helpers.

### Django Models & Migrations
- Always specify `related_name` on `ForeignKey` and `ManyToManyField` relationships.
- Use `db_index=True` or `models.Index` on fields frequently used in filters, joins, or sort orders (e.g. `is_published`, `order`, `-total_xp`).
- Every model change must be accompanied by an auto-generated migration (`python manage.py makemigrations`). Do not hand-edit migration files unless resolving conflicts.

### Django REST Framework Conventions
- Use class-based views or viewsets.
- Separate serializers by purpose (e.g. `UserSummarySerializer` vs `UserDetailSerializer`).
- Never expose sensitive fields (e.g. `password`, internal secrets, or question `correct_answer` before attempt evaluation) in public API serializers.

### Database Query Optimization
- Prevent $N+1$ query bottlenecks:
  - Use `.select_related()` for single-object relations (`ForeignKey`, `OneToOneField`).
  - Use `.prefetch_related()` for multi-object relations (`ManyToManyField`, reverse `ForeignKey`).
- Benchmark slow endpoints using Django Debug Toolbar or custom execution logging.

---

## 🌿 Git Workflow & Commit Standards

We follow a feature-branch workflow. Direct commits to `main` are restricted.

### Branch Naming Conventions
- `feature/<feature-name>` — New features (e.g., `feature/code-sandbox-runner`)
- `fix/<bug-description>` — Bug fixes (e.g., `fix/quiz-hud-timer-reset`)
- `docs/<doc-topic>` — Documentation additions (e.g., `docs/setup-guide-refactor`)
- `refactor/<scope>` — Code refactoring without changing functionality

### Commit Message Standards
Use [Conventional Commits](https://www.conventionalcommits.org/):

```text
<type>(<optional scope>): <short description in present tense>

[optional body explaining context and rationale]

[optional issue reference, e.g. Closes #42]
```

**Allowed Types:**
- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Formatting changes with no code behavior alteration
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `perf:` A code change that improves performance
- `test:` Adding or updating tests
- `chore:` Changes to build process, dependencies, or auxiliary tools

*Example:*
```bash
git commit -m "feat(assessments): add streak multiplier to daily quiz submissions"
```

---

## 🧪 Verification & Quality Checks

Before opening a pull request, run all quality checks locally:

### 1. Frontend Verification
```bash
cd frontend

# Check for TypeScript errors
npx tsc --noEmit

# Check for ESLint errors
npm run lint

# Verify production build succeeds
npm run build
```

### 2. Backend Verification
```bash
cd backend

# Activate virtual environment
# Windows: .venv\Scripts\Activate.ps1 | Linux/macOS: source .venv/bin/activate

# Verify system checks and missing migrations
python manage.py check

# Verify migration consistency
python manage.py makemigrations --check --dry-run

# Run backend tests
python manage.py test
```

---

## 📋 Pull Request Checklist

When submitting a pull request, verify that:

- [ ] Code strictly follows frontend and backend style conventions.
- [ ] TypeScript compiles cleanly with zero errors (`npx tsc --noEmit`).
- [ ] Next.js production build succeeds (`npm run build`).
- [ ] Django system checks pass (`python manage.py check`).
- [ ] No secrets, API keys, passwords, or credentials are committed.
- [ ] Branch is rebased against the latest `main`.
- [ ] Documentation has been updated if adding or modifying APIs or features.
