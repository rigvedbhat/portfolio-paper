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
          bg: "#f7f6f4",
          card: "#ffffff",
          yellow: "#ffe500",
          yellowHover: "#ebd200",
          black: "#111111",
          dark: "#1c1b18",
          gray: "#5e5e5e",
          muted: "#888888",
          lightGray: "#e6e4e0",
          border: "#111111",
          red: "#e02e2e",
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
