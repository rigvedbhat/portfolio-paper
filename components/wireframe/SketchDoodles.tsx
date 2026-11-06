import React from "react";
import { TypewriterText } from "./TypewriterText";

// Hand-drawn arrow pointing down-left or down-right to video
export function ArrowDoodle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`sketch-wobble ${className}`}
    >
      <path
        d="M6 10 C 25 4, 52 6, 68 18 C 72 21, 74 24, 73 26"
        stroke="#111111"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M60 26 C 66 26, 73 26, 73 26 C 73 26, 74 19, 73 14"
        stroke="#111111"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Arrow doodle for the contact form submit button
export function SubmitArrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 54 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`sketch-wobble ${className}`}
    >
      <path
        d="M4 12 C 16 11, 32 12, 46 12"
        stroke="#111111"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M38 5 C 41 8, 46 11, 48 12 C 45 14, 40 17, 37 20"
        stroke="#111111"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Hand-drawn wavy underline
export function WavyUnderline({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`sketch-wobble ${className}`}
    >
      <path
        d="M2 7 C 14 3, 22 10, 34 6 C 46 2, 54 9, 66 5 C 78 1, 86 8, 98 4 C 110 1, 118 7, 130 4 C 134 3, 137 5, 138 6"
        stroke="#111111"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Hand-drawn little face icon (used in logo and on the ID badge)
export function DoodleFaceSmall({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      {/* Face outline */}
      <circle cx="18" cy="19" r="14" fill="#ffffff" stroke="#111111" strokeWidth="2.2" />
      {/* Messy hair */}
      <path
        d="M6 16 C 7 9, 13 5, 18 5 C 23 5, 29 9, 30 16 C 27 12, 23 11, 18 11 C 13 11, 9 13, 6 16 Z"
        fill="#111111"
      />
      <path
        d="M8 12 C 10 9, 13 8, 16 9 M20 9 C 23 8, 26 9, 28 12"
        stroke="#111111"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Two dot eyes */}
      <circle cx="13.5" cy="19" r="1.6" fill="#111111" />
      <circle cx="22.5" cy="19" r="1.6" fill="#111111" />
      {/* Nose */}
      <path d="M18 21 L17.5 23 L19 23" stroke="#111111" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      {/* Smile */}
      <path
        d="M14.5 25.5 C 16 27.5, 20 27.5, 21.5 25.5"
        stroke="#111111"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Rosy blush dots */}
      <circle cx="11.5" cy="22.5" r="1.4" fill="#ffe500" />
      <circle cx="24.5" cy="22.5" r="1.4" fill="#ffe500" />
    </svg>
  );
}

