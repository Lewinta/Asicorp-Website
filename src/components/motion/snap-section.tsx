"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useSnap } from "@/components/motion/snap-context";
import { cn } from "@/lib/utils";

type SnapSectionProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Full-viewport section that soft-snaps into place.
 * - `min-h-screen` (not fixed height) so taller content scrolls internally.
 * - Registers with the Lenis Snap instance on desktop only.
 */
export function SnapSection({ children, className }: SnapSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const snap = useSnap();

  useEffect(() => {
    if (!snap || !ref.current) return;
    // Skip snapping on small screens — momentum + snap feels janky on touch.
    if (!window.matchMedia("(min-width: 768px)").matches) return;

    const remove = snap.addElement(ref.current, { align: ["start"] });
    return remove;
  }, [snap]);

  return (
    <div
      ref={ref}
      data-snap-section
      className={cn(
        "flex min-h-screen w-full flex-col justify-center",
        className,
      )}
    >
      {children}
    </div>
  );
}
