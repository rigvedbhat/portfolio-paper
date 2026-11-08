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
          <div className="relative w-full h-full bg-[#000000] flex items-center justify-center overflow-hidden">
            {!isPlaying ? (
              <div
                className="relative w-full h-full cursor-pointer flex items-center justify-center group"
                onClick={() => setIsPlaying(true)}
              >
                {/* Poster / Video preview backdrop */}
                <img
                  src="/video-poster.jpg"
                  alt="Video Showcase Preview"
                  className="absolute inset-0 w-full h-full object-contain bg-black select-none pointer-events-none"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

                {/* Central Hand-Drawn White Play Button (sketched oval + play triangle) */}
                <div className="relative z-20 flex flex-col items-center gap-2 transform transition-transform group-hover:scale-110">
                  <HandDrawnPlayButton />
                </div>
              </div>
            ) : (
              <video
                src="/Featured-vid.mp4"
                className="w-full h-full object-contain bg-black"
                controls
                autoPlay
                playsInline
                preload="auto"
              >
                <source src="/Featured-vid.mp4" type="video/mp4" />
                <source src="/Featured-vid.mov" type="video/quicktime" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </BeveledSketchFrame>
      </div>
    </section>
  );
}
