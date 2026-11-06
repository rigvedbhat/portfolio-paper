"use client";

import React from "react";
import { SketchFilters } from "@/components/wireframe/SketchFilters";
import { Header } from "@/components/wireframe/Header";
import {
  HangingAboutBanner,
  HobbyCardsSection,
  ScatteredBioSection,
  WorkPrinciplesSection,
  ExperienceSection,
} from "@/components/wireframe/AboutComponents";
import { ContactSection } from "@/components/wireframe/ContactSection";
import { Footer } from "@/components/wireframe/Footer";

export default function AboutDedicatedPage() {
  return (
    <main className="relative min-h-screen bg-wire-bg text-wire-black w-full max-w-full flex flex-col justify-between">
      {/* SVG hand-drawn displacement filters */}
      <SketchFilters />

      {/* 1. Shared Navigation Header (About tab is active) */}
      <Header />

      {/* 2. Top Banner: "some hobby I really love!" + Hanging ABOUT letters */}
      <HangingAboutBanner />

      {/* 3. Four Scrapbook Hobby Cards (NOT project cards!) */}
      <HobbyCardsSection />

      {/* 4. "a little bit about me" Sticky Note + Scattered Ruled Notebook Sheets */}
      <ScatteredBioSection />

      {/* 5. "WHAT I DIVE INTO MY WORK?" 4 Working Principles with Hover-to-Foreground */}
      <WorkPrinciplesSection />

      {/* 6. "MY EXPERIENCE" Notebook Section (Google, Spotify, Garena) */}
      <ExperienceSection />

      {/* 7. Shared Contact Booklet (Scroll scrub 3D opening) */}
      <ContactSection />

      {/* 8. Page Footer */}
      <Footer />
    </main>
  );
}
