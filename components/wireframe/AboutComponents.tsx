"use client";

import React, { useEffect, useRef, useState } from "react";
import { TypewriterText } from "./TypewriterText";

// =========================================================================
// SECTION A: HANGING "ABOUT" BANNER WITH PHYSICS AIRFLOW
// Exact Framer recreation from reference:
// - Authentic SVG letter cards (YVl5PCAafc8v7eJBR4W8E5HD2U.svg etc.)
// - Two curved string cords matching Framer's vector assets
// - Responsive positioning: 130px x 150px on desktop (gap: 120px), 70px x 80px on mobile
// - Authentic airflow physics with pinOffset (48px), mass, spring torque, damping
// =========================================================================

const BANNER_ITEMS = [
  {
    char: "a",
    src: "/assets/YVl5PCAafc8v7eJBR4W8E5HD2U.svg",
    width: 130,
    height: 150,
    widthMobile: 70,
    heightMobile: 80,
    tilt: -5.0, // Natural tilt from Framer
  },
  {
    char: "b",
    src: "/assets/VR5TjdvYZibMqubZnIu55ljEBUk.svg",
    width: 130,
    height: 150,
    widthMobile: 70,
    heightMobile: 80,
    tilt: 4.5,
  },
  {
    char: "o",
    src: "/assets/fIQszHGpbBLMJWCWw60KjVdIJA.svg",
    width: 130,
    height: 150,
    widthMobile: 70,
    heightMobile: 80,
    tilt: -2.0,
  },
  {
    char: "u",
    src: "/assets/r1TR122Hi2aeMTl6I1lsOfpt6I.svg",
    width: 130,
    height: 150,
    widthMobile: 70,
    heightMobile: 80,
    tilt: 5.0,
  },
  {
    char: "t",
    src: "/assets/wO41vqVGIifQv66KU72xMs8f0.svg",
    width: 130,
    height: 150,
    widthMobile: 70,
    heightMobile: 80,
    tilt: -4.0,
  },
];

// Helper to calculate exact Y on the primary hanging curve
function getCurveY(normX: number, containerHeight: number) {
  // Catenary sag / cubic bezier profile matching Framer FP6zgnGJJVkNmGgCWKpK1eNL1JU
  // Normalized Y curve where center dips down
  const dip = Math.sin(normX * Math.PI);
  return containerHeight * 0.22 + dip * (containerHeight * 0.32);
}

