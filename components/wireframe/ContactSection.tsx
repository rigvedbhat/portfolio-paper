"use client";

import React, { useEffect, useRef, useState } from "react";
import { TypewriterText } from "./TypewriterText";

export function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const bookSpreadRef = useRef<HTMLDivElement>(null);
  const shadowOverlayRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  // Bi-directional scroll scrub interaction directly tied to window scroll position
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateBookletOnScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    const updateBookletOnScroll = () => {
      const container = containerRef.current;
      const cover = coverRef.current;
      const spread = bookSpreadRef.current;
      if (!container || !cover || !spread) return;

      const rect = container.getBoundingClientRect();
      const totalScroll = rect.height - window.innerHeight;
      if (totalScroll <= 0) return;

      const currentScroll = -rect.top;
      const rawProgress = Math.max(0, Math.min(1, currentScroll / totalScroll));

      // Scrub window: starts opening at 2% scroll, reaches full 180deg open flat at 32% scroll,
      // and STAYS firmly pinned in place all the way to 88% scroll for comfortable reading & interaction.
      let openProgress = 0;
      if (rawProgress <= 0.02) {
        openProgress = 0;
      } else if (rawProgress >= 0.32) {
        openProgress = 1;
      } else {
        openProgress = (rawProgress - 0.02) / (0.32 - 0.02);
      }

      // 1. Cover 3D rotation from 0deg (closed) to -180deg (flat open on left)
      const rotationY = -180 * openProgress;
      cover.style.transform = `rotateY(${rotationY.toFixed(2)}deg)`;

      // 2. Exact Horizontal Centering:
      // Dynamically measure the exact rendered width of the single page.
      // When closed (progress 0), offset is -singlePageWidth / 2 so the front cover is dead-center in the viewport.
      // When open (progress 1), offset is 0 so the whole 2-page spread is dead-center in the viewport.
      const singlePageWidth = spread.offsetWidth / 2;
      const shiftX = (1 - openProgress) * (-singlePageWidth / 2);
      spread.style.transform = `translateX(${shiftX.toFixed(2)}px)`;

      // 3. Dynamic book shadow over inside page when cover is near-closed
      if (shadowOverlayRef.current) {
        const shadowOpacity = Math.max(0, 1 - openProgress * 2.2);
        shadowOverlayRef.current.style.opacity = shadowOpacity.toFixed(2);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    updateBookletOnScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSubmitted(true);
  };

  return (
    <section
      ref={containerRef}
      id="contact"
      className="relative w-full h-[320vh] bg-wire-bg"
    >
      {/* Sticky Viewport Stage: remains pinned in viewport center while scrolling */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden px-4 sm:px-6">
        
        {/* 3D Perspective Stage */}
        <div
          className="relative flex items-center justify-center w-full"
          style={{ perspective: "2500px" }}
        >
          {/* Centering Wrapper: width is 2 * pageW (1060px on desktop) with spine at center */}
          <div
            ref={bookSpreadRef}
            className="relative will-change-transform w-[96vw] max-w-[1060px] md:w-[860px] lg:w-[1060px] h-[430px] xs:h-[470px] sm:h-[510px] lg:h-[530px]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* ======================================================== */}
            {/* RIGHT PAGE: Static Base Layer (White Notebook Ruled Form) */}
            {/* Occupies right half: from x = 50% to x = 100%             */}
            {/* ======================================================== */}
            <div
              className="absolute right-0 top-0 w-1/2 h-full bg-[#ffffff] rounded-r-2xl border-2 border-[#111111] shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-2.5 xs:p-4 sm:p-10 lg:p-12 flex flex-col justify-between overflow-hidden z-0"
              style={{
                borderLeftWidth: "1px",
              }}
            >
              {/* Internal Shadow overlay when cover is shutting */}
              <div
                ref={shadowOverlayRef}
                className="absolute inset-0 bg-black/25 pointer-events-none z-20 transition-opacity duration-75"
                style={{ opacity: 1 }}
              />

              <div className="flex flex-col h-full justify-between">
                <div>
                  {/* Hand-Drawn Black Pill: "Contact with me!" */}
                  <div className="inline-block bg-[#111111] text-[#ffffff] px-2.5 xs:px-4 py-1 sm:py-1.5 rounded-full mb-2 xs:mb-3 sm:mb-6 sketch-wobble shadow-xs">
                    <h4 className="font-caveat font-bold text-sm xs:text-base sm:text-xl text-white tracking-wide">
                      <TypewriterText text="Contact with me!" preset="caption" />
                    </h4>
                  </div>

                  {submitted ? (
                    /* Submission confirmation */
                    <div className="bg-[#ffe500]/30 border-2 border-[#111111] rounded-xl p-3 xs:p-6 text-center my-3 sm:my-6 sketch-wobble">
                      <h5 className="font-marker text-lg sm:text-2xl text-[#111111] mb-1 sm:mb-2">Message Sent!</h5>
                      <p className="font-hand text-xs sm:text-lg text-[#333333]">
                        Thanks for reaching out! I will reply shortly.
                      </p>
                    </div>
                  ) : (
                    /* Form Fields matching reference Image 2 */
                    <form onSubmit={handleSubmit} className="flex flex-col gap-2 xs:gap-3.5 sm:gap-6">
                      {/* Name */}
                      <div className="flex flex-col">
                        <label className="font-caveat font-bold text-xs xs:text-sm sm:text-xl text-[#444444]">
                          <TypewriterText text="Your name" preset="caption" />
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full pt-0.5 pb-0.5 bg-transparent border-b border-[#111111] font-hand text-xs xs:text-sm sm:text-lg text-[#111111] focus:outline-none"
                        />
                      </div>

                      {/* Email */}
                      <div className="flex flex-col">
                        <label className="font-caveat font-bold text-xs xs:text-sm sm:text-xl text-[#444444]">
                          <TypewriterText text="Email" preset="caption" />
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pt-0.5 pb-0.5 bg-transparent border-b border-[#111111] font-hand text-xs xs:text-sm sm:text-lg text-[#111111] focus:outline-none"
                        />
                      </div>

                      {/* Message */}
                      <div className="flex flex-col">
                        <label className="font-caveat font-bold text-xs xs:text-sm sm:text-xl text-[#444444]">
                          <TypewriterText text="Message" preset="caption" />
                        </label>
                        <textarea
                          required
                          rows={1}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full pt-0.5 pb-0.5 bg-transparent border-b border-[#111111] font-hand text-xs xs:text-sm sm:text-lg text-[#111111] focus:outline-none resize-none"
                        />
                      </div>

                      {/* Yellow "Send it →" Oval Button (bottom-right aligned) */}
                      <div className="flex justify-end pt-1">
                        <button
                          type="submit"
                          className="group relative inline-flex items-center justify-center px-3 xs:px-4 sm:px-6 py-1 sm:py-2 select-none transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                          style={{ transform: "rotate(-1deg)" }}
                        >
                          {/* Yellow marker fill */}
                          <span
                            className="absolute inset-0 w-full h-full pointer-events-none z-0"
                            style={{
                              WebkitMask:
                                "url('/assets/tQRv0kz9Evh7wYlLybo9c0WHqM.svg') no-repeat center / 100% 100%",
                              mask: "url('/assets/tQRv0kz9Evh7wYlLybo9c0WHqM.svg') no-repeat center / 100% 100%",
                              backgroundColor: "#ffe500",
                            }}
                          />

                          {/* Hand-drawn button border outline */}
                          <span
                            className="absolute inset-0 w-full h-full pointer-events-none z-10"
                            style={{
                              WebkitMask:
                                "url('/assets/YWhw8KQ9Dy3OBXAU4f03EZA4Sq0.svg') no-repeat center / 100% 100%",
                              mask: "url('/assets/YWhw8KQ9Dy3OBXAU4f03EZA4Sq0.svg') no-repeat center / 100% 100%",
                              backgroundColor: "#111111",
                            }}
                          />

                          {/* Label + Arrow */}
                          <span className="relative z-20 flex items-center gap-1.5 xs:gap-2 font-caveat font-bold text-sm xs:text-base sm:text-2xl text-[#111111] leading-none px-1 xs:px-2">
                            <span><TypewriterText text="Send it" preset="caption" /></span>
                            <img
                              src="/assets/yNwLE1jiicPEhTCNAg4hluCx7aw.svg"
                              alt="Arrow"
                              className="w-4 h-2.5 sm:w-5 sm:h-3 object-contain inline-block transform transition-transform group-hover:translate-x-1"
                            />
                          </span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Bottom Row: Email on left, Socials on right */}
                <div className="pt-2 sm:pt-4 border-t border-[#111111]/15 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1 xs:gap-0 text-xs sm:text-base font-caveat font-bold w-full">
                  <div className="flex flex-col">
                    <a
                      href="mailto:rigvedmb2@gmail.com"
                      className="text-[#111111] hover:underline text-[11px] xs:text-xs sm:text-base whitespace-nowrap"
                    >
                      <TypewriterText text="rigvedmb2@gmail.com" preset="fast" />
                    </a>
                    <div className="w-full h-1 overflow-hidden -mt-0.5">
                      <img src="/assets/mVqvbTUbNChN4quMJjltePhW1A.svg" alt="" className="w-full h-full object-fill" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-6 text-[11px] xs:text-xs sm:text-base">
                    <div className="flex flex-col">
                      <a
                        href="https://www.instagram.com/rigved.bhat/?hl=en"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#111111] hover:underline lowercase"
                      >
                        <TypewriterText text="instagram" preset="fast" />
                      </a>
                      <div className="w-full h-1 overflow-hidden -mt-0.5">
                        <img src="/assets/mVqvbTUbNChN4quMJjltePhW1A.svg" alt="" className="w-full h-full object-fill" />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <a
                        href="https://www.linkedin.com/in/rigved-bhat-b4b46332a/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#111111] hover:underline lowercase"
                      >
                        <TypewriterText text="linkedin" preset="fast" />
                      </a>
                      <div className="w-full h-1 overflow-hidden -mt-0.5">
                        <img src="/assets/mVqvbTUbNChN4quMJjltePhW1A.svg" alt="" className="w-full h-full object-fill" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* CENTRAL SPIRAL WIRE BINDING: 8 PAIRS OF DOUBLE-LOOP RINGS */}
            {/* Positioned right on the spine at x = 50%                 */}
            {/* ======================================================== */}
            <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 z-40 flex flex-col justify-around py-6 pointer-events-none">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-1 items-center">
                  <div className="w-8 sm:w-9 h-1.5 bg-[#111111] rounded-full shadow-xs" />
                  <div className="w-8 sm:w-9 h-1.5 bg-[#111111] rounded-full shadow-xs" />
                </div>
              ))}
            </div>

            {/* ======================================================== */}
            {/* 3D HINGED FLIPPING COVER (Hinged at spine x = 50%)       */}
            {/* Width is 1/2 of the spread, covers right half when closed*/}
            {/* ======================================================== */}
            <div
              ref={coverRef}
              className="absolute left-1/2 top-0 w-1/2 h-full z-30 will-change-transform"
              style={{
                transformOrigin: "left center",
                transformStyle: "preserve-3d",
                transform: "rotateY(0deg)",
              }}
            >
              {/* ------------------------------------------------------ */}
              {/* A. FRONT OF COVER: Yellow Square with Sketched Oval     */}
              {/*    "LET'S MAKE SOMETHING" (Exact Reference Image 3)    */}
              {/* ------------------------------------------------------ */}
              <div
                className="absolute inset-0 bg-[#ffe500] rounded-r-2xl border-2 border-[#111111] shadow-[0_24px_55px_rgba(0,0,0,0.18)] flex items-center justify-center select-none overflow-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                {/* White Binding Strip on Left Edge with punched hole slots (Image 3) */}
                <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-9 bg-white/95 border-r-2 border-[#111111] flex flex-col justify-around py-6 items-center">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-1 items-center">
                      <div className="w-2.5 h-1.5 bg-[#111111] rounded-xs" />
                      <div className="w-2.5 h-1.5 bg-[#111111] rounded-xs" />
                    </div>
                  ))}
                </div>

                {/* Hand-drawn Oval encircling "LET'S MAKE SOMETHING" */}
                <div className="relative pl-8 pr-4 sm:pl-10 sm:pr-6 flex items-center justify-center w-full h-full">
                  <div className="relative w-full max-w-[420px] py-12 flex items-center justify-center">
                    {/* Sketched Oval Loop matching Image 3 */}
                    <svg
                      className="w-full h-auto pointer-events-none"
                      viewBox="0 0 440 240"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M 220,18 C 340,14 425,50 420,120 C 415,190 320,228 220,225 C 110,222 20,185 24,120 C 28,52 110,22 220,18 Z"
                        stroke="#111111"
                        strokeWidth="3.4"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 222,22 C 335,18 420,53 415,118 C 410,185 315,223 218,220 C 115,217 26,180 30,118 C 34,56 114,26 310,18"
                        stroke="#111111"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        opacity="0.4"
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <h2 className="font-marker text-2xl xs:text-3xl sm:text-4xl lg:text-[50px] text-[#111111] leading-[0.92] text-center tracking-tight uppercase select-none">
                        <TypewriterText text="LET'S" preset="heading" />
                        <br />
                        <TypewriterText text="MAKE" preset="heading" delayMs={200} />
                        <br />
                        <TypewriterText text="SOMETHING" preset="heading" delayMs={400} />
                      </h2>
                    </div>
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------------ */}
              {/* B. INSIDE OF COVER: Big Boy Doodle Avatar + "I'M RIGVED" */}
              {/*    (Exact Reference Image 2)                           */}
              {/* ------------------------------------------------------ */}
              <div
                className="absolute inset-0 bg-[#ffe500] rounded-l-2xl border-2 border-[#111111] shadow-[0_24px_55px_rgba(0,0,0,0.18)] p-3 xs:p-6 sm:p-10 flex flex-col items-center justify-center select-none overflow-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  borderRightWidth: "1px",
                }}
              >
                {/* Big Doodle Avatar Face in center of yellow page (Image 2) */}
                <div className="w-28 h-28 xs:w-40 xs:h-40 sm:w-64 sm:h-64 lg:w-72 lg:h-72 flex items-center justify-center mb-1 xs:mb-3">
                  <img
                    src="/assets/fNwIMs4sIdKKKRacWGUdjywxvk.svg"
                    alt="Rigved Avatar"
                    className="w-full h-full object-contain pointer-events-none select-none"
                    draggable={false}
                  />
                </div>

                {/* "I'M RIGVED" directly below the face (Image 2) */}
                <h3 className="font-marker text-xl xs:text-2xl sm:text-4xl lg:text-5xl text-[#111111] tracking-wide uppercase select-none">
                  <TypewriterText text="I'M RIGVED" preset="heading" delayMs={200} />
                </h3>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
