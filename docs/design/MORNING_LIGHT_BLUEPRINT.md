# DHRISHTA HEALTH CARE SERVICES
## Master Build Blueprint — Cinematic Web Experience · v1.0

> **Codename:** `morning-light`
> **Positioning:** Not a hospital website. A cinematic story about care coming home.
> **Quality bar:** Apple keynote page × Stripe polish × Awwwards Site of the Day. Every scroll is a directed shot, never a "section."
> **This document is the single source of truth** for design, motion, engineering, and delivery. Hand it to any senior developer (or Claude Code) and the result should be indistinguishable from a top-tier studio build.

---

## 00 · Deliverables Index

Every deliverable requested in the brief, mapped to its section:

| # | Deliverable | Section |
|---|---|---|
| 1 | Folder structure | §05 |
| 2 | Component architecture | §06 |
| 3 | Animation timeline | §08 (per scene) + §09 (master map) |
| 4 | GSAP timeline plan | §07.2, §08 |
| 5 | Three.js scene architecture | §10 |
| 6 | React component hierarchy | §06.2 |
| 7 | ScrollTrigger mapping | §09 |
| 8 | Mobile optimization strategy | §16 |
| 9 | Performance optimization checklist | §15 |
| 10 | Asset pipeline | §19 |
| 11 | Image optimization plan | §19.3 |
| 12 | Accessibility checklist | §17 |
| 13 | SEO checklist | §18 |
| 14 | Design token system | §03 |
| 15 | Color variables | §03.1 |
| 16 | Typography scale | §03.2 |
| 17 | Spacing system | §03.3 |
| 18 | Motion guidelines | §03.5 + §07 |
| 19 | Transition durations | §03.5 |
| 20 | Easing functions | §03.5 |
| 21 | State management architecture | §13 |
| 22 | Loading strategy | §14 |
| 23 | Progressive enhancement strategy | §20.2 |
| 24 | Code splitting strategy | §20.1 |
| 25 | Reusable animation utilities | §12 |
| 26 | Production deployment checklist | §22 |
| 27 | Testing checklist | §21 |
| 28 | Future scalability plan | §23 |

---

## 01 · Experience Vision & Narrative Arc

### 01.1 The one-line brief

**The visitor should finish the page feeling: "These are the people I would trust with my mother."**

Trust is not built with feature grids. It is built the way film builds it — light, faces, pacing, silence. The entire page is one continuous story told in ten scenes:

```
S0  Preloader        A breath before the story
S1  Hero             Morning light enters a home            → CALM
S2  Story            One family, five chapters              → EMPATHY
S3  Services         Objects of care, floating in glass     → CAPABILITY
S4  Care Journey     A line that grows with every step      → CLARITY
S5  Why Dhrishta     Six floating islands of assurance      → TRUST
S6  Statistics       Numbers born from light                → PROOF
S7  Testimonials     Voices, breathing portraits            → HUMANITY
S8  Gallery          A wall of real moments                 → INTIMACY
S9  FAQ              Questions unfold like paper            → HONESTY
S10 Contact          A sunset walk, then a hand extended    → HOPE
```

### 01.2 Emotional pacing curve

The scroll is scored like a film. Intensity (motion density, color warmth, particle count) follows this curve:

```
intensity
   ▲
   │        ╭─╮ S3–S4                    ╭ S10 finale
   │  S1   ╱   ╰╮        ╭─ S6 ╮        ╱
   │ ╭────╯     ╰─ S5 ──╯      ╰─ S7–S9╯
   │╱   quiet    breathe   proof   quiet   warm close
   └──────────────────────────────────────────▶ scroll
```

Rule: **never two loud scenes in a row.** After every high-motion scene, a scene of stillness. This restraint is what separates a ₹8L build from a template.

### 01.3 Copy voice

Short. Warm. Sentence case. No healthcare jargon, no "leveraging holistic solutions." Speak like a calm, competent person at the door.

- Hero: **"Care that comes home."** — sub: *"Nursing, elder care and daily support — delivered with dignity, in the place your family loves most."*
- Chapter titles read like a poem, not headings (see §08.2).
- CTAs are verbs a family actually says: **"Talk to a care advisor"**, **"Plan care for someone you love"** — never "Submit" or "Learn more."

---

## 02 · Art Direction & Design Philosophy

### 02.1 The aesthetic thesis

**"Morning light in a well-loved home."** Every visual decision derives from this:

- **Light is the protagonist.** Warm ivory surfaces, soft volumetric shafts, gold used only where light would naturally fall. Shadows are soft and long, never hard.
- **Glass, linen, brass.** Materials of a premium home — not chrome, not neon, not "medical plastic." Glassmorphism is allowed only where a real pane of glass would exist (floating cards, service objects), always over a lit background, never over flat color.
- **Depth over decoration.** Layered parallax, fog, depth of field. Nothing sits flat; nothing is ornamental.
- **Stillness is a feature.** Massive whitespace. One idea per viewport. Idle states breathe (±1% scale, 4s loops) — the site feels alive even when the user stops.

### 02.2 The signature element

Every memorable site has one. Ours: **the light shaft.** A single warm volumetric beam appears in the preloader, motivates the hero's morning sun, becomes the timeline's glow in S4, forms the particle digits in S6, and sets as the sun in S10. One visual motif, carried across the whole film — this is the thread reviewers and clients will remember.

### 02.3 Hard "never" list

- Never stock-photo blue-gradient healthcare clichés (no stethoscope-on-keyboard, no smiling call-center headset).
- Never carousels with dots, never accordion snap, never default `ease-in-out`, never bounce easings on serious content.
- Never pure `#FFFFFF` or pure `#000000` anywhere.
- Never more than two accent colors visible in a single viewport.
- Never animate `filter: blur()` or `box-shadow` on scroll (compositor killers) — fake them with pre-blurred layers and opacity.

---

## 03 · Design Token System

Single file: `styles/tokens.css`. Every color, size, duration and easing in the codebase references a token. Tailwind config maps to these variables — no raw hex in components, ever.

### 03.1 Color — the minimal palette

Discipline: **90 / 7 / 3.** ~90% of any viewport is ivory + navy ink, ~7% teal, ~3% gold. Emerald and clay are *semantic only* (success / error) and never decorative. This is the entire palette — nothing else ships.

```css
:root {
  /* ── Neutrals · the canvas (≈90%) ─────────────────────── */
  --ivory-050: #FDFDFB;   /* page base — warm white          */
  --ivory-100: #FAF7F1;   /* section alternate — soft ivory  */
  --ivory-200: #F2EEE5;   /* cards at rest, inputs           */
  --mist-300:  #E4E4DE;   /* hairlines, dividers, borders    */

  /* ── Ink · all text (navy family) ─────────────────────── */
  --navy-900:  #0A1B2E;   /* display + body text  (14.6:1 on ivory-050) */
  --navy-700:  #16324F;   /* subheads, icons                  */
  --navy-500:  #405872;   /* secondary text, captions (7.1:1) */

  /* ── Primary accent · Healing Teal (≈7%) ──────────────── */
  --teal-700:  #175A56;   /* small text on ivory (7.5:1)      */
  --teal-600:  #1F6F6B;   /* buttons, links (5.6:1)           */
  --teal-500:  #2E8B84;   /* interactive hover, strokes       */
  --teal-300:  #A7D3CE;   /* tints, focus glows, particles    */

  /* ── Warm accent · Soft Gold (≈3%, "where light falls") ─ */
  --gold-500:  #C29A55;   /* light shafts, milestone glow, focus ring */
  --gold-300:  #EAD9B0;   /* particle highlights, hover halos */

  /* ── Semantic only — never decorative ─────────────────── */
  --emerald-600: #2E7D5B; /* success, "care active" states    */
  --clay-600:    #A9503C; /* errors, destructive              */

  /* ── Surfaces & atmosphere ─────────────────────────────── */
  --glass-bg:     rgba(253, 253, 251, 0.55);
  --glass-border: rgba(255, 255, 255, 0.65);
  --glass-blur:   20px;
  --scrim-warm:   linear-gradient(180deg, rgba(194,154,85,.10), rgba(10,27,46,0) 40%);
  --shadow-key:   0 1px 2px rgba(10,27,46,.05), 0 24px 64px -24px rgba(10,27,46,.18);
  --shadow-float: 0 2px 4px rgba(10,27,46,.04), 0 40px 96px -32px rgba(10,27,46,.22);
}
```

**Dark passages** (S2 chapter III, S10 night sky) don't get a second palette — they *invert the same one*: navy-900 becomes the surface, ivory-050 the ink, gold the light source. One palette, two exposures, like day and dusk of the same house.

**Backgrounds** are never flat: `--ivory-050` base + an almost-invisible radial warmth top-left (`radial-gradient(120% 80% at 20% 0%, rgba(194,154,85,.05), transparent 60%)`) + optional 1.5% grain texture (tiled 128px PNG, `mix-blend: overlay`). This is the "expensive paper" feel.

### 03.2 Typography

| Role | Face | Weights | Notes |
|---|---|---|---|
| Display | **Satoshi Variable** | 500–740 axis | Headlines, chapter titles, stats. Fallback chain: General Sans → SF Pro Display → Inter. |
| Body / UI | **Inter Variable** | 400–600 | Paragraphs, labels, forms. `font-feature-settings: "ss01","cv11"` for the humanist alternates. |
| Numeric | Satoshi tabular | 640 | Stats & counters — `font-variant-numeric: tabular-nums` so digits don't jitter while counting. |

Both self-hosted `woff2`, `font-display: swap`, preloaded, subset to Latin. *(If brand alignment with the Dhrishta family identity is wanted later, Bricolage Grotesque can replace Satoshi for Display with zero other changes — the scale below is face-agnostic.)*

