"use client";

import React from "react";
import { PaintbrushProjectCard, ProjectCardData } from "./PaintbrushProjectCard";
import { TypewriterText } from "./TypewriterText";

const allProjects: ProjectCardData[] = [
  {
    id: "work-1",
    title: "Zen",
    category: "branding",
    image: "/assets/1ec5NhNwPqsuc7huJkBFk8nwac0.png",
    stickyNote: "This is a very difficult project",
  },
  {
    id: "work-2",
    title: "Uno",
    category: "design",
    image: "/assets/EKhp8wDn0Q3VgsiTpZnvGofVEs.png",
    offsetY: "md:mt-24",
    rotation: "rotate-1",
    arrowNote: { text: "this one was very challenging", direction: "up" },
  },
  {
    id: "work-3",
    title: "Danang",
    category: "branding",
    image: "/assets/fufoHFC4tEi3ZbDPQ1mhhuCc.png",
    rotation: "-rotate-1.5",
    arrowNote: { text: "a fun experiment", direction: "down-left" },
  },
  {
    id: "work-4",
    title: "Katagina",
    category: "draw",
    image: "/assets/1m4q8oANXqaU28RL6AYoDhZsZs.png",
    offsetY: "md:mt-24",
    rotation: "rotate-1",
    stickyNote: "still my personal favourite",
  },
  {
    id: "work-5",
    title: "Flowers",
    category: "draw",
    image: "/assets/2cYwDazB1EFEioC8vxCngdJX26E.png",
  },
  {
    id: "work-6",
    title: "Adosa",
    category: "draw",
    image: "/assets/D6Mg59OQ17iE3p9ukca50gvri4.png",
    offsetY: "md:mt-24",
    rotation: "-rotate-1",
  },
  {
    id: "work-7",
    title: "Meridian",
    category: "system",
    image: "/assets/5P0olsqXIbRzFhrNPXXcfdb1HZQ.png",
    stickyNote: "clean and structured",
  },
  {
    id: "work-8",
    title: "Cityyyyy",
    category: "design",
    image: "/assets/UhP72sKdD3tNnuShGAmdf9cesYI.png",
    offsetY: "md:mt-24",
    rotation: "rotate-1",
    arrowNote: { text: "a calm place to end on", direction: "up" },
  },
];

export function PaintbrushGallery() {
  return (
    <section className="relative w-full pt-28 sm:pt-36 pb-20 sm:pb-28 px-4 sm:px-8 md:px-14 bg-wire-bg select-none">
      <div className="max-w-6xl mx-auto">
        {/* Works Header matching reference: "Works" large heading */}
        <div className="mb-14 sm:mb-20 flex flex-col items-start">
          <p className="font-caveat font-bold text-xl sm:text-2xl text-wire-muted tracking-wide mb-1">
            <TypewriterText text="Selected work — 2024 to 2026" preset="caption" />
          </p>
          <h1 className="font-marker text-6xl sm:text-8xl md:text-9xl text-wire-black leading-[0.85] tracking-tight uppercase">
            <TypewriterText text="Works" preset="heading" delayMs={100} speedMs={60} />
          </h1>
        </div>

        {/* Complete Project Grid (All 8 Projects with Authentic Paintbrush Scroll Reveal) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-16 sm:gap-y-24 items-start">
          {allProjects.map((proj) => (
            <PaintbrushProjectCard key={proj.id} proj={proj} />
          ))}
        </div>
      </div>
    </section>
  );
}
