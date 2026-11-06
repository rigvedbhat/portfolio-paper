"use client";

import React, { useMemo, useRef } from "react";
import {
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

import { cn } from "@/lib/utils";

export interface DockItemData {
  link: string;
  Icon: React.ReactNode;
  target?: string;
  rel?: string;
}

export interface AnimatedDockProps {
  className?: string;
  items: DockItemData[];
}

type DockItemProps = {
  item: DockItemData;
  mouseX: MotionValue<number>;
};

const springConfig = {
  mass: 0.18,
  stiffness: 220,
  damping: 18,
};

function getAriaLabel(link: string) {
  if (link.startsWith("mailto:")) {
    return "Email";
  }

  if (link.includes("linkedin.com")) {
    return "LinkedIn";
  }

  if (link.includes("Cruxy---ModVerse")) {
    return "Featured project";
  }

  if (link.includes("github.com")) {
    return "GitHub";
  }

  return "Social link";
}

function DockItem({ item, mouseX }: DockItemProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  const distance = useTransform(mouseX, (value) => {
    const bounds = ref.current?.getBoundingClientRect();

    if (!bounds) {
      return Infinity;
    }

    return value - bounds.left - bounds.width / 2;
  });

  const width = useSpring(
    useTransform(distance, [-160, 0, 160], [52, 82, 52]),
    springConfig
  );
  const scale = useSpring(
    useTransform(distance, [-160, 0, 160], [1, 1.28, 1]),
    springConfig
  );

  const rel = useMemo(() => {
    if (item.rel) {
      return item.rel;
    }

    return item.target === "_blank" ? "noopener noreferrer" : undefined;
  }, [item.rel, item.target]);

  return (
    <motion.a
      ref={ref}
      href={item.link}
      target={item.target}
      rel={rel}
      aria-label={getAriaLabel(item.link)}
      style={{ width, height: width }}
      className="group relative flex shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white shadow-[0_18px_48px_rgba(0,0,0,0.35)] outline-none transition-colors hover:border-cyan-300/40 focus-visible:border-cyan-300/60"
    >
      <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.28),transparent_70%)] opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
      <motion.span
        style={{ scale }}
        className="relative z-10 flex items-center justify-center"
      >
        {item.Icon}
      </motion.span>
    </motion.a>
  );
}

export function AnimatedDock({ className, items }: AnimatedDockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(event) => mouseX.set(event.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto flex items-end gap-3 rounded-[28px] border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl",
        className
      )}
    >
      {items.map((item) => (
        <DockItem key={item.link} item={item} mouseX={mouseX} />
      ))}
    </motion.div>
  );
}