**Fluid scale** (clamp between 390px and 1600px viewports):

```css
:root {
  --font-display: 'Satoshi', 'General Sans', -apple-system, 'Inter', sans-serif;
  --font-body:    'Inter', -apple-system, sans-serif;

  --text-hero:   clamp(3.00rem, 1.2rem + 7.5vw, 8.25rem);  /* lh .95  ls -0.035em  w 640 */
  --text-d1:     clamp(2.35rem, 1.2rem + 4.8vw, 5.50rem);  /* lh 1.02 ls -0.03em   w 620 */
  --text-d2:     clamp(1.85rem, 1.1rem + 2.8vw, 3.50rem);  /* lh 1.08 ls -0.02em   w 600 */
  --text-h3:     clamp(1.40rem, 1.1rem + 1.4vw, 2.15rem);  /* lh 1.2                w 580 */
  --text-lead:   clamp(1.125rem, 1rem + .5vw, 1.375rem);   /* lh 1.55  navy-500     w 440 */
  --text-body:   1.0625rem;                                 /* lh 1.7                w 420 */
  --text-small:  0.9375rem;                                 /* lh 1.6                       */
  --text-overline: 0.8125rem;                               /* caps, ls .16em, teal-600, w 560 */
}
```

Rules: headlines max **12 words**; body max measure **62ch**; overlines (e.g. `CHAPTER II — TIME MOVES QUIETLY`) introduce every scene and are the only tracked-caps element on the site.

### 03.3 Spacing, layout & radius

```css
:root {
  /* 4px base scale */
  --sp-1: .25rem;  --sp-2: .5rem;  --sp-3: .75rem; --sp-4: 1rem;
  --sp-6: 1.5rem;  --sp-8: 2rem;   --sp-12: 3rem;  --sp-16: 4rem;
  --sp-24: 6rem;   --sp-32: 8rem;  --sp-40: 10rem;

  /* Fluid rhythm */
  --section-y:  clamp(6.5rem, 16vh, 13rem);   /* vertical breath between scenes  */
  --gutter:     clamp(1.25rem, 4.5vw, 4rem);
  --container:  90rem;                         /* 1440px max, 12-col grid, 24px gap */

  /* Radius — soft, domestic, never sharp */
  --r-sm: .625rem;  --r-md: 1.125rem;  --r-lg: 1.75rem;  --r-pill: 999px;
}
```

Grid: 12 columns desktop / 6 tablet / 4 mobile. Text blocks live on cols 2–7 or 6–11 — **never centered paragraphs** except the hero and stat captions. Asymmetry reads editorial; centering reads template.

### 03.4 Elevation & glass

Three elevation levels only: `rest` (no shadow, 1px `--mist-300` border) → `raised` (`--shadow-key`) → `floating` (`--shadow-float`, reserved for glass cards and the nav). Glass recipe (used sparingly — S3 panels, S5 islands, nav on scroll, S10 form card):

```css
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur)) saturate(1.4);
  border: 1px solid var(--glass-border);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.7), var(--shadow-float);
  border-radius: var(--r-lg);
}
/* Mobile tier LITE: backdrop-filter is expensive → swap to solid ivory-100 @ 92% */
```

### 03.5 Motion tokens — durations & easing

```css
:root {
  /* Durations (time-based animations; scroll-scrubbed motion is distance-based, not timed) */
  --t-micro: 140ms;   /* hovers, taps, toggles          */
  --t-fast:  240ms;   /* small reveals, tooltips        */
  --t-base:  420ms;   /* card enters, menu items        */
  --t-slow:  700ms;   /* headline masks, section enters */
  --t-scene: 1100ms;  /* preloader exit, page transitions */
  --t-drift: 4000ms;  /* idle breathing loops           */

  /* Easing */
  --ease-out:    cubic-bezier(0.22, 1, 0.36, 1);    /* "power curtain" — every entrance   */
  --ease-in:     cubic-bezier(0.55, 0, 0.80, 0.4);  /* exits only                          */
  --ease-inout:  cubic-bezier(0.66, 0, 0.34, 1);    /* position swaps, camera-like moves   */
  --ease-soft:   cubic-bezier(0.33, 1, 0.68, 1);    /* gentle, for large surfaces          */
}
```

**GSAP equivalents:** entrances `expo.out` / `power3.out` · camera & lighting `power2.inOut` · idle loops `sine.inOut` · scrubbed tweens always `ease: 'none'` (the *scroll* is the easing — Lenis provides the interpolation) · one custom ease registered globally:

```ts
CustomEase.create('breathe', 'M0,0 C0.38,0 0.12,1 1,1'); // long soft settle, for hero text & preloader exit
```

**Framer Motion spring presets:**

```ts
export const springs = {
  soft:   { type: 'spring', stiffness: 150, damping: 24, mass: 1 },   // cards, panels
  snappy: { type: 'spring', stiffness: 320, damping: 28, mass: .8 },  // buttons, toggles
  paper:  { type: 'spring', stiffness: 170, damping: 21, mass: 1 },   // FAQ unfold — one soft overshoot, no wobble
} as const;
```

**Choreography laws (non-negotiable):**

1. One hero motion per viewport; everything else supports it.
2. Reveal travel ≤ 32px; scale-in from 0.96, never 0.8. Restraint = luxury.
3. Stagger 60–90ms between siblings; max 8 staggered children (batch the rest).
4. Parallax layers move ≤ 12% of viewport height relative to each other.
5. Only `transform` + `opacity` are animated at 60/120fps. `clip-path` allowed for reveals (GPU-friendly `inset()` only).
6. Exits are 40% faster than entrances (`--ease-in`, 0.6× duration).
7. Nothing loops faster than 3s at idle; ambient loops are ±1–1.5% amplitude.
8. `prefers-reduced-motion`: every scrub scene resolves to its final art-directed frame with a 240ms crossfade. The story still reads — it just doesn't move. (Full policy §17.)

---

## 04 · Tech Stack & Division of Labor

| Layer | Tool | Owns | Never does |
|---|---|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript strict** | Routing, RSC data, metadata, image pipeline | — |
| Styling | **Tailwind CSS 4 + tokens.css** | Layout, utilities mapped to tokens | Raw hex, raw px durations |
| Smooth scroll | **Lenis** | Scroll interpolation (`lerp: 0.09`) — the premium glide | Animating anything itself |
| Scroll choreography | **GSAP 3.13 + ScrollTrigger (+ SplitText, DrawSVG, MorphSVG — all free since 3.13)** | Every scroll-bound timeline, pinning, scrubbing, sequence scrub | Hover states, presence mounts |
| Component motion | **Framer Motion 11** | Enter/exit (`AnimatePresence`), hover/tap, layout animation (FAQ, lightbox), menu & page transitions, springs | Scroll scrubbing (one owner only: GSAP) |
| 3D | **Three.js + React Three Fiber + drei + postprocessing** | S3 service objects, S5 islands, S6 particles, S8 gallery wall, hero dust | DOM layout |
| State | **Zustand** | Scroll progress bridge, device tier, preloader, UI, audio | Server data |
| Fonts | Self-hosted variable woff2 | — | Google Fonts runtime requests |

**The bridge rule (critical):** GSAP writes scroll progress into a Zustand store (`setState`, no React re-render); R3F reads it inside `useFrame` with damping. React never re-renders per scroll frame. This single pattern is why the site holds 120fps.

---

## 05 · Folder Structure

```
dhrishta-care/
├── app/
│   ├── (site)/
│   │   ├── layout.tsx              # <Providers> → Lenis, tier detect, cursor, preloader gate
│   │   ├── page.tsx                # The film: composes S1–S10 (RSC shell, client scenes)
│   │   └── opengraph-image.tsx     # Branded OG (edge-generated)
│   ├── api/contact/route.ts        # POST → validate (zod) → notify (Resend) → rate-limit
│   ├── sitemap.ts · robots.ts · manifest.ts
│   └── globals.css                 # imports tokens.css, utilities.css
│
├── components/
│   ├── chrome/                     # Persistent UI shell
│   │   ├── Preloader.tsx  Nav.tsx  Footer.tsx
│   │   ├── ScrollProgress.tsx      # 2px gold hairline, top
│   │   ├── Cursor.tsx              # desktop-only magnetic dot + label states
│   │   └── AudioToggle.tsx         # ambient sound, off by default
│   ├── scenes/                     # DOM layer of each scene (one folder each)
│   │   ├── S1Hero/  S2Story/  S3Services/  S4Journey/  S5WhyUs/
│   │   ├── S6Stats/ S7Testimonials/ S8Gallery/ S9Faq/ S10Contact/
│   │   └── (each: index.tsx, timeline.ts, copy from /content)
│   ├── canvas/                     # All R3F — dynamically imported, ssr:false
│   │   ├── Stage.tsx               # shared <Canvas>: dpr, tier, color mgmt, PostFX
│   │   ├── HeroDust.tsx  ServiceObjects.tsx  Islands.tsx
│   │   ├── ParticleDigits.tsx  GalleryWall.tsx
│   │   └── materials/ (glass.ts, lightShaft.ts)  shaders/
│   ├── typography/                 # SplitReveal, Overline, ChapterTitle
│   └── ui/                         # Button, GlassCard, Input, TextArea, Badge, IconTile
│
├── lib/
│   ├── animation/                  # easings.ts, variants.ts (FM), split.ts, magnetic.ts,
│   │   └── counter.ts, sequence.ts # canvas image-sequence engine
│   ├── scroll/lenis.ts · bridge.ts # createLenis(), progress → zustand
│   ├── three/tiers.ts · loaders.ts # device tier detect, draco/ktx2 loaders, glyph sampler
│   └── seo/jsonld.ts               # LocalBusiness + MedicalBusiness + FAQPage builders
│
├── hooks/                          # useSectionTimeline, useDeviceTier, useSequence,
│                                   # usePointerParallax, useReducedMotion, useInViewOnce
├── stores/                         # scroll.ts, ui.ts, preloader.ts, audio.ts (zustand)
├── content/                        # services.ts, journey.ts, stats.ts, faqs.ts,
│                                   # testimonials.ts, copy.ts   ← all editable text lives here
├── styles/tokens.css · utilities.css
├── public/
│   ├── sequences/hero/f0001–f0121.avif (+ .webp fallback, 3 resolutions)
│   ├── models/*.glb (draco) · textures/*.ktx2 · hdri/home_morning_1k.hdr
│   ├── fonts/*.woff2 · images/ · audio/ambient-morning.mp3 · grain.png
└── next.config.mjs · tailwind.config.ts · tsconfig.json
```

