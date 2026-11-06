"use client";

import React, { useState } from "react";
import { StickyNoteAnnotation } from "./SketchDoodles";
import { TypewriterText } from "./TypewriterText";

interface PhotoSlide {
  id: number;
  palette: string;
  label: string;
}

const initialPhotos: PhotoSlide[] = [
  { id: 1, palette: "from-[#833ab4] via-[#fd1d1d] to-[#fcb045]", label: "Mountain Lake & Wildflowers" },
  { id: 2, palette: "from-[#0077b6] via-[#00b4d8] to-[#90e0ef]", label: "Solitary Tree in Meadow" },
  { id: 3, palette: "from-[#2b9348] via-[#55a630] to-[#80b918]", label: "Hilltop Observation Deck" },
  { id: 4, palette: "from-[#f77f00] via-[#fcbf49] to-[#eae2b7]", label: "Sunset Dune Horizon" },
  { id: 5, palette: "from-[#1d3557] via-[#457b9d] to-[#a8dadc]", label: "Ocean Shoreline Surf" },
  { id: 6, palette: "from-[#6a040f] via-[#9d0208] to-[#d00000]", label: "Autumn Crimson Canopy" },
  { id: 7, palette: "from-[#3d5a80] via-[#98c1d9] to-[#e0fbfc]", label: "Winter Alpine Ridge" },
  { id: 8, palette: "from-[#588157] via-[#3a5a40] to-[#344e41]", label: "Moss Forest Pathway" },
];

