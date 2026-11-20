# CodeQuest 3D — UI/UX Design System & Theme Specification

## 1. Aesthetic Philosophy: 2026 Gaming Educational Platform

CodeQuest 3D merges **high-end 3D fantasy gaming** with **rigorous DSA computer science education**. The design language breaks away from flat, sterile SaaS dashboards into an immersive, vibrant world inspired by floating islands, glowing crystalline artifacts, and cyberpunk gaming UI.

### Key Pillars:
1. **Atmospheric Glassmorphism**: High-blur translucent panels (`backdrop-blur-xl`, `bg-[#0e112b]/65`) layered over cosmic gradients and 3D scenes. Avoid flat solid surfaces.
2. **Neon Accents with Purpose**:
   - **Neon Purple (`#8B5CF6`)**: Brand, Primary Actions, Active Navigation.
   - **Neon Cyan (`#06B6D4`)**: Logic, DSA Progress, Code & Technical states.
   - **Neon Amber/Gold (`#F59E0B`)**: Streaks, XP, Achievements, Rewards.
   - **Neon Emerald (`#10B981`)**: Solved states, Success, Completed modules.
   - **Neon Pink (`#EC4899`)**: High-tier gamification, Quests, Special events.
3. **Layered Depth & Specular Edges**: Subtle 1px white/neon borders (`border-white/10` to `border-white/20`) with inner specular glows simulating frosted curved glass.
4. **Fluid Motion & Micro-interactions**: Hover lifts, smooth spring tabs with Framer Motion, glowing pulse indicators, and responsive split-views.

---

## 2. Design Tokens

### Color Palette

| Token | Hex / HSL | Usage |
|---|---|---|
| `bg-cq-bg` | `#070814` | Deep cosmic universe base background |
| `surface-deep` | `#0D0F24` | Background for sidebars and docked panels |
| `surface-glass` | `rgba(14, 17, 43, 0.65)` | Primary card glassmorphic fill |
| `neon-purple` | `#8B5CF6` | Primary buttons, active tabs, level badges |
| `neon-cyan` | `#06B6D4` | Data structure stats, code highlights, speed |
| `neon-amber` | `#F59E0B` | Streak badges, XP numbers, trophy icons |
| `neon-emerald` | `#10B981` | Success states, solved checks, progress boosts |
| `neon-pink` | `#EC4899` | Mini-game badges, premium quest accents |
| `border-glass` | `rgba(255, 255, 255, 0.12)` | Subtle frosted glass border |
| `text-primary` | `#FFFFFF` | Main headlines, values, active labels |
| `text-secondary`| `#CBD5E1` | Body descriptions, card subtitles |
| `text-muted` | `#94A3B8` | Inactive nav links, metadata tags |

### Shadows & Glows

| Class | Spec | Effect |
|---|---|---|
| `shadow-neon-purple` | `0 0 25px rgba(139, 92, 246, 0.45)` | Glowing primary action buttons & active navigation |
| `shadow-neon-cyan` | `0 0 25px rgba(6, 182, 212, 0.45)` | Stat cards & code blocks |
| `shadow-neon-amber` | `0 0 25px rgba(245, 158, 11, 0.45)` | Achievement medals & streak counters |
| `shadow-neon-emerald`| `0 0 25px rgba(16, 185, 129, 0.45)`| Quiz correct answers & success badges |
| `shadow-glass-md` | `0 8px 32px 0 rgba(0, 0, 0, 0.45)` | Elevated floating cards |

### Typography Scale
- **Display Extra Large**: `text-4xl md:text-5xl font-extrabold tracking-tight` (Hero headline)
- **Display Large**: `text-2xl md:text-3xl font-extrabold` (Page welcome headers)
- **Title**: `text-xl md:text-2xl font-bold` (Card titles)
- **Section Heading**: `text-lg font-semibold` (Stat categories, tab headers)
- **Body Regular**: `text-sm text-slate-300 leading-relaxed`
- **Code Block**: `font-mono text-sm` with syntax highlighting tints

---

## 3. Core Component Library

Located in `frontend/components/ui/`:

1. **Button** (`Button.tsx`)
   - Powered by `class-variance-authority`.
   - Variants:
     - `primary`: Neon gradient (`from-purple-600 to-indigo-600`) with violet glow drop shadow.
     - `amber`: High-energy gaming CTA (`from-amber-400 to-orange-500`) with golden aura.
     - `secondary`: Frosted glass with border highlight (`bg-white/10 hover:bg-white/15`).
     - `ghost`: Transparent with purple accent hover.
     - `destructive`: Red neon border with crimson glow.
   - Sizes: `sm`, `md`, `lg`, `icon`.

2. **Card** (`Card.tsx`)
   - Features glassmorphism default (`glass-panel rounded-3xl`).
   - Variants: `default`, `interactive` (with scale & border glow on hover), `elevated`, `glow-purple`, `glow-cyan`, `glow-amber`, `glow-emerald`.

3. **Badge** (`Badge.tsx`)
   - Variants: `default`, `success` (emerald glow), `warning` (amber glow), `danger` (rose glow), `purple` (neon violet glow), `cyan` (cyber cyan glow).
   - Ideal for XP bonuses, level indicators, and difficulty tags.

4. **Input** (`Input.tsx`)
   - Translucent surface with neon focus ring, support for leading/trailing icons, helper text, and validation error messages.

5. **Sidebar / Navigation** (`Sidebar.tsx`, `NavigationBar.tsx`, `MobileNav.tsx`)
   - **Sidebar**: Fixed on desktop with floating game controller brand mark, active pill highlights, XP / Level status widget.
   - **NavigationBar**: Floating glass navbar for public landing page and page headers with quick search, notification badge, and profile avatar.
   - **MobileNav**: Bottom fixed glass dock for mobile devices with quick access to Home, Play, Leaderboard, and Profile.

---

## 4. Page Layout Patterns

### A. Student Dashboard Layout
- **Left Column**: Floating glass navigation sidebar.
- **Top Row**: Personalized greeting banner with floating island landscape backdrop, 3D character hero, and quick "Continue Learning" action with progress gauge.
- **Middle Row**: 4 vibrant stat cards (DSA Progress, Games Played, Current Streak, Total XP) each having its distinct color-coded glass gradient and neon indicator.
- **Bottom Row**: Horizontal "Recent Achievements" showcase with badge icons and XP values.

### B. Topic Learning Split-Screen Layout
- Designed for deep focus and immediate active recall:
- **Left Column (45%)**:
  - Theory & documentation tabs (Introduction, Explanation, Code Example).
  - High-readability copy with key takeaways and interactive C++ code viewer.
- **Right Column (55%)**:
  - Interactive arena with tabs (Visualization, Mini-Game, Quiz).
  - 3D Array stage with isometric numbered blocks on stone circular podium.
  - Interactive step-by-step navigation controls.
- **Mobile View**: Collapses smoothly into stacked cards with top-level tabs and fixed bottom dock navigation.

---

## 5. Usage & Implementation Guidelines
- **Always preserve dark-mode-first contrast**: Text must remain crisp against blurred photographic or gradient backdrops.
- **Never use plain flat gray backgrounds**: Always introduce depth via subtle radial gradient orbs (`bg-gradient-to-br from-purple-950/40 via-slate-950/60 to-indigo-950/40`).
- **Use Framer Motion sparingly and purposefully**: Stagger card entries (`staggerChildren: 0.08`), smooth tab indicator layout transitions (`layoutId="activeTab"`), and micro-press scale on buttons (`whileTap={{ scale: 0.97 }}`).