---

## 06 · Component Architecture

### 06.1 Principles

- **Scenes are self-contained films.** Each `scenes/S*/` folder owns its DOM, its `timeline.ts` (GSAP), and reads its copy from `/content`. Deleting a folder removes the scene cleanly.
- **Canvas is one `<Canvas>`, many scenes.** A single shared R3F Stage (persistent WebGL context) mounts scene groups by visibility — creating/destroying contexts per section causes stutter. Scene groups mount lazily via `<Suspense>` when their DOM section is within 1.5 viewports.
- **Server by default.** Only scenes and chrome are client components; page shell, metadata, JSON-LD are RSC.
- **Copy never lives in JSX.** Everything human-readable is in `/content/*.ts` — future CMS swap (§23) becomes a data-layer change only.

### 06.2 React component hierarchy

```
<RootLayout>                              RSC · fonts, tokens, metadata, JSON-LD
└─ <Providers>                            client · zustand hydrate, tier detect
   ├─ <Preloader/>                        gates render until critical assets ready
   ├─ <LenisProvider>                     creates Lenis, wires GSAP ticker
   │  ├─ <Nav/> <ScrollProgress/> <Cursor/> <AudioToggle/>
   │  ├─ <main id="film">
   │  │  ├─ <S1Hero>      ── <SequenceCanvas/> + <HeroDust/>(R3F) + <HeroCopy/>
   │  │  ├─ <S2Story>     ── <Chapter ×5/> + <ProgressRail/>
   │  │  ├─ <S3Services>  ── <ServiceObjects/>(R3F) + <ServicePanel/> | <ServiceCardsMobile/>
   │  │  ├─ <S4Journey>   ── <TimelinePath(SVG)/> + <Milestone ×6/>
   │  │  ├─ <S5WhyUs>     ── <Islands/>(R3F) | <IslandCardsMobile/>
   │  │  ├─ <S6Stats>     ── <ParticleDigits/>(R3F) + <StatCaption/> (+ DOM fallback counters)
   │  │  ├─ <S7Testimonials> ─ <VoiceChapter ×3/> (portrait, waveform, kinetic quote)
   │  │  ├─ <S8Gallery>   ── <GalleryWall/>(R3F) | <SwipeStrip/> + <Lightbox layoutId/>
   │  │  ├─ <S9Faq>       ── <FaqItem ×8/> (FM layout + paper spring)
   │  │  └─ <S10Contact>  ── <SunsetSky/> + <Silhouettes/> + <ContactCard/> 
   │  └─ <Footer/>                        parallax-revealed from behind main
   └─ <Stage/>                            fixed R3F canvas behind/above per scene z-map
```


---

## 07 · The Animation Engine

### 07.1 Lenis — the premium glide

One instance, created in `LenisProvider`, driven by GSAP's ticker so scroll interpolation and timelines share a single clock (no drift, no double-rAF):

```ts
// lib/scroll/lenis.ts
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function createLenis() {
  const lenis = new Lenis({
    lerp: 0.09,             // the feel: 0.07 = heavier/cinema, 0.12 = lighter. Ship 0.09.
    wheelMultiplier: 0.9,   // slightly slower than native = deliberate, expensive
    smoothWheel: true,
    syncTouch: false,       // touch keeps native momentum (users expect it); Lenis owns wheel
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  return lenis;
}
```

Rules: anchor jumps use `lenis.scrollTo(target, { duration: 1.4, easing: t => 1 - Math.pow(1 - t, 4) })`; Lenis pauses (`lenis.stop()`) while the preloader, menu overlay, or lightbox is open; `data-lenis-prevent` on any inner scrollable.

### 07.2 GSAP conventions

- All plugins registered once in `lib/animation/gsap.ts`: `ScrollTrigger, SplitText, DrawSVGPlugin, MorphSVGPlugin, CustomEase` (all free as of GSAP 3.13).
- **Every scene timeline lives in `useSectionTimeline`** (see §12) → `gsap.context()` scoped to the scene ref, auto `revert()` on unmount. Zero leaked triggers, HMR-safe.
- Scrubbed timelines: `ease: 'none'` on every tween; total timeline `duration: 1` and position tweens by progress fractions (`0.28`, `0.55`…) so the ScrollTrigger `end` distance is the only tuning knob.
- `scrub: true` (frame-locked) for pinned film scenes — Lenis already smooths input; adding `scrub: 0.8` on top double-smooths and feels drunk. Use numeric scrub (`0.6`) only on *unpinned* parallax.
- Pins: `anticipatePin: 1`, `pinSpacing: true`, never pin a parent of another pin.
- `ScrollTrigger.config({ ignoreMobileResize: true })` — prevents URL-bar resize jumps on mobile.
- After preloader exit and after fonts load: `ScrollTrigger.refresh()`.

### 07.3 The GSAP → R3F bridge (the 120fps secret)

```ts
// stores/scroll.ts — written by ScrollTrigger, read by useFrame. React never re-renders on scroll.
import { create } from 'zustand';

type ScrollState = {
  hero: number; story: number; services: number; journey: number;
  islands: number; stats: number; gallery: number; contact: number;
  velocity: number;
};
export const useScrollStore = create<ScrollState>(() => ({
  hero: 0, story: 0, services: 0, journey: 0,
  islands: 0, stats: 0, gallery: 0, contact: 0, velocity: 0,
}));
export const setProgress = (key: keyof ScrollState, v: number) =>
  useScrollStore.setState({ [key]: v });
```

```ts
// Inside any R3F scene — transient read + damping = butter
useFrame((_, dt) => {
  const p = useScrollStore.getState().services;
  group.current.rotation.y = THREE.MathUtils.damp(
    group.current.rotation.y, p * ARC_TOTAL, 4.2, dt
  );
});
```

Every ScrollTrigger that a canvas scene cares about does `onUpdate: self => setProgress('services', self.progress)`. One writer, many readers, no React churn.

### 07.4 Framer Motion usage map

| Concern | API | Where |
|---|---|---|
| Presence (mount/unmount) | `AnimatePresence` | Menu overlay, lightbox, service info panel, toasts |
| Viewport reveals (non-scrubbed) | `whileInView` + `variants` + `viewport={{ once: true, margin: '-18%' }}` | S9 FAQ list, S10 form, footer, any content below pins |
| Hover / press | `whileHover` / `whileTap` + `springs.snappy` | Buttons, cards, icon tiles |
| Layout animation | `layout` / `layoutId` | FAQ open/close height, gallery → lightbox shared element |
| Springs & pointers | `useSpring`, `useMotionValue` | Cursor follow, magnetic buttons, card tilt |
| Page/menu transitions | `motion.div` curtains | Ivory curtain wipe, 1100ms `--ease-inout` |

Shared variants library:

```ts
// lib/animation/variants.ts
export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: .7, ease: [.22, 1, .36, 1] } },
};
export const maskUp = {           // line-mask reveal — pair with overflow-hidden parent
  hidden: { y: '112%' },
  show:   { y: '0%', transition: { duration: .9, ease: [.22, 1, .36, 1] } },
};
export const scaleIn = {
  hidden: { opacity: 0, scale: .96 },
  show:   { opacity: 1, scale: 1, transition: { duration: .6, ease: [.22, 1, .36, 1] } },
};
export const stagger = (delay = 0) => ({
  show: { transition: { staggerChildren: .07, delayChildren: delay } },
});
```

**Ownership law:** if it responds to *scroll position*, GSAP owns it. If it responds to *state or pointer*, Framer Motion owns it. No element is animated by both.

### 07.5 Device tiers — cinematic degradation

Detected once at boot (`lib/three/tiers.ts`), stored in zustand, read everywhere:

```ts
export type Tier = 'CINEMATIC' | 'BALANCED' | 'LITE' | 'STATIC';

export function detectTier(): Tier {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return 'STATIC';
  const mem = (navigator as any).deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  const mobile = matchMedia('(pointer: coarse)').matches;
  const gpu = getGPURenderer();     // WEBGL_debug_renderer_info, try/catch → ''
  const weakGPU = /Mali-4|Adreno 3|Adreno 4|PowerVR|SwiftShader/i.test(gpu);
  if (weakGPU || mem <= 2 || cores <= 4) return 'LITE';
  if (mobile || mem <= 4) return 'BALANCED';
  return 'CINEMATIC';
}
```

| Setting | CINEMATIC (desktop) | BALANCED (modern mobile) | LITE | STATIC (reduced motion) |
|---|---|---|---|---|
| Target | 120fps | 60fps | 60fps | — |
| Canvas DPR cap | `min(devicePixelRatio, 2)` | 1.5 | 1 | no canvas |
| Hero sequence | 121f @1600px AVIF | 121f @1080px | 61f @720px | 1 art-directed still |
| PostFX (Bloom + DoF) | ✓ | Bloom only | ✗ | ✗ |
| Shadows | soft PCF 1024 | contact-baked | baked only | — |
| Particles: dust / digits | 900 / 5200 | 400 / 2600 | 120 / DOM counters | DOM counters |
| Glass blur | 20px | 14px | solid fill | solid fill |
| S8 gallery | 3D wall | 3D wall (fewer planes) | swipe strip | static grid |

