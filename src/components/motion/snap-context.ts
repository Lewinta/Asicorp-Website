"use client";

import { createContext, useContext } from "react";
import type Snap from "lenis/snap";

/** Live Lenis Snap instance, or null (reduced motion / not yet mounted). */
export const SnapContext = createContext<Snap | null>(null);

export function useSnap(): Snap | null {
  return useContext(SnapContext);
}