export function HangingAboutBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [containerSize, setContainerSize] = useState({ w: 880, h: 300 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      const el = containerRef.current;
      if (!el) return;
      const w = el.clientWidth || 880;
      const mobile = w < 810;
      setIsMobile(mobile);
      setContainerSize({ w, h: mobile ? 220 : 300 });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Physics state per letter card: angle (rad), angular velocity, resting tilt
  const physicsState = useRef(
    BANNER_ITEMS.map((item) => ({
      angle: (item.tilt * Math.PI) / 180,
      velocity: 0,
      targetAngle: (item.tilt * Math.PI) / 180,
    }))
  );

  // Mouse velocity tracking for airflow simulation
  const mouseState = useRef({
    x: 0,
    y: 0,
    lastX: 0,
    lastY: 0,
    vx: 0,
    vy: 0,
    lastTime: 0,
    active: false,
  });

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      const now = performance.now();
      const m = mouseState.current;

      if (m.lastTime > 0) {
        const dt = Math.max(1, now - m.lastTime);
        const instantVx = (clientX - m.lastX) / dt;
        const instantVy = (clientY - m.lastY) / dt;
        m.vx = m.vx * 0.5 + instantVx * 0.5;
        m.vy = m.vy * 0.5 + instantVy * 0.5;
      }

      m.lastX = m.x;
      m.lastY = m.y;
      m.x = clientX;
      m.y = clientY;
      m.lastTime = now;
      m.active = true;
    };

    const handlePointerLeave = () => {
      mouseState.current.active = false;
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("mouseleave", handlePointerLeave);

    let animId: number;

    const tick = () => {
      if (prefersReducedMotion) {
        BANNER_ITEMS.forEach((item, i) => {
          const el = cardRefs.current[i];
          if (el) {
            el.style.transform = `rotate(${item.tilt}deg)`;
          }
        });
        return;
      }

      const m = mouseState.current;
      m.vx *= 0.94;
      m.vy *= 0.94;

      BANNER_ITEMS.forEach((item, i) => {
        const el = cardRefs.current[i];
        if (!el) return;
        const p = physicsState.current[i];

        // Airflow calculation
        let airTorque = 0;
        if (m.active) {
          const rect = el.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + 48; // Pin offset
          const dx = m.x - centerX;
          const dy = m.y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const AIR_RADIUS = 260;
          if (dist < AIR_RADIUS) {
            const proximity = Math.pow(1 - dist / AIR_RADIUS, 1.8);
            const impulse = m.vx * 0.045 * proximity;
            airTorque = impulse;
          }
        }

        // Spring physics: restoring torque towards target angle
        const displacement = p.angle - p.targetAngle;
        const springK = 0.085; // cardStiffness
        const damping = 0.925; // cardDamping

        const restoringTorque = -springK * displacement;
        const totalTorque = restoringTorque + airTorque;

        p.velocity = (p.velocity + totalTorque) * damping;
        p.angle += p.velocity;

        // Angle clamp
        const maxDev = (28 * Math.PI) / 180;
        p.angle = Math.max(p.targetAngle - maxDev, Math.min(p.targetAngle + maxDev, p.angle));

        const deg = (p.angle * 180) / Math.PI;
        el.style.transform = `rotate(${deg.toFixed(2)}deg)`;
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("mouseleave", handlePointerLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Compute card positions along string
  const totalCards = BANNER_ITEMS.length;
  const cardGap = isMobile ? 56 : 120;
  const totalSpan = (totalCards - 1) * cardGap;
  const startX = containerSize.w / 2 - totalSpan / 2;

  return (
    <section className="relative w-full pt-28 sm:pt-36 pb-12 sm:pb-16 px-4 sm:px-8 select-none overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Handwritten subtitle: "some hobby I really love!" with Typewriter Animation */}
        <h2 className="font-caveat font-bold text-2xl sm:text-3xl md:text-4xl text-[#111111] tracking-wide text-center mb-6 sm:mb-8">
          <TypewriterText text="some hobby I really love!" preset="heading" />
        </h2>

        {/* Strings + Hanging Letters Stage */}
        <div
          ref={containerRef}
          className="relative w-full h-[240px] sm:h-[300px]"
          style={{ overflow: "visible" }}
        >
          {/* Two Curved Hanging String Cords matching Framer SVGs */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox={`0 0 ${containerSize.w} ${containerSize.h}`}
            preserveAspectRatio="none"
          >
            {/* Primary Curved Cord */}
            <path
              d={`M 0,${containerSize.h * 0.18} Q ${containerSize.w * 0.5},${containerSize.h * 0.76} ${containerSize.w},${containerSize.h * 0.18}`}
              stroke="#B9B9B9"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            {/* Secondary Companion Cord */}
            <path
              d={`M 0,${containerSize.h * 0.22} Q ${containerSize.w * 0.5},${containerSize.h * 0.82} ${containerSize.w},${containerSize.h * 0.24}`}
              stroke="#E3E3E3"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* 5 Authentic Hanging Letter Cards */}
          {BANNER_ITEMS.map((item, idx) => {
            const cardW = isMobile ? item.widthMobile : item.width;
            const cardH = isMobile ? item.heightMobile : item.height;
            const pinOffset = isMobile ? 26 : 48;

            // X coordinate centered around startX
            const posX = startX + idx * cardGap;
            const normX = Math.max(0, Math.min(1, posX / Math.max(1, containerSize.w)));
            const posY = getCurveY(normX, containerSize.h);

            return (
              <div
                key={item.char}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className="absolute cursor-pointer will-change-transform z-10 select-none"
                style={{
                  left: `${posX - cardW / 2}px`,
                  top: `${posY - pinOffset}px`,
                  width: `${cardW}px`,
                  height: `${cardH}px`,
                  transformOrigin: `50% ${pinOffset}px`,
                  transform: `rotate(${item.tilt}deg)`,
                }}
                title={`Hanging Letter '${item.char.toUpperCase()}'`}
              >
                <img
                  src={item.src}
                  alt={`Letter ${item.char}`}
                  className="w-full h-full object-contain pointer-events-none select-none drop-shadow-md transition-shadow hover:drop-shadow-lg"
                  draggable={false}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// =========================================================================
// SECTION B: HOBBY CARDS (AUTHENTIC ASYMMETRIC SCRAPBOOK COMPOSITION)
// Exact Framer recreation matching reference:
// - Item 1: padding 0, rotated -5deg, caption: "Just meeee and the mountainsss!!!", photo width 70%
// - Item 2: padding-top 56px, rotated 6deg, photo rotated -8deg, photo width 100%
// - Item 3: padding 0, rotated 7deg, photo width 80%, caption: "Too tired to standd."
// - Item 4: padding 0, rotated -5deg, photo width 100%, caption: "Peak visionsss onlyyy"
// Authentic SVGs: E4yJR11KIrktjakYHV2fRanbck.svg (card background), 2YZ35XU7fmaLRY67nyBhUXQWc8.svg (paper clip),
// 3ieTmRPOGWValYITWLkPubZhlkE.svg (ragged photo edge mask).
// =========================================================================
export function HobbyCardsSection() {
  return (
    <section className="relative w-full py-12 sm:py-20 px-4 sm:px-8 bg-wire-bg select-none">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 items-start">
          
          {/* ================================================================= */}
          {/* ITEM 1: Mountain Lake & Runner (Top left, -5deg tilt, 70% width photo) */}
          {/* ================================================================= */}
          <div className="w-full flex flex-col items-start pt-0">
            {/* Header Content Container (framer-a74lgq) */}
            <div className="w-[90%] h-[130px] flex justify-center items-start relative">
              {/* Paper Card with Paper Clip & Caption (framer-117mq8v: 250px height, rotate -5deg) */}
              <div
                className="relative w-full h-[250px] pt-14 pb-0 pl-10 pr-6 flex flex-col justify-start items-start select-none transition-transform duration-300 hover:rotate-0"
                style={{
                  transform: "rotate(-5deg)",
                  backgroundImage: "url('/assets/E4yJR11KIrktjakYHV2fRanbck.svg')",
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              >
                {/* Paper Clip (framer-qu8dl: left 19px, top -4px, width 15px) */}
                <div className="absolute left-[19px] -top-1 w-[15px] h-[45px] z-20 pointer-events-none">
                  <img
                    src="/assets/2YZ35XU7fmaLRY67nyBhUXQWc8.svg"
                    alt="Paper Clip"
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>

                {/* Caption (framer-d3byl7) */}
                <p className="font-caveat font-bold text-lg sm:text-xl text-[#111111] leading-snug text-left">
                  <TypewriterText text="Just meeee and the mountainsss!!!" preset="caption" />
                </p>
              </div>
            </div>

            {/* Photo Container (framer-15wtqon: width 70%, aspect 1.05, ragged mask) */}
            <div
              className="relative w-[70%] aspect-[1.05] mt-2 transition-transform duration-300 hover:scale-105"
              style={{
                WebkitMask: "url('/assets/3ieTmRPOGWValYITWLkPubZhlkE.svg') 50% / contain no-repeat",
                mask: "url('/assets/3ieTmRPOGWValYITWLkPubZhlkE.svg') 50% / contain no-repeat",
              }}
            >
              <img
                src="/assets/sATgsP34lR83MiF196uhr9M4HDo.png"
                alt="Mountain Lake"
                className="w-full h-full object-cover select-none pointer-events-none"
                draggable={false}
              />
            </div>
          </div>

          {/* ================================================================= */}
          {/* ITEM 2: Golden Hour Crew (Shifted DOWN 56px, +6deg tilt, photo -8deg, 100% photo) */}
          {/* ================================================================= */}
          <div className="w-full flex flex-col items-center pt-8 sm:pt-14">
            {/* Header Content Container (framer-9ab13) */}
            <div className="w-[110%] h-[100px] flex justify-center items-start relative">
              {/* Paper Card with Paper Clip & Caption (framer-10k44f6: 250px height, rotate 6deg) */}
              <div
                className="relative w-full h-[250px] pt-14 pb-0 pl-10 pr-6 flex flex-col justify-start items-start select-none transition-transform duration-300 hover:rotate-0"
                style={{
                  transform: "rotate(6deg)",
                  backgroundImage: "url('/assets/E4yJR11KIrktjakYHV2fRanbck.svg')",
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              >
                {/* Paper Clip (framer-vrgscs) */}
                <div className="absolute left-[19px] -top-1 w-[15px] h-[45px] z-20 pointer-events-none">
                  <img
                    src="/assets/2YZ35XU7fmaLRY67nyBhUXQWc8.svg"
                    alt="Paper Clip"
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>

                {/* Caption (framer-140t14w) */}
                <p className="font-caveat font-bold text-lg sm:text-xl text-[#111111] leading-snug text-center w-full">
                  <TypewriterText text="Golden hour crewwww" preset="caption" />
                </p>
              </div>
            </div>

            {/* Photo Container (framer-1vz41d3: width 100%, aspect 1.05, rotate -8deg, ragged mask) */}
            <div
              className="relative w-full aspect-[1.05] mt-2 transition-transform duration-300 hover:scale-105"
              style={{
                transform: "rotate(-8deg)",
                WebkitMask: "url('/assets/3ieTmRPOGWValYITWLkPubZhlkE.svg') 50% / contain no-repeat",
                mask: "url('/assets/3ieTmRPOGWValYITWLkPubZhlkE.svg') 50% / contain no-repeat",
              }}
            >
              <img
                src="/assets/Ftnt01le1kkib13zeUVutJTwUnQ.png"
                alt="Golden Hour Crew"
                className="w-full h-full object-cover select-none pointer-events-none"
                draggable={false}
              />
            </div>
          </div>

          {/* ================================================================= */}
          {/* ITEM 3: Tennis Court (Top right-center, +7deg tilt, 80% photo) */}
          {/* ================================================================= */}
          <div className="w-full flex flex-col items-end pt-0">
            {/* Header Content Container (framer-1l2d2h4) */}
            <div className="w-[90%] h-[80px] flex justify-center items-start relative">
              {/* Paper Card with Paper Clip & Caption (framer-1p7niml: 250px height, rotate 7deg) */}
              <div
                className="relative w-full h-[250px] pt-10 pb-0 pl-8 pr-6 flex flex-col justify-start items-start select-none transition-transform duration-300 hover:rotate-0"
                style={{
                  transform: "rotate(7deg)",
                  backgroundImage: "url('/assets/E4yJR11KIrktjakYHV2fRanbck.svg')",
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              >
                {/* Paper Clip (framer-1nh8463) */}
                <div className="absolute left-[19px] -top-1 w-[15px] h-[45px] z-20 pointer-events-none">
                  <img
                    src="/assets/2YZ35XU7fmaLRY67nyBhUXQWc8.svg"
                    alt="Paper Clip"
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>

                {/* Caption (framer-13yckg9) */}
                <p className="font-caveat font-bold text-lg sm:text-xl text-[#111111] leading-snug text-center w-full">
                  <TypewriterText text="Too tired to standd." preset="caption" />
                </p>
              </div>
            </div>

            {/* Photo Container (framer-18ptny5: width 80%, aspect 1.05, ragged mask) */}
            <div
              className="relative w-[80%] aspect-[1.05] mt-2 transition-transform duration-300 hover:scale-105"
              style={{
                WebkitMask: "url('/assets/3ieTmRPOGWValYITWLkPubZhlkE.svg') 50% / contain no-repeat",
                mask: "url('/assets/3ieTmRPOGWValYITWLkPubZhlkE.svg') 50% / contain no-repeat",
              }}
            >
              <img
                src="/assets/Kqp9toTCFbVNz4dELfWZjQI8xw.png"
                alt="Tennis Court"
                className="w-full h-full object-cover select-none pointer-events-none"
                draggable={false}
              />
            </div>
          </div>

          {/* ================================================================= */}
          {/* ITEM 4: Peak Visions Alpine (Far right, -5deg tilt, 100% photo) */}
          {/* ================================================================= */}
          <div className="w-full flex flex-col items-end pt-4 sm:pt-8">
            {/* Header Content Container (framer-1ih5tq3) */}
            <div className="w-[80%] h-[100px] flex justify-center items-start relative">
              {/* Paper Card with Paper Clip & Caption (framer-2h8jtu: 250px height, rotate -5deg) */}
              <div
                className="relative w-full h-[250px] pt-14 pb-0 pl-10 pr-6 flex flex-col justify-start items-start select-none transition-transform duration-300 hover:rotate-0"
                style={{
                  transform: "rotate(-5deg)",
                  backgroundImage: "url('/assets/E4yJR11KIrktjakYHV2fRanbck.svg')",
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              >
                {/* Paper Clip (framer-gdtzrs) */}
                <div className="absolute left-[19px] -top-1 w-[15px] h-[45px] z-20 pointer-events-none">
                  <img
                    src="/assets/2YZ35XU7fmaLRY67nyBhUXQWc8.svg"
                    alt="Paper Clip"
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>

                {/* Caption (framer-s46ilh) */}
                <p className="font-caveat font-bold text-lg sm:text-xl text-[#111111] leading-snug text-left">
                  <TypewriterText text="Peak visionsss onlyyy" preset="caption" />
                </p>
              </div>
            </div>

            {/* Photo Container (framer-acq8yy: width 100%, aspect 1.05, ragged mask) */}
            <div
              className="relative w-full aspect-[1.05] mt-2 transition-transform duration-300 hover:scale-105"
              style={{
                WebkitMask: "url('/assets/3ieTmRPOGWValYITWLkPubZhlkE.svg') 50% / contain no-repeat",
                mask: "url('/assets/3ieTmRPOGWValYITWLkPubZhlkE.svg') 50% / contain no-repeat",
              }}
            >
              <img
                src="/assets/sATgsP34lR83MiF196uhr9M4HDo.png"
                alt="Peak visions"
                className="w-full h-full object-cover select-none pointer-events-none"
                draggable={false}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// =========================================================================
// SECTION C: A LITTLE BIT ABOUT ME
// Yellow sticky note + avatar, and 3 scattered ruled notebook sheets held by tape
// =========================================================================
export function ScatteredBioSection() {
  return (
    <section className="relative w-full mt-16 sm:mt-28 pt-24 sm:pt-36 pb-20 sm:pb-28 px-4 sm:px-8 md:px-14 bg-wire-bg select-none">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Yellow Sticky Note with "a little bit about me" + Boy Avatar Doodle at top right */}
        <div className="w-full flex justify-end pr-4 sm:pr-12 mb-8 sm:mb-12">
          <div
            className="relative inline-flex items-center gap-2.5 bg-[#ffe500] px-4 py-2.5 rounded-xs shadow-md border border-[#111111]/40 sketch-wobble"
            style={{ transform: "rotate(2deg)" }}
          >
            {/* Scotch Tape strip at top */}
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-3.5 bg-white/70 border border-black/10 backdrop-blur-xs -rotate-2" />

            {/* Avatar doodle face */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0">
              <img
                src="/assets/fNwIMs4sIdKKKRacWGUdjywxvk.svg"
                alt="Avatar"
                className="w-full h-full object-contain pointer-events-none"
                draggable={false}
              />
            </div>

            <h3 className="font-caveat font-bold text-lg sm:text-xl md:text-2xl text-[#111111] leading-none">
              <TypewriterText text="a little bit about me" preset="heading" />
            </h3>
          </div>
        </div>

        {/* Scattered Ruled Notebook Sheets matching Reference */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 items-start">
          
          {/* LEFT COLUMN: Two stacked notebook sheets */}
          <div className="md:col-span-6 flex flex-col gap-8 sm:gap-10">
            {/* Sheet 1: Top Left with Orange/Yellow Washi Tape */}
            <div
              className="relative bg-[#ffffff] rounded-[12px] p-6 sm:p-8 shadow-[0_12px_36px_rgba(0,0,0,0.08)] border border-[#111111]/70 transition-transform duration-300 hover:scale-[1.01]"
              style={{
                transform: "rotate(-2deg)",
                backgroundImage:
                  "repeating-linear-gradient(transparent, transparent 31px, rgba(17,17,17,0.07) 31px, rgba(17,17,17,0.07) 32px)",
                backgroundPosition: "0 18px",
              }}
            >
              <div className="absolute -top-3 left-10 w-16 h-5 bg-[#f59e0b]/80 border border-black/10 rounded-xs -rotate-1 shadow-xs" />

              <p className="font-hand text-lg sm:text-xl text-[#222222] leading-[32px] pt-1">
                <TypewriterText
                  text="Currently, I'm at Meridian Health working on experiences for mental health clinicians and administrators. Before that, I spent almost two years at StyleBook helping salons manage their businesses (and discovering that stylists have very strong opinions about scheduling interfaces, which I deeply respect)."
                  preset="paragraph"
                />
              </p>
            </div>

            {/* Sheet 2: Bottom Left with Pink Washi Tape */}
            <div
              className="relative bg-[#ffffff] rounded-[12px] p-6 sm:p-8 shadow-[0_12px_36px_rgba(0,0,0,0.08)] border border-[#111111]/70 transition-transform duration-300 hover:scale-[1.01]"
              style={{
                transform: "rotate(1.5deg)",
                backgroundImage:
                  "repeating-linear-gradient(transparent, transparent 31px, rgba(17,17,17,0.07) 31px, rgba(17,17,17,0.07) 32px)",
                backgroundPosition: "0 18px",
              }}
            >
              <div className="absolute -top-3 left-10 w-16 h-5 bg-[#ec4899]/80 border border-black/10 rounded-xs rotate-2 shadow-xs" />

              <p className="font-hand text-lg sm:text-xl text-[#222222] leading-[32px] pt-1">
                <TypewriterText
                  text="When I'm not designing, you'll find me thinking about why some interfaces feel intuitive and others make you want to throw your laptop out a window. Usually with coffee."
                  preset="paragraph"
                />
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Tall ruled notebook sheet with Cyan Washi Tape */}
          <div className="md:col-span-6 flex flex-col justify-start">
            <div
              className="relative bg-[#ffffff] rounded-[12px] p-6 sm:p-9 shadow-[0_12px_36px_rgba(0,0,0,0.08)] border border-[#111111]/70 transition-transform duration-300 hover:scale-[1.01]"
              style={{
                transform: "rotate(1deg)",
                backgroundImage:
                  "repeating-linear-gradient(transparent, transparent 31px, rgba(17,17,17,0.07) 31px, rgba(17,17,17,0.07) 32px)",
                backgroundPosition: "0 18px",
              }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-18 h-5 bg-[#06b6d4]/80 border border-black/10 rounded-xs -rotate-1 shadow-xs" />

              <p className="font-hand text-lg sm:text-xl text-[#222222] leading-[32px] pt-1 mb-4">
                <TypewriterText
                  text="I spend my days designing for healthcare platforms, booking systems, and other products where 'just figure it out' isn't an option. The people using these tools are busy, stressed, and have actual work to do. My job is to get out of their way."
                  preset="paragraph"
                />
              </p>
              <p className="font-hand text-lg sm:text-xl text-[#222222] leading-[32px]">
                <TypewriterText
                  text="I've worked on teams of two and teams of twenty. I've had access to endless user research and I've had to make educated guesses with limited data. I've worked within strict component libraries and I've built design systems from scratch. What stays consistent is asking good questions, collaborating with people who know more than me, and shipping things that actually help."
                  preset="paragraph"
                />
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// =========================================================================
// SECTION D & E: "WHAT DIVE INTO MY WORK?" SECTION
// Centered oversized brush heading + 4 horizontally cascading notebook paper sheets
// Dynamic hover-to-foreground stacking context (z-50) with authentic Framer paper assets
// =========================================================================
export function WorkPrinciplesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const principles = [
    {
      num: "01",
      title: "Starting with why, not what",
      desc: "Before wireframes, I want to know what problem we're actually solving. Sometimes what people ask for isn't what they need.",
      color: "#cbe3fb",
      defaultRotate: 3,
      topOffset: "pt-0",
      baseZ: 10,
    },
    {
      num: "02",
      title: "Designing for real constraints",
      desc: "Perfect conditions don't exist, tight budgets, messy legacy systems, no access to users. I make smart calls with imperfect information.",
      color: "#fef08a",
      defaultRotate: -6,
      topOffset: "pt-10 sm:pt-14",
      baseZ: 20,
    },
    {
      num: "03",
      title: "Collaboration over hero design",
      desc: "The best work happens when designers, engineers, and product folks actually talk. Not throwing things over the wall.",
      color: "#fbcfe8",
      defaultRotate: 5,
      topOffset: "pt-1 sm:pt-2",
      baseZ: 30,
    },
    {
      num: "04",
      title: "Making the invisible visible",
      desc: "The most impactful work isn't flashy — it's the auto-save that prevents panic, the error message that actually helps. Details build trust.",
      color: "#bbf7d0",
      defaultRotate: -5,
      topOffset: "pt-12 sm:pt-16",
      baseZ: 40,
    },
  ];

  return (
    <section className="relative w-full mt-16 sm:mt-28 pt-24 sm:pt-36 pb-20 sm:pb-28 px-4 sm:px-8 md:px-14 bg-wire-bg select-none">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Centered Oversized Brush-Style Heading with Typewriter Effect */}
        <h2 className="font-marker text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#111111] leading-tight text-center tracking-tight uppercase mb-12 sm:mb-20">
          <TypewriterText text="WHAT DIVE INTO" preset="heading" />
          <br />
          <TypewriterText text="MY WORK?" preset="heading" delayMs={300} />
        </h2>

        {/* 4 Overlapping Cascading Notebook Paper Sheets */}
        <div
          className="relative w-full flex justify-center items-start py-6 sm:py-10 overflow-x-auto lg:overflow-visible pb-16"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="flex justify-center items-start min-w-[880px] lg:min-w-0">
            {principles.map((card, i) => {
              const isHovered = hoveredIndex === i;
              const isAnyHovered = hoveredIndex !== null;

              const zIndex = isHovered ? 50 : card.baseZ;
              const rotation = isHovered ? 0 : card.defaultRotate;
              const translateY = isHovered ? -22 : 0;
              const scale = isHovered ? 1.08 : isAnyHovered ? 0.96 : 1;
              const opacity = isAnyHovered && !isHovered ? 0.65 : 1;

              return (
                <div
                  key={card.num}
                  className={`relative w-[210px] sm:w-[230px] md:w-[250px] flex-shrink-0 ${card.topOffset}`}
                  style={{ zIndex }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseOver={() => setHoveredIndex(i)}
                >
                  <div
                    data-card-sheet={i}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseOver={() => setHoveredIndex(i)}
                    onClick={() => setHoveredIndex(hoveredIndex === i ? null : i)}
                    className="absolute top-0 left-0 w-[360px] sm:w-[390px] md:w-[420px] aspect-[901/631] cursor-pointer transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)]"
                    style={{
                      transform: `translateY(${translateY}px) rotate(${rotation}deg) scale(${scale})`,
                      opacity,
                      filter: isHovered
                        ? "drop-shadow(0 25px 30px rgba(0,0,0,0.18))"
                        : "drop-shadow(0 10px 15px rgba(0,0,0,0.08))",
                    }}
                  >
                    {/* Authentic Torn Paper Base Image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/1TDjxV1XOxc6fKJZHd7hlG0dxw.png"
                      alt="Paper sheet"
                      className="absolute inset-0 w-full h-full object-fill pointer-events-none z-1"
                    />

                    {/* Pastel Color Tint Layer Masked by the Paper Contour */}
                    <div
                      className="absolute inset-0 z-2 opacity-85 pointer-events-none"
                      style={{
                        backgroundColor: card.color,
                        WebkitMask: "url(/assets/1TDjxV1XOxc6fKJZHd7hlG0dxw.png) center/100% 100% no-repeat",
                        mask: "url(/assets/1TDjxV1XOxc6fKJZHd7hlG0dxw.png) center/100% 100% no-repeat",
                      }}
                    />

                    {/* Subtle Notebook Ruled Lines */}
                    <div
                      className="absolute inset-[20px_30px_20px_70px] pointer-events-none z-3"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(transparent, transparent 27px, rgba(0,0,0,0.06) 28px)",
                      }}
                    />

                    {/* Paper Content: Numbered Circle, Title, Description */}
                    <div className="relative z-4 h-full pt-8 sm:pt-9 pb-6 pr-8 pl-16 sm:pl-18 flex flex-col justify-start">
                      {/* Number in Hand-Drawn Circle SVG + Heading */}
                      <div className="flex items-center gap-3 mb-3.5">
                        <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/assets/37C10FqTxPUKOJzhNldFD0Y7A.svg"
                            alt="Circle"
                            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                          />
                          <span className="relative z-1 font-caveat font-bold text-lg sm:text-xl text-[#111111] leading-none">
                            <TypewriterText text={card.num} preset="fast" />
                          </span>
                        </div>

                        <h3 className="font-caveat font-bold text-xl sm:text-2xl text-[#111111] leading-snug tracking-wide">
                          <TypewriterText text={card.title} preset="heading" delayMs={100} />
                        </h3>
                      </div>

                      {/* Description Body Text */}
                      <p className="font-sans text-xs sm:text-sm md:text-[14.5px] leading-relaxed text-[#1f1f1f] font-medium pr-2">
                        <TypewriterText text={card.desc} preset="paragraph" delayMs={200} />
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// =========================================================================
// SECTION F: "MY EXPERIENCE" SECTION
// Authentic centered ruled notebook page with red vertical margin
// =========================================================================
export function ExperienceSection() {
  const experiences = [
    {
      company: "Google",
      role: "Senior Interaction Designer",
      period: "2023 — Present",
      location: "Chicago, IL",
      desc: "Designing developer-facing platform tools, workflow automation builders, and design system governance primitives used across multi-product suites.",
      highlight: "#ffe500",
    },
    {
      company: "Spotify",
      role: "Product Designer",
      period: "2021 — 2023",
      location: "New York / Remote",
      desc: "Created listening party experiences, synchronized canvas visuals, and artist profile analytics dashboards for creators and music listeners worldwide.",
      highlight: "#86efac",
    },
    {
      company: "Garena",
      role: "UI/UX Designer",
      period: "2019 — 2021",
      location: "Singapore",
      desc: "Crafted interactive web campaigns, tournament companion tools, and gamer community forums with rich micro-animations and delight details.",
      highlight: "#fbcfe8",
    },
  ];

  return (
    <section className="relative w-full mt-16 sm:mt-28 pt-24 sm:pt-36 pb-20 sm:pb-28 px-4 sm:px-8 md:px-14 bg-wire-bg select-none">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Section Heading: "MY EXPERIENCE" */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-14">
          <h2 className="font-marker text-4xl sm:text-5xl md:text-6xl text-[#111111] tracking-tight uppercase">
            <TypewriterText text="MY EXPERIENCE" preset="heading" />
          </h2>
          <div className="mt-2 w-32 h-1 overflow-hidden">
            <img src="/assets/mVqvbTUbNChN4quMJjltePhW1A.svg" alt="" className="w-full h-full object-fill" />
          </div>
        </div>

        {/* Notebook Page Container with Red Margin Line */}
        <div
          className="relative w-full bg-[#ffffff] rounded-[18px] p-6 sm:p-10 md:p-12 border-2 border-[#111111] shadow-[0_16px_45px_rgba(0,0,0,0.10)]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(transparent, transparent 31px, rgba(17,17,17,0.06) 31px, rgba(17,17,17,0.06) 32px)",
            backgroundPosition: "0 28px",
          }}
        >
          {/* Vertical Red Margin Line */}
          <div className="absolute top-0 bottom-0 left-12 sm:left-16 md:left-20 w-[1.5px] bg-[#ef4444]/60 pointer-events-none" />

          {/* Experience List Items */}
          <div className="relative pl-8 sm:pl-12 md:pl-16 flex flex-col gap-10 sm:gap-12">
            {experiences.map((exp, i) => (
              <div key={i} className="flex flex-col">
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-3">
                    <span
                      className="font-marker text-2xl sm:text-3xl text-[#111111] px-2 py-0.5 rounded-xs"
                      style={{ backgroundColor: `${exp.highlight}90` }}
                    >
                      <TypewriterText text={exp.company} preset="heading" />
                    </span>
                    <span className="font-hand font-bold text-lg sm:text-xl text-[#222222]">
                      <TypewriterText text={exp.role} preset="caption" />
                    </span>
                  </div>

                  <span className="font-mono text-xs sm:text-sm font-semibold text-[#666666] tracking-wide">
                    <TypewriterText text={exp.period} preset="fast" />
                  </span>
                </div>

                <p className="font-hand text-base sm:text-lg text-[#333333] leading-[32px] pt-1">
                  <TypewriterText text={exp.desc} preset="paragraph" />
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
