"use client";

import React, { useState } from "react";
import { BeveledSketchFrame, HandDrawnPlayButton } from "./SketchDoodles";
import { TypewriterText } from "./TypewriterText";

export function VideoShowcase() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="relative w-full pt-16 sm:pt-24 pb-14 sm:pb-24 px-3 sm:px-6 md:px-12 flex flex-col items-center bg-wire-bg overflow-hidden select-none">
      {/* Heading & Subtitle Container matching reference layout */}
      <div className="w-full max-w-5xl mb-4 sm:mb-6 flex flex-row items-center justify-between gap-3 sm:gap-4 px-1">
        {/* Main Heading: "Selected work — 2024 to 2026" with Typewriter Effect */}
        <h2 className="font-caveat font-bold text-xl sm:text-3xl md:text-4xl text-[var(--wire-text-primary)] tracking-tight leading-tight transition-colors duration-300">
          <TypewriterText text="Selected work — 2024 to 2026" delayMs={200} speedMs={30} />
        </h2>

        {/* Subtitle with curved arrow pointing left: "<- a little showcase of my work" */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Hand-drawn pencil arrow pointing down-left toward video */}
          <svg
            viewBox="0 0 46 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 sm:w-10 h-auto hidden sm:block flex-shrink-0"
          >
            <path
              d="M44 6 C 30 5, 12 8, 4 17 M 4 17 L 5 8 M 4 17 L 13 16"
              stroke="var(--wire-canvas-stroke)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-colors duration-300"
            />
          </svg>
          <p className="font-caveat font-bold text-sm sm:text-xl md:text-2xl text-[var(--wire-text-secondary)] whitespace-nowrap transition-colors duration-300">
            <TypewriterText text="a little showcase of my work" delayMs={450} speedMs={25} />
          </p>
        </div>
      </div>

      {/* Large Beveled Sketch Media Frame with Diagonal Hatching Borders */}
      <div className="w-full max-w-5xl">
        <BeveledSketchFrame aspectRatio="16/9">
          {/* Media Player Display */}
          <div
            className="relative w-full h-full bg-[#1e1c18] cursor-pointer flex items-center justify-center overflow-hidden group"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {/* Artistic Painting / Studio Canvas Visual (warm palette matching reference) */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#993322] via-[#d65a31] to-[#f49d37] opacity-90 flex items-center justify-center">
              {/* Painterly texture and brush strokes */}
              <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
                <filter id="canvas-grain">
                  <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
                  <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.5 0" />
                </filter>
                <rect width="100%" height="100%" filter="url(#canvas-grain)" />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-72 h-72 rounded-full border-4 border-white/40 blur-xs" />
              </div>
            </div>

            {/* Central Hand-Drawn White Play Button (sketched oval + play triangle) */}
            {!isPlaying ? (
              <div className="relative z-20 flex flex-col items-center gap-2">
                <HandDrawnPlayButton />
              </div>
            ) : (
              <div className="relative z-20 flex flex-col items-center gap-3 bg-black/60 backdrop-blur-xs p-6 rounded-2xl border border-white/20">
                <div className="flex items-center gap-3 text-white font-mono text-sm sm:text-base">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <span>PLAYING SHOWCASE [00:14 / 01:45]</span>
                </div>
                <div className="w-48 sm:w-64 h-1.5 bg-white/30 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-wire-yellow rounded-full animate-pulse" />
                </div>
                <span className="font-caveat font-bold text-white text-base">Click to pause</span>
              </div>
            )}
          </div>
        </BeveledSketchFrame>
      </div>
    </section>
  );
}
