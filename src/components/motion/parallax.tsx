"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** [from, to] translateY over the section's scroll progress. */
  range?: [string, string];
};

/**
 * Drifts its children vertically as the nearest scroll section passes through
 * the viewport. Layer this under content for a depth effect.
 */
export function Parallax({ children, className, range = ["-6%", "6%"] }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], range);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
