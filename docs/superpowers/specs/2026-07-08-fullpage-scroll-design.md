# Full-viewport soft-snap scroll with parallax — Design

**Date:** 2026-07-08
**Branch:** `feature/fullpage-scroll` (off checkpoint `54d310c` on `feature/hero-foto`)
**App:** `asicorp-website` (Next.js 16.2.9, React 19, Tailwind v4, `motion/react`, Lenis smooth scroll)

## Goal

Make the site read as "one full section at a time." As the visitor scrolls,
the page settles onto full-viewport sections, each section re-plays its
entrance animations, and background + image layers drift with a parallax
depth effect. Applies to every page.

## Decisions (locked)

| Question | Decision |
|----------|----------|
| Scope | Every page: home, servicios, nosotros, contacto, evaluación |
| Scroll feel | **Soft snap** — native CSS scroll-snap, not scroll-jacking |
| Entrance animations | **Replay every time** a section enters the viewport |
| Parallax | **Backgrounds + imagery** — bg layers drift; key images shift in-frame |
| Reduced motion | Snap + parallax disabled; normal scroll fallback |
| Mobile | Snapping softened/disabled; parallax travel reduced |
| Safety | New branch; checkpoint `54d310c` untouched |

## Architecture

### 1. Snap mechanism
- Scroll container: `scroll-snap-type: y proximity`.
  - **Proximity, not mandatory** — locks to a section when the user settles
    near one, never traps mid-scroll, and lets tall sections scroll normally.
- Each top-level section: `scroll-snap-align: start`.
- `scroll-padding-top` set to the fixed navbar height so a snapped section's
  top clears the navbar.
- **Lenis handshake:** parallax reads Lenis scroll position (no conflict).
  The snapping integration with Lenis (Lenis's snap module vs. native CSS
  snap with Lenis configured to allow it) is version-dependent and will be
  confirmed against the installed Lenis version during planning. The design
  is fixed; only this wiring detail is validated at plan time.

### 2. `SnapSection` component (the core interface)
A single reusable wrapper, e.g. `src/components/motion/snap-section.tsx`:
- `min-h-screen` (NOT fixed `h-screen`) so content taller than the viewport
  (the contact/evaluación forms) scrolls internally instead of clipping.
- Applies `scroll-snap-align: start` and a vertical-centering content wrapper.
- Wraps its children in the replay-on-entry animation (see §3).
- Props allow opting out of snap/parallax per section if a page needs it.

Each page is restructured so its top-level sections are direct snap children
of the snap container, each rendered through `SnapSection`.

### 3. Entrance animations — replay on every entry
- A `useInView`-based hook (`motion/react`) with `once: false`, so content
  re-animates each time its section scrolls into view (and again on scroll-back).
- Reuses the existing motion vocabulary in `src/components/motion/`
  (`Reveal` / `StaggerGroup` / `StaggerItem`) — extended or wrapped to support
  the replay behavior rather than the current play-once behavior.

### 4. Parallax — backgrounds + imagery
- Per section, `useScroll` (scoped to the section via `target`/`offset`) +
  `useTransform` map scroll progress to `translateY` on:
  - Background layers: the `line-texture` overlay and the blurred color blobs.
  - Key imagery: the hero banner shifts within its frame.
- GPU transforms only (`translateY`, no layout-affecting properties).

### 5. Accessibility, mobile, reduced motion
- `prefers-reduced-motion: reduce` → disable scroll-snap and parallax; the site
  falls back to normal scrolling (consistent with existing Lenis behavior).
- Small screens → soften or disable mandatory snapping (mobile momentum +
  snap feels janky) and reduce parallax travel.
- Keyboard navigation, in-page anchor links, and the navbar's section links
  keep working.

## Component / file boundaries

- `src/components/motion/snap-section.tsx` — new: the full-viewport snap wrapper.
- `src/components/motion/reveal.tsx` — extend for replay-on-entry (`once: false`)
  without breaking existing call sites (opt-in prop or new variant).
- `src/app/globals.css` — snap container utility, `scroll-padding`, reduced-motion
  guards.
- `src/components/providers.tsx` — Lenis/snap integration point if needed.
- Each page (`src/app/page.tsx`, `servicios`, `nosotros`, `contacto`,
  `evaluacion`) — restructure top-level sections as snap children. Localized,
  no logic changes.

## Non-goals (YAGNI)

- No scroll-jacking / one-gesture-per-section behavior.
- No section navigation dots / pager UI (can be added later if wanted).
- No per-section deep-link routing beyond existing anchors.
- No redesign of section content — only the scroll/animation shell changes.

## Risks & mitigations

- **"Every page" incl. forms:** `min-h-screen` + proximity snap degrades tall
  pages to normal scroll. Per-page structure lets us exclude a page with a
  one-line change if it feels bad.
- **Lenis vs. snap conflict:** validated at plan time; parallax is independent
  of the snap mechanism, so it works regardless.
- **Motion sickness / a11y:** reduced-motion fully disables the effects.

## Rollout

All work on `feature/fullpage-scroll`. Checkpoint `54d310c` remains the restore
point. Adoption is page-by-page, so we can review the homepage first before
rolling to the rest.
