"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DestinationId } from "@/lib/types";

/* ── DLC Gallery Sections Data ─────────────────────────────── */

export interface DLCSection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  mediaItems: DLCMediaItem[];
}

export interface DLCMediaItem {
  type: "photo" | "video";
  src: string;
  caption: string;
}

// Placeholder sections - user will add real content later
export const dlcSections: DLCSection[] = [
  {
    id: "kit-college",
    title: "KIT COLLEGE",
    subtitle: "Campus Chronicles",
    description: "Life at KIT College of Engineering - from classrooms to labs, events to late-night coding sessions.",
    mediaItems: [],
  },
  {
    id: "pune-hackathon",
    title: "PUNE HACKATHON",
    subtitle: "The Competitive Arc",
    description: "Highlights from the Pune Hackathon - the grind, the breakthroughs, and the team behind it all.",
    mediaItems: [],
  },
  {
    id: "bangalore-hackathon",
    title: "BANGALORE HACKATHON",
    subtitle: "The Southern Expedition",
    description: "A trip to Bangalore for the hackathon - competing, networking, and exploring the tech capital.",
    mediaItems: [],
  },
];

/* ── DLC Gallery Component ─────────────────────────────────── */

interface DLCGalleryProps {
  onNavigate: (id: DestinationId) => void;
  onReturnHome: () => void;
}

