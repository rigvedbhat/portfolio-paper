"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { DestinationId } from '@/lib/types';
import { destinations } from '@/lib/world-data';

interface NavigationMenuProps {
  activeDestination: DestinationId;
  isTransitioning: boolean;
  onNavigate: (id: DestinationId) => void;
}

export default function NavigationMenu({
  activeDestination,
  isTransitioning,
  onNavigate
}: NavigationMenuProps) {
  // hoveredDestination: string | null. When null, defaults back to activeDestination.
  const [hoveredDestination, setHoveredDestination] = useState<DestinationId | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // The destination that currently gets the brushstroke banner
  const currentBannerId = hoveredDestination ?? activeDestination;

  return (
    <div
      className="hud-interactive"
      style={{
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        opacity: isTransitioning ? 0.5 : (isScrolled ? 0 : 1),
        transform: isScrolled ? 'translateY(-12px)' : 'translateY(0)',
        pointerEvents: (isTransitioning || isScrolled) ? 'none' : 'auto'
      }}
    >
      {/* Title Screen Top Header */}
      <div className="nav-header">
        <div className="nav-name">RIGVED BHAT</div>
        <div className="nav-meta">PORTFOLIO / 2026</div>
      </div>

      {/* Main Home Title Screen Navigation Menu */}
      <nav
        className="nav-menu"
        onMouseLeave={() => setHoveredDestination(null)}
      >
        {destinations.map((dest) => {
          const isActive = activeDestination === dest.id;
          const isBannerActive = currentBannerId === dest.id;

          return (
            <button
              key={dest.id}
              className={`nav-item ${isActive ? 'active' : ''} ${isBannerActive ? 'highlighted' : ''}`}
              onClick={() => onNavigate(dest.id as DestinationId)}
              onMouseEnter={() => setHoveredDestination(dest.id as DestinationId)}
              disabled={isTransitioning}
              style={{
                zIndex: isBannerActive ? 2 : 1,
              }}
            >
              {/* Sliding Shared Brushstroke Banner */}
              {isBannerActive && (
                <motion.div
                  layoutId="nav-brushstroke-banner"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 32,
                  }}
                  style={{
                    position: "absolute",
                    top: "-11px",
                    bottom: "-11px",
                    left: "-18px",
                    width: "350px",
                    backgroundImage: "url('/brushstroke-banner.png')",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "100% 100%",
                    pointerEvents: "none",
                    zIndex: 0,
                    filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4))",
                  }}
                />
              )}

              <span className="nav-item-text">{dest.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
