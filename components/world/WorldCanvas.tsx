"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";

import { CinematicCamera } from "@/components/camera/CinematicCamera";
import { ParticleSystem } from "@/components/world/ParticleSystem";
import type { DestinationId } from "@/lib/types";

interface WorldCanvasProps {
  destination: DestinationId;
  isTransitioning: boolean;
  onTransitionComplete: () => void;
  visible: boolean;
}

export function WorldCanvas({
  destination,
  isTransitioning,
  onTransitionComplete,
  visible,
}: WorldCanvasProps) {
  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        opacity: visible ? 1 : 0,
        transition: "opacity 1.5s ease-in-out",
        overflow: "hidden",
      }}
    >
      {/* Loop Video Background from public folder */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          filter: "brightness(90%) contrast(105%)",
        }}
      >
        <source src="/BG-loop.mp4" type="video/mp4" />
      </video>

      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [0, 0, 4.5],
        }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        style={{ background: "transparent", position: "relative", zIndex: 1 }}
      >
        <Suspense fallback={null}>
          {/* Floating Embers / Sparks Particle Effect on top of full background */}
          <ParticleSystem windStrength={0.8} />

          {/* Camera System */}
          <CinematicCamera
            destination={destination}
            isTransitioning={isTransitioning}
            onTransitionComplete={onTransitionComplete}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
