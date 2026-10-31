"use client";

import React, { useEffect, useRef } from "react";

interface Grass2DCanvasProps {
  visible?: boolean;
}

interface GrassBlade {
  x: number;
  height: number;
  width: number;
  bend: number;
  stiffness: number;
  phase: number;
  colorBase: string;
  colorTip: string;
  layer: number; // 0 = back, 1 = mid, 2 = front
}

export default function Grass2DCanvas({ visible = true }: Grass2DCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = Math.floor(window.innerHeight * 0.38));

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = Math.floor(window.innerHeight * 0.38);
      generateBlades();
    };
    window.addEventListener("resize", handleResize);

    let blades: GrassBlade[] = [];

    const generateBlades = () => {
      blades = [];
      // Density scaled to screen width
      const bladeCount = Math.floor(width * 0.35);

      for (let i = 0; i < bladeCount; i++) {
        const layer = Math.random() < 0.3 ? 0 : Math.random() < 0.7 ? 1 : 2;
        const hScale = layer === 0 ? 0.5 + Math.random() * 0.3 : layer === 1 ? 0.7 + Math.random() * 0.35 : 0.9 + Math.random() * 0.4;
        const bladeHeight = height * 0.65 * hScale;

        // Tsushima Palette: Deep Ink/Sage base -> Pale Pampas Silver/Gold tip
        const isGolden = Math.random() > 0.4;
        const colorBase = layer === 0 ? "#0A1316" : layer === 1 ? "#122023" : "#1A2C30";
        const colorTip = isGolden
          ? layer === 2
            ? "#EAE3D2"
            : "#C8BD9F"
          : layer === 2
          ? "#B8C4B9"
          : "#8A998E";

        blades.push({
          x: Math.random() * width,
          height: bladeHeight,
          width: 2.5 + Math.random() * 3.5,
          bend: (Math.random() - 0.5) * 15,
          stiffness: 0.8 + Math.random() * 0.6,
          phase: Math.random() * Math.PI * 2,
          colorBase,
          colorTip,
          layer,
        });
      }

      // Sort blades by layer so back blades render first
      blades.sort((a, b) => a.layer - b.layer);
    };

    generateBlades();

    let time = 0;

    const render = () => {
      time += 0.018;

      ctx.clearRect(0, 0, width, height);

      // Global wind wave parameter
      const globalWind = Math.sin(time * 1.2) * 22 + Math.cos(time * 0.7) * 12;

      blades.forEach((b) => {
        const rootX = b.x;
        const rootY = height;

        // Sway physics calculation
        const localWind = Math.sin(time * 2.2 + b.phase + rootX * 0.005) * 14 * b.stiffness;
        const totalBend = b.bend + globalWind + localWind;

        const tipX = rootX + totalBend;
        const tipY = height - b.height;

        // Quadratic control point for natural grass curve
        const controlX = rootX + totalBend * 0.45;
        const controlY = height - b.height * 0.55;

        // Blade gradient
        const grad = ctx.createLinearGradient(rootX, rootY, tipX, tipY);
        grad.addColorStop(0, b.colorBase);
        grad.addColorStop(0.6, b.colorBase);
        grad.addColorStop(1, b.colorTip);

        // Draw curved grass blade
        ctx.beginPath();
        ctx.moveTo(rootX - b.width / 2, rootY);
        ctx.quadraticCurveTo(controlX, controlY, tipX, tipY);
        ctx.quadraticCurveTo(controlX + b.width / 2, controlY, rootX + b.width / 2, rootY);
        ctx.closePath();

        ctx.fillStyle = grad;
        ctx.fill();

        // Draw fluffy Pampas seed tuft on taller foreground blades
        if (b.layer === 2 && b.height > height * 0.45) {
          ctx.beginPath();
          ctx.arc(tipX, tipY, 2 + Math.random() * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(245, 240, 232, 0.4)";
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!visible) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "38vh",
        pointerEvents: "none",
        zIndex: 2,
        opacity: visible ? 0.92 : 0,
        transition: "opacity 1s ease",
      }}
    />
  );
}
