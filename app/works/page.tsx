"use client";

import React from "react";
import { SketchFilters } from "@/components/wireframe/SketchFilters";
import { Header } from "@/components/wireframe/Header";
import { PaintbrushGallery } from "@/components/wireframe/PaintbrushGallery";
import { ContactSection } from "@/components/wireframe/ContactSection";
import { Footer } from "@/components/wireframe/Footer";

export default function WorksPage() {
  return (
    <main className="relative min-h-screen bg-wire-bg text-wire-black w-full max-w-full flex flex-col justify-between">
      {/* SVG hand-drawn displacement filters */}
      <SketchFilters />

      {/* Shared Header Navigation (Works tab is active) */}
      <Header />

      {/* Complete Works Portfolio with Paintbrush-Style Reveal Animation */}
      <PaintbrushGallery />

      {/* Shared Contact Booklet (Scroll scrub 3D opening) */}
      <ContactSection />

      {/* Page Footer */}
      <Footer />
    </main>
  );
}
