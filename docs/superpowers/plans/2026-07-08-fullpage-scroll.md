# Full-viewport Soft-Snap Scroll with Parallax — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every page settle onto full-viewport sections as the visitor scrolls (soft snap), replay each section's entrance animation on entry, and add background + image parallax depth.

**Architecture:** Reuse the already-installed Lenis smooth-scroll and its `lenis/snap` module for proximity snapping (native CSS scroll-snap conflicts with Lenis, so we snap at the Lenis layer). A React context exposes the `Snap` instance; a `SnapSection` wrapper registers each top-level section as a snap target and gives it a full-viewport centered layout. Parallax is driven independently by `motion/react`'s `useScroll`/`useTransform`, which read Lenis's real scroll position. Entrance-animation replay comes from flipping the existing `Reveal`/`StaggerGroup` components to `once: false`.

**Tech Stack:** Next.js 16.2.9 (App Router), React 19, TypeScript, Tailwind CSS v4, `motion` 12.42 (`motion/react`), `lenis` 1.3.25 (+ `lenis/snap`).

## Global Constraints

- Next.js 16.2.9 / React 19, App Router. Read `node_modules/next/dist/docs/` before writing Next.js code (per `AGENTS.md`).
- Node ≥ 20. `@/*` path alias → `src/*`.
- **No test framework is configured** (no jest/vitest, no `test` script). Verification is `npm run build`, `npm run lint`, and exercising the running app. This plan uses those as its test cycle instead of unit tests.
- The app serves a **production build under pm2** (process name `asicorp`, port **3001**, domain `asicorprd.com`). To see changes: `npm run build && pm2 restart asicorp`.
- Content is Spanish (es-DO). Use `cn()` (`src/lib/utils.ts`) for class composition. Motion package is `motion/react` (not `framer-motion`).
- Work happens on branch `feature/fullpage-scroll`. Checkpoint `54d310c` is the restore point and must stay untouched.
- Everything must degrade gracefully under `prefers-reduced-motion: reduce` (snap + parallax off, normal scroll) — the existing Lenis setup already bails out under reduced motion.

---

## File Structure

- `src/components/motion/snap-context.ts` — **new.** React context + `useSnap()` hook exposing the Lenis `Snap` instance.
- `src/components/providers.tsx` — **modify.** Instantiate `Snap` alongside Lenis, wrap `MotionConfig`, provide the context.
- `src/components/motion/snap-section.tsx` — **new.** Full-viewport wrapper that registers its element with `Snap` and centers content.
- `src/components/motion/parallax.tsx` — **new.** `<Parallax>` wrapper using `useScroll`/`useTransform`.
- `src/components/motion/reveal.tsx` — **modify.** Flip `Reveal`/`StaggerGroup` to replay on re-entry (`once: false`).
- `src/app/page.tsx` — **modify.** Wrap homepage sections in `SnapSection`.
- `src/components/home/hero-foto.tsx` — **modify.** Apply parallax to bg layers + banner image.
- `src/app/servicios/page.tsx`, `nosotros/page.tsx`, `contacto/page.tsx`, `evaluacion/page.tsx` — **modify.** Wrap top-level sections in `SnapSection`.
- `src/app/globals.css` — **modify.** `scroll-padding-top` + reduced-motion guard.

---

### Task 1: Lenis `Snap` context foundation

**Files:**
- Create: `src/components/motion/snap-context.ts`
- Modify: `src/components/providers.tsx`

**Interfaces:**
- Produces: `SnapContext` (React context of `Snap | null`) and `useSnap(): Snap | null` from `snap-context.ts`. `Snap` is the default export of `lenis/snap`. `Providers` now provides a live `Snap` instance (or `null` under reduced motion) to descendants.

- [ ] **Step 1: Create the context module**

Create `src/components/motion/snap-context.ts`:

