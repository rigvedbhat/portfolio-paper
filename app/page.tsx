"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import HUD from "@/components/hud/HUD";
import InkIntro from "@/components/hud/InkIntro";
import DLCIntro from "@/components/hud/DLCIntro";
import { WorldCanvas } from "@/components/world/WorldCanvas";
import {
  playTransitionAudio,
  startBackgroundAudio,
  pauseBackgroundAudio,
  resumeBackgroundAudio,
  toggleBackgroundAudio,
  playDLCIntroAudio,
} from "@/lib/audio-manager";
import type { DestinationId, WorldState } from "@/lib/types";

export default function HomePage() {
  const [showMovieIntro, setShowMovieIntro] = useState(false);
  const [showDLCIntro, setShowDLCIntro] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [worldState, setWorldState] = useState<WorldState>({
    phase: "boot",
    activeDestination: "origin",
    selectedProject: null,
    soundEnabled: false,
    bootProgress: 0,
    isTransitioning: false,
  });

  const bootTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Boot Progress Simulation (Runs immediately on initial mount) ─────── */
  useEffect(() => {
    if (worldState.phase !== "boot") return;

    bootTimerRef.current = setInterval(() => {
      setWorldState((prev) => {
        if (prev.bootProgress >= 100) {
          if (bootTimerRef.current) clearInterval(bootTimerRef.current);
          return prev;
        }
        const next = Math.min(prev.bootProgress + Math.random() * 6 + 3, 100);
        return { ...prev, bootProgress: next };
      });
    }, 70);

    return () => {
      if (bootTimerRef.current) clearInterval(bootTimerRef.current);
    };
  }, [worldState.phase]);

  /* ── Handlers ──────────────────────────────────────────────── */

  // Triggered when user clicks "Start the experience" button on Boot Loading Screen
  const handleBootComplete = useCallback(() => {
    if (bootTimerRef.current) clearInterval(bootTimerRef.current);
    // Move directly into the Cinematic Movie Intro
    setShowMovieIntro(true);
  }, []);

  // Triggered when Cinematic Movie Intro finishes (or user skips)
  const handleMovieIntroComplete = useCallback(() => {
    setShowMovieIntro(false);
    startBackgroundAudio();
    setWorldState((prev) => ({
      ...prev,
      phase: "menu",
      bootProgress: 100,
      soundEnabled: true,
    }));
  }, []);

  const handleTransitionComplete = useCallback(() => {
    setWorldState((prev) => ({
      ...prev,
      isTransitioning: false,
    }));
  }, []);

  /* ── DLC Intro Complete Handler ────────────────────────────── */
  const handleDLCIntroComplete = useCallback(() => {
    setShowDLCIntro(false);
    // Resume background music after DLC intro ends
    resumeBackgroundAudio();
    setWorldState((prev) => ({
      ...prev,
      phase: "destination",
      activeDestination: "dlc",
      selectedProject: null,
      isTransitioning: false,
    }));
  }, []);

  /* ── Solid Black Screen Transition Handler (Main Screen Switches Only) ── */
  const handleNavigate = useCallback(
    (id: DestinationId) => {
      if (worldState.isTransitioning || worldState.activeDestination === id) return;

      playTransitionAudio();

      // Special handling for DLC: pause bg music, show DLC cinematic intro
      if (id === "dlc" && worldState.activeDestination === "origin") {
        setIsFading(true);
        playDLCIntroAudio(true); // Trigger play immediately in the click stack trace
        setTimeout(() => {
          pauseBackgroundAudio();
          setShowDLCIntro(true);
          setIsFading(false);
        }, 450);
        return;
      }

      // Blackout fade transition triggers ONLY when entering/exiting Main World (origin)
      const isMainScreenSwitch =
        (worldState.activeDestination === "origin" && id !== "origin") ||
        (worldState.activeDestination !== "origin" && id === "origin");

      if (isMainScreenSwitch) {
        setIsFading(true);

        setTimeout(() => {
          setWorldState((prev) => ({
            ...prev,
            phase: id === "origin" ? "menu" : "destination",
            activeDestination: id,
            selectedProject: null,
            isTransitioning: true,
          }));
        }, 450);

        setTimeout(() => {
          setIsFading(false);
          handleTransitionComplete();
        }, 1000);
      } else {
        // Direct instant switch between sub-page tabs
        setWorldState((prev) => ({
          ...prev,
          phase: id === "origin" ? "menu" : "destination",
          activeDestination: id,
          selectedProject: null,
        }));
      }
    },
    [worldState.isTransitioning, worldState.activeDestination, handleTransitionComplete]
  );

  /* ── Keyboard Listeners (ESC returns to Home with Blackout Fade) ────── */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showDLCIntro) {
          setShowDLCIntro(false);
          return;
        }
        handleNavigate("origin");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNavigate, showDLCIntro]);

  const handleSelectProject = useCallback((slug: string | null) => {
    playTransitionAudio();
    setWorldState((prev) => ({
      ...prev,
      selectedProject: slug,
    }));
  }, []);

  const handleToggleSound = useCallback(() => {
    const nowPlaying = toggleBackgroundAudio();
    setWorldState((prev) => ({
      ...prev,
      soundEnabled: nowPlaying,
    }));
  }, []);

  /* ── Render ────────────────────────────────────────────────── */

  return (
    <main
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        background: "#0A1215",
      }}
    >
      {/* 1. Movie Intro Sequence */}
      {showMovieIntro && (
        <InkIntro onComplete={handleMovieIntroComplete} />
      )}

      {/* 2. DLC Cinematic Intro Sequence */}
      {showDLCIntro && (
        <DLCIntro onComplete={handleDLCIntroComplete} />
      )}

      {/* 3. 3D World Scene */}
      <WorldCanvas
        destination={worldState.activeDestination}
        isTransitioning={worldState.isTransitioning}
        onTransitionComplete={handleTransitionComplete}
        visible={!showMovieIntro && !showDLCIntro && worldState.phase !== "boot"}
      />

      {/* 4. HUD UI Overlay (Includes Boot Loading Screen + Navigation) */}
      {!showMovieIntro && !showDLCIntro && (
        <HUD
          worldState={worldState}
          onNavigate={handleNavigate}
          onSelectProject={handleSelectProject}
          onToggleSound={handleToggleSound}
          onBootComplete={handleBootComplete}
        />
      )}

      {/* 5. Solid Pitch Black Fade Veil Overlay (Only for Main Screen Switches) */}
      <AnimatePresence>
        {isFading && (
          <motion.div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "#000000",
              pointerEvents: "none",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