// Stylized Polaroid portrait matching the hero reference: Person holding a camera up to their eye/face
export function CameraSelfieDoodle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 340 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full select-none ${className}`}
    >
      {/* Background warm grain fill */}
      <rect width="340" height="380" fill="#ebe7e0" />

      {/* Subtle background shadow / gradient */}
      <path d="M0 0 L340 0 L340 180 C 260 200, 80 180, 0 160 Z" fill="#dfdad0" opacity="0.5" />

      {/* Dark clothing / hoodie body */}
      <path
        d="M40 380 C 50 310, 85 270, 140 260 L 200 260 C 255 270, 290 310, 300 380 Z"
        fill="#1e1e24"
      />
      {/* Red contrast stitching / zipper on jacket like in reference */}
      <path
        d="M170 265 L170 380"
        stroke="#d82a2a"
        strokeWidth="2.5"
        strokeDasharray="4 3"
      />
      <path
        d="M148 275 C 158 310, 155 350, 150 380"
        stroke="#d82a2a"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        opacity="0.7"
      />
      <path
        d="M192 275 C 182 310, 185 350, 190 380"
        stroke="#d82a2a"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        opacity="0.7"
      />

      {/* Neck & Chin */}
      <path
        d="M146 220 C 146 245, 154 260, 170 260 C 186 260, 194 245, 194 220 Z"
        fill="#f7dfd4"
      />
      <path
        d="M152 235 C 160 248, 180 248, 188 235"
        stroke="#e5bda9"
        strokeWidth="2"
      />

      {/* Head / Face contour */}
      <path
        d="M115 130 C 115 80, 135 60, 170 60 C 205 60, 225 80, 225 130 C 225 185, 205 230, 170 230 C 135 230, 115 185, 115 130 Z"
        fill="#fbeae2"
      />

      {/* Left eye visible (right eye covered by camera) */}
      <path
        d="M190 145 C 196 140, 208 140, 214 145"
        stroke="#222"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="202" cy="148" r="3.5" fill="#1b1b1b" />
      <circle cx="203.5" cy="146.5" r="1.2" fill="#ffffff" />
      <path
        d="M192 135 C 198 131, 210 131, 216 135"
        stroke="#1a1a1a"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Nose bridge next to camera */}
      <path d="M174 150 L176 175 L182 178" stroke="#dcb09a" strokeWidth="2.5" strokeLinecap="round" />

      {/* Lips */}
      <path
        d="M166 200 C 172 197, 180 197, 186 200"
        stroke="#c97e74"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M168 205 C 174 208, 178 208, 184 205"
        stroke="#b86b62"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Messy shaggy black hair with bangs */}
      <path
        d="M110 120 C 105 70, 130 40, 170 40 C 210 40, 235 70, 230 120 C 228 95, 215 75, 195 75 C 180 75, 175 85, 160 85 C 145 85, 135 75, 120 85 C 112 92, 111 105, 110 120 Z"
        fill="#18181c"
      />
      {/* Front bangs falling over forehead */}
      <path d="M125 75 Q 130 110 138 120 Q 142 95 152 78" fill="#18181c" />
      <path d="M148 78 Q 155 115 162 128 Q 166 98 178 78" fill="#18181c" />
      <path d="M175 78 Q 185 110 190 125 Q 196 95 210 82" fill="#18181c" />
      <path d="M210 85 Q 225 110 228 135 Q 235 105 228 85" fill="#18181c" />

      {/* Vintage Camera held in front of face (center-left) */}
      <g transform="translate(130, 125)">
        {/* Camera body shadow */}
        <rect x="-2" y="2" width="76" height="58" rx="8" fill="#000000" opacity="0.3" />
        {/* Camera body (metallic silver & textured dark grip) */}
        <rect x="0" y="0" width="72" height="54" rx="6" fill="#d2d0cb" stroke="#111111" strokeWidth="2.5" />
        <rect x="0" y="14" width="72" height="28" fill="#2d2d32" />
        {/* Top dials / shutter button */}
        <rect x="10" y="-5" width="12" height="6" rx="2" fill="#8f8e8b" stroke="#111111" strokeWidth="1.8" />
        <rect x="50" y="-4" width="14" height="5" rx="1.5" fill="#b0aea9" stroke="#111111" strokeWidth="1.8" />
        {/* Viewfinder window */}
        <rect x="10" y="4" width="12" height="8" rx="2" fill="#111111" />
        <rect x="12" y="5" width="8" height="6" rx="1" fill="#46738b" />
        {/* Flash window */}
        <rect x="52" y="4" width="12" height="7" rx="1.5" fill="#fef08a" stroke="#111111" strokeWidth="1.5" />

        {/* Central Camera Lens */}
        <circle cx="36" cy="28" r="21" fill="#111111" />
        <circle cx="36" cy="28" r="18" fill="#28282d" stroke="#777777" strokeWidth="1.5" />
        <circle cx="36" cy="28" r="14" fill="#111111" />
        <circle cx="36" cy="28" r="10" fill="#1c3a4b" />
        <circle cx="36" cy="28" r="6" fill="#0b171e" />
        {/* Lens reflection glint */}
        <ellipse cx="33" cy="24" rx="4" ry="2.5" fill="#ffffff" opacity="0.8" transform="rotate(-30 33 24)" />
        <circle cx="41" cy="32" r="1.5" fill="#ffffff" opacity="0.6" />
      </g>

      {/* Hand holding camera */}
      <g>
        {/* Fingers curling over top edge of camera */}
        <path
          d="M125 140 C 120 120, 130 110, 142 112 C 145 112, 146 118, 145 125"
          fill="#f7dfd4"
          stroke="#111111"
          strokeWidth="2"
        />
        <path
          d="M142 112 C 146 110, 154 110, 158 116 C 160 120, 158 126, 156 128"
          fill="#f7dfd4"
          stroke="#111111"
          strokeWidth="2"
        />
        <path
          d="M158 116 C 162 114, 170 114, 174 120 C 176 124, 174 130, 170 132"
          fill="#f7dfd4"
          stroke="#111111"
          strokeWidth="2"
        />
        {/* Forearm & Wrist */}
        <path
          d="M100 240 C 105 180, 115 150, 125 140 L 140 155 C 130 175, 120 200, 115 250 Z"
          fill="#f7dfd4"
          stroke="#111111"
          strokeWidth="2"
        />
      </g>

      {/* Vintage photo grain / vignette border */}
      <rect
        x="0"
        y="0"
        width="340"
        height="380"
        fill="none"
        stroke="#111111"
        strokeWidth="4"
        opacity="0.15"
      />
    </svg>
  );
}

// Hand-drawn white oval play button with sketched play triangle
export function HandDrawnPlayButton({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center cursor-pointer group select-none ${className}`}>
      {/* Outer hand-drawn oval outline */}
      <svg
        viewBox="0 0 160 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-28 sm:w-36 md:w-44 h-auto transition-transform duration-300 group-hover:scale-105"
      >
        {/* Sketched overlapping oval loop */}
        <path
          d="M80 6 C 125 5, 155 22, 154 45 C 153 68, 118 85, 78 84 C 36 83, 5 66, 6 44 C 7 23, 40 7, 85 6"
          stroke="#ffffff"
          strokeWidth="2.8"
          strokeLinecap="round"
          className="opacity-95"
        />
        <path
          d="M82 8 C 122 7, 152 23, 151 44 C 150 65, 115 82, 76 82 C 38 82, 8 67, 8 45 C 8 25, 42 9, 80 8"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Hand-drawn play triangle in center */}
        <path
          d="M68 28 L104 46 L68 64 Z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Second sketch pass for authentic hand-drawn feel */}
        <path
          d="M69 29 L103 46 L69 63 Z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />
      </svg>
    </div>
  );
}

