"use client";

import React from "react";
import { PaintbrushProjectCard, ProjectCardData } from "./PaintbrushProjectCard";
import { TypewriterText } from "./TypewriterText";

const allProjects: ProjectCardData[] = [
  {
    id: "work-1",
    title: "Seromod",
    category: "agentic ai",
    image: "/Crux AI logo.png",
    stickyNote: "Still my personal favourite",
    link: "https://github.com/rigvedbhat/seromod-agentic",
  },
  {
    id: "work-2",
    title: "PCAM Project",
    category: "deep learning",
    image: "/pcam-project.jpg",
    offsetY: "md:mt-24",
    rotation: "rotate-1",
    arrowNote: { text: "This one was very challenging", direction: "up" },
    link: "https://github.com/rigvedbhat/anvil-piedpiper",
  },
  {
    id: "work-3",
    title: "sakAIme",
    category: "ai / travel",
    image: "/sakaime-logo.png",
    rotation: "-rotate-1.5",
    stickyNote: "This is a very difficult project",
    link: "https://github.com/rigvedbhat/piedpiper-re-final",
  },
  {
    id: "work-4",
    title: "RosterLens",
    category: "esports / scouting",
    image: "/project-rosterlens.jpg",
    offsetY: "md:mt-24",
    rotation: "rotate-1",
    stickyNote: "esports team scouting",
    link: "https://github.com/Prathmesh3373/Curoscent_Triwizathon",
  },
  {
    id: "work-5",
    title: "COVO",
    category: "community / campus",
    image: "/project-covo.jpg",
    stickyNote: "college student community",
    link: "https://github.com/devatulya/covo",
  },
  {
    id: "work-6",
    title: "OrbitOpt",
    category: "aerospace / opt",
    image: "/project-orbitopt.jpg",
    offsetY: "md:mt-24",
    rotation: "-rotate-1",
    arrowNote: { text: "satellite trajectory optimization", direction: "down-left" },
    link: "https://github.com/Pratiksha-2005/OrbitOpt",
  },
  {
    id: "work-7",
    title: "Vyanjan Dravyani",
    category: "culinary / masala",
    image: "/project-masala.jpg",
    offsetY: "md:mt-24",
    rotation: "rotate-1",
    stickyNote: "homemade masala business",
    link: "https://github.com/rigvedbhat/vyanjan_dravyani_website",
  },
];

export function PaintbrushGallery() {
  return (
    <section className="relative w-full pt-24 sm:pt-36 pb-20 sm:pb-28 px-4 sm:px-8 md:px-14 bg-wire-bg select-none overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Works Header matching reference: "Works" large heading */}
        <div className="mb-10 sm:mb-20 flex flex-col items-start">
          <p className="font-caveat font-bold text-lg sm:text-2xl text-wire-muted tracking-wide mb-1">
            <TypewriterText text="Selected work — 2024 to 2026" preset="caption" />
          </p>
          <h1 className="font-marker text-5xl sm:text-8xl md:text-9xl text-wire-black leading-[0.85] tracking-tight uppercase">
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
