"use client";

import React, { useEffect, useRef, useState } from "react";
import { TypewriterText } from "./TypewriterText";

export function HeroSection() {
  const pendulumRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  // Physics state for smooth vertical drop and natural pendulum dangle
  const physicsState = useRef({
    // Start timestamp for graceful ~1.6s entry drop
    startTime: 0,
    dropDuration: 1600, // 1.6s visible, graceful descent
    startDropY: -650,    // Starts well above viewport
    currentDropY: -650,
    // Pendulum angular swing
    theta: 0.20,        // Initial sway angle (~11.5 degrees) for graceful entry dangle
    omega: 0.0,         // Angular velocity
    prevMouseX: 0,
    prevMouseY: 0,
  });

  // Track scroll position for smooth layered hero exit
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Airflow mouse interaction & pendulum animation loop
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      if (pendulumRef.current) {
        pendulumRef.current.style.transform = "translate3d(0, 0px, 0) rotate(0rad)";
      }
      return;
    }

    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      const state = physicsState.current;
      const elem = pendulumRef.current;
      if (!elem) return;

      const rect = elem.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height * 0.65;

      const dx = e.clientX - cardCenterX;
      const dy = e.clientY - cardCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Mouse pointer velocity (airflow direction & speed)
      const vx = e.clientX - state.prevMouseX;
      state.prevMouseX = e.clientX;
      state.prevMouseY = e.clientY;

      // Airflow influence radius (~ 380px around card)
      const influenceRadius = 380;
      if (dist < influenceRadius) {
        const proximity = Math.pow(1 - dist / influenceRadius, 1.8);
        const airImpulse = vx * proximity * 0.00045;
        state.omega += airImpulse;
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Physics constants for pendulum dangle
    const gravity = 0.0018;    // Restoring torque for pendulum swing
    const airFriction = 0.990; // Natural fluid air damping
    const maxTheta = 0.30;     // Max swing limit (~17 deg)

    const updatePhysics = (timestamp: number) => {
      const state = physicsState.current;
      if (!state.startTime) state.startTime = timestamp;

      // 1. Vertical Drop-Down (Smooth 1.6s ease-out descent with ZERO downward overshoot)
      const elapsed = timestamp - state.startTime;
      if (elapsed < state.dropDuration) {
        const progress = elapsed / state.dropDuration;
        // Cubic ease-out: starts with momentum, gently glides into resting place
        const ease = 1 - Math.pow(1 - progress, 3);
        state.currentDropY = state.startDropY * (1 - ease);
      } else {
        state.currentDropY = 0;
      }

      // 2. Pendulum Dangle & Swing Physics
      const torque = -gravity * Math.sin(state.theta);
      state.omega += torque;
      state.omega *= airFriction;
      state.theta += state.omega;

      // Clamp to prevent unnatural flips
      if (state.theta > maxTheta) {
        state.theta = maxTheta;
        state.omega = -state.omega * 0.35;
      } else if (state.theta < -maxTheta) {
        state.theta = -maxTheta;
        state.omega = -state.omega * 0.35;
      }

      // 3. Apply 3D Transform to Pendulum (Anchored at top center 0px)
      if (pendulumRef.current) {
        const deg = (state.theta * 180) / Math.PI;
        const rotateY = deg * 0.45;
        pendulumRef.current.style.transform = `translate3d(0, ${state.currentDropY.toFixed(2)}px, 0) rotate(${deg.toFixed(3)}deg) rotateY(${rotateY.toFixed(3)}deg)`;
      }

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Subtle nudge when mouse enters the badge card
  const handleCardMouseEnter = () => {
    physicsState.current.omega += 0.004;
  };

  // Scroll interpolation values
  const watermarkOpacity = Math.max(0.15, 0.85 - scrollY * 0.0015);
  const watermarkTranslateY = scrollY * 0.25;
  const heroContentOpacity = Math.max(0, 1 - scrollY * 0.002);

  return (
    <section
      id="about"
      className="relative min-h-[820px] sm:min-h-[880px] md:min-h-[940px] pt-0 pb-16 sm:pb-24 flex flex-col items-center justify-start overflow-hidden bg-wire-bg select-none w-full max-w-full"
    >
      {/* 1. Large Pale-Yellow Handwritten Background Typography ("ux designer" in Caveat script) */}
      <div
        className="absolute top-[32%] sm:top-[30%] md:top-[28%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1300px] px-2 sm:px-6 flex items-center justify-center pointer-events-none z-0 overflow-hidden"
        style={{
          opacity: watermarkOpacity,
          transform: `translate(-50%, calc(-50% + ${watermarkTranslateY}px))`,
          transition: "opacity 0.1s ease-out",
        }}
      >
        <h2
          className="font-caveat font-normal text-[clamp(90px,18vw,290px)] text-[#ffe500] leading-[0.85] tracking-[-0.02em] whitespace-nowrap text-center select-none"
          style={{
            textShadow: "0 2px 20px rgba(255, 229, 0, 0.2)",
          }}
        >
          ux designer
        </h2>
      </div>

      {/* 2. Hanging ID Badge System Suspended from Absolute Top Edge (0px) */}
      <div className="absolute top-0 left-0 right-0 w-full flex flex-col items-center pointer-events-none z-20">
        {/* Physical Pendulum Container with Drop-down and Dangle Physics */}
        <div
          ref={pendulumRef}
          style={{
            transformOrigin: "top center",
            willChange: "transform",
            transformStyle: "preserve-3d",
          }}
          className="flex flex-col items-center pointer-events-auto cursor-grab active:cursor-grabbing"
          onMouseEnter={handleCardMouseEnter}
        >
          {/* Authentic Crimson Lanyard Ribbon (Starts from very top edge 0px with NO gap) */}
          <div className="flex flex-col items-center">
            {/* Lanyard strap with woven texture */}
            <div className="relative w-4 sm:w-5 h-10 sm:h-12 overflow-hidden shadow-xs">
              <img
                src="/assets/lanyard-strap.png"
                alt=""
                className="w-full h-full object-cover select-none pointer-events-none"
                draggable={false}
              />
            </div>

            {/* Metallic Lobster Clasp Mechanism with Highlights and Shadow */}
            <div className="relative -mt-1 flex flex-col items-center z-10">
              <img
                src="/assets/lanyard-clip.png"
                alt=""
                className="w-7 sm:w-8 h-auto object-contain select-none pointer-events-none drop-shadow-md"
                draggable={false}
              />
            </div>
          </div>

          {/* Physical ID Card: Scaled to prevent overlapping headline text */}
          <div className="relative -mt-3.5 flex justify-center">
            <div className="relative w-[215px] sm:w-[245px] md:w-[265px] bg-[#fbfbf9] rounded-[13px] p-2.5 sm:p-3 flex flex-col items-center border-2 border-[#111111] shadow-[0_16px_40px_rgba(0,0,0,0.14)] transition-shadow duration-300 hover:shadow-[0_22px_50px_rgba(0,0,0,0.18)]">
              {/* Clean Geometrical Punch Hole Slot for the clasp hook */}
              <div className="w-8 sm:w-10 h-2 sm:h-2.5 bg-[#e2ded6] rounded-full border border-[#111111]/35 shadow-inner mb-2" />

              {/* Hand-drawn doodle face icon at top-left of card */}
              <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-20">
                <img
                  src="/assets/fNwIMs4sIdKKKRacWGUdjywxvk.svg"
                  alt=""
                  className="w-4 h-4 sm:w-5 sm:h-5 object-contain select-none pointer-events-none"
                  draggable={false}
                />
              </div>

              {/* Angled Yellow Sticky Note taped across top of photo */}
              <div
                className="absolute top-2 left-7 sm:top-2.5 sm:left-9 w-26 sm:w-32 bg-[#ffe500] px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-xs shadow-md border border-[#111111]/30 z-30 sketch-wobble"
                style={{ transform: "rotate(-5deg)" }}
              >
                {/* Clear scotch tape strip on top edge */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 sm:w-10 h-2 sm:h-2.5 bg-white/75 border border-black/10 backdrop-blur-xs -rotate-0.5" />
                <div className="flex items-center justify-center gap-1">
                  <img
                    src="/assets/sticky-doodle.svg"
                    alt=""
                    className="w-3 h-3 object-contain"
                    draggable={false}
                  />
                  <p className="font-caveat font-bold text-[11px] sm:text-xs text-[#111111] leading-tight text-center whitespace-nowrap">
                    <TypewriterText text="hello! have a nice day" preset="caption" delayMs={400} />
                  </p>
                </div>
              </div>

              {/* Polaroid Photo Frame with Authentic Portrait Photo */}
              <div className="relative w-full aspect-[4/4.3] bg-[#ffffff] rounded-md p-1.5 sm:p-2 border border-[#111111]/20 shadow-xs flex flex-col overflow-hidden">
                <div className="relative w-full flex-1 rounded overflow-hidden bg-[#e8e4dc]">
                  <img
                    src="/assets/john-portrait.webp"
                    alt="John with vintage camera"
                    className="w-full h-full object-cover object-center select-none pointer-events-none"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to push headline comfortably below the hanging card with ample breathing room */}
      <div className="h-[450px] sm:h-[480px] md:h-[510px]" />

      {/* 3. Primary Heading Below Badge: "I'M JOHN" with Scroll-Triggered Typing Animation */}
      <div
        className="flex flex-col items-center text-center px-4 max-w-4xl z-10 mt-6 sm:mt-8"
        style={{
          opacity: heroContentOpacity,
          transition: "opacity 0.1s ease-out",
        }}
      >
        <h1 className="font-marker text-5xl sm:text-7xl md:text-8xl lg:text-[100px] text-[#222222] leading-[0.9] tracking-tight uppercase select-none">
          <TypewriterText text="I'M JOHN" delayMs={300} speedMs={60} />
        </h1>

        {/* 4. Subtitle in Patrick Hand font with Typewriter Reveal */}
        <p className="mt-4 sm:mt-5 font-hand text-base sm:text-xl md:text-2xl text-[#444444] leading-relaxed max-w-3xl px-2">
          <TypewriterText
            text="A product designer in Chicago who gets excited about making complicated things simple"
            delayMs={700}
            speedMs={20}
          />
        </p>
      </div>

    </section>
  );
}
