"use client";

import React, { useEffect, useRef, useState } from "react";

export type TypewriterPreset = "heading" | "paragraph" | "caption" | "nav" | "fast";

interface TypewriterTextProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div" | "label";
  className?: string;
  preset?: TypewriterPreset;
  speedMs?: number; // Override character typing interval in ms
  delayMs?: number; // Delay before starting typing after viewport trigger
  threshold?: number; // IntersectionObserver threshold
  cursor?: boolean;
}

const PRESET_SPEEDS: Record<TypewriterPreset, { speed: number; delay: number }> = {
  heading: { speed: 38, delay: 120 }, // Deliberate and slightly slower
  paragraph: { speed: 14, delay: 80 }, // Smooth and readable
  caption: { speed: 20, delay: 60 }, // Quick
  nav: { speed: 26, delay: 40 }, // Subtle and quick
  fast: { speed: 10, delay: 30 },
};

export function TypewriterText({
  text,
  as: Component = "span",
  className = "",
  preset = "caption",
  speedMs,
  delayMs,
  threshold = 0.15,
  cursor = false,
}: TypewriterTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Determine timing from preset or explicit props
  const presetConfig = PRESET_SPEEDS[preset] || PRESET_SPEEDS.caption;
  const finalSpeed = speedMs ?? presetConfig.speed;
  const finalDelay = delayMs ?? presetConfig.delay;

  useEffect(() => {
    // Respect user's reduced motion preference: reveal instantly
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealedCount(text.length);
      setIsComplete(true);
      return;
    }

    const elem = containerRef.current;
    if (!elem) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggered) {
            setHasTriggered(true);
            observer.disconnect();
          }
        });
      },
      { threshold, rootMargin: "0px 0px -20px 0px" }
    );

    observer.observe(elem);
    return () => observer.disconnect();
  }, [hasTriggered, threshold, text.length]);

  useEffect(() => {
    if (!hasTriggered) return;

    let intervalId: NodeJS.Timeout;

    const timeoutId = setTimeout(() => {
      let current = 0;
      intervalId = setInterval(() => {
        current += 1;
        setRevealedCount(current);
        if (current >= text.length) {
          clearInterval(intervalId);
          setIsComplete(true);
        }
      }, finalSpeed);
    }, finalDelay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [hasTriggered, text, finalSpeed, finalDelay]);

  return (
    // @ts-expect-error dynamic component type
    <Component ref={containerRef} className={className}>
      {text.split("").map((char, index) => {
        const isRevealed = index < revealedCount;
        return (
          <span
            key={index}
            style={{
              opacity: isRevealed ? 1 : 0,
              visibility: isRevealed ? "visible" : "hidden",
              transition: "opacity 0.04s ease-out",
            }}
          >
            {char}
          </span>
        );
      })}
      {cursor && hasTriggered && !isComplete && (
        <span className="inline-block w-[2px] h-[1em] bg-current ml-0.5 animate-pulse align-middle" />
      )}
    </Component>
  );
}
