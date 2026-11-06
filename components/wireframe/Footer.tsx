import React from "react";
import Link from "next/link";
import { StarDoodle, SparkleDoodle } from "./SketchDoodles";
import { TypewriterText } from "./TypewriterText";

export function Footer() {
  return (
    <footer className="relative w-full py-10 sm:py-16 px-4 sm:px-6 md:px-12 bg-wire-bg flex flex-col items-center border-t border-[#111111]/15 overflow-hidden select-none">
      {/* Decorative stars */}
      <div className="absolute top-8 left-[12%] text-[#111111]/30">
        <StarDoodle className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <div className="absolute top-10 right-[14%] text-[#111111]/30">
        <SparkleDoodle className="w-6 h-6 sm:w-8 sm:h-8" />
      </div>

      <div className="max-w-4xl w-full text-center flex flex-col items-center overflow-hidden">
        {/* Navigation & Contact Links in Caveat font */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 font-caveat font-bold text-lg sm:text-2xl text-[#333333] mb-6 sm:mb-8">
          <Link href="/about" className="hover:text-[#111111] hover:underline">
            <TypewriterText text="about" preset="fast" />
          </Link>
          <span className="opacity-40">/</span>
          <Link href="/works" className="hover:text-[#111111] hover:underline">
            <TypewriterText text="works" preset="fast" />
          </Link>
          <span className="opacity-40">/</span>
          <Link href="/contact" className="hover:text-[#111111] hover:underline">
            <TypewriterText text="contact" preset="fast" />
          </Link>
          <span className="opacity-40">/</span>
          <a
            href="mailto:john@gmail.com"
            className="hover:text-[#111111] hover:underline text-[#111111]"
          >
            <TypewriterText text="john@gmail.com" preset="fast" />
          </a>
        </div>

        {/* Bottom Attribution & Copyright */}
        <div className="pt-4 sm:pt-6 border-t border-[#111111]/15 w-full flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs font-mono text-[#888888] gap-2 text-center">
          <span>
            <TypewriterText text="© 2026 WIREFRAME PORTFOLIO • VISUAL RECREATION" preset="fast" />
          </span>
          <span>
            <TypewriterText text="WIREFRAME BY HUEHAUS STUDIO (RECREATION)" preset="fast" />
          </span>
        </div>
      </div>
    </footer>
  );
}