export function PhotoGallery() {
  const [photoList, setPhotoList] = useState<PhotoSlide[]>(initialPhotos);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);

  const currentPhoto = photoList[currentIndex];

  const triggerFlash = () => {
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 300);
  };

  const handleNext = () => {
    triggerFlash();
    setCurrentIndex((prev) => (prev + 1) % photoList.length);
  };

  const handlePrev = () => {
    triggerFlash();
    setCurrentIndex((prev) => (prev - 1 + photoList.length) % photoList.length);
  };

  const handleRemove = () => {
    triggerFlash();
    if (photoList.length <= 1) return;
    const removed = photoList[currentIndex];
    const updated = photoList.filter((_, idx) => idx !== currentIndex);
    updated.push(removed);
    setPhotoList(updated);
    if (currentIndex >= updated.length) {
      setCurrentIndex(0);
    }
  };

  const formatCounter = (idx: number, total: number) => {
    const pad = (n: number) => String(n).padStart(3, "0");
    return `${pad(idx + 1)}-${pad(total)}`;
  };

  return (
    <section className="relative w-full py-16 sm:py-24 px-4 sm:px-8 bg-wire-bg select-none overflow-hidden flex flex-col items-center">
      {/* 1. Primary Heading: "THINGS I POINTED MY CAMERA AT" with Typewriter Effect */}
      <div className="flex flex-col items-center text-center mb-10 sm:mb-14">
        <h2 className="font-marker text-4xl sm:text-6xl md:text-7xl text-[#111111] leading-tight tracking-tight uppercase">
          <TypewriterText text="THINGS I POINTED" delayMs={150} speedMs={35} />
          <br />
          <TypewriterText text="MY CAMERA AT" delayMs={600} speedMs={35} />
        </h2>

        {/* Yellow sticky note annotation with doodle head */}
        <div className="mt-4 transform -rotate-1">
          <StickyNoteAnnotation text="I really love taking picture" />
        </div>
      </div>

      {/* 2. Camera Interface with Peeking Photos Container */}
      <div className="relative w-full max-w-5xl flex items-center justify-center">
        {/* Physical Camera Body: Clean, Straight, Geometrically Consistent Edges (NO sketch-wobble) */}
        <div className="relative z-20 w-full max-w-[680px] bg-gradient-to-b from-[#e5e2da] via-[#dcd8ce] to-[#cfcac0] rounded-[32px] sm:rounded-[38px] p-5 sm:p-7 border-2 border-[#111111] shadow-[0_28px_65px_rgba(0,0,0,0.18)] flex flex-col">
          {/* Subtle brushed cross-hatch texture */}
          <div
            className="absolute inset-0 rounded-[30px] sm:rounded-[36px] pointer-events-none opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #000 1px, transparent 1px), linear-gradient(0deg, #000 1px, transparent 1px)",
              backgroundSize: "4px 4px",
            }}
          />

          {/* Camera Controls Area */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-5 sm:gap-7">
            {/* Left: Clean Rectangular LCD Viewfinder Screen with Consistent Rounded Corners */}
            <div className="relative w-full sm:w-[420px] aspect-[4/3] bg-[#111111] rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border-2 border-[#222222] shadow-inner overflow-hidden flex flex-col">
              {/* Top LCD HUD Status */}
              <div className="relative z-20 flex items-center justify-between text-white font-mono text-xs sm:text-sm px-2 py-1 select-none pointer-events-none">
                <span className="flex items-center gap-1.5 font-bold">
                  <span>▶</span>
                </span>
                <span className="bg-black/60 px-2 py-0.5 rounded text-[11px] sm:text-xs tracking-wider">
                  {formatCounter(currentIndex, photoList.length)}
                </span>
              </div>

              {/* Photo Canvas Display */}
              <div className="relative z-10 flex-1 rounded-lg overflow-hidden bg-black flex items-center justify-center">
                <div className={`w-full h-full bg-gradient-to-tr ${currentPhoto.palette} flex items-end p-4 transition-all duration-300`}>
                  {/* Subtle film grain */}
                  <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                    <filter id="film-grain">
                      <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#film-grain)" />
                  </svg>
                  <span className="relative z-10 font-hand text-sm sm:text-base text-white/90 bg-black/40 px-2 py-0.5 rounded">
                    {currentPhoto.label}
                  </span>
                </div>

                {/* Shutter Flash Animation Overlay */}
                {isFlashing && (
                  <div className="absolute inset-0 bg-white z-30 animate-camFlash pointer-events-none" />
                )}
              </div>
            </div>

            {/* Right: Camera Physical Controls (Circular Dial + Green Button) */}
            <div className="flex flex-col items-center justify-center gap-5 sm:gap-6 py-2">
              {/* Circular Dial Controller */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-b from-[#5c5b57] via-[#484744] to-[#363532] p-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.3)] border border-[#222222] flex items-center justify-center">
                {/* Left Button */}
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 text-[#cccccc] hover:text-white p-2 text-base sm:text-lg transition-transform active:scale-90"
                  aria-label="Previous photo"
                >
                  ◀
                </button>

                {/* Center OK Shutter Button */}
                <button
                  type="button"
                  onClick={triggerFlash}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-b from-[#6b6a66] to-[#403f3c] text-white font-mono font-bold text-xs sm:text-sm border border-[#777777] shadow-md flex items-center justify-center hover:brightness-110 active:scale-95 transition-all"
                  aria-label="Confirm / Shutter"
                >
                  OK
                </button>

                {/* Right Button */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 text-[#cccccc] hover:text-white p-2 text-base sm:text-lg transition-transform active:scale-90"
                  aria-label="Next photo"
                >
                  ▶
                </button>
              </div>

              {/* Round Green Button below dial */}
              <button
                type="button"
                onClick={handleRemove}
                title="Send current image to end of gallery"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-b from-[#48a942] to-[#2e7d32] border-2 border-[#1b5e20] shadow-md flex items-center justify-center text-white text-base hover:brightness-110 active:scale-90 transition-transform"
                aria-label="Send image to end"
              >
                🗑
              </button>
            </div>
          </div>

          {/* Bottom Branding: "W I R E F R A M E" */}
          <div className="mt-4 sm:mt-5 text-center">
            <span className="font-mono text-xs sm:text-sm tracking-[0.35em] text-[#666660] font-bold">
              W I R E F R A M E
            </span>
          </div>
        </div>

        {/* Cleanly Positioned Peeking Next Photos to the Right */}
        <div className="hidden lg:flex items-center gap-5 ml-6 pointer-events-none opacity-85">
          {photoList.slice(currentIndex + 1, currentIndex + 3).map((p, idx) => (
            <div
              key={p.id}
              className="w-44 aspect-[4/3] bg-white p-2 rounded-lg border-2 border-[#111111] shadow-md flex-shrink-0"
              style={{ transform: idx === 1 ? "rotate(2deg)" : "rotate(-1deg)" }}
            >
              <div className={`w-full h-full rounded bg-gradient-to-tr ${p.palette}`} />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Annotation below camera: "^ shot on film" */}
      <div className="mt-6 sm:mt-8 flex items-center gap-1.5">
        <svg viewBox="0 0 32 20" fill="none" className="w-6 h-4">
          <path d="M4 16 C 14 14, 20 8, 28 4 M 28 4 L 20 4 M 28 4 L 26 12" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="font-caveat font-bold text-lg sm:text-2xl text-[#111111]">
          <TypewriterText text="shot on film" preset="caption" />
        </span>
      </div>
    </section>
  );
}