// Authentic 3D beveled sketch picture frame with diagonal hatching lines
export function BeveledSketchFrame({
  children,
  className = "",
  aspectRatio = "16/9",
}: {
  children: React.ReactNode;
  className?: string;
  aspectRatio?: string;
}) {
  return (
    <div className={`relative w-full p-3 sm:p-5 md:p-6 bg-[#fbfaf8] border-2 border-[#111111] sketch-wobble shadow-sm ${className}`}>
      {/* 4 Mitered diagonal corner lines connecting outer box to inner image */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top-left miter */}
        <line x1="0" y1="0" x2="24" y2="24" stroke="#111111" strokeWidth="2" />
        {/* Top-right miter */}
        <line x1="100%" y1="0" x2="calc(100% - 24px)" y2="24" stroke="#111111" strokeWidth="2" />
        {/* Bottom-left miter */}
        <line x1="0" y1="100%" x2="24" y2="calc(100% - 24px)" stroke="#111111" strokeWidth="2" />
        {/* Bottom-right miter */}
        <line x1="100%" y1="100%" x2="calc(100% - 24px)" y2="calc(100% - 24px)" stroke="#111111" strokeWidth="2" />

        {/* Subtle diagonal hatching pattern along the bevel borders */}
        <defs>
          <pattern id="bevel-hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#111111" strokeWidth="0.8" opacity="0.35" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#bevel-hatch)" opacity="0.4" />
      </svg>

      {/* Inner Image Frame */}
      <div
        className="relative z-0 w-full overflow-hidden border-2 border-[#111111] bg-white sketch-subtle"
        style={{ aspectRatio }}
      >
        {children}
      </div>
    </div>
  );
}