A runtime **FPS governor** (rolling 3s average via `gsap.ticker`) demotes one tier live if fps < 48 for 3s — users never see a slideshow.

---

## 08 · Scene-by-Scene Direction

Format per scene: **Direction** (what the viewer feels) → **Staging** (layout/layers) → **Motion spec** (GSAP/FM) → **Mobile** → **Fallback**.

---

### S0 · Preloader — "A breath before the story"

**Direction.** 1.6–2.4s max. Ivory field. The Dhrishta mark draws itself in a thin gold stroke (DrawSVG 0→100%, 1.1s `--ease-inout`), a tabular counter climbs 0→100 in the corner, and a single vertical **light shaft** (the signature, §02.2) fades in behind the mark. Exit: shaft brightens 10%, mark fills navy, then the ivory field splits as **two curtains** (top 45% up, bottom 55% down, 1100ms `--ease-inout`, 60ms offset) revealing hero frame 0 already breathing beneath.

**Engineering.** Gates on: fonts ready + hero frames 1–24 decoded + WebGL context created. Minimum display 1.2s (no flash), hard cap 4s (release regardless, stream the rest). Counter = real bytes loaded, snapped to int. `lenis.stop()` until curtains finish, then `start()` + `ScrollTrigger.refresh()`.

---

### S1 · Hero — "Morning Light" *(pinned, 300vh)*

**Direction.** Frame 0: wide interior of a warm modern home, dawn light shafting through sheer curtains, dust motes drifting. As the user scrolls, the camera dollies slowly forward and left, past a plant that sways once, settling on an elderly woman in an armchair, smiling, as a caregiver in soft sage uniform steadies her teacup. No cuts. The headline dissolves upward mid-journey; the CTA breathes in as the shot settles.

**Staging (layers, back→front).**
1. `<SequenceCanvas>` — 121-frame pre-rendered cinematic sequence (§19.1), cover-fit, scrubbed.
2. `<HeroDust>` (R3F, additive points) — 900 gold-tinted motes with slow curl drift, opacity following the light-shaft screen region.
3. Warm scrim `--scrim-warm` + vignette div (opacity animated, not blur).
4. Copy block: overline `HOME · DAY · ELDER · NURSING CARE`, headline **"Care that comes home."** (SplitText words, mask-up), sub-line, scroll cue (thin line + "scroll" caption, 2.4s sine pulse).
5. CTA pair (magnetic): primary teal pill "Talk to a care advisor", ghost "Explore our care".

> **Why pre-rendered, not real-time 3D:** photoreal humans + home interiors in WebGL are heavy and land in the uncanny valley. The Apple technique — render the shot in Blender/Cycles (or shoot on a gimbal), export a scrubbed frame sequence, composite live particles and light on top — gives film-grade imagery at image-decode cost. Real-time R3F is reserved for scenes where abstraction is the point (S3, S5, S6, S8). This is the professional trade.

**Entrance (time-based, runs once after curtains).**

```ts
gsap.timeline({ defaults: { ease: 'breathe' } })
  .fromTo('.hero-canvas', { scale: 1.06 }, { scale: 1, duration: 2.4 }, 0)   // settle
  .from(split.words, { yPercent: 118, duration: 1.1, stagger: .07 }, .15)    // masked words
  .from('.hero-sub',  { y: 24, opacity: 0, duration: .8 }, .7)
  .from('.hero-cta > *', { y: 18, opacity: 0, stagger: .08, duration: .7 }, .9)
  .from('.scroll-cue', { opacity: 0, duration: .6 }, 1.5);
```

**Scroll timeline (scrubbed).**

```ts
// scenes/S1Hero/timeline.ts
const seq = createSequence(canvas, { frames: 121, path: seqPath(tier), fit: 'cover' });

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '#hero', start: 'top top', end: '+=300%',
    scrub: true, pin: true, anticipatePin: 1,
    onUpdate: s => setProgress('hero', s.progress),
  },
});
tl.to(seq, { frame: 120, snap: 'frame', ease: 'none', duration: 1 }, 0)
  .to(split.words, { yPercent: -130, opacity: 0, stagger: .035, duration: .16, ease: 'power2.in' }, .26)
  .to('.hero-sub, .scroll-cue', { opacity: 0, duration: .08 }, .24)
  .to('.hero-vignette', { opacity: .38, duration: .3 }, .5)      // gentle focus pull
  .fromTo('.hero-cta', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .1 }, .84)
  .to('.hero-canvas', { scale: 1.03, duration: .25 }, .75);      // final push-in
```

`<HeroDust>` reads `hero` progress: mote drift speed eases down as the shot settles (arrival = stillness); dust opacity ×0.4 by progress 0.9 so the faces own the frame.

**Mobile.** Same sequence at 1080/720px, pin shortened to `+=220%`, headline `--text-hero` floor 3rem, CTA full-width sticky-safe above the thumb zone.
**Fallback (STATIC).** Final frame as `next/image` `priority` hero + static copy. This same frame is the LCP image on all tiers (frame 0 is, technically — preloaded, `fetchpriority=high`).

---

### S2 · Story — "One Family, Five Chapters" *(pinned, 500vh — the scroll film)*

**Direction.** The emotional core. One family across time; the viewer scrolls through years. Each chapter is a full-bleed composition (art-directed photography/renders, consistent grade) with a poem-line title. Light temperature arcs **warm → cool → warm**: this is the story told in color.

| Ch | Title (overline + line) | Image direction | Grade |
|---|---|---|---|
| I | *A house full of mornings.* | Family breakfast, sunlit chaos, laughter | gold-warm |
| II | *Time moves quietly.* | Same table, fewer chairs; parents greyer; long shadows | neutral |
| III | *Life pulls everyone away.* | Empty chair, phone glowing with missed calls, dusk | cool navy (palette inverted) |
| IV | *Help knocks gently.* | Doorway; caregiver silhouette in morning backlight — **the light shaft returns** | warming |
| V | *Mornings return.* | Garden walk, arm in arm; teacups for two | full gold-warm |

**Staging.** Pinned stage; chapters absolutely stacked. Left rail: five dots + roman numerals; active dot fills gold, hairline progress connects them (DrawSVG scrub). Titles set in Display at `--text-d1`, bottom-left on cols 2–7.

**Motion spec — one reusable chapter transition** (no hard cuts, ever):

```ts
const CH = 5, W = 1 / CH;
chapters.forEach((c, i) => {
  const at = i * W;
  if (i > 0) tl
    .fromTo(c.el, { clipPath: 'inset(0 0 100% 0)' },              // curtain-down reveal
                  { clipPath: 'inset(0 0 0% 0)', duration: .30 * W, ease: 'none' }, at)
    .to(chapters[i-1].media, { scale: .955, opacity: 0, yPercent: -3,
                  duration: .30 * W, ease: 'none' }, at);          // previous recedes into depth
  tl.fromTo(c.media, { scale: 1.12, yPercent: 6 },                 // interior parallax: image
                     { scale: 1.0, yPercent: -5, duration: W, ease: 'none' }, at)   // travels within its mask
    .fromTo(c.lines, { yPercent: 115 },
                     { yPercent: 0, stagger: .05, duration: .22 * W, ease: 'none' }, at + .18 * W)
    .to(c.lines,     { yPercent: -115, stagger: .04, duration: .16 * W, ease: 'none' }, at + .80 * W);
});
tl.to('#story-temp', { '--warmth': 1, ease: 'none', duration: 1 }, 0); // CSS var drives a gold↔navy
                                                                        // overlay via keyframed stops
```

Chapter III inverts surface tokens (navy field, ivory type) via a class toggled by `onToggle` at that window — the "night" of the film. Chapter IV re-introduces the gold shaft as a DOM gradient layer that brightens across its window.

**Mobile.** Identical structure; pin `+=380%`; titles at `--text-d2`; rail collapses to a 3px progress bar.
**Fallback.** Five stacked full-bleed figures with `whileInView` mask-up titles — the poem still reads top to bottom.

---

### S3 · Services — "Objects of Care" *(pinned 400vh · R3F)*

**Direction.** Nine services become nine sculpted **glass objects** floating on a gentle arc — abstract, luminous, precious; a museum vitrine, not a pricing grid. Scroll rotates the arc; each object arrives center-stage, its info panel sliding in beside it.

**The nine** (`content/services.ts`): Nursing Care · Home Care · Day Care · Physiotherapy · Palliative Care · Post-Surgery Care · Elder Care · Doctor Visits · Medicine Management. Each: a distinct abstract glass form (capsule-cross, orbit rings, folded plane, helix…) with an engraved icon plate inside — two meshes, so hover can separate the layers.

**3D spec.** Arc radius 6u, objects every 22°; camera fixed at z 9, `lookAt` center with ±0.35u pointer-lerp sway. Material: `MeshPhysicalMaterial { transmission: .92, thickness: .55, roughness: .14, ior: 1.42, clearcoat: .6, attenuationColor: teal-300, attenuationDistance: 2.4 }` under the shared morning HDRI; ground: baked soft contact shadow plane. Idle: each object `y = sin(t·.45 + φ)·.08`, rotation.y drift ±4°.

**Scroll & interaction.**

```ts
// DOM trigger writes progress; R3F damps toward it
scrollTrigger: { trigger: '#services', start: 'top top', end: '+=400%',
  pin: true, scrub: true, snap: { snapTo: 1/8, duration: .45, ease: 'power2.inOut' },
  onUpdate: s => setProgress('services', s.progress) }
// useFrame: arc.rotation.y ← damp(→ progress · 8 · 22°, λ 4.2)
```

