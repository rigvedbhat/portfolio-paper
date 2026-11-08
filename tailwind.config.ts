import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wire: {
          bg: "var(--wire-bg)",
          card: "var(--wire-card)",
          yellow: "var(--wire-yellow)",
          yellowHover: "var(--wire-yellow-hover)",
          black: "var(--wire-black)",
          dark: "var(--wire-dark)",
          gray: "var(--wire-gray)",
          muted: "var(--wire-muted)",
          lightGray: "var(--wire-light-gray)",
          border: "var(--wire-border)",
          red: "var(--wire-red)",
        },
      },
      fontFamily: {
        marker: ['"Permanent Marker"', "cursive", "sans-serif"],
        caveat: ['"Caveat"', "cursive", "sans-serif"],
        hand: ['"Patrick Hand"', "cursive", "sans-serif"],
        mono: ['"Geist Mono"', "monospace"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      borderRadius: {
        pill: "9999px",
        card: "12px",
      },
      keyframes: {
        camFlash: {
          "0%": { opacity: "0.9" },
          "100%": { opacity: "0" },
        },
        swing: {
          "0%, 100%": { transform: "rotate(-1.5deg)" },
          "50%": { transform: "rotate(1.5deg)" },
        },
      },
      animation: {
        camFlash: "camFlash 0.35s ease-out forwards",
        swing: "swing 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