// Sticky note annotation with tiny doodle face (used on project cards and camera heading)
export function StickyNoteAnnotation({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 bg-wire-yellow px-2 py-0.5 sm:px-3 sm:py-1 shadow-sm border border-[#111111]/30 sketch-wobble select-none z-20 ${className}`}
    >
      <DoodleFaceSmall className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
      <span className="font-caveat font-bold text-xs sm:text-base md:text-lg text-[#111111] whitespace-nowrap">
        <TypewriterText text={text} preset="caption" />
      </span>
    </div>
  );
}

// Hand-drawn arrow with annotation note
export function ArrowNoteAnnotation({
  text,
  direction = "right", // "up", "left", "right", "down-left"
  className = "",
}: {
  text: string;
  direction?: "up" | "left" | "right" | "down-left";
  className?: string;
}) {
  return (
    <div className={`inline-flex items-center gap-1.5 select-none font-caveat font-bold text-base sm:text-xl text-[#111111] ${className}`}>
      {direction === "left" && (
        <svg viewBox="0 0 40 18" fill="none" className="w-8 h-4">
          <path d="M38 10 C 25 12, 12 11, 4 9 M4 9 L 10 4 M 4 9 L 10 15" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {direction === "up" && (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
          <path d="M12 22 C 12 14, 11 8, 12 4 M 12 4 L 7 9 M 12 4 L 17 9" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {direction === "down-left" && (
        <svg viewBox="0 0 36 24" fill="none" className="w-7 h-5">
          <path d="M32 4 C 24 6, 12 12, 5 19 M 5 19 L 5 11 M 5 19 L 14 20" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      <span><TypewriterText text={text} preset="caption" /></span>
      {direction === "right" && (
        <svg viewBox="0 0 40 18" fill="none" className="w-8 h-4">
          <path d="M2 9 C 14 8, 26 9, 36 10 M 36 10 L 30 4 M 36 10 L 30 16" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

// Hand-drawn little star doodle
export function StarDoodle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`sketch-wobble ${className}`}
    >
      <path
        d="M12 2 L12 22 M2 12 L22 12 M5 5 L19 19 M5 19 L19 5"
        stroke="#111111"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Hand-drawn spark / asterisks
export function SparkleDoodle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`sketch-wobble ${className}`}
    >
      <path
        d="M10 2 C 10 7, 10 7, 10 18 M2 10 C 7 10, 7 10, 18 10"
        stroke="#111111"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Wireframe blueprint placeholder image graphic with diagonal cross
export function WireframePlaceholderGraphic({
  title = "PROJECT",
  ratio = "16/10",
  className = "",
}: {
  title?: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden bg-[#f0ede6] flex items-center justify-center border-2 border-[#111111] sketch-wobble ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {/* Background diagonal lines representing raw wireframe */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="#111111" strokeWidth="1.5" strokeDasharray="6 6" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="#111111" strokeWidth="1.5" strokeDasharray="6 6" />
      </svg>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, #111 1px, transparent 1px), linear-gradient(to bottom, #111 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Center placeholder badge */}
      <div className="relative z-10 px-4 py-2 bg-white/90 border border-[#111111] rounded shadow-sm flex flex-col items-center gap-1">
        <span className="font-mono text-xs uppercase tracking-widest text-[#777777]">
          [ Wireframe Image ]
        </span>
        <span className="font-marker text-sm text-[#111111] tracking-wide">
          {title}
        </span>
      </div>
    </div>
  );
}

// Hand-drawn avatar illustration (neutral placeholder portrait sketch)
export function DoodleAvatar({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`sketch-wobble ${className}`}
    >
      {/* Head shape */}
      <ellipse
        cx="80"
        cy="75"
        rx="50"
        ry="58"
        fill="#ffffff"
        stroke="#111111"
        strokeWidth="3"
      />
      {/* Hair doodle */}
      <path
        d="M36 65 C 38 40, 55 22, 80 22 C 105 22, 122 40, 124 65 C 115 50, 100 45, 80 46 C 60 45, 45 52, 36 65 Z"
        fill="#111111"
      />
      {/* Glasses */}
      <rect
        x="50"
        y="65"
        width="22"
        height="18"
        rx="4"
        fill="#ffffff"
        stroke="#111111"
        strokeWidth="2.5"
      />
      <rect
        x="88"
        y="65"
        width="22"
        height="18"
        rx="4"
        fill="#ffffff"
        stroke="#111111"
        strokeWidth="2.5"
      />
      <path d="M72 73 L88 73" stroke="#111111" strokeWidth="2.5" />
      <path d="M38 72 L50 72 M110 72 L122 72" stroke="#111111" strokeWidth="2.5" />
      {/* Eyes */}
      <circle cx="61" cy="74" r="3" fill="#111111" />
      <circle cx="99" cy="74" r="3" fill="#111111" />
      {/* Nose */}
      <path d="M80 82 C 81 87, 82 89, 78 90" stroke="#111111" strokeWidth="2.2" strokeLinecap="round" />
      {/* Smile */}
      <path
        d="M68 100 C 75 108, 85 108, 92 100"
        stroke="#111111"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Cheeks blush */}
      <ellipse cx="52" cy="88" rx="6" ry="3" fill="#ffe500" opacity="0.8" />
      <ellipse cx="108" cy="88" rx="6" ry="3" fill="#ffe500" opacity="0.8" />
      {/* Shoulders / Shirt */}
      <path
        d="M40 148 C 45 125, 62 118, 80 118 C 98 118, 115 125, 120 148"
        stroke="#111111"
        strokeWidth="3"
        fill="#ffe500"
      />
    </svg>
  );
}
