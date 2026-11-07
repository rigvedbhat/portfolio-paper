"use client";

import React, { useEffect, useRef, useState, useId } from "react";
import { StickyNoteAnnotation, ArrowNoteAnnotation } from "./SketchDoodles";
import { TypewriterText } from "./TypewriterText";

export interface ProjectCardData {
  id: string;
  title: string;
  category: string;
  image: string;
  rotation?: string;
  offsetY?: string;
  stickyNote?: string;
  arrowNote?: { text: string; direction: "up" | "left" | "right" | "down-left" };
}

export function PaintbrushProjectCard({ proj }: { proj: ProjectCardData }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isSettled, setIsSettled] = useState(false);
  
  const rawId = useId();
  // Safe CSS & SVG identifier
  const safeId = `proj_${proj.id.replace(/[^a-zA-Z0-9]/g, "")}_${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const maskId = `brushMask_${safeId}`;

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    const cardEl = cardRef.current;
    if (!cardEl) return;

    // Synchronous viewport position check (matching Framer's exact Clip45 logic)
    const checkVisibility = () => {
      const rect = cardEl.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      // In viewport if top is within 88% of screen height and bottom is above top
      const inView = rect.top < windowHeight * 0.88 && rect.bottom > 40;

      if (inView) {
        setIsRevealed((prev) => {
          if (!prev) {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
              setIsSettled(true);
            }, 1650);
            return true;
          }
          return prev;
        });
      } else {
        // Reverse scroll un-paints and resets animation
        if (timer) clearTimeout(timer);
        setIsRevealed(false);
        setIsSettled(false);
      }
    };

    // Initial check on mount
    checkVisibility();

    // IntersectionObserver for standard notifications
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          if (timer) clearTimeout(timer);
          timer = setTimeout(() => {
            setIsSettled(true);
          }, 1650);
        } else {
          if (timer) clearTimeout(timer);
          setIsRevealed(false);
          setIsSettled(false);
        }
      },
      {
        threshold: [0, 0.15, 0.3],
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(cardEl);

    // Passive scroll listener for zero-latency scroll synchronization
    window.addEventListener("scroll", checkVisibility, { passive: true });
    window.addEventListener("resize", checkVisibility, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative flex flex-col group select-none ${proj.offsetY || ""} ${proj.rotation || ""}`}
    >
      {/* Optional Sticky Note Annotation on top-left of card */}
      {proj.stickyNote && (
        <div className="absolute -top-3.5 left-2 sm:-top-4 sm:left-4 z-30 transform -rotate-2">
          <StickyNoteAnnotation text={proj.stickyNote} />
        </div>
      )}

      {/* Authentic Picture Frame */}
      <div className="relative w-full aspect-[1144/650] flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.015]">
        {/* Inner Canvas Area (Photo + Wireframe Background) */}
        <div
          className="relative w-full h-full border-[3px] border-double transform rotate-1 overflow-hidden shadow-sm transition-colors duration-300"
          style={{
            borderColor: "var(--wire-card-frame-border)",
            backgroundColor: "var(--wire-card-frame-bg)",
          }}
        >
          {/* Native SVG Paintbrush Canvas with GPU-Accelerated Sweeping Mask Bands */}
          <svg
            viewBox="0 0 1000 580"
            className="w-full h-full block"
            preserveAspectRatio="none"
          >
            <defs>
              <style>
                {`
                  @keyframes sweepL2R_${safeId} {
                    0% { transform: translateX(-1400px) skewX(-35deg); }
                    100% { transform: translateX(0px) skewX(-35deg); }
                  }
                  @keyframes sweepR2L_${safeId} {
                    0% { transform: translateX(1400px) skewX(-35deg); }
                    100% { transform: translateX(0px) skewX(-35deg); }
                  }
                  .bL2R_${safeId} {
                    transform: translateX(-1400px) skewX(-35deg);
                  }
                  .bR2L_${safeId} {
                    transform: translateX(1400px) skewX(-35deg);
                  }
                  .paintActive_${safeId} .stk1 { animation: sweepL2R_${safeId} 0.55s cubic-bezier(0.25, 1, 0.5, 1) 0.05s forwards; }
                  .paintActive_${safeId} .stk2 { animation: sweepR2L_${safeId} 0.55s cubic-bezier(0.25, 1, 0.5, 1) 0.25s forwards; }
                  .paintActive_${safeId} .stk3 { animation: sweepL2R_${safeId} 0.55s cubic-bezier(0.25, 1, 0.5, 1) 0.45s forwards; }
                  .paintActive_${safeId} .stk4 { animation: sweepR2L_${safeId} 0.55s cubic-bezier(0.25, 1, 0.5, 1) 0.65s forwards; }
                  .paintActive_${safeId} .stk5 { animation: sweepL2R_${safeId} 0.55s cubic-bezier(0.25, 1, 0.5, 1) 0.85s forwards; }
                  .paintActive_${safeId} .stk6 { animation: sweepR2L_${safeId} 0.55s cubic-bezier(0.25, 1, 0.5, 1) 1.05s forwards; }
                `}
              </style>

              <mask id={maskId}>
                {/* Concealing black base */}
                <rect width="1000" height="580" fill="black" />

                {/* Group containing the 6 alternating skewed brush strokes with organic bristle teeth */}
                <g className={isRevealed ? `paintActive_${safeId}` : ""}>
                  {/* Stroke 1: Sweeps Left to Right */}
                  <g className={`bL2R_${safeId} stk1`}>
                    <rect x="-300" y="-10" width="1600" height="115" fill="white" />
                    <polygon points="1300,-10 1340,15 1300,35 1360,55 1290,75 1350,95 1300,105" fill="white" />
                  </g>

                  {/* Stroke 2: Sweeps Right to Left */}
                  <g className={`bR2L_${safeId} stk2`}>
                    <rect x="-300" y="90" width="1600" height="115" fill="white" />
                    <polygon points="-300,90 -340,115 -290,135 -360,155 -300,175 -350,195 -300,205" fill="white" />
                  </g>

                  {/* Stroke 3: Sweeps Left to Right */}
                  <g className={`bL2R_${safeId} stk3`}>
                    <rect x="-300" y="190" width="1600" height="115" fill="white" />
                    <polygon points="1300,190 1350,215 1300,235 1370,255 1290,275 1340,295 1300,305" fill="white" />
                  </g>

                  {/* Stroke 4: Sweeps Right to Left */}
                  <g className={`bR2L_${safeId} stk4`}>
                    <rect x="-300" y="290" width="1600" height="115" fill="white" />
                    <polygon points="-300,290 -350,315 -290,335 -370,355 -300,375 -340,395 -300,405" fill="white" />
                  </g>

                  {/* Stroke 5: Sweeps Left to Right */}
                  <g className={`bL2R_${safeId} stk5`}>
                    <rect x="-300" y="390" width="1600" height="115" fill="white" />
                    <polygon points="1300,390 1340,415 1300,435 1360,455 1290,475 1350,495 1300,505" fill="white" />
                  </g>

                  {/* Stroke 6: Sweeps Right to Left */}
                  <g className={`bR2L_${safeId} stk6`}>
                    <rect x="-300" y="490" width="1600" height="110" fill="white" />
                    <polygon points="-300,490 -340,515 -290,535 -360,555 -300,575 -330,595 -300,600" fill="white" />
                  </g>
                </g>
              </mask>
            </defs>

            {/* Base Wireframe Canvas Layer */}
            <rect width="1000" height="580" fill="var(--wire-card-frame-bg)" />
            <rect
              x="400"
              y="262"
              width="200"
              height="46"
              rx="6"
              fill="var(--wire-draft-box-bg)"
              stroke="var(--wire-draft-box-stroke)"
              strokeWidth="1.5"
            />
            <text
              x="500"
              y="291"
              textAnchor="middle"
              fontFamily="Permanent Marker, cursive, sans-serif"
              fontSize="18"
              fill="var(--wire-draft-text)"
            >
              {proj.title} [draft]
            </text>

            {/* Authentic Photograph Layer Revealed via Native SVG Mask */}
            <image
              href={proj.image}
              width="1000"
              height="580"
              preserveAspectRatio="xMidYMid slice"
              mask={isSettled ? undefined : `url(#${maskId})`}
              style={{
                opacity: isRevealed ? 1 : 0,
                transition: "opacity 0.2s ease-out",
              }}
            />
          </svg>
        </div>
      </div>

      {/* Project Title & Category Bar Beneath Frame */}
      <div className="mt-2.5 sm:mt-3 px-1 flex items-center justify-between">
        <h3 className="font-hand text-xl sm:text-2xl md:text-3xl text-[var(--wire-text-primary)] font-medium tracking-wide transition-colors duration-300">
          <TypewriterText text={proj.title} delayMs={150} speedMs={40} />
        </h3>

        <div
          className="px-3 sm:px-4 py-0.5 rounded-full sketch-wobble transition-colors duration-300"
          style={{
            border: "1px solid var(--wire-pill-border)",
            backgroundColor: "var(--wire-pill-bg)",
            color: "var(--wire-pill-text)",
          }}
        >
          <span className="font-caveat font-bold text-sm sm:text-lg">
            <TypewriterText text={proj.category} preset="caption" />
          </span>
        </div>
      </div>

      {/* Optional Arrow Annotation Below Card */}
      {proj.arrowNote && (
        <div className="mt-3 sm:mt-4 self-center sm:self-start px-2">
          <ArrowNoteAnnotation
            text={proj.arrowNote.text}
            direction={proj.arrowNote.direction}
          />
        </div>
      )}
    </div>
  );
}
