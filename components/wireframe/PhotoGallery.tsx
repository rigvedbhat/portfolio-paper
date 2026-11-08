"use client";

import React, { useState } from "react";
import { StickyNoteAnnotation } from "./SketchDoodles";
import { TypewriterText } from "./TypewriterText";

interface PhotoSlide {
  id: number;
  src: string;
  label: string;
}

const initialPhotos: PhotoSlide[] = [
  { id: 1, src: "/portfolio-images/IMG_20261107_115007_484.jpg", label: "Street Perspective" },
  { id: 2, src: "/portfolio-images/IMG_20261107_115039_666.jpg", label: "Golden Hour Glow" },
  { id: 3, src: "/portfolio-images/IMG_20261107_115043_726.jpg", label: "Wanderer's Lens" },
  { id: 4, src: "/portfolio-images/IMG_20261107_115213_886.jpg", label: "Architecture in Motion" },
  { id: 5, src: "/portfolio-images/IMG_20261107_115344_243.jpg", label: "Shadow & Light" },
  { id: 6, src: "/portfolio-images/IMG_20261107_115436_302.jpg", label: "Urban Moments" },
  { id: 7, src: "/portfolio-images/IMG_20261107_115439_140.jpg", label: "Quiet Corners" },
  { id: 8, src: "/portfolio-images/IMG_20261107_115443_206.jpg", label: "Framed Stories" },
  { id: 9, src: "/portfolio-images/IMG_20261107_115447_910.jpg", label: "Reflections" },
  { id: 10, src: "/portfolio-images/IMG_20261107_115454_166.jpg", label: "Candid Stillness" },
  { id: 11, src: "/portfolio-images/IMG_20261107_115458_200.jpg", label: "Through The Looking Glass" },
  { id: 12, src: "/portfolio-images/IMG_20261107_115501_388.jpg", label: "Textures of Life" },
  { id: 13, src: "/portfolio-images/IMG_20261107_115504_837.jpg", label: "Monochrome & Mood" },
  { id: 14, src: "/portfolio-images/IMG_20261107_115507_481.jpg", label: "Chasing Shadows" },
  { id: 15, src: "/portfolio-images/IMG_20261107_115529_551.jpg", label: "Fleeting Moments" },
  { id: 16, src: "/portfolio-images/IMG_20261107_115630_580.jpg", label: "Geometry & Flow" },
  { id: 17, src: "/portfolio-images/IMG_20261107_115639_348.jpg", label: "Sunset Trail" },
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
        <h2 className="font-marker text-4xl sm:text-6xl md:text-7xl text-wire-black leading-tight tracking-tight uppercase">
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
        <div className="relative z-20 w-full max-w-[680px] bg-gradient-to-b from-[#282724] via-[#201f1c] to-[#181716] rounded-[32px] sm:rounded-[38px] p-5 sm:p-7 border-2 border-[#383530] shadow-[0_28px_65px_rgba(0,0,0,0.55)] flex flex-col">
          {/* Subtle brushed cross-hatch texture */}
          <div
            className="absolute inset-0 rounded-[30px] sm:rounded-[36px] pointer-events-none opacity-5"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #fff 1px, transparent 1px), linear-gradient(0deg, #fff 1px, transparent 1px)",
              backgroundSize: "4px 4px",
            }}
          />

          {/* Camera Controls Area */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-5 sm:gap-7">
            {/* Left: Clean Rectangular LCD Viewfinder Screen with Consistent Rounded Corners */}
            <div className="relative w-full sm:w-[420px] aspect-[4/3] bg-[#111111] rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border-2 border-[#2a2926] shadow-inner overflow-hidden flex flex-col">
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
                <div className="relative w-full h-full flex items-end p-4 transition-all duration-300">
                  <img
                    src={currentPhoto.src}
                    alt="Photograph"
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
                    draggable={false}
                  />
                  {/* Subtle film grain */}
                  <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none">
                    <filter id="film-grain">
                      <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#film-grain)" />
                  </svg>
                </div>

                {/* Shutter Flash Animation Overlay */}
                {isFlashing && (
                  <div className="absolute inset-0 bg-white z-30 animate-cam-flash pointer-events-none" />
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
                  className="absolute left-1 xs:left-2 text-[#cccccc] hover:text-white p-2.5 min-w-[36px] min-h-[36px] flex items-center justify-center text-base sm:text-lg transition-transform active:scale-90"
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
                  className="absolute right-1 xs:right-2 text-[#cccccc] hover:text-white p-2.5 min-w-[36px] min-h-[36px] flex items-center justify-center text-base sm:text-lg transition-transform active:scale-90"
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
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-b from-[#48a942] to-[#2e7d32] border-2 border-[#1b5e20] shadow-md flex items-center justify-center text-white text-base hover:brightness-110 active:scale-90 transition-transform"
                aria-label="Send image to end"
              >
                🗑
              </button>
            </div>
          </div>

          {/* Bottom Branding: "W I R E F R A M E" */}
          <div className="mt-4 sm:mt-5 text-center">
            <span className="font-mono text-xs sm:text-sm tracking-[0.35em] text-[#858279] font-bold">
              W I R E F R A M E
            </span>
          </div>
        </div>

        {/* Cleanly Positioned Peeking Next Photos to the Right */}
        <div className="hidden lg:flex items-center gap-5 ml-6 pointer-events-none opacity-85">
          {photoList.slice(currentIndex + 1, currentIndex + 3).map((p, idx) => (
            <div
              key={p.id}
              className="w-44 aspect-[4/3] bg-white p-2 rounded-lg border-2 border-[#383530] shadow-md flex-shrink-0 overflow-hidden"
              style={{ transform: idx === 1 ? "rotate(2deg)" : "rotate(-1deg)" }}
            >
              <img
                src={p.src}
                alt={p.label}
                className="w-full h-full rounded object-cover object-center"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Annotation below camera: "^ shot on film" */}
      <div className="mt-6 sm:mt-8 flex items-center gap-1.5">
        <svg viewBox="0 0 32 20" fill="none" className="w-6 h-4">
          <path d="M4 16 C 14 14, 20 8, 28 4 M 28 4 L 20 4 M 28 4 L 26 12" stroke="currentColor" className="text-wire-black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="font-caveat font-bold text-lg sm:text-2xl text-wire-black">
          <TypewriterText text="shot on film" preset="caption" />
        </span>
      </div>
    </section>
  );
}
