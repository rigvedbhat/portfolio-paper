"use client";

import React from "react";
import Link from "next/link";
import { PaintbrushProjectCard, ProjectCardData } from "./PaintbrushProjectCard";
import { TypewriterText } from "./TypewriterText";

// Exactly the 4 featured projects for the Homepage / About route
const featuredProjects: ProjectCardData[] = [
  {
    id: "feat-1",
    title: "Seromod",
    category: "agentic ai",
    image: "/Crux AI logo.png",
    stickyNote: "Still my personal favourite",
    link: "https://github.com/rigvedbhat/seromod-agentic",
  },
  {
    id: "feat-2",
    title: "AI Resume Analyser",
    category: "nlp / career",
    image: "/ai-resume-analyzer.jpg",
    offsetY: "md:mt-24",
    rotation: "rotate-1",
    arrowNote: { text: "A fun experiment", direction: "up" },
    link: "https://github.com/rigvedbhat/ai-resume-analyzer",
  },
  {
    id: "feat-3",
    title: "PCAM Project",
    category: "deep learning",
    image: "/pcam-project.jpg",
    rotation: "-rotate-1.5",
    arrowNote: { text: "This one was very challenging", direction: "down-left" },
    link: "https://github.com/rigvedbhat/anvil-piedpiper",
  },
  {
    id: "feat-4",
    title: "sakAIme",
    category: "ai / travel",
    image: "/sakaime-logo.png",
    offsetY: "md:mt-24",
    rotation: "rotate-1",
    stickyNote: "This is a very difficult project",
    link: "https://github.com/rigvedbhat/piedpiper-re-final",
  },
];

export function FeaturedProjects() {
  return (
    <section className="relative w-full py-12 sm:py-20 px-4 sm:px-8 md:px-14 bg-wire-bg select-none">
      <div className="max-w-6xl mx-auto">
        {/* Asymmetric Staggered 2-Column Grid (Exactly 4 Projects with Authentic Paintbrush Reveal) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-16 sm:gap-y-24 items-start">
          {featuredProjects.map((proj) => (
            <PaintbrushProjectCard key={proj.id} proj={proj} />
          ))}
        </div>

        {/* Hand-Drawn "VIEW ALL WORKS →" Navigation Button */}
        <div className="mt-20 sm:mt-28 flex justify-center">
          <Link
            href="/works"
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 bg-wire-card border-2 border-wire-border hover:border-wire-yellow rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95 select-none"
            style={{ transform: "rotate(-0.8deg)" }}
          >
            <span className="absolute inset-0 rounded-full bg-[#ffe500] opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-0" />

            <span className="relative z-10 font-caveat font-bold text-2xl sm:text-3xl text-wire-black group-hover:text-[#111111] leading-none tracking-wide transition-colors">
              <TypewriterText text="VIEW ALL WORKS" preset="heading" />
            </span>

            <svg
              className="relative z-10 w-6 h-6 transform transition-transform duration-200 group-hover:translate-x-1 text-wire-black group-hover:text-[#111111]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
