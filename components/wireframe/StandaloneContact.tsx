"use client";

import React, { useState } from "react";
import { TypewriterText } from "./TypewriterText";

export function StandaloneContact() {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSubmitted(true);
  };

  return (
    <section className="relative w-full min-h-[calc(100vh-140px)] pt-28 sm:pt-36 pb-20 sm:pb-28 px-4 sm:px-8 md:px-14 bg-wire-bg select-none overflow-hidden">
      {/* Subtle Dotted Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60 z-0"
        style={{
          backgroundImage: "radial-gradient(var(--wire-grid-dot) 1.2px, transparent 1.2px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div
        className={`relative max-w-6xl mx-auto z-10 transition-all duration-700 ease-out ${
          mounted ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
        }`}
      >
        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: Massive "Say hello" + Yellow Sticky Note + Curved Arrow */}
          <div className="lg:col-span-5 flex flex-col items-start pt-2 sm:pt-6">
            {/* Massive Heading */}
            <h1 className="font-marker text-6xl sm:text-7xl md:text-8xl lg:text-[96px] text-wire-black leading-[0.9] tracking-tight uppercase select-none mb-6 sm:mb-8">
              <TypewriterText text="Say hello" preset="heading" />
            </h1>

            {/* Yellow Sticky Note Banner: "drop me a line, I usually reply within a day" */}
            <div
              className="relative w-full max-w-[360px] bg-[#ffe500] px-4 py-3 rounded-sm shadow-md border border-[#111111]/30 flex items-center gap-3 select-none sketch-wobble mb-6"
              style={{ transform: "rotate(-1.5deg)" }}
            >
              {/* Clear scotch tape strip */}
              <div className="absolute -top-2 left-6 w-10 h-3 bg-white/70 border border-black/10 backdrop-blur-xs -rotate-2" />

              {/* Boy doodle avatar on sticky note */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 bg-white/60 rounded-full border border-[#111111]/30 p-1 flex items-center justify-center">
                <img
                  src="/assets/fNwIMs4sIdKKKRacWGUdjywxvk.svg"
                  alt="Avatar"
                  className="w-full h-full object-contain pointer-events-none"
                  draggable={false}
                />
              </div>

              {/* Sticky Note Message */}
              <p className="font-caveat font-bold text-base sm:text-lg text-[#111111] leading-snug">
                <TypewriterText text="drop me a line, I usually reply within a day" preset="caption" />
              </p>
            </div>

            {/* Hand-Drawn Directional Arrow pointing toward form on large screens */}
            <div className="hidden lg:flex items-center gap-3 pl-12 pt-2">
              <svg
                className="w-24 h-16 transform rotate-6"
                viewBox="0 0 100 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 20 C 35 15, 65 25, 80 45"
                  stroke="var(--wire-canvas-stroke)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="4 4"
                />
                <polyline
                  points="65 48 82 46 80 30"
                  stroke="var(--wire-canvas-stroke)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* RIGHT COLUMN: Contact with me! Form Card */}
          <div className="lg:col-span-7 w-full flex justify-center lg:justify-end">
            <div
              className="relative w-full max-w-xl rounded-[16px] p-6 sm:p-10 shadow-[0_16px_45px_rgba(0,0,0,0.12)] select-none"
              style={{
                backgroundColor: "var(--wire-form-card-bg)",
                border: "3px double var(--wire-form-card-border)",
                transform: "rotate(-0.4deg)",
              }}
            >
              {/* Form Heading */}
              <div className="mb-8">
                <h2 className="font-marker text-2xl sm:text-3xl text-wire-black tracking-wide">
                  <TypewriterText text="Contact with me!" preset="heading" />
                </h2>
              </div>

              {submitted ? (
                /* Success Message */
                <div className="py-12 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#ffe500] rounded-full border-2 border-[#111111] flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-[#111111]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-marker text-2xl text-wire-black mb-2">Message Sent!</h3>
                  <p className="font-hand text-lg text-wire-muted">
                    Thanks for reaching out! I&apos;ll get back to you shortly.
                  </p>
                </div>
              ) : (
                /* Contact Form */
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  {/* Name Input */}
                  <div className="flex flex-col">
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-transparent font-hand text-lg sm:text-xl text-wire-black placeholder-wire-muted outline-none py-1.5 px-0"
                    />
                    {/* Hand-Drawn Underline SVG */}
                    <div className="w-full h-2.5 overflow-hidden -mt-1 pointer-events-none">
                      <img
                        src="/assets/mVqvbTUbNChN4quMJjltePhW1A.svg"
                        alt=""
                        className="w-full h-full object-fill select-none"
                        style={{ filter: "var(--wire-invert-filter)" }}
                        draggable={false}
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="flex flex-col">
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-transparent font-hand text-lg sm:text-xl text-wire-black placeholder-wire-muted outline-none py-1.5 px-0"
                    />
                    {/* Hand-Drawn Underline SVG */}
                    <div className="w-full h-2.5 overflow-hidden -mt-1 pointer-events-none">
                      <img
                        src="/assets/mVqvbTUbNChN4quMJjltePhW1A.svg"
                        alt=""
                        className="w-full h-full object-fill select-none"
                        style={{ filter: "var(--wire-invert-filter)" }}
                        draggable={false}
                      />
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="flex flex-col">
                    <textarea
                      name="message"
                      rows={4}
                      required
                      placeholder="Message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-transparent font-hand text-lg sm:text-xl text-wire-black placeholder-wire-muted outline-none py-1.5 px-0 resize-none"
                    />
                    {/* Hand-Drawn Underline SVG */}
                    <div className="w-full h-2.5 overflow-hidden -mt-1 pointer-events-none">
                      <img
                        src="/assets/mVqvbTUbNChN4quMJjltePhW1A.svg"
                        alt=""
                        className="w-full h-full object-fill select-none"
                        style={{ filter: "var(--wire-invert-filter)" }}
                        draggable={false}
                      />
                    </div>
                  </div>

                  {/* "Send it →" Authentic Yellow Button */}
                  <div className="mt-4 flex justify-start">
                    <button
                      type="submit"
                      className="group relative inline-flex items-center justify-center px-6 py-2.5 select-none transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                      style={{ transform: "rotate(-0.8deg)" }}
                    >
                      {/* Yellow Marker Scribble Fill */}
                      <span
                        className="absolute inset-0 w-full h-full pointer-events-none z-0"
                        style={{
                          WebkitMask:
                            "url('/assets/tQRv0kz9Evh7wYlLybo9c0WHqM.svg') no-repeat center / 100% 100%",
                          mask: "url('/assets/tQRv0kz9Evh7wYlLybo9c0WHqM.svg') no-repeat center / 100% 100%",
                          backgroundColor: "#ffe500",
                        }}
                      />

                      {/* Hand-drawn Button Outline */}
                      <span
                        className="absolute inset-0 w-full h-full pointer-events-none z-10"
                        style={{
                          WebkitMask:
                            "url('/assets/YWhw8KQ9Dy3OBXAU4f03EZA4Sq0.svg') no-repeat center / 100% 100%",
                          mask: "url('/assets/YWhw8KQ9Dy3OBXAU4f03EZA4Sq0.svg') no-repeat center / 100% 100%",
                          backgroundColor: "#111111",
                        }}
                      />

                      {/* Button Label + Hand-drawn Arrow */}
                      <span className="relative z-20 flex items-center gap-2 font-caveat font-bold text-xl sm:text-2xl text-[#111111] leading-none px-2">
                        <span><TypewriterText text="Send it" preset="caption" /></span>
                        <img
                          src="/assets/yNwLE1jiicPEhTCNAg4hluCx7aw.svg"
                          alt="Arrow"
                          className="w-5 h-3 object-contain inline-block transform transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    </button>
                  </div>
                </form>
              )}

              {/* Divider Line */}
              <div className="w-full h-[1px] bg-wire-border my-8" />

              {/* Bottom Info: Email on left, Socials on right */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Email link with hand-drawn underline */}
                <div className="flex flex-col">
                  <a
                    href="mailto:john@wireframe.design"
                    className="font-caveat font-bold text-lg sm:text-xl text-wire-black hover:text-wire-yellow transition-colors select-none"
                  >
                    <TypewriterText text="john@wireframe.design" preset="fast" />
                  </a>
                  <div className="w-full h-1.5 overflow-hidden -mt-0.5">
                    <img
                      src="/assets/mVqvbTUbNChN4quMJjltePhW1A.svg"
                      alt=""
                      className="w-full h-full object-fill"
                      style={{ filter: "var(--wire-invert-filter)" }}
                    />
                  </div>
                </div>

                {/* Social Links with hand-drawn underlines */}
                <div className="flex items-center gap-4">
                  {[
                    { name: "instagram", href: "https://instagram.com" },
                    { name: "x / twitter", href: "https://x.com" },
                    { name: "linkedin", href: "https://linkedin.com" },
                  ].map((s) => (
                    <div key={s.name} className="flex flex-col">
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-caveat font-bold text-base sm:text-lg text-wire-black hover:text-wire-yellow transition-colors lowercase select-none"
                      >
                        <TypewriterText text={s.name} preset="fast" />
                      </a>
                      <div className="w-full h-1.5 overflow-hidden -mt-0.5">
                        <img
                          src="/assets/mVqvbTUbNChN4quMJjltePhW1A.svg"
                          alt=""
                          className="w-full h-full object-fill"
                          style={{ filter: "var(--wire-invert-filter)" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
