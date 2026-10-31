"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DestinationId, JourneyStage, Project, RepoMeta } from "@/lib/types";
import { categorizedProjects, journeyExperiences, aboutInfo } from "@/lib/world-data";
import { fetchRepoMeta, fetchRecentCommits, type CommitSummary } from "@/lib/github-api";

interface DedicatedPageOverlayProps {
  activeDestination: DestinationId;
  projects: Project[];
  selectedProject: string | null;
  onSelectProject: (slug: string | null) => void;
  journeyStages: JourneyStage[];
  contactInfo: { email: string; github: string; linkedin: string; githubHandle: string };
  onNavigate: (id: DestinationId) => void;
  onReturnHome: () => void;
}

export default function DedicatedPageOverlay({
  activeDestination,
  selectedProject,
  onSelectProject,
  contactInfo,
  onNavigate,
  onReturnHome,
}: DedicatedPageOverlayProps) {
  // Left sidebar category state for Projects section
  const [activeCategory, setActiveCategory] = useState<"WEBSITE" | "RESEARCH" | "MACHINE LEARNING">("WEBSITE");
  
  // Active selected experience state for Journey (Journal) section
  const [selectedTaleId, setSelectedTaleId] = useState<string>("discord-bot-developer");

  const [repoData, setRepoData] = useState<RepoMeta | null>(null);
  const [commits, setCommits] = useState<CommitSummary[]>([]);
  const [loadingRepo, setLoadingRepo] = useState(false);

  const selectedProj = categorizedProjects.find((p) => p.slug === selectedProject);
  const selectedTale = journeyExperiences.find((t) => t.id === selectedTaleId) || journeyExperiences[0];

  // Fetch GitHub repo metadata when a project is selected
  useEffect(() => {
    if (selectedProj) {
      setLoadingRepo(true);
      Promise.all([
        fetchRepoMeta(selectedProj.owner, selectedProj.repo),
        fetchRecentCommits(selectedProj.owner, selectedProj.repo),
      ]).then(([meta, recentCommits]) => {
        setRepoData(meta);
        setCommits(recentCommits || []);
        setLoadingRepo(false);
      });
    }
  }, [selectedProj]);

  if (activeDestination === "origin") return null;

  // Filter projects by active category
  const filteredProjects = categorizedProjects.filter((p) => p.category === activeCategory);

  // Top Tabs with ABOUT at position 0
  const topTabs: { id: DestinationId; label: string }[] = [
    { id: "about", label: "ABOUT" },
    { id: "projects", label: "PROJECTS" },
    { id: "research", label: "RESEARCH" },
    { id: "journey", label: "EXPERIENCE" },
    { id: "contact", label: "CONTACT" },
  ];

  const leftCategories: { id: "WEBSITE" | "RESEARCH" | "MACHINE LEARNING"; label: string }[] = [
    { id: "WEBSITE", label: "WEBSITE" },
    { id: "RESEARCH", label: "RESEARCH" },
    { id: "MACHINE LEARNING", label: "MACHINE LEARNING" },
  ];

  // Common background style for non-About sections
  const experienceBackgroundStyle: React.CSSProperties =
    activeDestination !== "about"
      ? {
          position: "relative",
          backgroundImage: "url('/journey_asset.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }
      : {};

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
          <div className="got-collections-tabs">
            {topTabs.map((tab) => {
              const isActive = activeDestination === tab.id;
              return (
                <button
                  key={tab.id}
                  className={`got-collections-tab ${isActive ? "active" : ""}`}
                  onClick={() => {
                    onSelectProject(null);
                    onNavigate(tab.id);
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
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

        {/* ── ABOUT VIEW (Clean Parchment Theme) ── */}
        {activeDestination === "about" && (
          <div className="got-collections-body" style={{ flexDirection: "column", overflowY: "auto", gap: "2rem" }}>
            {/* Circle Photo Top Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "2rem", borderBottom: "2px solid #C8C2B4", paddingBottom: "1.5rem" }}>
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  border: "3px solid #B81D18",
                  boxShadow: "0 4px 18px rgba(184, 29, 24, 0.3)",
                  overflow: "hidden",
                  flexShrink: 0,
                  background: "#E0DDD7",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={aboutInfo.photoUrl}
                  alt={aboutInfo.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
                />
              </div>

              <div>
                <h2 style={{ fontSize: "2.2rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#0F0E0C", marginBottom: "0.3rem", fontFamily: "Georgia, serif", fontWeight: 800 }}>
                  {aboutInfo.name}
                </h2>
                <div style={{ fontSize: "0.85rem", letterSpacing: "0.2em", color: "#B81D18", fontWeight: 800, textTransform: "uppercase" }}>
                  {aboutInfo.role}
                </div>
              </div>
            </div>

            {/* Grid Layout: Left Bio & Goals, Right Academic Profile & Interests */}
            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "3rem" }}>
              {/* Left Column: Bio & Future Goals */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
                <h3 style={{ fontSize: "0.85rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#4A443C", fontWeight: 800 }}>
                  ABOUT THE BUILDER
                </h3>

                {aboutInfo.bio.map((paragraph, i) => (
                  <p key={i} style={{ fontSize: "0.98rem", lineHeight: 1.85, color: "#11100E", fontWeight: 500 }}>
                    {paragraph}
                  </p>
                ))}

                {/* Future Goals Box */}
                <div style={{ marginTop: "1rem", background: "#FFFFFF", padding: "1.6rem", border: "1px solid #C8C2B4", borderLeft: "5px solid #B81D18", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
                  <h4 style={{ fontSize: "0.85rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#B81D18", fontWeight: 800, marginBottom: "0.9rem" }}>
                    FUTURE GOALS
                  </h4>
                  {aboutInfo.futureGoals.map((goal, idx) => (
                    <p key={idx} style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "#11100E", fontWeight: 500, marginBottom: idx === 0 ? "0.9rem" : 0 }}>
                      {goal}
                    </p>
                  ))}
                </div>
              </div>

              {/* Right Column: Currently & Interests */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {/* Currently Academic Profile Card */}
                <div className="got-project-card" style={{ padding: "1.6rem", background: "#FFFFFF", border: "1px solid #C8C2B4" }}>
                  <div className="got-project-card-red-tag" />
                  <h3 style={{ fontSize: "0.85rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#B81D18", fontWeight: 800, marginBottom: "1.2rem" }}>
                    CURRENTLY
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.88rem" }}>
                    <div>
                      <div style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#5A544A", fontWeight: 700 }}>DEGREE</div>
                      <div style={{ fontWeight: 800, color: "#0F0E0C" }}>{aboutInfo.currently.degree}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#5A544A", fontWeight: 700 }}>SPECIALIZATION</div>
                      <div style={{ fontWeight: 800, color: "#0F0E0C" }}>{aboutInfo.currently.specialization}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#5A544A", fontWeight: 700 }}>MINOR</div>
                      <div style={{ fontWeight: 800, color: "#0F0E0C" }}>{aboutInfo.currently.minor}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#5A544A", fontWeight: 700 }}>YEAR</div>
                      <div style={{ fontWeight: 800, color: "#0F0E0C" }}>{aboutInfo.currently.year}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#5A544A", fontWeight: 700 }}>TRADE</div>
                      <div style={{ fontWeight: 800, color: "#B81D18" }}>{aboutInfo.currently.trade}</div>
                    </div>
                  </div>
                </div>

                {/* Interests Section */}
                <div>
                  <h3 style={{ fontSize: "0.85rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#4A443C", fontWeight: 800, marginBottom: "1rem" }}>
                    INTERESTS
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
                    {aboutInfo.interests.map((interest, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: "#FFFFFF",
                          border: "1px solid #C8C2B4",
                          padding: "0.45rem 0.95rem",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          color: "#11100E",
                        }}
                      >
                        ◆ {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Featured Media / Embedded Video Section */}
              <div style={{ marginTop: "2rem", borderTop: "2px solid #C8C2B4", paddingTop: "1.8rem", gridColumn: "1 / -1" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
                  <h3 style={{ fontSize: "0.88rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#B81D18", fontWeight: 800 }}>
                    FEATURED MEDIA & HIGHLIGHTS
                  </h3>
                  <a
                    href="https://www.linkedin.com/feed/update/urn:li:ugcPost:7449836955699412992/"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: "0.7rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "#B81D18",
                      fontWeight: 800,
                      textDecoration: "none",
                    }}
                  >
                    OPEN ON LINKEDIN &#8250;
                  </a>
                </div>
                <div
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #C8C2B4",
                    padding: "1.2rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                    maxWidth: "540px",
                    margin: "0 auto 2rem auto",
                    overflow: "hidden",
                    borderRadius: "4px",
                  }}
                >
                  <div
                    style={{ width: "100%", display: "flex", justifyContent: "center" }}
                    dangerouslySetInnerHTML={{
                      __html: `<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7449836955699412992?collapsed=1" height="876" width="504" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>`,
                    }}
                  />

                  {/* Direct Video Media Card */}
                  <div
                    style={{
                      width: "100%",
                      marginTop: "1rem",
                      padding: "1rem",
                      background: "#F4F0E8",
                      borderTop: "1px solid #C8C2B4",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#B81D18", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.8rem" }}>
                        in
                      </div>
                      <div>
                        <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#0F0E0C" }}>Rigved Mithun Bhat</div>
                        <div style={{ fontSize: "0.68rem", color: "#4A443C", fontWeight: 600 }}>Featured Video & Systems Demo on LinkedIn</div>
                      </div>
                    </div>
                    <a
                      href="https://www.linkedin.com/feed/update/urn:li:ugcPost:7449836955699412992/"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: "#0C1012",
                        color: "#FFFFFF",
                        padding: "0.5rem 1rem",
                        fontSize: "0.68rem",
                        fontWeight: 800,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        textDecoration: "none",
                        borderRadius: "2px",
                      }}
                    >
                      WATCH DEMO &#8250;
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PROJECTS VIEW (High-Contrast Parchment Overlay) ── */}
        {activeDestination === "projects" && (
          <div className="got-collections-body" style={experienceBackgroundStyle}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(247, 244, 238, 0.88)", backdropFilter: "blur(6px)", zIndex: 1, pointerEvents: "none" }} />
            {!selectedProject ? (
              <>
                {/* Left Sidebar Category Menu */}
                <div className="got-left-sidebar" style={{ zIndex: 2 }}>
                  {leftCategories.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    return (
                      <div
                        key={cat.id}
                        className={`got-left-card ${isActive ? "active" : ""}`}
                        onClick={() => setActiveCategory(cat.id)}
                      >
                        <span className="got-left-card-label">{cat.label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Right Side: Projects Cards Grid */}
                <div className="got-right-grid" style={{ zIndex: 2 }}>
                  {filteredProjects.map((project, idx) => (
                    <motion.div
                      key={project.slug}
                      className="got-project-card"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.06 * idx }}
                      onClick={() => onSelectProject(project.slug)}
                    >
                      {/* Top-Left Red Corner Tag */}
                      <div className="got-project-card-red-tag" />

                      {/* Header */}
                      <div className="got-project-card-header">
                        <div className="got-project-card-title">{project.title}</div>
                      </div>

                      {/* Card Thumbnail Image */}
                      <div className="got-project-card-image-wrap">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="got-project-card-image"
                          style={{
                            objectPosition: project.slug === "portfolio" ? "top center" : "center center",
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              /* Detail Project View */
              <div style={{ flex: 1, padding: "1rem", overflowY: "auto", zIndex: 2 }}>
                <button
                  onClick={() => onSelectProject(null)}
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
                  &#8249; BACK TO PROJECTS
                </button>

                <div style={{ background: "#FFFFFF", border: "1px solid #C8C2B4", padding: "2.5rem", boxShadow: "0 6px 25px rgba(0,0,0,0.06)", borderRadius: "4px" }}>
                  <h2 style={{ fontSize: "2.2rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#0F0E0C", marginBottom: "0.5rem", fontFamily: "Georgia, serif", fontWeight: 800 }}>
                    {selectedProj?.title}
                  </h2>
                  <div style={{ fontSize: "0.85rem", letterSpacing: "0.22em", color: "#B81D18", fontWeight: 800, marginBottom: "1.8rem", textTransform: "uppercase" }}>
                    {selectedProj?.category}
                  </div>

                  <div style={{ fontStyle: "italic", borderLeft: "4px solid #B81D18", paddingLeft: "1.4rem", margin: "1.8rem 0", fontSize: "1.1rem", color: "#11100E", fontWeight: 600, background: "#F7F4EE", padding: "1.2rem 1.6rem" }}>
                    &ldquo;{selectedProj?.quote}&rdquo;
                  </div>

                  <p style={{ fontSize: "1.02rem", lineHeight: 1.85, marginBottom: "2rem", color: "#11100E", fontWeight: 500 }}>
                    {selectedProj?.subtitle}
                  </p>

                  {loadingRepo ? (
                    <div style={{ fontSize: "0.8rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#4A443C", fontWeight: 700 }}>
                      Fetching repository telemetry...
                    </div>
                  ) : (
                    repoData && (
                      <div style={{ marginTop: "2rem", borderTop: "2px solid #C8C2B4", paddingTop: "1.8rem" }}>
                        <h3 style={{ fontSize: "0.85rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#B81D18", fontWeight: 800, marginBottom: "1.2rem" }}>
                          GitHub Telemetry
                        </h3>
                        <div style={{ display: "flex", gap: "2rem", marginBottom: "1.8rem", fontSize: "0.95rem", fontWeight: 800, color: "#0F0E0C" }}>
                          <span>★ {repoData.stars} Stars</span>
                          {repoData.language && <span>◆ {repoData.language}</span>}
                          <span>! {repoData.openIssues} Issues</span>
                        </div>

                        {commits.length > 0 && (
                          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {commits.slice(0, 3).map((commit) => (
                              <div key={commit.sha} style={{ borderLeft: "3px solid #B81D18", paddingLeft: "1.2rem", fontSize: "0.9rem", color: "#11100E", background: "#F7F4EE", padding: "0.8rem 1rem" }}>
                                <div style={{ fontSize: "0.68rem", letterSpacing: "0.18em", color: "#B81D18", fontWeight: 800, marginBottom: "0.3rem" }}>
                                  {commit.sha} &bull; {new Date(commit.date).toLocaleDateString()}
                                </div>
                                <div style={{ fontWeight: 600 }}>{commit.message}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        <a
                          href={`https://github.com/${selectedProj?.owner}/${selectedProj?.repo}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: "inline-block",
                            marginTop: "2rem",
                            padding: "0.85rem 2.2rem",
                            background: "#0C1012",
                            color: "#FFFFFF",
                            textDecoration: "none",
                            fontWeight: 800,
                            fontSize: "0.78rem",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                          }}
                        >
                          VIEW ON GITHUB &#8250;
                        </a>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── RESEARCH VIEW (High-Contrast Parchment Overlay) ── */}
        {activeDestination === "research" && (
          <div className="got-collections-body" style={{ ...experienceBackgroundStyle, flexDirection: "column" }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(247, 244, 238, 0.88)", backdropFilter: "blur(6px)", zIndex: 1, pointerEvents: "none" }} />
            <div style={{ maxWidth: "850px", zIndex: 2, background: "#FFFFFF", border: "1px solid #C8C2B4", padding: "2.5rem 3rem", boxShadow: "0 8px 30px rgba(0,0,0,0.06)", borderRadius: "4px" }}>
              <h2 style={{ fontSize: "2.4rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#0F0E0C", marginBottom: "0.4rem", fontFamily: "Georgia, serif", fontWeight: 800 }}>
                RESEARCH
              </h2>
              <div style={{ fontSize: "0.88rem", letterSpacing: "0.22em", color: "#B81D18", fontWeight: 800, textTransform: "uppercase", marginBottom: "1.8rem" }}>
                Spatial & Environmental AI Systems
              </div>
              <div style={{ fontStyle: "italic", borderLeft: "4px solid #B81D18", paddingLeft: "1.4rem", margin: "1.8rem 0", fontSize: "1.1rem", color: "#11100E", fontWeight: 600, background: "#F7F4EE", padding: "1.2rem 1.6rem" }}>
                &ldquo;Research begins where intuition is no longer enough.&rdquo;
              </div>
              <p style={{ fontSize: "1.05rem", lineHeight: 1.85, color: "#11100E", fontWeight: 500, marginBottom: "2rem" }}>
                My research focuses on visitor-flow redistribution models combining machine learning with spatial behavior.
              </p>
              <a
                href="https://github.com/rigvedbhat/tourism-ai-dss"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-block",
                  padding: "0.85rem 2.2rem",
                  background: "#0C1012",
                  color: "#FFFFFF",
                  textDecoration: "none",
                  fontWeight: 800,
                  fontSize: "0.78rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                EXPLORE RESEARCH REPOSITORY &#8250;
              </a>
            </div>
          </div>
        )}

        {/* ── EXPERIENCE VIEW (High-Contrast Parchment Overlay) ── */}
        {activeDestination === "journey" && (
          <div className="got-collections-body" style={experienceBackgroundStyle}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(247, 244, 238, 0.88)", backdropFilter: "blur(6px)", zIndex: 1, pointerEvents: "none" }} />

            {/* Left Sidebar: ACTIVE TALES List */}
            <div className="got-journal-sidebar" style={{ position: "relative", zIndex: 2 }}>
              <div className="got-journal-sidebar-header">ACTIVE TALES</div>

              {journeyExperiences.map((tale) => {
                const isActive = selectedTaleId === tale.id;
                return (
                  <div
                    key={tale.id}
                    className={`got-tale-card ${isActive ? "active" : ""}`}
                    onClick={() => setSelectedTaleId(tale.id)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={isActive ? "#FFFFFF" : "#0F0E0C"}>
                      <path d="M12 2L2 12l10 10 10-10L12 2zm0 4.5L17.5 12 12 17.5 6.5 12 12 6.5z" />
                    </svg>
                    <span className="got-tale-card-title">{tale.role}</span>
                  </div>
                );
              })}
            </div>

            {/* Right Main Area: Selected Tale Story Narrative */}
            <div className="got-tale-content" style={{ position: "relative", zIndex: 2 }}>
              <motion.div
                key={selectedTale.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                style={{ background: "#FFFFFF", border: "1px solid #C8C2B4", padding: "2.5rem", boxShadow: "0 8px 30px rgba(0,0,0,0.06)", borderRadius: "4px" }}
              >
                {/* Role Title */}
                <h2
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#0F0E0C",
                    marginBottom: "0.4rem",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {selectedTale.role}
                </h2>

                {/* Subtitle / Period */}
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    letterSpacing: "0.2em",
                    color: "#B81D18",
                    textTransform: "uppercase",
                    marginBottom: "1.8rem",
                  }}
                >
                  {selectedTale.type} &bull; {selectedTale.period}
                </div>

                {/* Main Narrative Description */}
                <p
                  style={{
                    fontSize: "1.05rem",
                    lineHeight: 1.85,
                    color: "#11100E",
                    fontWeight: 500,
                    background: "#F7F4EE",
                    padding: "1.5rem 1.8rem",
                    borderLeft: "4px solid #B81D18",
                    margin: 0,
                  }}
                >
                  {selectedTale.description}
                </p>
              </motion.div>
            </div>
          </div>
        )}

        {/* ── CONTACT VIEW (High-Contrast Parchment Overlay) ── */}
        {activeDestination === "contact" && (
          <div className="got-collections-body" style={{ ...experienceBackgroundStyle, flexDirection: "column" }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(247, 244, 238, 0.88)", backdropFilter: "blur(6px)", zIndex: 1, pointerEvents: "none" }} />
            <div style={{ maxWidth: "850px", zIndex: 2, background: "#FFFFFF", border: "1px solid #C8C2B4", padding: "2.5rem 3rem", boxShadow: "0 8px 30px rgba(0,0,0,0.06)", borderRadius: "4px" }}>
              <h2 style={{ fontSize: "2.4rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#0F0E0C", marginBottom: "0.4rem", fontFamily: "Georgia, serif", fontWeight: 800 }}>
                CONTACT
              </h2>
              <div style={{ fontSize: "0.88rem", letterSpacing: "0.22em", color: "#B81D18", fontWeight: 800, marginBottom: "1.8rem", textTransform: "uppercase" }}>
                Send a Signal &bull; Collaboration
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", marginTop: "2rem" }}>
                <a href={`mailto:${contactInfo.email}`} className="got-project-card" style={{ padding: "1.8rem", textDecoration: "none", color: "inherit", background: "#F7F4EE", border: "1px solid #C8C2B4" }}>
                  <div style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#B81D18", fontWeight: 800, marginBottom: "0.6rem" }}>Direct Email</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0F0E0C", wordBreak: "break-all" }}>{contactInfo.email}</div>
                </a>
                <a href={contactInfo.github} target="_blank" rel="noreferrer" className="got-project-card" style={{ padding: "1.8rem", textDecoration: "none", color: "inherit", background: "#F7F4EE", border: "1px solid #C8C2B4" }}>
                  <div style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#B81D18", fontWeight: 800, marginBottom: "0.6rem" }}>GitHub</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0F0E0C" }}>@{contactInfo.githubHandle}</div>
                </a>
                <a href={contactInfo.linkedin} target="_blank" rel="noreferrer" className="got-project-card" style={{ padding: "1.8rem", textDecoration: "none", color: "inherit", background: "#F7F4EE", border: "1px solid #C8C2B4" }}>
                  <div style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#B81D18", fontWeight: 800, marginBottom: "0.6rem" }}>LinkedIn</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0F0E0C" }}>Rigved Bhat</div>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Controller Bar */}
        <div className="got-collections-bottombar">
          <div>RIGVED BHAT &bull; ARCHIVE</div>
          <div>(A) SELECT &nbsp;&nbsp;&nbsp;&nbsp; (B) EXIT</div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