Active object (nearest to camera): scales to 1.12, emissive icon plate warms to gold-300, inner/outer meshes separate ±0.12u (damped), and the DOM `<ServicePanel>` (glass card, right column) swaps content via `AnimatePresence` — title mask-up, two-line description, "Explore →" text link. Cursor becomes a "drag" label over the canvas; horizontal drag nudges the arc (velocity added to target, damped back).

**Mobile.** No pin. Horizontal swipe deck (FM `drag="x"` + snap): flat glass cards with 3D tilt on drag (`rotateY` from drag offset), tiny pre-rendered PNG of each object (250KB total beats a mobile transmission shader).
**Fallback.** 3×3 grid of `scaleIn` cards with the PNG renders.

---

### S4 · Interactive Care Journey *(unpinned scrub, ~250vh)*

**Direction.** "What happens when you call us?" answered as a growing golden path — clarity as choreography.

**Milestones** (`content/journey.ts`): 1 First conversation → 2 Home assessment → 3 Personal care plan → 4 Caregiver match → 5 Care begins → 6 Ongoing reviews.

**Motion spec.** A single SVG path (gentle S-curve, `vector-effect: non-scaling-stroke`, gold-500 @ 2.5px) draws via DrawSVG scrubbed across the section. Each milestone is a ScrollTrigger at its node (`start: 'top 68%'`): icon strokes self-draw (DrawSVG .7s), node ring pulses once (scale 1→1.35 fade, gold-300), title + line `fadeUp`. The **active connector only** runs a 24-mote canvas drift (tiny 2D canvas, not R3F — cheap) rising along the path normal. Passed milestones keep a filled gold dot; the path ahead sits at 12% opacity — you can see the road, but it lights as you walk it.

**Mobile.** Path straightens to a left-edge vertical; content right-aligned column; motes off in LITE.

---

### S5 · Why Dhrishta — "Floating Islands" *(pinned 150vh · R3F)*

**Direction.** Six assurances as glass islands drifting at different depths in soft fog; moving the pointer shifts your vantage — you're walking among them.

**The six:** Compassion-first caregivers · Certified professional nurses · 24/7 support & emergency response · Verified & background-checked staff · Family app with daily updates · Doctor-supervised care plans.

**3D spec.** Six `GlassCard` planes (rounded-rect geometry, same physical material at transmission .8) at depths z −2…+2, scattered x/y; `fog(ivory-100, 6, 14)` gives aerial perspective. Idle float: `y += sin(t·.5+φ)·.12`, `rotZ ±1.5°`. Pointer parallax: camera position lerps toward `NDC · (0.6, 0.35)`, `lookAt(0,0,0)` — nearer islands sweep more (true parallax, free). Text lives in DOM overlays position-synced via drei `<Html transform occlude>` so it stays crisp and selectable. Scroll (pin `+=150%`): the flotilla drifts 1.2u left→right and depths interleave — a slow pan through the field.

**Mobile.** DOM: staggered two-column offset cards with FM tilt-on-touch and ±6px scroll-parallax between columns.

---

### S6 · Statistics — "Numbers Made of Light" *(pinned 350vh · R3F particles)*

**Direction.** Proof, rendered in the signature light. A cloud of gold-teal particles condenses into each figure, holds while the caption sets, then exhales into the next.

**Stats** (`content/stats.ts` — placeholders, editable): `650+ families cared for` · `120+ certified nurses & caregivers` · `24/7 care, every day of the year` · `4.9★ average family rating`.

**Technique — glyph sampling (no GPGPU needed at 5k points):**

```ts
// lib/three/glyphSampler.ts — offscreen canvas → alpha rejection-sample → Float32Array
export function sampleGlyph(text: string, count = 5200): Float32Array {
  const c = new OffscreenCanvas(1024, 380), ctx = c.getContext('2d')!;
  ctx.font = '700 300px Satoshi'; ctx.textAlign = 'center';
  ctx.fillText(text, 512, 300);
  const { data } = ctx.getImageData(0, 0, 1024, 380);
  const pts = new Float32Array(count * 3);
  for (let i = 0; i < count;) {
    const x = Math.random() * 1024 | 0, y = Math.random() * 380 | 0;
    if (data[(y * 1024 + x) * 4 + 3] > 128) {
      pts[i*3]   = (x - 512) / 90;
      pts[i*3+1] = (190 - y) / 90;
      pts[i*3+2] = (Math.random() - .5) * .5;
      i++;
    }
  }
  return pts;
}
```

Per stat window (¼ of the pin): particles `damp` from a noise sphere → glyph targets (**condense**, first 35%), hold with ±0.02u shimmer (**hold**, 40%), then burst along curl-noise velocities (**exhale**, last 25%) and re-seed for the next figure. Points: additive, size-attenuated, gold-300 core / teal-300 rim by distance. Beneath the canvas a DOM caption (`aria-live="polite"`) counts up with `counter()` (§12) in tabular figures — screen readers and LITE devices get real numbers, always.

**Mobile.** 2600 points, two stats per pin screen. **LITE/STATIC:** DOM-only — big Satoshi numerals counting up on `whileInView`, gold underline draws beneath. Still beautiful.

---

### S7 · Testimonials — "Voices" *(pinned 300vh, 3 chapters)*

**Direction.** One family at a time, full-bleed. A portrait that breathes, a voice made visible, words that arrive as if spoken.

**Per chapter.** Left: portrait in a tall arch mask — breathing loop (`scale 1↔1.014`, 4s `sine.inOut`) over a slower background plate (parallax ±14px, the "alive" two-layer trick). Beneath it: a 44-bar waveform (SVG rects, heights from a stored noise array) animating `scaleY` while the chapter is active — motion only, muted by default. Right: the quote, split to words, each word scrubbed `opacity .16 → 1` across the chapter window (kinetic captions — reading pace bound to scroll pace), then attribution + relationship (*"Daughter of a Dhrishta elder-care family, Tirupati"*) fades up. Chapter swaps use the S2 clip-path curtain.

**Mobile.** Unpinned; portrait 4:5 above quote; words reveal via `whileInView` batches of 6.

---

### S8 · Gallery — "A Wall of Moments" *(unpinned · R3F, own scroll behavior)*

**Direction.** Real photographs — hands, shared meals, walks, festivals — as a gently curved 3D wall that never stops drifting. Care, in the plural.

**3D spec.** 18–24 image planes on a cylinder segment (radius 9u, 3 rows), textures via KTX2, slight per-plane `rotY` toward camera. Idle drift `x: 0.12u/s`, direction nudged by scroll velocity (`useScrollStore.velocity`). Pointer drag → inertia (velocity damped λ 2.5); hover: plane lifts z +0.5, scale 1.06, neighbors dim to 55%; cursor label "view". Click → FM `layoutId` shared-element expand into a DOM lightbox (caption, date, location; `Esc`/backdrop closes; Lenis stopped while open).

**Mobile.** Momentum swipe strip (FM drag, `scroll-snap` assist), 4:5 cards, tap → same lightbox.
**Fallback.** Two-column masonry, `scaleIn` on view.

---

### S9 · FAQ — "Unfolding" *(no pin — stillness before the finale)*

**Direction.** Eight honest questions (costs, caregiver vetting, emergencies, trial periods, languages spoken, doctor coordination, equipment, switching caregivers). Each answer unfolds like a letter — physical, soft, never an accordion snap.

```tsx
<motion.li layout transition={springs.soft} className="faq-item">
  <button aria-expanded={open} onClick={toggle}>…</button>
  <AnimatePresence initial={false}>
    {open && (
      <motion.div layout style={{ transformOrigin: 'top', transformPerspective: 900, overflow: 'hidden' }}
        initial={{ rotateX: -92, opacity: 0, height: 0 }}
        animate={{ rotateX: 0,  opacity: 1, height: 'auto', transition: springs.paper }}
        exit={{    rotateX: -60, opacity: 0, height: 0, transition: { duration: .32, ease: [.55,0,.8,.4] } }}>
        <motion.p variants={fadeUp} initial="hidden" animate="show">{answer}</motion.p>
      </motion.div>
    )}
  </AnimatePresence>
</motion.li>
```

`springs.paper` (stiffness 170 / damping 21) gives exactly one gentle overshoot — paper settling, not jelly. Siblings reflow via `layout` on the parent list. Hairline `--mist-300` rules between items; question numbers in gold tabular figures (a real sequence, so numbering is earned).

---

### S10 · Contact — "The Sunset Walk" *(finale, ~350vh + footer)*

**Direction.** The film's last shot. A wide dusk sky; two silhouettes — caregiver and elder, arm in arm — walking a gentle rise. As the user scrolls, the sun sets, the sky deepens ivory → amber → navy, first stars arrive, and a warm glass card extends the hand: **"Let's plan the right care, together."**

