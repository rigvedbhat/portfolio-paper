"use client";

import React, { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Detect currently applied theme on html element or localStorage
    const saved = localStorage.getItem("portfolio-theme") as "dark" | "light" | null;
    const currentTheme =
      saved ||
      (document.documentElement.classList.contains("light") ? "light" : "dark");

    setTheme(currentTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    const applyTheme = () => {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(nextTheme);
      document.documentElement.setAttribute("data-theme", nextTheme);
      localStorage.setItem("portfolio-theme", nextTheme);
      setTheme(nextTheme);
    };

    // Smooth transition class helper
    document.documentElement.classList.add("theme-transition");
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 450);

    // Use View Transitions API if supported for cinematic page crossfade
    const doc = document as unknown as { startViewTransition?: (cb: () => void) => void };
    if (typeof doc.startViewTransition === "function") {
      doc.startViewTransition(() => {
        applyTheme();
      });
    } else {
      applyTheme();
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className="group relative inline-flex items-center justify-center w-[32px] sm:w-[44px] h-[32px] sm:h-[44px] rounded-full select-none transition-transform duration-200 hover:scale-110 active:scale-95 cursor-pointer ml-0.5 sm:ml-2 flex-shrink-0"
    >
      {/* Hand-drawn oval/circle border matching sketchbook aesthetic */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
        viewBox="0 0 44 44"
        fill="none"
      >
        <path
          d="M 22,5 C 33,4.5 40,12 39.5,22 C 39,32 32,39.5 22,39 C 12,38.5 4.5,31 5,22 C 5.5,12 12,5.5 22,5 Z"
          stroke="var(--wire-nav-border, currentColor)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-colors duration-200"
        />
      </svg>

      {/* Animated Icon: Sun or Moon */}
      <span className="relative z-10 flex items-center justify-center w-full h-full text-[var(--wire-text-primary)] transition-transform duration-300 group-hover:rotate-12">
        {!mounted ? (
          /* Placeholder while mounting to avoid SSR mismatch */
          <span className="w-5 h-5" />
        ) : theme === "dark" ? (
          /* Moon icon (Hand-drawn style for Dark theme) */
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="var(--wire-yellow)" fillOpacity="0.2" />
          </svg>
        ) : (
          /* Sun icon (Hand-drawn style for Light theme) */
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4.5" fill="var(--wire-yellow)" fillOpacity="0.35" />
            <line x1="12" y1="2" x2="12" y2="4.5" />
            <line x1="12" y1="19.5" x2="12" y2="22" />
            <line x1="4.22" y1="4.22" x2="5.99" y2="5.99" />
            <line x1="18.01" y1="18.01" x2="19.78" y2="19.78" />
            <line x1="2" y1="12" x2="4.5" y2="12" />
            <line x1="19.5" y1="12" x2="22" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.99" y2="18.01" />
            <line x1="18.01" y1="5.99" x2="19.78" y2="4.22" />
          </svg>
        )}
      </span>
    </button>
  );
}
