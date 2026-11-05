import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        // Brand palette from the GameXchange design system.
        midnight: "#0a0a1f",
        ocean: "#0f1030",
        electric: "#3b82f6",
        indigo: "#6366f1",
        violet: "#8b5cf6",
        purple: "#a855f7",
        magenta: "#d946ef",
        cyan: "#22d3ee",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "var(--font-bangla)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        display: [
          "var(--font-space-grotesk)",
          "var(--font-inter)",
          "var(--font-bangla)",
          "sans-serif",
        ],
        bangla: ["var(--font-bangla)", "var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px -12px rgba(99, 102, 241, 0.65)",
        "glow-lg": "0 0 90px -20px rgba(139, 92, 246, 0.65)",
        "glow-cyan": "0 0 45px -12px rgba(34, 211, 238, 0.55)",
        "inner-top": "inset 0 1px 0 0 rgba(255,255,255,0.08)",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #3b82f6 0%, #6366f1 35%, #8b5cf6 65%, #d946ef 100%)",
        "brand-gradient-soft":
          "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(139,92,246,0.18), rgba(217,70,239,0.18))",
        "hero-radial":
          "radial-gradient(ellipse 80% 55% at 50% -10%, rgba(99,102,241,0.35), transparent 70%)",
        "grid-pattern":
          "linear-gradient(to right, rgba(148,163,184,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.07) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "56px 56px",
      },
      keyframes: {
        aurora: {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "33%": { transform: "translate3d(4%, -6%, 0) scale(1.12)" },
          "66%": { transform: "translate3d(-5%, 4%, 0) scale(0.95)" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-24px) rotate(2deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.45", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.06)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        shine: {
          "0%": { transform: "translateX(-120%) skewX(-20deg)" },
          "100%": { transform: "translateX(220%) skewX(-20deg)" },
        },
      },
      animation: {
        aurora: "aurora 16s ease-in-out infinite",
        "gradient-x": "gradient-x 6s ease infinite",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 11s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2s ease-out infinite",
        marquee: "marquee 40s linear infinite",
        "spin-slow": "spin-slow 12s linear infinite",
        shine: "shine 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
