"use client";

import React, { useRef } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Golden Samurai Background Component
 * Fits public/bg.jpeg perfectly to 100% of the screen viewport width and height.
 */
export function GoldenSamuraiBackground() {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // Load user's new background image asset from public/bg.jpeg
  const texture = useLoader(THREE.TextureLoader, "/bg.jpeg");

  // Subtle floating motion
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.015;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Background Plane fit 100% to viewport screen dimensions */}
      <mesh position={[0, 0, -2]}>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial map={texture} depthWrite={false} />
      </mesh>
    </group>
  );
}
