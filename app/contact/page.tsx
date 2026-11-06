"use client";

import React from "react";
import { SketchFilters } from "@/components/wireframe/SketchFilters";
import { Header } from "@/components/wireframe/Header";
import { StandaloneContact } from "@/components/wireframe/StandaloneContact";
import { Footer } from "@/components/wireframe/Footer";

export default function ContactPage() {
  return (
    <main className="relative min-h-screen bg-wire-bg text-wire-black w-full max-w-full flex flex-col justify-between">
      {/* SVG hand-drawn displacement filters */}
      <SketchFilters />

      {/* Shared Header Navigation (Contact tab is active) */}
      <Header />

      {/* Dedicated Standalone "Say Hello" Layout */}
      <StandaloneContact />

      {/* Page Footer */}
      <Footer />
    </main>
  );
}
