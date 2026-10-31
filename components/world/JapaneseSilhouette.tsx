"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Japanese Silhouette Component
 * Renders an authentic sumi-e style Japanese Samurai warrior & Torii shrine silhouette
 * with subtle atmospheric sway/breathing motion.
 */
export function JapaneseSilhouette() {
  const groupRef = useRef<THREE.Group>(null);

  // Very slight breathing and wind sway motion
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = -0.2 + Math.sin(state.clock.elapsedTime * 0.4) * 0.015;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.004;
    }
  });

  // Canvas texture generating authentic sumi-e Japanese Samurai + Torii Gate silhouette
  const silhouetteTexture = React.useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    ctx.clearRect(0, 0, 1024, 1024);

    // Dark ink fill style
    ctx.fillStyle = "#0A1012";

    // 1. Distant Mountain Silhouettes (Sumi-e wash)
    ctx.beginPath();
    ctx.moveTo(0, 700);
    ctx.quadraticCurveTo(200, 580, 450, 640);
    ctx.quadraticCurveTo(700, 520, 1024, 680);
    ctx.lineTo(1024, 1024);
    ctx.lineTo(0, 1024);
    ctx.closePath();
    ctx.fill();

    // 2. Torii Gate Silhouette (Right side)
    const tx = 760;
    const ty = 480;
    // Top Kasagi beam
    ctx.fillRect(tx - 110, ty - 15, 220, 16);
    ctx.fillRect(tx - 95, ty + 2, 190, 10);
    // Pillars
    ctx.fillRect(tx - 70, ty + 12, 18, 180);
    ctx.fillRect(tx + 52, ty + 12, 18, 180);
    // Nuki tie beam
    ctx.fillRect(tx - 85, ty + 45, 170, 12);
    // Gakuzuka center tablet
    ctx.fillRect(tx - 8, ty + 2, 16, 45);

    // 3. Samurai Warrior Silhouette (Center-right standing dramatically)
    const sx = 512;
    const sy = 440;

    // Kabuto (Helmet & Crest)
    ctx.beginPath();
    ctx.arc(sx, sy, 32, Math.PI, 0, false);
    ctx.fill();
    // Helmet Horns (Kuwagata crest)
    ctx.beginPath();
    ctx.moveTo(sx - 20, sy - 20);
    ctx.quadraticCurveTo(sx - 55, sy - 70, sx - 45, sy - 90);
    ctx.quadraticCurveTo(sx - 15, sy - 60, sx - 5, sy - 25);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(sx + 20, sy - 20);
    ctx.quadraticCurveTo(sx + 55, sy - 70, sx + 45, sy - 90);
    ctx.quadraticCurveTo(sx + 15, sy - 60, sx + 5, sy - 25);
    ctx.fill();

    // Shoulder Armor (Sode) & Body
    ctx.beginPath();
    ctx.moveTo(sx - 48, sy + 20);
    ctx.lineTo(sx + 48, sy + 20);
    ctx.lineTo(sx + 65, sy + 90);
    ctx.lineTo(sx + 35, sy + 220);
    ctx.lineTo(sx - 35, sy + 220);
    ctx.lineTo(sx - 65, sy + 90);
    ctx.closePath();
    ctx.fill();

    // Katana Sword in Hand
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#0A1012";
    ctx.beginPath();
    ctx.moveTo(sx - 25, sy + 110);
    ctx.lineTo(sx + 90, sy + 30);
    ctx.stroke();

    // 4. Subtle Ink Spatters & Bamboo Stalk Silhouettes
    ctx.fillStyle = "#0A1012";
    for (let i = 0; i < 12; i++) {
      const bx = 120 + i * 45;
      const bw = 6 + Math.random() * 4;
      ctx.fillRect(bx, 420 + (i % 3) * 20, bw, 350);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  return (
    <group ref={groupRef} position={[0.4, 0.1, 0]}>
      {/* Sumi-e Japanese Silhouette Plane */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[7.5, 7.5]} />
        <meshBasicMaterial
          map={silhouetteTexture}
          transparent={true}
          opacity={0.88}
          depthWrite={false}
        />
      </mesh>

      {/* Glowing Japanese Sun / Moon Disk behind Samurai */}
      <mesh position={[0.4, 0.6, -0.5]}>
        <circleGeometry args={[1.4, 64]} />
        <meshBasicMaterial color="#F5F0E8" opacity={0.08} transparent={true} />
      </mesh>
    </group>
  );
}
