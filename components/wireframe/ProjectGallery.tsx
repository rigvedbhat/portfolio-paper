"use client";

import React from "react";
import { BeveledSketchFrame, StickyNoteAnnotation, ArrowNoteAnnotation } from "./SketchDoodles";
import { TypewriterText } from "./TypewriterText";

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  rotation?: string;
  offsetY?: string;
  stickyNote?: string;
  arrowNote?: { text: string; direction: "up" | "left" | "right" | "down-left" };
  palette: string;
}

const projects: ProjectItem[] = [
  {
    id: "proj-1",
    title: "Zen",
    category: "branding",
    stickyNote: "This is a very difficult project",
    palette: "from-[#4a8505] via-[#7cb518] to-[#38b000]",
  },
  {
    id: "proj-2",
    title: "Uno",
    category: "design",
    offsetY: "md:mt-24",
    rotation: "rotate-1",
    arrowNote: { text: "this one was very challenging", direction: "up" },
    palette: "from-[#f77f00] via-[#eae2b7] to-[#0077b6]",
  },
  {
    id: "proj-3",
    title: "Danang",
    category: "branding",
    rotation: "-rotate-1.5",
    arrowNote: { text: "a fun experiment", direction: "down-left" },
    palette: "from-[#3a0ca3] via-[#4361ee] to-[#4cc9f0]",
  },
  {
    id: "proj-4",
    title: "Katagina",
    category: "draw",
    offsetY: "md:mt-24",
    rotation: "rotate-1",
    stickyNote: "still my personal favourite",
    palette: "from-[#d90429] via-[#ef233c] to-[#ffb703]",
  },
  {
    id: "proj-5",
    title: "Adosa",
    category: "draw",
    palette: "from-[#023e8a] via-[#0096c7] to-[#90e0ef]",
  },
  {
    id: "proj-6",
    title: "Cityyyyy",
    category: "design",
    offsetY: "md:mt-24",
    rotation: "-rotate-1",
    arrowNote: { text: "a calm place to end on", direction: "up" },
    palette: "from-[#606c38] via-[#283618] to-[#dda15e]",
  },
];

export function ProjectGallery() {
  return (
    <section className="relative w-full py-12 sm:py-20 px-4 sm:px-8 md:px-14 bg-wire-bg select-none">
      <div className="max-w-6xl mx-auto">
        {/* Asymmetric Staggered 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-16 sm:gap-y-24 items-start">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className={`relative flex flex-col group ${proj.offsetY || ""} ${proj.rotation || ""}`}
            >
              {/* Optional Sticky Note Annotation on top-left of card */}
              {proj.stickyNote && (
                <div className="absolute -top-3.5 left-2 sm:-top-4 sm:left-4 z-30 transform -rotate-2">
                  <StickyNoteAnnotation text={proj.stickyNote} />
                </div>
              )}

              {/* 3D Beveled Picture Frame with Hatching Borders */}
              <div className="relative w-full transition-transform duration-300 group-hover:scale-[1.015]">
                <BeveledSketchFrame aspectRatio="16/9.5">
                  {/* Media Content Canvas with Painted Abstract Art Aesthetic */}
                  <div className={`relative w-full h-full bg-gradient-to-tr ${proj.palette} flex items-center justify-center overflow-hidden`}>
                    {/* Subtle sketch brush strokes overlay */}
                    <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
                      <line x1="0" y1="0" x2="100%" y2="100%" stroke="#ffffff" strokeWidth="1" strokeDasharray="8 8" />
                      <line x1="100%" y1="0" x2="0" y2="100%" stroke="#ffffff" strokeWidth="1" strokeDasharray="8 8" />
                    </svg>

                    {/* Wireframe Placeholder Label */}
                    <div className="relative px-3 py-1 bg-white/85 backdrop-blur-xs border border-[#111111] rounded shadow-xs">
                      <span className="font-hand text-sm sm:text-base text-[#111111]">
                        {proj.title}
                      </span>
                    </div>
                  </div>
                </BeveledSketchFrame>
              </div>

              {/* Title & Category Bar directly below frame */}
              <div className="mt-2.5 sm:mt-3 px-1 flex items-center justify-between">
                {/* Project Title with Typewriter Effect */}
                <h3 className="font-hand text-xl sm:text-2xl md:text-3xl text-[#111111] font-medium tracking-wide">
                  <TypewriterText text={proj.title} delayMs={150} speedMs={40} />
                </h3>

                {/* Hand-drawn Oval Category Pill on Right */}
                <div className="px-3 sm:px-4 py-0.5 rounded-full border border-[#111111] sketch-wobble bg-white/70">
                  <span className="font-caveat font-bold text-sm sm:text-lg text-[#111111]">
                    {proj.category}
                  </span>
                </div>
              </div>

              {/* Optional Arrow Annotation below card */}
              {proj.arrowNote && (
                <div className="mt-3 sm:mt-4 self-center sm:self-start px-2">
                  <ArrowNoteAnnotation
                    text={proj.arrowNote.text}
                    direction={proj.arrowNote.direction}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