```ts
"use client";

import { createContext, useContext } from "react";
import type Snap from "lenis/snap";

/** Live Lenis Snap instance, or null (reduced motion / not yet mounted). */
export const SnapContext = createContext<Snap | null>(null);

export function useSnap(): Snap | null {
  return useContext(SnapContext);
}
```

- [ ] **Step 2: Refactor `providers.tsx` to create Snap and provide the context**

Replace the entire contents of `src/components/providers.tsx` with:

```tsx
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
```

- [ ] **Step 3: Verify the build compiles and types resolve**

Run: `npm run build`
Expected: `✓ Compiled successfully`, TypeScript finishes with no errors. (If `lenis/snap` types fail to resolve, confirm the import path against `node_modules/lenis/dist/lenis-snap.d.ts` — it is the package's `./snap` export.)

- [ ] **Step 4: Verify lint passes**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 5: Verify smooth scroll still works in the running app**

Run: `pm2 restart asicorp` then load `https://asicorprd.com/` and scroll.
Expected: page still scrolls smoothly (Lenis active); no console errors. Nothing snaps yet (no sections registered) — that is correct at this stage.

- [ ] **Step 6: Commit**

```bash
git add src/components/motion/snap-context.ts src/components/providers.tsx
git commit -m "feat(scroll): add Lenis Snap context foundation"
```

---

### Task 2: `SnapSection` wrapper + global scroll padding

**Files:**
- Create: `src/components/motion/snap-section.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `useSnap()` from Task 1.
- Produces: `SnapSection` component — `{ children: ReactNode; className?: string }`. Renders a `<div data-snap-section>` that is `min-h-screen`, vertically centers its content, and registers itself as a proximity snap target (desktop only). Later tasks wrap page sections with it.

- [ ] **Step 1: Create the `SnapSection` component**

Create `src/components/motion/snap-section.tsx`:

```tsx
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
```

- [ ] **Step 2: Add scroll padding + reduced-motion guard to globals**

In `src/app/globals.css`, find the `@theme`/base layer near the top where global element styles live (search for `html` or `body`). Add this block (place it after the existing base styles, e.g. right before the first `@utility`):

```css
html {
  /* Snapped section tops clear the fixed navbar (~5rem tall). */
  scroll-padding-top: 5rem;
}

@media (prefers-reduced-motion: reduce) {
  [data-snap-section] {
    min-height: 0;
  }
}
```

- [ ] **Step 3: Verify build compiles**

Run: `npm run build`
Expected: `✓ Compiled successfully`, no TypeScript errors.

- [ ] **Step 4: Verify lint passes**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/motion/snap-section.tsx src/app/globals.css
git commit -m "feat(scroll): add SnapSection wrapper and scroll-padding"
```

---

### Task 3: Adopt `SnapSection` on the homepage

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `SnapSection` from Task 2.
- Produces: homepage sections rendered as full-viewport snap targets. No new exports.

- [ ] **Step 1: Wrap each homepage section in `SnapSection`**

Replace the entire contents of `src/app/page.tsx` with:

```tsx
import { HeroFoto } from "@/components/home/hero-foto";
import { EjemploReal } from "@/components/home/ejemplo-real";
import {
  Benefits,
  CTASection,
  ComoFunciona,
  PorQueAsicorp,
  Sectores,
  StatsBand,
} from "@/components/home/sections";
import { SnapSection } from "@/components/motion/snap-section";

export default function Home() {
  return (
    <>
      <SnapSection>
        <HeroFoto />
      </SnapSection>
      <SnapSection>
        <EjemploReal />
      </SnapSection>
      <SnapSection>
        <StatsBand />
      </SnapSection>
      <SnapSection>
        <Benefits />
      </SnapSection>
      <SnapSection>
        <Sectores />
      </SnapSection>
      <SnapSection>
        <ComoFunciona />
      </SnapSection>
      <SnapSection>
        <PorQueAsicorp />
      </SnapSection>
      <SnapSection>
        <CTASection />
      </SnapSection>
    </>
  );
}
```

- [ ] **Step 2: Build and restart**

Run: `npm run build && pm2 restart asicorp`
Expected: build succeeds; process restarts online.

- [ ] **Step 3: Verify snapping behavior in the browser**

Load `https://asicorprd.com/` on a desktop-width window and scroll slowly with a trackpad/mouse wheel.
Expected:
- Each section fills the viewport height; content is vertically centered.
- When you stop scrolling near a section boundary, the page gently settles onto the nearest section (proximity snap) — it does NOT hard-jump or trap you mid-scroll.
- Scrolling continuously still works normally (you can scroll past sections).
Note: if a thin section (e.g. StatsBand) looks too empty as a full viewport, that is a tuning decision to raise later — not a defect. Flag it for the review checkpoint.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(scroll): adopt SnapSection on homepage"
```

---

### Task 4: Replay entrance animations on every entry

**Files:**
- Modify: `src/components/motion/reveal.tsx`

**Interfaces:**
- Produces: `Reveal` now defaults to `once = false`; `StaggerGroup` gains an `once?: boolean` prop defaulting to `false`. `StaggerItem` and variants unchanged. Because `motion`'s `whileInView` animates without unmounting, form/input state inside these wrappers is preserved across replays.

- [ ] **Step 1: Update `Reveal` and `StaggerGroup` to replay by default**

Replace the entire contents of `src/components/motion/reveal.tsx` with:

```tsx
"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const easing = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easing } },
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
};

