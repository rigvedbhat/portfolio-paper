"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  ArrowDown, 
  ExternalLink, 
  Github, 
  Mail, 
  Linkedin, 
  BookOpen, 
  Compass, 
  Sparkles, 
  Terminal, 
  Layers,
  ChevronRight
} from "lucide-react";

import { ParticleSystem } from "@/components/world/ParticleSystem";
import type { DestinationId } from "@/lib/types";
import { 
  categorizedProjects, 
  journeyExperiences, 
  aboutInfo, 
  contactInfo 
} from "@/lib/world-data";

interface CinematicEnvironmentProps {
  onNavigate: (id: DestinationId) => void;
  onSelectProject: (slug: string | null) => void;
  activeDestination?: DestinationId;
}

export default function CinematicEnvironment({
  onNavigate,
  onSelectProject,
}: CinematicEnvironmentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<number>(0);

  /* ── GSAP & ScrollTrigger Initialization ───────────────────────── */
  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>(".cinematic-scene");

      sections.forEach((section, index) => {
        // Active section tracking via ScrollTrigger
        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveSection(index),
          onEnterBack: () => setActiveSection(index),
        });

        if (prefersReducedMotion) return;

        // 1. Background Layer Parallax (Subtle deep translation)
        const bgLayer = section.querySelector(".layer-bg");
        if (bgLayer) {
          gsap.fromTo(
            bgLayer,
            { yPercent: -6, scale: 1.02 },
            {
              yPercent: 6,
              scale: 1.08,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            }
          );
        }

        // 2. Midground Layer Parallax (Main landscape subject)
        const midLayer = section.querySelector(".layer-mid");
        if (midLayer) {
          gsap.fromTo(
            midLayer,
            { yPercent: -12, scale: 1.05 },
            {
              yPercent: 12,
              scale: 1.12,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            }
          );
        }

        // 3. Foreground Foliage/Branch Parallax (Fast stereoscopic translation)
        const fgLayer = section.querySelector(".layer-fg");
        if (fgLayer) {
          gsap.fromTo(
            fgLayer,
            { yPercent: 25, xPercent: -5 },
            {
              yPercent: -25,
              xPercent: 5,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5,
              },
            }
          );
        }

        // 4. Atmospheric Fog Layer Drift
        const fogLayer = section.querySelector(".layer-fog");
        if (fogLayer) {
          gsap.fromTo(
            fogLayer,
            { xPercent: -10, opacity: 0.25 },
            {
              xPercent: 10,
              opacity: 0.55,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.8,
              },
            }
          );
        }

        // 5. Typography Content Reveal
        const contentBlock = section.querySelector(".cinematic-content");
        if (contentBlock) {
          gsap.fromTo(
            contentBlock,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 75%",
                end: "top 25%",
                scrub: false,
                toggleActions: "play reverse play reverse",
              },
            }
          );
        }

        // 6. Watermark Kanji Drift
        const kanjiWatermark = section.querySelector(".kanji-watermark");
        if (kanjiWatermark) {
          gsap.fromTo(
            kanjiWatermark,
            { yPercent: -15, opacity: 0.04 },
            {
              yPercent: 15,
              opacity: 0.09,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5,
              },
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollToScene = (index: number) => {
    const el = document.getElementById(`scene-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navChapters = [
    { label: "I. THE LORE", subtitle: "Pampas Grassland", kanji: "誉" },
    { label: "II. ABOUT", subtitle: "Autumn Forest", kanji: "道" },
    { label: "III. MASTERY", subtitle: "Architecture & Skills", kanji: "鍛" },
    { label: "IV. ARCHIVE", subtitle: "Alpine Mountains", kanji: "探" },
    { label: "V. THE SIGNAL", subtitle: "Coastal Sunset", kanji: "結" },
  ];

  return (
    <div ref={containerRef} className="cinematic-environment-wrapper">
      {/* ── Fixed Atmospheric Particle System (R3F Canvas) ──────── */}
      <div className="fixed-particle-canvas">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true }}
          style={{ background: "transparent" }}
        >
          <ParticleSystem windStrength={0.85} />
        </Canvas>
      </div>

      {/* ── Quick Chapter Jump Indicator ───────────────────────── */}
      <nav className="chapter-nav hud-interactive" aria-label="Cinematic Chapters">
        {navChapters.map((ch, i) => (
          <button
            key={ch.label}
            onClick={() => scrollToScene(i)}
            className={`chapter-nav-item ${activeSection === i ? "active" : ""}`}
            title={`${ch.label} - ${ch.subtitle}`}
          >
            <span className="chapter-dot" />
            <span className="chapter-label">
              <span className="chapter-kanji">{ch.kanji}</span>
              {ch.label}
            </span>
          </button>
        ))}
      </nav>

      {/* ═══════════════════════════════════════════════════════════
          SCENE 1: GOLDEN PAMPAS GRASSLAND (The Lore / Intro)
          ═══════════════════════════════════════════════════════════ */}
      <section id="scene-0" className="cinematic-scene scene-pampas">
        {/* Background Layer: Soft Sky & Foothills */}
        <div className="layer-plane layer-bg">
          <div className="sky-gradient-overlay sky-pampas" />
        </div>

        {/* Midground Layer: Expansive Aso Golden Pampas Grass Field */}
        <div className="layer-plane layer-mid">
          <Image
            src="/environments/scene1-pampas.webp"
            alt="Golden Pampas Grass Fields at Mount Aso, Kumamoto, Japan"
            fill
            priority
            sizes="100vw"
            quality={90}
            className="scene-image object-center"
          />
        </div>

        {/* Foreground Layer: Swaying Pampas Plumes */}
        <div className="layer-plane layer-fg pointer-events-none">
          <div className="fg-element fg-pampas-bottom">
            <Image
              src="/environments/foreground-pampas.webp"
              alt="Foreground swaying pampas grass plume"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={85}
              className="object-contain object-bottom-right opacity-80 mix-blend-screen"
            />
          </div>
        </div>

        {/* Atmospheric Mist & Fog Layer */}
        <div className="layer-plane layer-fog">
          <div className="ambient-fog fog-golden" />
        </div>

        {/* Atmospheric Vignette & Color Grading */}
        <div className="atmospheric-overlay grading-golden" />

        {/* Calligraphic Watermark */}
        <div className="kanji-watermark">誉</div>

        {/* Scene Content & Narrative */}
        <div className="cinematic-content text-left pl-8 sm:pl-16 md:pl-24 max-w-3xl">
          <div className="scene-badge">
            <Compass className="w-3.5 h-3.5 text-amber-300" />
            <span>PROLOGUE • THE LIVING WORLD</span>
          </div>

          <h1 className="cinematic-title">
            RIGVED BHAT
          </h1>
          <p className="cinematic-subtitle">
            AI ARCHITECT &bull; CREATIVE TECHNOLOGIST &bull; RESEARCHER
          </p>

          <p className="cinematic-description">
            &ldquo;Forget sterile interfaces. Build handcrafted atmospheres where intelligence feels organic, purposeful, and quiet.&rdquo;
          </p>

          <div className="cinematic-actions">
            <button
              onClick={() => scrollToScene(1)}
              className="got-btn got-btn-primary hud-interactive"
            >
              <span>BEGIN THE JOURNEY</span>
              <ArrowDown className="w-4 h-4 ml-2 animate-bounce" />
            </button>
            <button
              onClick={() => onNavigate("about")}
              className="got-btn got-btn-secondary hud-interactive"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              <span>OPEN JOURNAL</span>
            </button>
          </div>
        </div>

        {/* Bottom Scroll Prompt */}
        <div className="scroll-hint hud-interactive" onClick={() => scrollToScene(1)}>
          <span className="scroll-hint-text">SCROLL TO ADVANCE</span>
          <div className="scroll-indicator-bar" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SCENE 2: KYOTO AUTUMN MAPLE FOREST (About Me)
          ═══════════════════════════════════════════════════════════ */}
      <section id="scene-1" className="cinematic-scene scene-autumn">
        {/* Background Layer: Deep Canopy & Mountain Mist */}
        <div className="layer-plane layer-bg">
          <div className="sky-gradient-overlay sky-autumn" />
        </div>

        {/* Midground Layer: Kyoto Autumn Maple Garden & Stone Path */}
        <div className="layer-plane layer-mid">
          <Image
            src="/environments/scene2-autumn.webp"
            alt="Kyoto traditional garden path lined by vibrant autumn maple trees"
            fill
            sizes="100vw"
            quality={90}
            className="scene-image object-center"
          />
        </div>

        {/* Foreground Layer: Overhanging Crimson Maple Foliage */}
        <div className="layer-plane layer-fg pointer-events-none">
          <div className="fg-element fg-maple-top">
            <Image
              src="/environments/foreground-maple.webp"
              alt="Foreground red maple branches framing the canopy"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              quality={85}
              className="object-contain object-top-left opacity-90"
            />
          </div>
        </div>

        {/* Atmospheric Fog */}
        <div className="layer-plane layer-fog">
          <div className="ambient-fog fog-autumn" />
        </div>

        {/* Atmospheric Grade */}
        <div className="atmospheric-overlay grading-autumn" />

        {/* Calligraphic Watermark */}
        <div className="kanji-watermark">道</div>

        {/* Scene Content */}
        <div className="cinematic-content max-w-2xl text-left pl-8 sm:pl-16 md:pl-24">
          <div className="scene-badge">
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <span>ACT I &bull; THE PHILOSOPHY</span>
          </div>

          <h2 className="cinematic-title">
            CRAFTSMANSHIP & RESTRAINT
          </h2>
          <p className="cinematic-subtitle">
            JAPANESE DESIGN PHILOSOPHY &bull; INTENTIONAL ENGINEERING
          </p>

          <p className="cinematic-description">
            {aboutInfo.bio[3] || aboutInfo.bio[0]}
          </p>

          <div className="pillar-grid">
            {aboutInfo.interests.slice(0, 3).map((interest) => (
              <div key={interest} className="pillar-card">
                <div className="pillar-title">DISCIPLINE</div>
                <div className="pillar-desc">{interest}</div>
              </div>
            ))}
          </div>

          <div className="cinematic-actions">
            <button
              onClick={() => onNavigate("about")}
              className="got-btn got-btn-primary hud-interactive"
            >
              <span>INSPECT FULL BIOGRAPHY</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
            <button
              onClick={() => scrollToScene(2)}
              className="got-btn got-btn-secondary hud-interactive"
            >
              <span>NEXT: DISCIPLINES</span>
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SCENE 3: HISTORIC PAGODA & TEMPLE ARCHITECTURE (Experience)
          ═══════════════════════════════════════════════════════════ */}
      <section id="scene-2" className="cinematic-scene scene-architecture">
        {/* Background Layer: Indigo Dusk Sky */}
        <div className="layer-plane layer-bg">
          <div className="sky-gradient-overlay sky-twilight" />
        </div>

        {/* Midground Layer: Yasaka Pagoda & Traditional Machiya */}
        <div className="layer-plane layer-mid">
          <Image
            src="/environments/scene3-architecture.webp"
            alt="Historic Yasaka Pagoda towering over ancient wooden streets in Kyoto"
            fill
            sizes="100vw"
            quality={90}
            className="scene-image object-center"
          />
        </div>

        {/* Foreground Layer: Subtle Wooden Eaves & Lattice Silhouette */}
        <div className="layer-plane layer-fg pointer-events-none">
          <div className="fg-element fg-temple-eaves" />
        </div>

        {/* Atmospheric Mist & Incense Haze */}
        <div className="layer-plane layer-fog">
          <div className="ambient-fog fog-indigo" />
        </div>

        {/* Atmospheric Grade */}
        <div className="atmospheric-overlay grading-architecture" />

        {/* Calligraphic Watermark */}
        <div className="kanji-watermark">鍛</div>

        {/* Scene Content */}
        <div className="cinematic-content max-w-2xl text-left pl-8 sm:pl-16 md:pl-24">
          <div className="scene-badge">
            <Terminal className="w-3.5 h-3.5 text-amber-200" />
            <span>ACT II &bull; THE DISCIPLINES</span>
          </div>

          <h2 className="cinematic-title">
            THE CHRONICLE OF MASTERY
          </h2>
          <p className="cinematic-subtitle">
            DISTRIBUTED SYSTEMS &bull; APPLIED MACHINE LEARNING &bull; RESEARCH
          </p>

          <p className="cinematic-description">
            Like ancient timber joinery that stands firm without a single nail, software systems require deep structural discipline, clean abstractions, and meticulous execution.
          </p>

          <div className="experience-preview-list">
            {journeyExperiences.slice(0, 3).map((exp) => (
              <div key={exp.id} className="exp-preview-card">
                <div className="exp-header">
                  <span className="exp-rank">{exp.type}</span>
                  <span className="exp-role">{exp.role}</span>
                </div>
                <div className="exp-org">{exp.subtitle} &bull; {exp.period}</div>
                <div className="exp-summary">{exp.description}</div>
              </div>
            ))}
          </div>

          <div className="cinematic-actions">
            <button
              onClick={() => onNavigate("journey")}
              className="got-btn got-btn-primary hud-interactive"
            >
              <span>READ THE COMPLETE JOURNEY</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
            <button
              onClick={() => scrollToScene(3)}
              className="got-btn got-btn-secondary hud-interactive"
            >
              <span>NEXT: PROJECTS ARCHIVE</span>
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SCENE 4: DRAMATIC ALPINE MOUNTAINS & MIST (Projects & Research)
          ═══════════════════════════════════════════════════════════ */}
      <section id="scene-3" className="cinematic-scene scene-mountains">
        {/* Background Layer: High Alpine Horizon */}
        <div className="layer-plane layer-bg">
          <div className="sky-gradient-overlay sky-alpine" />
        </div>

        {/* Midground Layer: Mount Fuji Above Clouds with Boundary Woodwork */}
        <div className="layer-plane layer-mid">
          <Image
            src="/environments/scene4-mountains.webp"
            alt="Mount Fuji rising through alpine morning mist over Lake Kawaguchiko"
            fill
            sizes="100vw"
            quality={90}
            className="scene-image object-center"
          />
        </div>

        {/* Foreground Layer: Pine Silhouette & Crags */}
        <div className="layer-plane layer-fg pointer-events-none">
          <div className="fg-element fg-alpine-pines" />
        </div>

        {/* Atmospheric Fog */}
        <div className="layer-plane layer-fog">
          <div className="ambient-fog fog-alpine" />
        </div>

        {/* Atmospheric Grade */}
        <div className="atmospheric-overlay grading-mountains" />

        {/* Calligraphic Watermark */}
        <div className="kanji-watermark">探</div>

        {/* Scene Content */}
        <div className="cinematic-content max-w-3xl text-left pl-8 sm:pl-16 md:pl-24">
          <div className="scene-badge">
            <Layers className="w-3.5 h-3.5 text-blue-300" />
            <span>ACT III &bull; THE LIVING ARCHIVE</span>
          </div>

          <h2 className="cinematic-title">
            INVENTIONS & INQUIRIES
          </h2>
          <p className="cinematic-subtitle">
            OPEN-SOURCE ARCHITECTURES &bull; SPATIAL AI &bull; COMPUTATIONAL MODELS
          </p>

          <p className="cinematic-description">
            Selected projects that embody our standard of technical rigour and artistic restraint:
          </p>

          <div className="projects-grid">
            {categorizedProjects.slice(0, 4).map((proj) => (
              <div 
                key={proj.slug} 
                className="project-spotlight-card hud-interactive"
                onClick={() => {
                  onSelectProject(proj.slug);
                  onNavigate("projects");
                }}
              >
                <div className="proj-category">{proj.category}</div>
                <div className="proj-title">{proj.title}</div>
                <div className="proj-subtitle">{proj.subtitle}</div>
                <div className="proj-quote">&ldquo;{proj.quote}&rdquo;</div>
                <div className="proj-tags">
                  {proj.tags.map((t) => (
                    <span key={t} className="proj-tag">{t}</span>
                  ))}
                </div>
                <div className="proj-cta">
                  <span>INSPECT DETAILS</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </div>
              </div>
            ))}
          </div>

          <div className="cinematic-actions">
            <button
              onClick={() => onNavigate("projects")}
              className="got-btn got-btn-primary hud-interactive"
            >
              <span>BROWSE COMPLETE REPOSITORY ARCHIVE</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
            <button
              onClick={() => scrollToScene(4)}
              className="got-btn got-btn-secondary hud-interactive"
            >
              <span>NEXT: THE SIGNAL</span>
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SCENE 5: TWILIGHT COASTAL TORII GATE (Contact & Signal)
          ═══════════════════════════════════════════════════════════ */}
      <section id="scene-4" className="cinematic-scene scene-sunset">
        {/* Background Layer: Sunset Reflection Sky */}
        <div className="layer-plane layer-bg">
          <div className="sky-gradient-overlay sky-sunset" />
        </div>

        {/* Midground Layer: Itsukushima Torii Gate Standing in Tidal Ocean at Sunset */}
        <div className="layer-plane layer-mid">
          <Image
            src="/environments/scene5-sunset.webp"
            alt="Ancient Torii gate standing in tidal ocean waters at twilight sunset"
            fill
            sizes="100vw"
            quality={90}
            className="scene-image object-center"
          />
        </div>

        {/* Atmospheric Mist & Ocean Tide Haze */}
        <div className="layer-plane layer-fog">
          <div className="ambient-fog fog-sunset" />
        </div>

        {/* Atmospheric Grade */}
        <div className="atmospheric-overlay grading-sunset" />

        {/* Calligraphic Watermark */}
        <div className="kanji-watermark">結</div>

        {/* Scene Content */}
        <div className="cinematic-content max-w-2xl text-left pl-8 sm:pl-16 md:pl-24">
          <div className="scene-badge">
            <Mail className="w-3.5 h-3.5 text-amber-300" />
            <span>ACT IV &bull; THE SIGNAL</span>
          </div>

          <h2 className="cinematic-title">
            REACH ACROSS THE TIDE
          </h2>
          <p className="cinematic-subtitle">
            COLLABORATION &bull; RESEARCH INQUIRIES &bull; DIALOGUE
          </p>

          <p className="cinematic-description">
            Whether you are forging novel distributed architectures, exploring regional spatial intelligence, or looking to build an uncompromising digital work, send a signal.
          </p>

          <div className="contact-methods-grid">
            <a
              href={`mailto:${contactInfo.email}`}
              className="contact-card hud-interactive"
            >
              <Mail className="w-5 h-5 text-amber-400 mb-2" />
              <div className="contact-label">DIRECT DISPATCH</div>
              <div className="contact-val">{contactInfo.email}</div>
            </a>

            <a
              href={contactInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card hud-interactive"
            >
              <Github className="w-5 h-5 text-amber-400 mb-2" />
              <div className="contact-label">CODE REPOSITORY</div>
              <div className="contact-val">github.com/{contactInfo.githubHandle}</div>
            </a>

            <a
              href={contactInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card hud-interactive"
            >
              <Linkedin className="w-5 h-5 text-amber-400 mb-2" />
              <div className="contact-label">PROFESSIONAL NETWORK</div>
              <div className="contact-val">LinkedIn Profile</div>
            </a>
          </div>

          <div className="cinematic-actions">
            <button
              onClick={() => onNavigate("contact")}
              className="got-btn got-btn-primary hud-interactive"
            >
              <span>OPEN FULL CONTACT FORM</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
            <button
              onClick={() => scrollToScene(0)}
              className="got-btn got-btn-secondary hud-interactive"
            >
              <span>RETURN TO EMBARKATION</span>
              <ArrowDown className="w-4 h-4 ml-1 rotate-180" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
