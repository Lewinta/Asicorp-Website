"use client";

import { useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import Snap from "lenis/snap";
import { MotionConfig } from "motion/react";
import { SnapContext } from "@/components/motion/snap-context";

/* ---------------- Smooth scroll (Lenis) + section snap ---------------- */

function SmoothScroll({ children }: { children: ReactNode }) {
  const [snap, setSnap] = useState<Snap | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const snapInstance = new Snap(lenis, {
      type: "proximity",
      distanceThreshold: "25%",
      duration: 0.9,
    });
    // Snap is an externally constructed resource that can only exist post-mount;
    // setting it here is what makes it available reactively via SnapContext, not
    // derivable during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSnap(snapInstance);

    let raf = 0;
    function frame(time: number) {
      lenis.raf(time);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      snapInstance.destroy();
      lenis.destroy();
      setSnap(null);
    };
  }, []);

  return <SnapContext.Provider value={snap}>{children}</SnapContext.Provider>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>{children}</SmoothScroll>
    </MotionConfig>
  );
}
