# 🤝 Contributing to CodeQuest 3D

Thank you for your interest in contributing to **CodeQuest 3D**! We are thrilled to welcome educators, students, game developers, full-stack engineers, and open-source enthusiasts to our community.

This guide will help you understand our development process and get your contributions integrated smoothly.

---

## 📑 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [How Can I Contribute?](#-how-can-i-contribute)
- [Development Workflow](#-development-workflow)
  - [1. Fork & Clone](#1-fork--clone)
  - [2. Branching Strategy](#2-branching-strategy)
  - [3. Local Development](#3-local-development)
  - [4. Coding Standards](#4-coding-standards)
  - [5. Commit Guidelines](#5-commit-guidelines)
  - [6. Submitting a Pull Request](#6-submitting-a-pull-request)
- [Reporting Bugs](#-reporting-bugs)
- [Suggesting Enhancements](#-suggesting-enhancements)
- [Recognition](#-recognition)

---

## 📜 Code of Conduct

By participating in this project, you agree to abide by our **[Code of Conduct](./CODE_OF_CONDUCT.md)**. Please report any unacceptable behavior to the project maintainers.

---

## 💡 How Can I Contribute?

You can contribute to CodeQuest 3D in many ways:
- **Core Engineering:** Implement new features, optimize algorithms, or refine API endpoints.
- **3D Graphics & Games:** Design new 3D Three.js / React Three Fiber educational algorithm mini-games.
- **Curriculum & Questions:** Add real-world analogies, conceptual explanations, or new DSA quiz questions.
- **Bug Fixes:** Identify edge cases, UI glitches, or performance bottlenecks.
- **Documentation:** Improve installation guides, clarify API contracts, or write tutorials.

---

## 🚀 Development Workflow

### 1. Fork & Clone
1. Fork the repository on GitHub: [https://github.com/shubhamjrd4559-sudo/Codequest-3d](https://github.com/shubhamjrd4559-sudo/Codequest-3d)
2. Clone your fork locally:
   ```bash
   git clone https://github.com/<your-username>/Codequest-3d.git
   cd Codequest-3d
   ```
3. Set up the upstream remote:
   ```bash
   git remote add upstream https://github.com/shubhamjrd4559-sudo/Codequest-3d.git
   ```

---

### 2. Branching Strategy
Always create a descriptive branch off `main`:
- `feature/<short-description>` for new features (e.g., `feature/trie-visualizer-scene`)
- `fix/<short-description>` for bug fixes (e.g., `fix/heatmap-mobile-overflow`)
- `docs/<short-description>` for documentation improvements (e.g., `docs/setup-faq`)

```bash
git checkout -b feature/my-new-feature
```

---

### 3. Local Development
Follow the setup instructions in **[`docs/SETUP.md`](./docs/SETUP.md)** to run the backend and frontend locally:
- Backend runs on `http://localhost:8000/api/v1/`
- Frontend runs on `http://localhost:3000`

---

### 4. Coding Standards
Please read our **[`docs/DEVELOPMENT.md`](./docs/DEVELOPMENT.md)** for detailed engineering guidelines:
- **TypeScript:** Strict type checks enabled; no explicit `any`.
- **CSS / Styling:** Adhere to our cosmic glassmorphism design tokens (`DESIGN.md`).
- **Python / Django:** Write clean PEP 8 compliant code with explicit type annotations on public functions.
- **Three.js:** Ensure all 3D geometries, materials, and listeners are disposed of properly on unmount.

---

### 5. Commit Guidelines
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```text
<type>(<scope>): <subject>
```

**Common types:**
- `feat:` Introduces a new feature
- `fix:` Patches a bug
- `docs:` Changes to documentation only
- `style:` Formatting or UI styling changes with no logic alterations
- `refactor:` Code restructuring without functional behavior modification
- `test:` Adding or updating tests
- `chore:` Changes to build tools or dependencies

*Example:*
```bash
git commit -m "feat(games): add interactive rotation controls to TreeTraversalScene"
```

---

### 6. Submitting a Pull Request
1. Keep pull requests focused on a single responsibility.
2. Verify all quality checks pass before pushing:
   ```bash
   # In frontend:
   npx tsc --noEmit
   npm run lint
   npm run build

   # In backend:
   python manage.py check
   ```
3. Push your branch to your fork:
   ```bash
   git push origin feature/my-new-feature
   ```
4. Open a Pull Request against the `main` branch of `shubhamjrd4559-sudo/Codequest-3d`.
5. Complete the checklist provided in our **[Pull Request Template](./.github/PULL_REQUEST_TEMPLATE.md)**.

---

## 🐛 Reporting Bugs

If you find a bug:
1. Search [existing GitHub Issues](https://github.com/shubhamjrd4559-sudo/Codequest-3d/issues) to avoid duplicates.
2. Open a new issue using our **[Bug Report Template](./.github/ISSUE_TEMPLATE/bug_report.md)**.
3. Provide a clear description, reproduction steps, screenshots, and system environment details.

---

## 💡 Suggesting Enhancements

To propose a new feature or game concept:
1. Check existing feature requests.
2. Open a new issue using our **[Feature Request Template](./.github/ISSUE_TEMPLATE/feature_request.md)**.
3. Explain the problem, proposed solution, and educational benefit for learners.

---

## 🌟 Recognition

All contributors will be acknowledged in our release notes and repository contributors section. Thank you for making CodeQuest 3D an inspiring platform for future programmers!
