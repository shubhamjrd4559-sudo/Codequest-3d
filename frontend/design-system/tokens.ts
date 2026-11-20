/**
 * CodeQuest 3D — Core Design Tokens
 * 2026 Gaming Educational Platform Theme
 */

export const colors = {
  // Deep Cosmic Backgrounds
  background: {
    DEFAULT: "#070814",
    deep: "#04050b",
    surface: "#0D0F24",
    surfaceLight: "#141738",
    elevated: "#181B42",
  },
  
  // Neon Brand Accents
  brand: {
    purple: {
      DEFAULT: "#8B5CF6",
      light: "#A78BFA",
      dark: "#6D28D9",
      glow: "rgba(139, 92, 246, 0.5)",
    },
    cyan: {
      DEFAULT: "#06B6D4",
      light: "#22D3EE",
      dark: "#0891B2",
      glow: "rgba(6, 182, 212, 0.5)",
    },
    pink: {
      DEFAULT: "#EC4899",
      light: "#F472B6",
      dark: "#BE185D",
      glow: "rgba(236, 72, 153, 0.5)",
    },
    amber: {
      DEFAULT: "#F59E0B",
      light: "#FBBF24",
      dark: "#D97706",
      glow: "rgba(245, 158, 11, 0.5)",
    },
    emerald: {
      DEFAULT: "#10B981",
      light: "#34D399",
      dark: "#059669",
      glow: "rgba(16, 185, 129, 0.5)",
    },
    blue: {
      DEFAULT: "#3B82F6",
      light: "#60A5FA",
      dark: "#1D4ED8",
      glow: "rgba(59, 130, 246, 0.5)",
    },
  },

  // Glassmorphic Surface Alphas
  glass: {
    background: "rgba(15, 18, 45, 0.65)",
    backgroundSubtle: "rgba(255, 255, 255, 0.04)",
    backgroundHover: "rgba(255, 255, 255, 0.08)",
    border: "rgba(255, 255, 255, 0.12)",
    borderHighlight: "rgba(255, 255, 255, 0.25)",
  },

  // Typography
  text: {
    primary: "#FFFFFF",
    secondary: "#CBD5E1",
    muted: "#94A3B8",
    subtle: "#64748B",
    accent: "#C4B5FD",
  },
} as const;

export const shadows = {
  glowPurple: "0 0 25px rgba(139, 92, 246, 0.4)",
  glowCyan: "0 0 25px rgba(6, 182, 212, 0.4)",
  glowAmber: "0 0 25px rgba(245, 158, 11, 0.45)",
  glowEmerald: "0 0 25px rgba(16, 185, 129, 0.4)",
  glowPink: "0 0 25px rgba(236, 72, 153, 0.4)",
  glassCard: "0 10px 40px -10px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)",
  glassElevated: "0 20px 50px -12px rgba(0, 0, 0, 0.7), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)",
} as const;

export const radii = {
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "2rem",
  full: "9999px",
} as const;