**Staging & motion.**
- Sky: full-bleed div, CSS `background` scrubbed through 3 gradient keys via a GSAP-tweened `--dusk` variable (0→1). The sun is a radial-gradient layer translating down-left (the signature shaft's final descent). Stars: pre-scattered 1px dots, `opacity` staggered in past `--dusk: .6`.
- Silhouettes: layered SVG (hill, figures) with a subtle 2-pose walk morph (MorphSVG, 1.8s `sine.inOut` loop) and ±8px breeze sway on the grass path; parallax between hill and figures.
- The glass `<ContactCard>` rises (`fadeUp`, 40px, once at 55%): name / phone / city / care-type select / message. FM floating labels (label `y/scale` spring on focus), 1.5px teal underline draws on focus, validation shakes ±4px ×2 with clay message sliding under (`aria-describedby`), success = emerald tick DrawSVG + "A care advisor will call you within 2 hours."
- Direct row: phone (tap-to-call), WhatsApp, email — families in a hurry skip forms.
- `<AudioToggle>` (nav-persistent, off by default) crossfades a 60s ambient morning loop, gain-ramped 1.2s, paused on `visibilitychange`.
- **Footer reveal:** footer is `position: fixed; bottom: 0; z-index: -1` behind `<main>`; main's end simply slides up to uncover it (the classic rise — zero animation cost). Navy surface, ivory type, sitemap, licences/registrations, "Made with care in Andhra Pradesh."

**Mobile.** Sky scrub shortened; form full-width; sticky tap-to-call bar appears after 85% page depth.


---

## 09 · ScrollTrigger Master Map

The whole film on one page. Total choreographed scroll ≈ **26–28 viewport heights** desktop.

| # | Scene | Trigger | Start → End | Pin | Scrub | Snap | Writes store | Choreography summary |
|---|---|---|---|---|---|---|---|---|
| 1 | Hero | `#hero` | `top top → +=300%` | ✓ | `true` | — | `hero` | Sequence f0→120, headline exit @.26, vignette @.5, CTA @.84 |
| 2 | Story | `#story` | `top top → +=500%` | ✓ | `true` | `1/5 ·.4s` | — | 5 chapter curtains, media parallax, warmth var 0→1, rail draw |
| 3 | Services | `#services` | `top top → +=400%` | ✓ | `true` | `1/8 ·.45s` | `services` | Arc rotation 8 steps, active-object focus, panel swaps |
| 4 | Journey | `#journey` | `top 75% → bottom 60%` | — | `0.6` | — | `journey` | Path DrawSVG; +6 node triggers `top 68%` (once) |
| 5 | Why Us | `#islands` | `top top → +=150%` | ✓ | `true` | — | `islands` | Flotilla pan, depth interleave; pointer parallax independent |
| 6 | Stats | `#stats` | `top top → +=350%` | ✓ | `true` | `1/4 ·.4s` | `stats` | 4× condense→hold→exhale particle cycles + DOM counters |
| 7 | Testimonials | `#voices` | `top top → +=300%` | ✓ | `true` | `1/3 ·.4s` | — | 3 chapters: curtain, breathing portrait, word-scrub quotes |
| 8 | Gallery | `#gallery` | `top 85% → bottom 15%` | — | vel only | — | `gallery` | Wall drift speed ← scroll velocity; drag/hover local |
| 9 | FAQ | items | `whileInView` (FM) | — | — | — | — | fadeUp list; unfold is state-driven |
| 10 | Contact | `#contact` | `top 60% → bottom bottom` | — | `0.7` | — | `contact` | `--dusk` 0→1, sun descent, stars, card rise @55% |
| — | Global | `body` | page | — | — | — | `velocity` | `ScrollTrigger.getVelocity` → store (dust, wall, skew accents) |

**Ordering rules:** pins never nest; refresh runs after preloader, after fonts, after sequence-resolution swaps; all triggers created inside their scene's `gsap.context`.

---

## 10 · Three.js / R3F Scene Architecture

### 10.1 The Stage (one context for the whole site)

```tsx
// components/canvas/Stage.tsx  (dynamic import, ssr: false)
<Canvas
  dpr={tierDPR}                       // [1,2] | [1,1.5] | 1
  gl={{ antialias: tier !== 'LITE', powerPreference: 'high-performance', alpha: true }}
  camera={{ fov: 32, near: .1, far: 40 }}
  frameloop="always"                   // gsap.ticker drives Lenis; R3F drives itself
  onCreated={({ gl }) => { gl.outputColorSpace = SRGBColorSpace;
                           gl.toneMapping = ACESFilmicToneMapping; gl.toneMappingExposure = 1.05; }}>
  <Suspense fallback={null}>
    <SharedEnv />                      {/* single 1k HDRI: warm interior morning */}
    <SceneRouter />                    {/* mounts scene groups by DOM proximity */}
    {tier === 'CINEMATIC' && <PostFX />}
  </Suspense>
</Canvas>
```

- **Canvas placement:** `position: fixed; inset: 0` behind DOM (`z-index` map per scene; DOM copy always above canvas except S8 hover labels).
- **SceneRouter:** an IntersectionObserver (rootMargin `150% 0%`) toggles `visible` per scene group → mounts within `<Suspense>`, sets `group.visible`, and pauses that group's `useFrame` work when hidden (each scene early-returns on its own `active` flag). One context, zero cross-scene cost.
- **Lighting:** HDRI env (intensity .9) + one warm key `DirectionalLight` (gold-tinted, .7) + large soft `AmbientLight` (.25). Shadows: CINEMATIC uses a single 1024 PCFSoft map on S3/S5 grounds; others use baked contact-shadow textures.
- **PostFX (pmndrs/postprocessing):** `Bloom (intensity .35, luminanceThreshold .8)` + `DepthOfField (focusDistance from active object, bokehScale 2.2)` + `Vignette (.18)` — CINEMATIC only, half-res composite.
- **Assets:** GLB + Draco (`gltf-transform`), KTX2/Basis textures, meshes instanced wherever repeated (dust, stars, gallery frames), `frustumCulled` on, LOD on service objects (hi ≤ 9u distance, lo beyond).
- **Memory:** dispose scene groups fully on unmount (`useEffect` cleanup traverses geometry/material/texture `.dispose()`); texture budget ≤ 90MB GPU.

### 10.2 Signature material — the light shaft

A vertical plane with an additive gradient shader (`gold-300 → transparent`, soft noise edge, fresnel fade at grazing angles), animated only by opacity/scale. Reused in S0 (DOM gradient), S1 (in-sequence + dust), S4 (SVG gold path), S6 (particle tint), S10 (setting sun). One motif, five appearances — the thread that binds the film.

---

## 11 · Micro-Interaction Library

| Element | Interaction | Spec |
|---|---|---|
| **Primary button** | Magnetic + glow | Follows pointer within 56px radius at 0.35 strength (spring return); hover: `scale 1.03`, inner gold sheen sweeps 600ms, shadow `key → float`; press: `scale .97` `springs.snappy`; ripple: teal-300 radial from pointer, 480ms fade |
| **Ghost button** | Underline draw | 1.5px teal underline draws left→right 240ms; arrow glyph nudges 4px |
| **Cards (DOM)** | Perspective tilt | `rotateX/Y ≤ 5°` from pointer via `useMotionValue`+`useSpring`; sheen pseudo-element tracks pointer; shadow interpolates; reset on leave `springs.soft` |
| **Icon tiles** | Elastic pop | Hover: `scale 1 → 1.12 → 1.06` (240ms), stroke color navy→teal 140ms |
| **Nav links** | Mask swap | Two stacked labels; hover slides both `-100%` (320ms `--ease-out`) — the classic double-label |
| **Nav bar** | Condense on scroll | Transparent over hero → glass + hairline after 80vh (velocity-aware: hides on fast down-scroll, returns on any up-scroll) |
| **Inputs** | Floating label | Label springs to overline position on focus/value; teal underline draws; error: ±4px shake ×2 + clay caption slides under |
| **Cursor (desktop)** | Contextual dot | 8px navy dot, 80ms spring trail; grows to 56px labeled disc over canvas ("drag"), gallery ("view"), links ("open"); hidden on coarse pointers; **purely decorative — never required for affordance** |
| **Scroll cue** | Breathing line | 1px × 48px gold line, `scaleY .4↔1` 2.4s `sine.inOut`, fades permanently at first scroll |
| **Toasts** | Slide-spring | Bottom-left, `springs.soft`, auto-dismiss 4s, `role="status"` |

```ts
// lib/animation/magnetic.ts — attach to any element
export function magnetic(el: HTMLElement, strength = .35, radius = 56) {
  const x = gsap.quickTo(el, 'x', { duration: .4, ease: 'power3.out' });
  const y = gsap.quickTo(el, 'y', { duration: .4, ease: 'power3.out' });
  const move = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
    Math.hypot(dx, dy) < radius + r.width / 2 ? (x(dx * strength), y(dy * strength)) : (x(0), y(0));
  };
  window.addEventListener('pointermove', move);
  return () => { window.removeEventListener('pointermove', move); x(0); y(0); };
}
```

---

## 12 · Reusable Animation Utilities

```ts
// hooks/useSectionTimeline.ts — every scene's foundation (scoped, HMR-safe, leak-proof)
export function useSectionTimeline(
  build: (ctx: { scope: HTMLElement; tier: Tier; reduced: boolean }) => void, deps: unknown[] = []
) {
  const scope = useRef<HTMLElement>(null);
  const tier = useTierStore(s => s.tier);
  const reduced = tier === 'STATIC';
  useLayoutEffect(() => {
    if (!scope.current) return;
    const ctx = gsap.context(() => build({ scope: scope.current!, tier, reduced }), scope);
    return () => ctx.revert();
  }, [tier, ...deps]);
  return scope;
}
```

```ts
// lib/animation/sequence.ts — the image-sequence engine (hero + reusable)
export function createSequence(canvas: HTMLCanvasElement, opts: {
  frames: number; path: (i: number) => string; fit?: 'cover';
}) {
  const ctx = canvas.getContext('2d')!;
  const imgs: HTMLImageElement[] = [];
  const state = { frame: 0 };
  let raf = 0;

  const draw = () => {                                   // cover-fit blit, DPR-aware
    const img = imgs[Math.round(state.frame)]; if (!img?.complete) return;
    const dpr = Math.min(devicePixelRatio, 2);
    canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
    const s = Math.max(canvas.width / img.width, canvas.height / img.height);
    ctx.drawImage(img, (canvas.width - img.width * s) / 2,
                       (canvas.height - img.height * s) / 2, img.width * s, img.height * s);
  };

  // Priority loading: frame 0 → every 6th (scaffold) → fill. Draw improves as data arrives.
  const load = (i: number) => { const im = new Image();
    im.src = opts.path(i); im.decode?.().then(() => { imgs[i] = im; if (Math.round(state.frame) === i) draw(); });
    imgs[i] = im; };
  load(0);
  for (let i = 6; i < opts.frames; i += 6) load(i);
  requestIdleCallback?.(() => { for (let i = 1; i < opts.frames; i++) if (!imgs[i]) load(i); });

  Object.defineProperty(state, 'render', { value: () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); } });
  window.addEventListener('resize', draw);
  return new Proxy(state, { set(t, k, v) { (t as any)[k] = v; (t as any).render(); return true; } });
}
// GSAP usage: tl.to(seq, { frame: 120, snap: 'frame', ease: 'none' })
```

```ts
// lib/animation/split.ts — SplitText wrapper with mask spans + cleanup
export function splitMask(el: Element, by: 'words' | 'lines' = 'words') {
  const split = new SplitText(el, { type: by, [`${by}Class`]: 'split-child' });
  (split as any)[by].forEach((n: Element) => {
    const wrap = document.createElement('span');
    wrap.className = 'split-mask';                 // overflow:hidden; display:inline-block
    n.replaceWith(wrap); wrap.appendChild(n);
  });
  return { targets: (split as any)[by] as Element[], revert: () => split.revert() };
}

// lib/animation/counter.ts — tabular count-up (S6 captions, anywhere)
export function counter(el: HTMLElement, to: number, { duration = 1.6, suffix = '' } = {}) {
  const obj = { v: 0 };
  return gsap.to(obj, { v: to, duration, ease: 'power2.out',
    onUpdate: () => { el.textContent = Math.round(obj.v).toLocaleString('en-IN') + suffix; } });
}
```

```tsx
// lib/animation/parallax.ts — declarative depth for any DOM node: <div data-parallax="0.15" />
export function initParallax(scope: HTMLElement) {
  scope.querySelectorAll<HTMLElement>('[data-parallax]').forEach(el => {
    const speed = parseFloat(el.dataset.parallax!);
    gsap.fromTo(el, { yPercent: speed * 22 }, { yPercent: speed * -22, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: .6 } });
  });
}
```

Also in the kit: `usePointerParallax(ref, {x, y})` (spring-lerped NDC for R3F cameras & tilt), `useInViewOnce` (FM viewport wrapper with shared margins), `useReducedMotion` (tier-aware), `wrapProgress(p, a, b)` (normalize a sub-window of a master timeline — used by S2/S6/S7 chapter math).

---

## 13 · State Management Architecture

Zustand — four tiny stores, no context providers, no prop-drilling. Server data (contact POST) is a route handler; the film itself is stateless content from `/content`.

```ts
stores/scroll.ts     // §07.3 — scroll progress + velocity. Written by GSAP, read in useFrame. Never triggers React renders.
stores/tier.ts       // { tier, setTier } — detectTier() at boot, FPS governor may demote (§07.5).
stores/preloader.ts  // { progress: 0–1, phase: 'loading'|'reveal'|'done' } — gates Lenis + entrance timelines.
stores/ui.ts         // { menuOpen, lightbox: id|null, cursorVariant: 'dot'|'drag'|'view'|'open', activeService: i }
stores/audio.ts      // { enabled, toggle } — persisted to localStorage; gain ramping lives in AudioToggle.
```

Selector discipline: components subscribe to single slices (`useUiStore(s => s.menuOpen)`); anything frame-rate-sensitive uses `getState()` inside tickers. Rule of thumb: **React renders on intent (clicks), never on motion.**

---

## 14 · Loading Strategy

**Phase 0 — HTML (RSC).** Critical CSS (tokens + hero layout) inlined; fonts preloaded (`woff2`, crossorigin); hero frame-0 `<link rel=preload as=image fetchpriority=high>` (this *is* LCP); JSON-LD inline; everything below S1 is plain semantic HTML immediately (SEO reads the full story with JS off).

**Phase 1 — Boot (≤ 1.2s budget on 4G).** Tier detect → Lenis (stopped) → preloader mounts → parallel: font `document.fonts.ready`, hero frames 0–24 (priority queue §12), WebGL context + HDRI (CINEMATIC/BALANCED only).

**Phase 2 — Reveal.** Curtains (§S0) → entrance timeline → `lenis.start()` → `ScrollTrigger.refresh()`.

**Phase 3 — Ambient streaming.** `requestIdleCallback`: remaining hero frames → S2 imagery → GLBs (draco) → S6/S8 textures. An IntersectionObserver at `rootMargin: 300%` prefetches each scene's heavy assets two viewports early — by the time you arrive, it's warm. Ambient audio loads only on first toggle.

**Failure posture.** Any 3D asset that errors or exceeds a 6s timeout resolves its scene to the Tier-LITE DOM variant silently. The film never shows a spinner mid-story.

---

## 15 · Performance Engineering

### 15.1 Budgets (enforced in CI)

| Metric | Budget |
|---|---|
| First-load JS (gz, hero route) | ≤ 300KB total · initial chunk ≤ 140KB (three.js is *not* in it) |
| LCP (hero frame 0, 4G mid-tier) | ≤ 2.0s |
| CLS | ≤ 0.01 (all media has intrinsic size; pins reserve space) |
| INP | ≤ 150ms |
| Hero frame 0 | ≤ 130KB AVIF · full sequence ≤ 5.5MB desktop / 2.8MB mobile |
| GLB total (draco) | ≤ 3.5MB · GPU textures ≤ 90MB |
| Fonts | 2 files, ≤ 220KB total, subset |
| Lighthouse | Perf ≥ 95 · A11y 100 · Best Practices 100 · SEO 100 |

### 15.2 Checklist

- [ ] Only `transform`/`opacity`/`clip-path(inset)` animate; `will-change` applied by GSAP only while tweening (never persistent).
- [ ] Zero per-frame React renders (verified with React DevTools profiler during a full scroll).
- [ ] Zero layout thrash: all measurements in `ScrollTrigger.refresh` / batched reads.
- [ ] Canvas DPR capped per tier; postFX half-res; `frameloop` work early-returns for hidden scene groups.
- [ ] Sequences AVIF+WebP, three resolutions, `immutable` cache headers; images via `next/image` with `sizes`.
- [ ] Draco + KTX2 + instancing + LOD + frustum culling (§10).
- [ ] Dynamic-import every canvas + every below-fold scene (§20.1); three.js in its own async chunk.
- [ ] No third-party scripts. Analytics = Vercel + a 1KB custom beacon (fps p50/p95, tier, LCP) sampled at 10%.
- [ ] FPS governor live-demotes tier (§07.5); demotions logged to the beacon.
- [ ] `content-visibility: auto` on non-pinned late sections (S9, footer).
- [ ] Test rig: 6× CPU throttle + mid-tier Android (see §21) — 60fps floor holds.

---

## 16 · Mobile Experience Strategy

Not shrunk — **re-directed**. Same story, thumb-native grammar.

- **Grammar swap:** desktop explores with pointer depth; mobile explores with **swipe + momentum**. S3 becomes a drag deck, S8 a momentum strip, S5 offset tilt-cards. Pins shorten ~30% (touch scroll covers distance faster).
- **Lenis:** `syncTouch: false` — native momentum is what thumbs trust; ScrollTrigger still syncs perfectly.
- **3D:** BALANCED keeps hero dust, particles (2600), gallery wall; LITE keeps zero WebGL and still looks intentional (pre-rendered object PNGs, DOM counters, static grade overlays).
- **Layout:** type floors (§03.2 clamps), tap targets ≥ 44px, CTAs above the home-indicator zone, sticky call bar after 85% depth, `100svh` units (URL-bar-safe) + `ignoreMobileResize`.
- **Weight:** mobile ships ≤ 55% of desktop bytes (720/1080 sequences, fewer frames, no postFX chunk).
- **Haptics-adjacent:** touch feedback via `whileTap` scale everywhere — the site "presses back."

---

## 17 · Accessibility (WCAG 2.2 AA+)

**Motion**
- [ ] `prefers-reduced-motion` → tier STATIC: scrub scenes render final art-directed frames, 240ms crossfades only, particles/parallax/magnetic/cursor off, counters set instantly. The narrative fully survives (§08 fallbacks).
- [ ] In-page motion toggle in the nav (persisted) — not everyone sets the OS flag.
- [ ] No flashing > 3Hz anywhere; ambient audio strictly opt-in.

**Structure & semantics**
- [ ] One `<h1>` (hero); scenes are `<section aria-labelledby>` in logical order; landmarks `header/main/footer/nav`.
- [ ] Full keyboard path: skip-link → nav → CTAs → services (arrow keys rotate arc; focus mirrors active object) → FAQ buttons (`aria-expanded`) → form. Lightbox & menu trap focus, `Esc` closes, focus returns.
- [ ] `:focus-visible`: 2px gold-500 ring + 2px offset on every interactive element — on-brand, 3:1 against both surfaces.
- [ ] Canvas scenes: `role="img"` + rich `aria-label` narrating the shot (*"Morning light falls across a living room as a caregiver helps an elderly woman with her tea"*); decorative layers `aria-hidden`.
- [ ] Kinetic/scrubbed text is real DOM text (SplitText output) — screen readers read the plain sentence; S6 counters `aria-live="polite"` announcing final values once.
- [ ] Custom cursor is decorative; native cursor & hit-areas untouched. Gallery drag has button alternatives (prev/next, visually subtle, focusable).

**Contrast & forms**
- [ ] Verified pairs: navy-900/ivory 14.6:1 · navy-500/ivory 7.1:1 · teal-700 small-text 7.5:1 · ivory-on-navy (inverted scenes) 14.6:1 · gold used ≥ 24px or non-text only.
- [ ] Labels always visible (floating ≠ disappearing), errors text+color+icon, `autocomplete` attrs, no time limits.
- [ ] Audit: axe-core CI + NVDA/VoiceOver manual pass + keyboard-only full journey each release.

---

## 18 · SEO & Structured Data

- [ ] Metadata API: title `Dhrishta Health Care Services — Home Nursing, Elder & Day Care in Andhra Pradesh`, 155-char description, canonical, OG/Twitter (`summary_large_image`) with the edge-generated hero card.
- [ ] Semantic HTML renders fully server-side — the whole story is crawlable text before any animation code runs.
- [ ] `sitemap.ts`, `robots.ts`, `manifest.ts`; self-referencing canonical; single-page anchors excluded from sitemap.
- [ ] Performance signals (LCP/CLS/INP budgets §15) are the ranking work — the film must also be *fast furniture*.

```ts
// lib/seo/jsonld.ts (rendered inline in RSC layout)
{
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'MedicalBusiness'],
  name: 'Dhrishta Health Care Services',
  description: 'Home nursing, elder care, day care and post-surgery care delivered at home.',
  areaServed: { '@type': 'State', name: 'Andhra Pradesh' },
  address: { '@type': 'PostalAddress', addressLocality: 'Tirupati', addressRegion: 'AP', addressCountry: 'IN' },
  telephone: '+91-XXXXXXXXXX',
  openingHoursSpecification: { '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
    opens: '00:00', closes: '23:59' },
  hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Care services',
    itemListElement: services.map(s => ({ '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.name, serviceType: s.type } })) },
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '210' }, // real data only
  sameAs: [/* Google Business Profile, socials */],
}
// + a separate FAQPage entity built from content/faqs.ts
```

---

## 19 · Asset Pipeline & Image Optimization

### 19.1 Hero sequence

```
Blender/Cycles (or gimbal footage) → 24fps master, 5s dolly, 2400px ProRes
→ ffmpeg -i hero_master.mov -vf "fps=24,scale=1600:-2" f%04d.png          # 121 frames
→ sharp/avifenc batch: quality 52, effort 6  → also 1080px & 720px sets, WebP fallbacks
Naming: /sequences/hero/{res}/f0001.avif …  · headers: Cache-Control: public, max-age=31536000, immutable
Grade: single LUT across sequence + S2 photography (one film, one grade)
```

### 19.2 3D assets

```
Blender → glTF  → gltf-transform optimize in.glb out.glb --compress draco --texture-compress ktx2
HDRI: 1k .hdr (warm interior morning), PMREM at runtime · service-object PNG renders for mobile deck (transparent, 640px, ≤ 28KB each)
Audio: 60s seamless loop, 96kbps mono MP3 + AAC (~700KB), lazy on first toggle
```

### 19.3 Image plan

- All stills through `next/image`: AVIF→WebP auto, correct `sizes`, blur placeholders (8px base64), `priority` only on hero frame 0.
- Art direction: S2 chapters ship 4:5 mobile crops + 21:9 desktop crops via `<picture>` — faces stay in frame at every ratio.
- Gallery: 800px KTX2 for the 3D wall, 1600px AVIF for the lightbox (loaded on open).
- Grain/noise: one tiled 128px PNG (1.2KB), reused site-wide.
- Every asset has intrinsic dimensions (CLS 0); alt text written as narration, not filenames.

---

## 20 · Code Splitting & Progressive Enhancement

### 20.1 Split map

```
entry (≤140KB gz): RSC shell · tokens · Lenis · gsap core+ScrollTrigger · S1 DOM · preloader
async: three+R3F+drei chunk (on tier ≥ BALANCED, after reveal)
async per scene: S2…S10 via next/dynamic (ssr: true for DOM, ssr: false for canvas/*)
async on intent: lightbox, audio, MorphSVG (S10 only), contact form logic (on focus)
```

Each canvas scene dynamic-imports its own textures/models; nothing 3D blocks first paint.

### 20.2 Enhancement ladder (every rung is a complete site)

```
0 · No JS         → full semantic story, all copy & images, native form POST, static hero frame
1 · JS, no WebGL  → Lenis + GSAP DOM film: sequences, curtains, counters, FAQ, form  (≈ LITE)
2 · WebGL         → + dust, service objects, islands, particle digits, gallery wall  (BALANCED)
3 · CINEMATIC     → + postFX (bloom/DoF), 120fps, full particle counts, soft shadows
```

Feature-detect, never UA-sniff (except GPU renderer string for tiering). SSR HTML identical on every rung.

---

## 21 · Testing & QA Checklist

**Automated (CI on every PR)**
- [ ] TypeScript strict + ESLint (`jsx-a11y`) clean · Lighthouse CI against §15 budgets (fails build)
- [ ] axe-core zero critical/serious · Playwright: preloader completes, full-page scroll runs without console errors, form validates & submits, FAQ/lightbox keyboard flows, reduced-motion snapshot diffs
- [ ] Visual regression: Playwright screenshots at scroll 0/25/50/75/100% × 3 viewports × normal/reduced-motion
- [ ] Bundle-size guard (`size-limit`) on entry + three chunk

**Manual protocol (per release)**
- [ ] FPS trace (Chrome perf, 6× CPU): full scroll ≥ 55fps LITE floor; desktop trace ≥ 110fps
- [ ] Device matrix: M-series Mac (120Hz) · mid Windows/integrated GPU · iPhone 12+ · Pixel 6a / ₹15k Android · iPad Safari
- [ ] Networks: Fast 3G cold load (preloader ≤ 4s cap honored), offline after load (no crashes)
- [ ] Screen readers: VoiceOver iOS + NVDA — full narrative comprehensible, counters announced once
- [ ] Keyboard-only complete journey · 200% zoom reflow · `prefers-contrast: more` spot-check
- [ ] Content: copy proofread, phone/WhatsApp live-tested, form → notification received ≤ 60s, all placeholder stats replaced with verified numbers

---

## 22 · Production Deployment Checklist

- [ ] Vercel (or equivalent): static export where possible, edge network for `/sequences` & media with `immutable` headers, Brotli on
- [ ] Env secrets (Resend/SMTP key, rate-limit KV) set; `/api/contact` rate-limited (5/min/IP) + honeypot + zod validation
- [ ] Security headers: CSP (self + none needed beyond), HSTS, `Referrer-Policy`, `Permissions-Policy` (camera/mic/geo off)
- [ ] Error boundaries per scene → LITE fallback render + beacon report; Sentry (sampled) optional
- [ ] Monitoring: Vercel Analytics + custom fps/tier beacon dashboard; alert if p75 LCP > 2.5s or fps p50 < 50
- [ ] `robots` allow, sitemap submitted, Google Business Profile linked, OG validated (X/WhatsApp/LinkedIn preview)
- [ ] 404 page on-brand (lost-lantern motif, one line, one CTA home)
- [ ] Rollback plan: previous deployment pinned; sequences versioned by folder (`/hero/v1/`) so caches never mismatch
- [ ] Launch pass: run full §21 manual protocol on the production URL, real devices, before announcement

---

## 23 · Future Scalability Plan

**Phase 2 (0–3 months post-launch).** Headless CMS (Sanity) replacing `/content/*.ts` — schema mirrors the existing types, so it's a data-source swap, zero animation changes. Care-advisor booking (Cal.com embed styled to tokens). Blog/"Care Journal" (MDX, shares the token system, no 3D — fast editorial surface).

**Phase 3.** **i18n: Telugu + Hindi + English** via `next-intl` — the fluid type scale and 62ch measures already tolerate Telugu's taller script (test Display face fallback: Noto Sans Telugu paired with Satoshi Latin). City landing pages (`/care/tirupati`, `/care/vijayawada`) reusing S1+S4+S10 as a template with localized JSON-LD.

**Phase 4.** Family portal (auth, daily care updates) as a separate app sharing `tokens.css` + `ui/` via a small internal package; the marketing film stays static-fast. WhatsApp Business API for care-advisor handoff.

**Design-system longevity.** Tokens are the contract: any new surface (portal, print, decks) consumes the same ivory/navy/teal/gold system. New scenes follow the §08 template (Direction → Staging → Motion → Mobile → Fallback) so the film can grow without diluting.

---

## 24 · Build Order (Suggested Sprints)

| Sprint | Ship | Exit criteria |
|---|---|---|
| 1 | Foundations: tokens, Tailwind map, fonts, Lenis+GSAP+bridge, tier detect, chrome (nav/cursor/progress), preloader shell | Empty film scrolls at 120fps; tiers verified on 3 devices |
| 2 | S1 Hero end-to-end: sequence pipeline, entrance + scrub, dust, LCP ≤ 2s | The first 300vh already feels like the final site |
| 3 | S2 Story + S4 Journey (the DOM film) | Emotional spine complete; reduced-motion variant reads perfectly |
| 4 | S3 Services + S5 Islands (R3F Stage, materials, panels, mobile decks) | 60fps on Pixel 6a; keyboard path through services |
| 5 | S6 Stats + S7 Voices + S8 Gallery | Particles, portraits, wall + lightbox; governor tested |
| 6 | S9 FAQ + S10 Contact + footer + audio + form API | Full journey; axe + Lighthouse budgets green |
| 7 | Polish week: §21 protocol, copy pass, grade consistency, micro-interaction tuning, real-device sweep | Launch checklist §22 fully checked |

---

*End of blueprint. Every scene, easing, and byte budget above is intentional — build it exactly, and Dhrishta will have a site that doesn't show care services; it makes people feel cared for before they ever pick up the phone.*
