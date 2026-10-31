"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { stopDLCIntroAudio } from "@/lib/audio-manager";

interface DLCIntroProps {
  onComplete: () => void;
}

export default function DLCIntro({ onComplete }: DLCIntroProps) {
  const [isBlackoutFading, setIsBlackoutFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const doneRef = useRef(false);

  /* ── Finish handler (idempotent with black fade) ─────────── */
  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;

    setIsBlackoutFading(true);
    stopDLCIntroAudio();

    setTimeout(() => {
      onComplete();
    }, 800);
  }, [onComplete]);

  /* ── If video ends, finish ───────────────────────────────── */
  const handleVideoEnded = useCallback(() => {
    finish();
  }, [finish]);

  return (
    <div
      className="hud-interactive"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        backgroundColor: "#000000",
        overflow: "hidden",
      }}
    >
      {/* DLC Intro Video */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        onEnded={handleVideoEnded}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          backgroundColor: "#000000",
        }}
      >
        <source src="/DLC-intro.mp4" type="video/mp4" />
      </video>

      {/* Circular Skip Button positioned directly over the Gemini star watermark */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          finish();
        }}
        style={{
          position: "absolute",
          bottom: "10.8%",
          right: "8.3%",
          transform: "translate(50%, 50%)",
          width: "76px",
          height: "76px",
          borderRadius: "50%",
          background: "#080E10",
          border: "1.5px solid rgba(245, 240, 232, 0.45)",
          color: "rgba(245, 240, 232, 0.9)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2px",
          cursor: "pointer",
          zIndex: 110,
          boxShadow: "0 0 30px 12px #000000",
          transition: "all 0.3s cubic-bezier(0.2, 0, 0, 1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#FFFFFF";
          e.currentTarget.style.borderColor = "#D12C28";
          e.currentTarget.style.background = "#141C1E";
          e.currentTarget.style.transform = "translate(50%, 50%) scale(1.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(245, 240, 232, 0.9)";
          e.currentTarget.style.borderColor = "rgba(245, 240, 232, 0.45)";
          e.currentTarget.style.background = "#080E10";
          e.currentTarget.style.transform = "translate(50%, 50%) scale(1)";
        }}
      >
        <span
          style={{
            fontSize: "0.58rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          SKIP
        </span>
        <span
          style={{
            fontSize: "0.52rem",
            fontWeight: 500,
            letterSpacing: "0.18em",
            opacity: 0.75,
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          INTRO
        </span>
      </button>

      {/* Fade away black screen overlay */}
      <AnimatePresence>
        {isBlackoutFading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "#000000",
              zIndex: 120,
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
