"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BootSequenceProps {
  progress: number;
  tip: string;
  onComplete: () => void;
}

export default function BootSequence({ progress, tip, onComplete }: BootSequenceProps) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const isLoaded = progress >= 100;

  const handleStart = () => {
    setIsFadingOut(true);
    onComplete();
  };

  return (
    <AnimatePresence>
      {!isFadingOut && (
        <motion.div
          className="boot-screen hud-interactive"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
        >
          <motion.div
            className="boot-emblem"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            RMB
          </motion.div>

          <motion.div
            className="boot-text"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {tip}
          </motion.div>

          <motion.div
            className="boot-next-tip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Ghost of Tsushima Portfolio
          </motion.div>

          <div className="boot-spinner-container">
            {!isLoaded ? (
              <>
                <div className="boot-spinner"></div>
                <div className="boot-progress">{Math.floor(progress)}%</div>
              </>
            ) : (
              <motion.button
                onClick={handleStart}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  background: "#1A1A18",
                  color: "#F5F0E8",
                  border: "1px solid #1A1A18",
                  padding: "0.85rem 2.2rem",
                  fontSize: "0.8rem",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  cursor: "pointer",
                  borderRadius: "2px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#D12C28";
                  e.currentTarget.style.borderColor = "#D12C28";
                  e.currentTarget.style.transform = "scale(1.03)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#1A1A18";
                  e.currentTarget.style.borderColor = "#1A1A18";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                START THE EXPERIENCE
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
