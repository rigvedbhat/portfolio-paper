"use client";

import React, { useEffect, useRef, useState } from "react";
import { TypewriterText } from "./TypewriterText";

export function HeroSection() {
  const pendulumRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  // Physics state for smooth natural elastic dangle & swing
  const physicsState = useRef({
    // Vertical elastic spring displacement & velocity
    displacementY: 65,
    velocityY: 0,
    hasStarted: false,
    // Pendulum angular swing
    theta: 0.16,        // Initial sway angle
    omega: 0.0,         // Angular velocity
    prevMouseX: 0,
    prevMouseY: 0,
    hoverNudgeY: 0,
    hoverNudgeVel: 0,
    isHovered: false,
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

    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      const state = physicsState.current;
      const elem = pendulumRef.current;
      if (!elem) return;

      const rect = elem.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height * 0.65;

      const dx = touch.clientX - cardCenterX;
      const dy = touch.clientY - cardCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const vx = touch.clientX - (state.prevMouseX || touch.clientX);
      state.prevMouseX = touch.clientX;
      state.prevMouseY = touch.clientY;

      const influenceRadius = 260;
      if (dist < influenceRadius) {
        const proximity = Math.pow(1 - dist / influenceRadius, 1.5);
        const airImpulse = vx * proximity * 0.0006;
        state.omega += airImpulse;
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    // Physics constants for pendulum dangle & elastic vertical bounce
    const gravity = 0.0016;    // Restoring torque for pendulum swing
    const airFriction = 0.992; // Natural fluid air damping
    const maxTheta = 0.28;     // Max swing limit

    const updatePhysics = () => {
      const state = physicsState.current;

      // 1. Natural elastic vertical dangle spring (slower, bouncier diminishing oscillations like the rope)
      const targetY = state.isHovered ? -10 : 0;
      const springK = 0.016;
      const damping = 0.965;
      const forceY = -springK * (state.displacementY - targetY);
      state.velocityY = (state.velocityY + forceY) * damping;
      state.displacementY += state.velocityY;

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

      // 3. Apply 3D Transform to Pendulum (Anchored at top center)
      if (pendulumRef.current) {
        const deg = (state.theta * 180) / Math.PI;
        const rotateY = deg * 0.45;
        pendulumRef.current.style.transform = `translate3d(0, ${state.displacementY.toFixed(2)}px, 0) rotate(${deg.toFixed(3)}deg) rotateY(${rotateY.toFixed(3)}deg)`;
      }

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Nudge and bounce when mouse enters/leaves the badge card
  const handleCardMouseEnter = () => {
    physicsState.current.omega += 0.005;
    physicsState.current.isHovered = true;
  };

  const handleCardMouseLeave = () => {
    physicsState.current.isHovered = false;
  };

  // Scroll interpolation values
  const watermarkOpacity = Math.max(0.08, 0.45 - scrollY * 0.0008);
  const watermarkTranslateY = scrollY * 0.25;
  const heroContentOpacity = Math.max(0, 1 - scrollY * 0.002);

  return (
    <section
      id="about"
      className="relative min-h-[820px] sm:min-h-[880px] md:min-h-[940px] pt-0 pb-16 sm:pb-24 flex flex-col items-center justify-start overflow-hidden bg-wire-bg select-none w-full max-w-full"
    >
      {/* 1. Large Pale-Yellow Handwritten Background Typography ("Aspiring AI Engineer" in Caveat script) */}
      <div
        className="absolute top-[32%] sm:top-[30%] md:top-[28%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1300px] px-4 sm:px-6 flex items-center justify-center pointer-events-none z-0 overflow-hidden"
        style={{
          opacity: watermarkOpacity,
          transform: `translate(-50%, calc(-50% + ${watermarkTranslateY}px))`,
          transition: "opacity 0.1s ease-out",
        }}
      >
        <h2
          className="font-caveat font-normal text-[clamp(32px,8.5vw,140px)] text-[#ffe500] leading-[0.95] tracking-[-0.02em] whitespace-nowrap text-center select-none"
          style={{
            textShadow: "0 2px 20px rgba(255, 229, 0, 0.2)",
          }}
        >
          Aspiring AI Engineer
        </h2>
      </div>

      {/* 2. Hanging ID Badge System Suspended from above viewport */}
      <div className="absolute -top-16 left-0 right-0 w-full flex flex-col items-center pointer-events-none z-20">
        {/* Physical Pendulum Container with Drop-down and Dangle Physics */}
        <div
          ref={pendulumRef}
          style={{
            transformOrigin: "top center",
            willChange: "transform",
            transformStyle: "preserve-3d",
          }}
          className="flex flex-col items-center pointer-events-auto cursor-grab active:cursor-grabbing touch-pan-y"
          onMouseEnter={handleCardMouseEnter}
          onMouseLeave={handleCardMouseLeave}
          onTouchStart={handleCardMouseEnter}
          onTouchEnd={handleCardMouseLeave}
        >
          {/* Authentic Crimson Lanyard Ribbon (Extends well above screen edge so top cut is never visible) */}
          <div className="flex flex-col items-center">
            {/* Extended lanyard strap with woven texture */}
            <div className="relative w-4 sm:w-5 h-24 sm:h-28 overflow-hidden shadow-xs">
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
            <div className="relative w-[210px] xs:w-[225px] sm:w-[245px] md:w-[265px] bg-[#fbfbf9] rounded-[13px] p-2.5 sm:p-3 flex flex-col items-center border-2 border-[#111111] shadow-[0_16px_40px_rgba(0,0,0,0.14)] transition-shadow duration-300 hover:shadow-[0_22px_50px_rgba(0,0,0,0.18)]">
              {/* Clean Geometrical Punch Hole Slot for the clasp hook */}
              <div className="w-8 sm:w-10 h-2 sm:h-2.5 bg-[#e2ded6] rounded-full border border-[#111111]/35 shadow-inner mb-2" />

              {/* Hand-drawn doodle face icon at top-left of card */}
              <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-20">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full overflow-hidden border border-[#111111] bg-[#ffe500] flex items-center justify-center">
                  <img
                    src="/rigved-illustration.jpg"
                    alt="Rigved Doodle Avatar"
                    className="w-full h-full object-cover select-none pointer-events-none scale-125"
                    draggable={false}
                  />
                </div>
              </div>

              {/* Angled Yellow Sticky Note taped across top of photo */}
              <div
                className="absolute top-2 left-6 xs:left-7 sm:top-2.5 sm:left-9 w-26 sm:w-32 bg-[#ffe500] px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-xs shadow-md border border-[#111111]/30 z-30 sketch-wobble"
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
                    src="/rigved-id.png"
                    alt="Rigved - Aspiring AI Engineer"
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
      <div className="h-[390px] sm:h-[460px] md:h-[510px]" />

      {/* 3. Primary Heading Below Badge: "I'M RIGVED (RIG)" with Scroll-Triggered Typing Animation */}
      <div
        className="flex flex-col items-center text-center px-4 max-w-4xl z-10 mt-6 sm:mt-8"
        style={{
          opacity: heroContentOpacity,
          transition: "opacity 0.1s ease-out",
        }}
      >
        <h1 className="font-marker text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-[88px] text-[var(--wire-text-primary)] leading-[0.95] tracking-tight uppercase select-none transition-colors duration-300">
          <TypewriterText text="I'M RIGVED (RIG)" delayMs={300} speedMs={50} />
        </h1>

        {/* 4. Subtitle in Patrick Hand font with Typewriter Reveal */}
        <p className="mt-4 sm:mt-5 font-hand text-base sm:text-xl md:text-2xl text-[var(--wire-text-secondary)] leading-relaxed max-w-3xl px-2 transition-colors duration-300">
          <TypewriterText
            text="An aspiring AI Engineer based in Kolhapur, India, who enjoys experimenting with intelligent systems, building useful products, and turning ambitious ideas into working prototypes."
            delayMs={650}
            speedMs={15}
          />
        </p>
      </div>

    </section>
  );
}
