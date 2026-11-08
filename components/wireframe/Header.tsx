"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TypewriterText } from "./TypewriterText";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const pathname = usePathname();

  const isAboutActive = pathname === "/about";
  const isWorksActive = pathname === "/works" || (pathname?.startsWith("/works/") ?? false);
  const isContactActive = pathname === "/contact";

  const navLinks = [
    { name: "about", href: "/about", isActive: isAboutActive },
    { name: "works", href: "/works", isActive: isWorksActive },
    { name: "contact", href: "/contact", isActive: isContactActive },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 px-2 sm:px-8 md:px-14 py-2 sm:py-5 flex items-center justify-between pointer-events-none">
      {/* Hand-drawn Logo on Left: Box with Boy Doodle Face + RIG */}
      <Link
        href="/"
        className="pointer-events-auto group inline-flex items-center gap-1 sm:gap-2.5 px-1.5 py-0.5 sm:px-4 sm:py-1.5 bg-white border-2 border-[#111111] rounded-[8px] shadow-xs hover:scale-105 transition-transform duration-200 select-none flex-shrink-0"
        style={{ transform: "rotate(-2.2deg)" }}
        title="Rig - Home"
      >
        <img
          src="/rigved-avatar.png"
          alt="Rig Avatar Doodle"
          className="w-4 h-4 sm:w-7 sm:h-7 object-contain select-none pointer-events-none"
          draggable={false}
        />
        <span className="font-marker text-xs sm:text-xl text-[#111111] tracking-wider select-none leading-none">
          <TypewriterText text="RIG" preset="nav" />
        </span>
      </Link>

      {/* Three Oval Navigation Tabs on Right: Sketched Oval on Inactive, Black Scribble on Active */}
      <nav className="pointer-events-auto flex items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0">
        {navLinks.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`group relative inline-flex items-center justify-center min-w-[50px] xs:min-w-[64px] sm:min-w-[104px] h-[30px] sm:h-[44px] px-1.5 xs:px-3 sm:px-5 select-none transition-transform duration-200 hover:scale-105 ${
              item.isActive ? "active" : "inactive"
            }`}
          >
            {/* 1. Marker Scribble Fill (Visible ONLY when tab is ACTIVE) */}
            {item.isActive ? (
              <span
                className="absolute -inset-x-1 -inset-y-0.5 sm:-inset-x-2 sm:-inset-y-1.5 w-[calc(100%+8px)] sm:w-[calc(100%+16px)] h-[calc(100%+6px)] sm:h-[calc(100%+12px)] pointer-events-none z-10 select-none"
                style={{
                  WebkitMask:
                    "url('/assets/BaWPy54e4I2icN0N7Fr6b3ISPQ.svg') no-repeat center / 100% 100%",
                  mask: "url('/assets/BaWPy54e4I2icN0N7Fr6b3ISPQ.svg') no-repeat center / 100% 100%",
                  backgroundColor: "var(--wire-nav-active-bg)",
                }}
              />
            ) : (
              /* 2. Single Hand-Drawn Oval Border (Visible ONLY when tab is INACTIVE) */
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-0 select-none"
                viewBox="0 0 120 48"
                preserveAspectRatio="none"
                fill="none"
              >
                <path
                  d="M 16,24 C 15,10 30,5 60,4.5 C 90,4 105,10 104,24 C 103,38 90,44.5 60,45 C 30,45.5 17,38 16,24 Z"
                  stroke="var(--wire-nav-border)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-colors duration-200"
                />
              </svg>
            )}

            {/* 3. Tab Text */}
            <span
              className={`relative z-20 font-caveat font-bold text-[15px] xs:text-lg sm:text-2xl md:text-[27px] leading-none -mt-0.5 tracking-wide transition-colors duration-200 select-none ${
                item.isActive
                  ? "text-[var(--wire-nav-active-text)]"
                  : "text-[var(--wire-nav-text)] group-hover:text-[var(--wire-text-primary)]"
              }`}
            >
              <TypewriterText text={item.name} preset="nav" />
            </span>
          </Link>
        ))}

        {/* 4. Hand-drawn Theme Toggle (Light / Dark) */}
        <ThemeToggle />
      </nav>
    </header>
  );
}
