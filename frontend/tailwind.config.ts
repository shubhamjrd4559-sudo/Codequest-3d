import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./design-system/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        // Theme variables
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: {
          DEFAULT: "hsl(var(--surface))",
          elevated: "hsl(var(--surface-elevated))",
          subtle: "hsl(var(--surface-subtle))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
          border: "hsl(var(--card-border))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        // Neon Gaming Accents
        neon: {
          purple: "#8B5CF6",
          violet: "#A855F7",
          cyan: "#06B6D4",
          sky: "#38BDF8",
          pink: "#EC4899",
          amber: "#F59E0B",
          emerald: "#10B981",
          blue: "#3B82F6",
        },
        cq: {
          bg: "#070814",
          card: "rgba(18, 20, 48, 0.65)",
          sidebar: "rgba(13, 15, 36, 0.8)",
          border: "rgba(255, 255, 255, 0.12)",
          hover: "rgba(255, 255, 255, 0.08)",
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        "neon-purple": "0 0 25px rgba(139, 92, 246, 0.45)",
        "neon-cyan": "0 0 25px rgba(6, 182, 212, 0.45)",
        "neon-amber": "0 0 25px rgba(245, 158, 11, 0.45)",
        "neon-emerald": "0 0 25px rgba(16, 185, 129, 0.45)",
        "neon-pink": "0 0 25px rgba(236, 72, 153, 0.45)",
        "glass-sm": "0 4px 16px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)",
        "glass-md": "0 8px 32px 0 rgba(0, 0, 0, 0.45), inset 0 1px 0 0 rgba(255, 255, 255, 0.18)",
        "glass-lg": "0 16px 48px -8px rgba(0, 0, 0, 0.6), inset 0 1px 1px 0 rgba(255, 255, 255, 0.22)",
      },
      backdropBlur: {
        xs: "2px",
        xl: "20px",
        "2xl": "32px",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.03)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        shimmer: "shimmer 2.5s infinite linear",
      },
    },
  },
  plugins: [],
};

export default config;
