"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function KatanaMonument() {
  const groupRef = useRef<THREE.Group>(null);

  // Subtle natural wind sway
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = -0.32 + Math.sin(state.clock.elapsedTime * 0.8) * 0.005;
      groupRef.current.rotation.x = 0.22 + Math.cos(state.clock.elapsedTime * 0.6) * 0.005;
    }
  });

  return (
    <group ref={groupRef} position={[1.15, -0.08, 1.6]} rotation={[0.22, -0.35, -0.32]} scale={[1.15, 1.15, 1.15]}>
      {/* Blade (Steeped into the pampas grass hill) */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.022, 1.8, 0.075]} />
        <meshStandardMaterial
          color="#BAC6C8"
          metalness={0.95}
          roughness={0.15}
          envMapIntensity={1.8}
        />
      </mesh>

      {/* Blade Edge Highlight / Curved Hamon Line */}
      <mesh position={[0.006, 0.4, 0.035]}>
        <boxGeometry args={[0.004, 1.78, 0.01]} />
        <meshBasicMaterial color="#FFFFFF" opacity={0.9} transparent />
      </mesh>

      {/* Tsuba (Sword Guard) */}
      <mesh position={[0, 1.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.022, 24]} />
        <meshStandardMaterial color="#1C1815" metalness={0.85} roughness={0.35} />
      </mesh>

      {/* Tsuka (White Handle Wrap Base) */}
      <mesh position={[0, 1.68, 0]}>
        <cylinderGeometry args={[0.034, 0.036, 0.76, 16]} />
        <meshStandardMaterial color="#F4F0EA" roughness={0.5} />
      </mesh>

      {/* Black Handle Wrap Diamonds (Tsuka-maki) */}
      {[1.38, 1.48, 1.58, 1.68, 1.78, 1.88, 1.98].map((y, idx) => (
        <group key={idx} position={[0, y, 0]} rotation={[0, (idx * Math.PI) / 3, 0]}>
          <mesh rotation={[0.2, 0, 0]}>
            <torusGeometry args={[0.035, 0.007, 8, 16]} />
            <meshStandardMaterial color="#0C1012" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Kashira (Sword Handle Pommel Cap) */}
      <mesh position={[0, 2.06, 0]}>
        <cylinderGeometry args={[0.036, 0.033, 0.045, 16]} />
        <meshStandardMaterial color="#101416" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Menuki (Ornamental Hilt Fitting) */}
      <mesh position={[0.035, 1.68, 0]}>
        <boxGeometry args={[0.012, 0.05, 0.02]} />
        <meshStandardMaterial color="#C6A36B" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Ambient Cool Light on Sword Handle */}
      <pointLight position={[0.2, 1.8, 0.3]} intensity={0.6} color="#D8E4E8" distance={2.5} />
    </group>
  );
}
