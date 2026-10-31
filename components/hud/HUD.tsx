"use client";

import React, { useEffect, useState } from 'react';
import { WorldState, DestinationId } from '@/lib/types';
import { projects, journeyStages, contactInfo, loadingTips } from '@/lib/world-data';

import BootSequence from './BootSequence';
import NavigationMenu from './NavigationMenu';
import DedicatedPageOverlay from './DedicatedPageOverlay';
import DLCGallery from './DLCGallery';
import SoundToggle from './SoundToggle';

interface HUDProps {
  worldState: WorldState;
  onNavigate: (id: DestinationId) => void;
  onSelectProject: (slug: string | null) => void;
  onToggleSound: () => void;
  onBootComplete: () => void;
}

export default function HUD({
  worldState,
  onNavigate,
  onSelectProject,
  onToggleSound,
  onBootComplete
}: HUDProps) {
  const { phase, activeDestination, selectedProject, soundEnabled, bootProgress, isTransitioning } = worldState;

  // Hydration-safe random tip selection
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    // Pick random tip after client mount to prevent SSR hydration mismatch
    const randomIndex = Math.floor(Math.random() * loadingTips.length);
    setTipIndex(randomIndex);
  }, []);

  const currentTip = loadingTips[tipIndex] || loadingTips[0];

  return (
    <div className="hud">
      {/* Ghost of Tsushima Loading / Tip Screen */}
      {phase === 'boot' && (
        <BootSequence 
          progress={bootProgress} 
          tip={currentTip} 
          onComplete={onBootComplete} 
        />
      )}

      {/* Main Home & Dedicated Sub-Pages UI */}
      {phase !== 'boot' && (
        <>
          {/* Main Home Screen Title Menu (Visible on origin screen) */}
          {activeDestination === 'origin' && (
            <NavigationMenu 
              activeDestination={activeDestination} 
              isTransitioning={isTransitioning} 
              onNavigate={onNavigate} 
            />
          )}
          
          {/* DLC Gallery Full Overlay */}
          {activeDestination === 'dlc' && (
            <DLCGallery
              onNavigate={onNavigate}
              onReturnHome={() => {
                onSelectProject(null);
                onNavigate('origin');
              }}
            />
          )}

          {/* Dedicated Sub-Pages Full Overlay (for non-DLC destinations) */}
          {activeDestination !== 'dlc' && (
            <DedicatedPageOverlay 
              activeDestination={activeDestination}
              projects={projects}
              selectedProject={selectedProject}
              onSelectProject={onSelectProject}
              journeyStages={journeyStages}
              contactInfo={contactInfo}
              onNavigate={onNavigate}
              onReturnHome={() => {
                onSelectProject(null);
                onNavigate('origin');
              }}
            />
          )}

          {/* Sound Toggle (Only visible on Home Screen) */}
          {activeDestination === 'origin' && (
            <SoundToggle 
              enabled={soundEnabled} 
              onToggle={onToggleSound} 
            />
          )}
        </>
      )}
    </div>
  );
}