export function Reveal({ children, className, delay = 0, y = 26, once = false }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.7, ease: easing, delay }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerGroup({
  children,
  className,
  once = false,
}: {
  children: ReactNode;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Build and restart**

Run: `npm run build && pm2 restart asicorp`
Expected: build succeeds; process online.

- [ ] **Step 3: Verify replay behavior**

Load `https://asicorprd.com/`, scroll down two sections, then back up, then down again.
Expected: each section's content fades/slides in again each time it re-enters the viewport (not just the first time).

- [ ] **Step 4: Verify reduced-motion still animates statically**

In browser devtools, emulate `prefers-reduced-motion: reduce` (Rendering tab), reload.
Expected: content is visible (no motion), page scrolls normally, no snapping. (`MotionConfig reducedMotion="user"` from Task 1 suppresses transform/opacity animation.)

- [ ] **Step 5: Commit**

```bash
git add src/components/motion/reveal.tsx
git commit -m "feat(scroll): replay reveal animations on re-entry"
```

---

### Task 5: Parallax helper + hero parallax (backgrounds + image)

**Files:**
- Create: `src/components/motion/parallax.tsx`
- Modify: `src/components/home/hero-foto.tsx`

**Interfaces:**
- Consumes: nothing from prior tasks (reads Lenis scroll via `motion/react`).
- Produces: `Parallax` component — `{ children: ReactNode; className?: string; range?: [string, string] }`. Wraps children in a `motion.div` whose `y` maps section scroll progress (`offset: ["start end", "end start"]`) to `range` (default `["-6%", "6%"]`). Respects reduced motion via the global `MotionConfig`.

- [ ] **Step 1: Create the `Parallax` component**

Create `src/components/motion/parallax.tsx`:

```tsx
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
```

- [ ] **Step 2: Apply parallax to the hero background layers**

In `src/components/home/hero-foto.tsx`, add the import at the top with the other imports:

```tsx
import { Parallax } from "@/components/motion/parallax";
```

Then wrap the two blurred blob layers (the two `<div>`s with `bg-[radial-gradient(...)] ... blur-3xl` immediately after the `line-texture` div) in a single `Parallax`. Replace:

```tsx
      <div className="pointer-events-none absolute -left-40 -top-20 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,var(--brand-blue)_0%,transparent_62%)] opacity-[0.16] blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-32 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,var(--brand-navy)_0%,transparent_62%)] opacity-[0.14] blur-3xl" />
```

with:

```tsx
      <Parallax className="pointer-events-none absolute inset-0" range={["-10%", "10%"]}>
        <div className="pointer-events-none absolute -left-40 -top-20 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,var(--brand-blue)_0%,transparent_62%)] opacity-[0.16] blur-3xl" />
        <div className="pointer-events-none absolute -right-40 top-32 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,var(--brand-navy)_0%,transparent_62%)] opacity-[0.14] blur-3xl" />
      </Parallax>
```

- [ ] **Step 3: Apply a subtler parallax to the banner image**

Still in `src/components/home/hero-foto.tsx`, find the banner frame:

```tsx
          <div className="relative aspect-[2136/1506] w-full overflow-hidden rounded-3xl border border-border bg-card shadow-lift">
            <Image
              src="/asicorp_banner.jpg"
              alt="Estetoscopio, calculadora y la firma de un acuerdo: factoring médico y comercial de Asicorp"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
```

Wrap the `<Image>` in a `Parallax` that slightly over-scales so the drift never exposes an edge:

```tsx
          <div className="relative aspect-[2136/1506] w-full overflow-hidden rounded-3xl border border-border bg-card shadow-lift">
            <Parallax className="absolute inset-0 scale-110" range={["-5%", "5%"]}>
              <Image
                src="/asicorp_banner.jpg"
                alt="Estetoscopio, calculadora y la firma de un acuerdo: factoring médico y comercial de Asicorp"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </Parallax>
          </div>
```

- [ ] **Step 4: Build and restart**

Run: `npm run build && pm2 restart asicorp`
Expected: build succeeds; process online.

- [ ] **Step 5: Verify parallax depth**

Load `https://asicorprd.com/` and scroll through the hero.
Expected: the blurred color blobs and the banner image drift at a slightly different rate than the foreground text, creating depth. The banner's `scale-110` + `overflow-hidden` frame means no white edge is ever exposed as the image shifts. No layout shift or jank.

- [ ] **Step 6: Commit**

```bash
git add src/components/motion/parallax.tsx src/components/home/hero-foto.tsx
git commit -m "feat(scroll): add parallax helper and hero parallax"
```

---

### Task 6: Roll out `SnapSection` to remaining pages

**Files:**
- Modify: `src/app/servicios/page.tsx`, `src/app/nosotros/page.tsx`, `src/app/contacto/page.tsx`, `src/app/evaluacion/page.tsx`

**Interfaces:**
- Consumes: `SnapSection` from Task 2.
- Produces: each page's top-level `<section>` elements wrapped as snap targets. Form-bearing sections rely on `min-h-screen` (not fixed height) so they scroll internally rather than trapping the user.

Each of these pages has the shape `export default function X() { return (<div className="pb-24">{...top-level <section>s...}</div>); }`. For each page: import `SnapSection` and wrap **each direct `<section>` child** of the outer `<div>` individually — do not wrap the outer `<div>`. Leave the `<section>` elements and their `id`/`scroll-mt` attributes intact (in-page anchors keep working).

- [ ] **Step 1: Wrap sections on `servicios/page.tsx`**

Add to the imports at the top of `src/app/servicios/page.tsx`:

```tsx
import { SnapSection } from "@/components/motion/snap-section";
```

Then wrap each top-level `<section>...</section>` inside the outer `<div className="pb-24">` with `<SnapSection>...</SnapSection>`. For example, the hero section becomes:

```tsx
      <SnapSection>
        <section className="relative overflow-hidden pt-32 md:pt-40">
          {/* ...unchanged inner content... */}
        </section>
      </SnapSection>
```

Repeat for every direct `<section>` child of the outer `<div>`.

- [ ] **Step 2: Wrap sections on `nosotros/page.tsx`**

Same pattern: add the `SnapSection` import and wrap each top-level `<section>` in `src/app/nosotros/page.tsx`.

- [ ] **Step 3: Wrap sections on `contacto/page.tsx`**

Same pattern in `src/app/contacto/page.tsx`. The section containing the contact form is tall; because `SnapSection` uses `min-h-screen`, it will scroll internally rather than trap the user — do not add any fixed height.

- [ ] **Step 4: Wrap sections on `evaluacion/page.tsx`**

Same pattern in `src/app/evaluacion/page.tsx`. The evaluation form section is tall; same `min-h-screen` reasoning as contacto.

- [ ] **Step 5: Build and restart**

Run: `npm run build && pm2 restart asicorp`
Expected: build succeeds; process online.

- [ ] **Step 6: Verify each page**

Load each of `https://asicorprd.com/servicios`, `/nosotros`, `/contacto`, `/evaluacion` on desktop width.
Expected:
- Sections snap softly like the homepage.
- On `/contacto` and `/evaluacion`, the form section is fully reachable — you can scroll through the whole form; it is NOT trapped or clipped, and you can still submit.
- In-page anchor links (e.g. `/servicios#factoring`) still jump to the right section.

- [ ] **Step 7: Commit**

```bash
git add src/app/servicios/page.tsx src/app/nosotros/page.tsx src/app/contacto/page.tsx src/app/evaluacion/page.tsx
git commit -m "feat(scroll): roll out SnapSection to remaining pages"
```

---

### Task 7: Reduced-motion, mobile, and final verification

**Files:**
- No new files. Verification and any small fixes surfaced below.

**Interfaces:**
- Consumes: everything from Tasks 1–6. Produces the finished, verified feature.

- [ ] **Step 1: Verify reduced-motion end to end**

In devtools, emulate `prefers-reduced-motion: reduce`, reload `https://asicorprd.com/`.
Expected: no Lenis smooth scroll, no snapping, no parallax drift, no entrance animation — content static and fully readable, native scrolling. (Providers bails out of Lenis/Snap under reduced motion; `[data-snap-section]` drops its `min-height` via the globals guard; `MotionConfig reducedMotion="user"` neutralizes motion.)

- [ ] **Step 2: Verify mobile behavior**

In devtools, emulate a phone viewport (e.g. iPhone), reload the homepage and `/contacto`.
Expected: no snapping (SnapSection skips registration under 768px), normal touch scrolling, reduced/no parallax jank, forms fully usable.

- [ ] **Step 3: Verify keyboard + anchor navigation**

On desktop, tab through interactive elements and use the navbar's in-page links.
Expected: focus moves normally, in-page anchors scroll to the right section, snapping does not fight keyboard navigation.

- [ ] **Step 4: Full production verification**

Run: `npm run build && npm run lint && pm2 restart asicorp`
Expected: build `✓ Compiled successfully`, lint clean, process online. Load the site and confirm the whole flow feels right.

- [ ] **Step 5: Final commit (if any fixes were needed)**

```bash
git add -A
git commit -m "fix(scroll): reduced-motion and mobile polish"
```

(If Steps 1–4 needed no changes, skip this commit.)

---

## Notes for the reviewer / tuning knobs

- **Proximity vs mandatory:** `Snap` is configured `type: "proximity"` in `providers.tsx`. If the client wants a firmer "always lands exactly on a section" feel, change to `type: "mandatory"` there — one line.
- **Snap firmness:** `distanceThreshold: "25%"` and `duration: 0.9` in `providers.tsx` control how eagerly and how fast it snaps.
- **Parallax intensity:** the `range` prop on each `Parallax` (e.g. `["-10%","10%"]`) controls drift distance.
- **Thin sections:** if `StatsBand` or `PorQueAsicorp` feel empty as a full viewport, either group two into one `SnapSection` or exclude them by rendering them without the wrapper — the per-section structure makes this a one-line change.
