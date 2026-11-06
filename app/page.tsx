"use client";

import React from "react";
import { SketchFilters } from "@/components/wireframe/SketchFilters";
import { Header } from "@/components/wireframe/Header";
import { HeroSection } from "@/components/wireframe/HeroSection";
import { VideoShowcase } from "@/components/wireframe/VideoShowcase";
import { FeaturedProjects } from "@/components/wireframe/FeaturedProjects";
import { PhotoGallery } from "@/components/wireframe/PhotoGallery";
import { ContactSection } from "@/components/wireframe/ContactSection";
import { Footer } from "@/components/wireframe/Footer";

export default function AboutHomePage() {
  return (
    <main className="relative min-h-screen bg-wire-bg text-wire-black w-full max-w-full flex flex-col justify-between">
      {/* SVG hand-drawn displacement filters */}
      <SketchFilters />

      {/* 1. Shared Header Navigation (About is active) */}
      <Header />

      {/* 2. Hero Section with Suspended ID Badge & Watermark */}
      <HeroSection />

      {/* 3. Framed Video Showcase */}
      <VideoShowcase />

      {/* 4. Selected Work Preview (Exactly 4 Best Projects + Link to /works) */}
      <FeaturedProjects />

      {/* 5. Photography / Camera Gallery */}
      <PhotoGallery />

      {/* 6. Contact Booklet (Continuously scroll-driven 3D opening) */}
      <ContactSection />

      {/* 7. Page Footer */}
      <Footer />
    </main>
  );
}
