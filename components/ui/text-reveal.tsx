"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";

import { cn } from "@/lib/utils";

type TextRevealByWordProps = {
  text: string;
  className?: string;
};

type WordProps = {
  children: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
};

function Word({ children, progress, range }: WordProps) {
  const opacity = useTransform(progress, range, [0, 1]);

  return (
    <span className="relative mx-1.5 my-1.5 inline-block md:mx-2">
      <span className="text-black/20 dark:text-white/20">{children}</span>
      <motion.span
        style={{ opacity }}
        className="absolute inset-0 text-black dark:text-white"
      >
        {children}
      </motion.span>
    </span>
  );
}

/**
 * offset: ["start start", "end start"]
 *   progress 0 → target top at viewport top
 *   progress 1 → target bottom at viewport top
 *   total scroll = container height (500vh)
 *
 * sticky lasts for: container height − viewport height = 400vh
 *   progress at sticky end = 400 / 500 = 0.8
 *
 * Words are mapped from 0 → 0.75 so they all finish
 * well before the sticky unpins at 0.8.
 */
const REVEAL_END = 0.75;

export function TextRevealByWord({
  text,
  className,
}: TextRevealByWordProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const words = useMemo(() => text.split(" "), [text]);

  return (
    <div
      ref={containerRef}
      className={cn("relative z-0 h-[500vh] w-full pointer-events-none", className)}
    >
      <div className="sticky top-0 flex h-screen items-center justify-center px-6 sm:px-10 lg:px-16">
        <p className="mx-auto flex max-w-6xl flex-wrap justify-center text-center text-3xl font-black leading-tight tracking-[-0.04em] text-black/20 dark:text-white/20 sm:text-4xl lg:text-6xl">
          {words.map((word, index) => {
            const start = (index / words.length) * REVEAL_END;
            const end = ((index + 1) / words.length) * REVEAL_END;

            return (
              <Word
                key={`${word}-${index}`}
                progress={scrollYProgress}
                range={[start, end]}
              >
                {word}
              </Word>
            );
          })}
        </p>
      </div>
    </div>
  );
}