export default function DLCGallery({
  onReturnHome,
}: DLCGalleryProps) {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const activeSection = dlcSections.find((s) => s.id === selectedSection);

  return (
    <AnimatePresence>
      <motion.div
        className="got-collections-overlay hud-interactive"
        initial={{ opacity: 0, filter: "blur(8px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(8px)" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Top Black Navigation Bar */}
        <div className="got-collections-topbar">
          <div style={{ display: "flex", alignItems: "center", height: "100%", gap: "0.5rem" }}>
            <div
              style={{
                padding: "0 1.8rem",
                height: "100%",
                display: "flex",
                alignItems: "center",
                fontSize: "0.75rem",
                fontWeight: 800,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#FFFFFF",
                background: "#EBE7E1",
                position: "relative",
              }}
            >
              <span style={{ color: "#121618" }}>RIG&apos;S DLC</span>
              <span style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: "#D12C28" }} />
            </div>
            <span
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                color: "rgba(245, 240, 232, 0.5)",
                textTransform: "uppercase",
                marginLeft: "1rem",
              }}
            >
              REAL LIFE GALLERY
            </span>
          </div>

          <button
            onClick={onReturnHome}
            style={{
              background: "transparent",
              border: "1px solid rgba(245,240,232,0.35)",
              color: "#F5F0E8",
              padding: "0.4rem 1.2rem",
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            &#8249; RETURN TO HOME WORLD
          </button>
        </div>

        {/* Main Content Body */}
        <div className="got-collections-body" style={{ flexDirection: "column", gap: "2rem", position: "relative" }}>
          {/* Background Image */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "url('/journey_asset.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 0,
            }}
          />
          <div style={{ position: "absolute", inset: 0, background: "rgba(247, 244, 238, 0.88)", backdropFilter: "blur(6px)", zIndex: 1, pointerEvents: "none" }} />

          {!selectedSection ? (
            /* ── Section Selector Grid ─────────────────────────── */
            <div style={{ position: "relative", zIndex: 2, width: "100%" }}>
              <div style={{ marginBottom: "2rem" }}>
                <h2
                  style={{
                    fontSize: "2.4rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#0F0E0C",
                    fontFamily: "Georgia, serif",
                    fontWeight: 800,
                    marginBottom: "0.4rem",
                  }}
                >
                  RIG&apos;S DLC
                </h2>
                <div
                  style={{
                    fontSize: "0.88rem",
                    letterSpacing: "0.22em",
                    color: "#B81D18",
                    fontWeight: 800,
                    textTransform: "uppercase",
                  }}
                >
                  Real Life Gallery - Select a Chapter
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {dlcSections.map((section, idx) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 * idx, duration: 0.4 }}
                    onClick={() => setSelectedSection(section.id)}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #C8C2B4",
                      padding: "2rem 1.8rem",
                      cursor: "pointer",
                      transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                      position: "relative",
                      overflow: "hidden",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                    }}
                    whileHover={{
                      y: -4,
                      boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
                    }}
                  >
                    {/* Red Corner Tag */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "14px",
                        height: "14px",
                        background: "#B81D18",
                        clipPath: "polygon(0 0, 100% 0, 0 100%)",
                      }}
                    />

                    <div
                      style={{
                        fontSize: "0.65rem",
                        letterSpacing: "0.22em",
                        color: "#B81D18",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        marginBottom: "0.6rem",
                      }}
                    >
                      {section.subtitle}
                    </div>
                    <h3
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: 800,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "#0F0E0C",
                        fontFamily: "Georgia, serif",
                        marginBottom: "0.8rem",
                      }}
                    >
                      {section.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.88rem",
                        lineHeight: 1.7,
                        color: "#2E2A25",
                        fontWeight: 500,
                      }}
                    >
                      {section.description}
                    </p>

                    {/* Media Count Badge */}
                    <div
                      style={{
                        marginTop: "1.2rem",
                        fontSize: "0.65rem",
                        letterSpacing: "0.18em",
                        color: "#7A756C",
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}
                    >
                      {section.mediaItems.length > 0
                        ? `${section.mediaItems.length} ITEMS`
                        : "COMING SOON"}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            /* ── Selected Section Detail View ─────────────────── */
            <div style={{ position: "relative", zIndex: 2, width: "100%" }}>
              <button
                onClick={() => setSelectedSection(null)}
                style={{
                  background: "#0C1012",
                  color: "#FFFFFF",
                  border: "none",
                  padding: "0.55rem 1.4rem",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  marginBottom: "2rem",
                }}
              >
                &#8249; BACK TO DLC
              </button>

              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #C8C2B4",
                  padding: "2.5rem",
                  boxShadow: "0 6px 25px rgba(0,0,0,0.06)",
                  borderRadius: "4px",
                }}
              >
                <h2
                  style={{
                    fontSize: "2.2rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#0F0E0C",
                    fontFamily: "Georgia, serif",
                    fontWeight: 800,
                    marginBottom: "0.4rem",
                  }}
                >
                  {activeSection?.title}
                </h2>
                <div
                  style={{
                    fontSize: "0.85rem",
                    letterSpacing: "0.22em",
                    color: "#B81D18",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    marginBottom: "1.8rem",
                  }}
                >
                  {activeSection?.subtitle}
                </div>

                <p
                  style={{
                    fontSize: "1.05rem",
                    lineHeight: 1.85,
                    color: "#11100E",
                    fontWeight: 500,
                    background: "#F7F4EE",
                    padding: "1.5rem 1.8rem",
                    borderLeft: "4px solid #B81D18",
                    marginBottom: "2rem",
                  }}
                >
                  {activeSection?.description}
                </p>

                {/* Media Grid - Placeholder for when media is added */}
                {activeSection && activeSection.mediaItems.length > 0 ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                      gap: "1rem",
                    }}
                  >
                    {activeSection.mediaItems.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: "#F7F4EE",
                          border: "1px solid #C8C2B4",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        {item.type === "photo" ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.src}
                            alt={item.caption}
                            style={{
                              width: "100%",
                              height: "200px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <video
                            src={item.src}
                            controls
                            style={{ width: "100%", height: "200px", objectFit: "cover" }}
                          />
                        )}
                        <div
                          style={{
                            padding: "0.8rem",
                            fontSize: "0.78rem",
                            color: "#2E2A25",
                            fontWeight: 600,
                          }}
                        >
                          {item.caption}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "4rem 2rem",
                      background: "#F7F4EE",
                      border: "1px dashed #C8C2B4",
                      borderRadius: "4px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.8rem",
                        marginBottom: "0.8rem",
                        opacity: 0.3,
                      }}
                    >
                      ◆
                    </div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: "#7A756C",
                        fontWeight: 700,
                      }}
                    >
                      CONTENT COMING SOON
                    </div>
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: "#A09B90",
                        marginTop: "0.5rem",
                        fontWeight: 500,
                      }}
                    >
                      Photos and videos will be added to this section
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Controller Bar */}
        <div className="got-collections-bottombar">
          <div>RIGVED BHAT &bull; DLC</div>
          <div>(A) SELECT &nbsp;&nbsp;&nbsp;&nbsp; (B) EXIT</div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
