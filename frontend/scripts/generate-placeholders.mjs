/**
 * Generates "morning light" SVG placeholder images for the site
 * (art direction: docs/design/MORNING_LIGHT_BLUEPRINT.md — ivory, navy ink,
 * healing teal, soft gold; every image is a lit scene, never a flat card).
 *
 * Run: node scripts/generate-placeholders.mjs
 * Replace any generated file in public/images with a real photo (same name)
 * when photography becomes available — components reference paths only.
 */
import { mkdirSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images')

/* Palette — the only colors that ship (morning-light tokens). */
const C = {
  ivory050: '#FDFDFB',
  ivory100: '#FAF7F1',
  ivory200: '#F2EEE5',
  mist: '#E4E4DE',
  navy900: '#0A1B2E',
  navy700: '#16324F',
  navy500: '#405872',
  teal600: '#1F6F6B',
  teal500: '#2E8B84',
  teal300: '#A7D3CE',
  gold500: '#C29A55',
  gold300: '#EAD9B0',
  emerald: '#2E7D5B',
  clay: '#A9503C',
  rose: '#A9536B',
  plum: '#6E5A8E',
}

/*
 * Exposures — "one palette, two exposures, like day and dusk of the same house".
 * glow: the radial light color · tint: accent hue · dark: night scene
 */
const EXPOSURES = {
  dawn: { glow: C.gold300, tint: C.gold500, dark: false },
  teal: { glow: C.teal300, tint: C.teal500, dark: false },
  sage: { glow: '#CFE4D8', tint: C.emerald, dark: false },
  rose: { glow: '#F0D8DF', tint: C.rose, dark: false },
  plum: { glow: '#E2DBEE', tint: C.plum, dark: false },
  clay: { glow: '#F0DCD4', tint: C.clay, dark: false },
  mist: { glow: C.mist, tint: C.navy500, dark: false },
  dusk: { glow: C.gold500, tint: C.gold300, dark: true },
}

let uid = 0

/** Shared defs: field gradient, light shaft, window glow, grain. */
function defs(id, { dark, glow }) {
  return `<defs>
    <linearGradient id="field${id}" x1="0" y1="0" x2="0" y2="1">
      ${dark
        ? `<stop offset="0" stop-color="${C.navy700}"/><stop offset="1" stop-color="${C.navy900}"/>`
        : `<stop offset="0" stop-color="${C.ivory050}"/><stop offset="1" stop-color="${C.ivory200}"/>`}
    </linearGradient>
    <radialGradient id="glow${id}" cx="0.24" cy="0.08" r="0.9">
      <stop offset="0" stop-color="${glow}" stop-opacity="${dark ? 0.5 : 0.55}"/>
      <stop offset="0.55" stop-color="${glow}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="shaft${id}" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0" stop-color="${dark ? C.gold300 : C.gold300}" stop-opacity="${dark ? 0.55 : 0.65}"/>
      <stop offset="0.6" stop-color="${C.gold500}" stop-opacity="0.12"/>
      <stop offset="1" stop-color="${C.gold500}" stop-opacity="0"/>
    </linearGradient>
    <filter id="soft${id}" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="26"/>
    </filter>
    <filter id="grain${id}">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.05"/></feComponentTransfer>
      <feComposite operator="over" in2="SourceGraphic"/>
    </filter>
  </defs>`
}

/** Drifting dust motes inside the light. */
function motes(id, w, h, dark) {
  const pts = []
  let seed = 9 + id
  const rand = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  for (let i = 0; i < 14; i++) {
    const x = w * (0.08 + rand() * 0.5)
    const y = h * (0.08 + rand() * 0.6)
    const r = 1.2 + rand() * 2.6
    const o = 0.18 + rand() * 0.4
    pts.push(`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" fill="${dark ? C.gold300 : C.gold500}" opacity="${o.toFixed(2)}"/>`)
  }
  return pts.join('\n    ')
}

/** The Dhrishta mark — heart + pulse line. */
function mark(x, y, s, color, opacity = 1) {
  return `<g transform="translate(${x},${y}) scale(${s})" opacity="${opacity}">
    <path d="M0 18 C0 6 10-2 19 4 c3 2 5 5 6 8 1-3 3-6 6-8 9-6 19 2 19 14 0 14-18 24-25 28 C18 42 0 32 0 18z" fill="none" stroke="${color}" stroke-width="3"/>
    <path d="M8 22 h10 l4-8 7 18 4-8 h11" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </g>`
}

/**
 * A lit scene: warm field, radial glow, one gold light shaft, an arch window
 * with light pooling beneath it, dust motes, caption set bottom-left.
 */
function scene({ w, h, exposure = 'dawn', label, sub, overline, showCaption = true }) {
  const id = ++uid
  const ex = EXPOSURES[exposure] || EXPOSURES.dawn
  const inkMain = ex.dark ? C.ivory100 : C.navy900
  const inkSub = ex.dark ? C.teal300 : C.navy500
  const line = ex.dark ? 'rgba(250,247,241,0.22)' : 'rgba(10,27,46,0.14)'
  const archX = w * 0.72
  const archW = w * 0.17
  const archY = h * 0.16
  const archH = h * 0.52
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">
  ${defs(id, ex)}
  <rect width="${w}" height="${h}" fill="url(#field${id})"/>
  <rect width="${w}" height="${h}" fill="url(#glow${id})"/>
  <!-- light shaft entering from upper left -->
  <polygon points="${w * 0.12},${-h * 0.1} ${w * 0.34},${-h * 0.1} ${w * 0.62},${h * 1.05} ${w * 0.28},${h * 1.05}"
    fill="url(#shaft${id})" filter="url(#soft${id})"/>
  <!-- arch window with pooling light -->
  <g>
    <path d="M${archX} ${archY + archH} v-${archH - archW / 2} a${archW / 2} ${archW / 2} 0 0 1 ${archW} 0 v${archH - archW / 2} z"
      fill="${ex.dark ? 'rgba(234,217,176,0.14)' : 'rgba(234,217,176,0.35)'}" stroke="${line}" stroke-width="2"/>
    <line x1="${archX + archW / 2}" y1="${archY + archW * 0.1}" x2="${archX + archW / 2}" y2="${archY + archH}" stroke="${line}" stroke-width="1.5"/>
    <ellipse cx="${archX + archW / 2}" cy="${h * 0.74}" rx="${archW * 0.85}" ry="${h * 0.045}"
      fill="${C.gold300}" opacity="${ex.dark ? 0.2 : 0.4}" filter="url(#soft${id})"/>
  </g>
  <!-- horizon hairline -->
  <line x1="${w * 0.06}" y1="${h * 0.74}" x2="${w * 0.94}" y2="${h * 0.74}" stroke="${line}" stroke-width="1.5"/>
  ${motes(id, w, h, ex.dark)}
  ${mark(w - 92, 36, 0.82, ex.dark ? C.gold300 : ex.tint, 0.75)}
  ${showCaption
    ? `<g font-family="Manrope, Arial, sans-serif">
    ${overline ? `<text x="${w * 0.06}" y="${h * 0.84 - 46}" font-size="${Math.max(13, w / 90)}" font-weight="600" letter-spacing="4.5" fill="${ex.dark ? C.gold300 : ex.tint}">${overline.toUpperCase()}</text>` : ''}
    <text x="${w * 0.06}" y="${h * 0.84 + (overline ? 0 : -10)}" font-size="${Math.max(24, w / 26)}" font-weight="700" letter-spacing="-0.5" fill="${inkMain}">${label}</text>
    ${sub ? `<text x="${w * 0.06}" y="${h * 0.84 + (overline ? 40 : 30)}" font-family="Inter, Arial, sans-serif" font-size="${Math.max(13, w / 68)}" fill="${inkSub}">${sub}</text>` : ''}
  </g>`
    : ''}
  <rect width="${w}" height="${h}" filter="url(#grain${id})" opacity="0.35" fill="none"/>
</svg>`
}

/** Portrait — arch of morning light behind a quiet silhouette. */
function portrait({ size = 320, exposure = 'dawn' }) {
  const id = ++uid
  const ex = EXPOSURES[exposure] || EXPOSURES.dawn
  const s = size
  const figure = ex.dark ? C.ivory200 : C.navy700
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}" role="img" aria-label="Portrait placeholder">
  ${defs(id, ex)}
  <rect width="${s}" height="${s}" fill="url(#field${id})"/>
  <rect width="${s}" height="${s}" fill="url(#glow${id})"/>
  <path d="M${s * 0.18} ${s} v-${s * 0.42} a${s * 0.32} ${s * 0.32} 0 0 1 ${s * 0.64} 0 v${s * 0.42} z"
    fill="${C.gold300}" opacity="${ex.dark ? 0.22 : 0.45}"/>
  <circle cx="${s / 2}" cy="${s * 0.42}" r="${s * 0.17}" fill="${figure}" opacity="0.92"/>
  <path d="M${s * 0.2} ${s} c${s * 0.04}-${s * 0.2} ${s * 0.16}-${s * 0.3} ${s * 0.3}-${s * 0.3} s${s * 0.26} ${s * 0.1} ${s * 0.3} ${s * 0.3} z" fill="${figure}" opacity="0.92"/>
  <circle cx="${s * 0.78}" cy="${s * 0.2}" r="2.6" fill="${C.gold500}" opacity="0.55"/>
  <circle cx="${s * 0.68}" cy="${s * 0.3}" r="1.8" fill="${C.gold500}" opacity="0.4"/>
  <circle cx="${s * 0.84}" cy="${s * 0.34}" r="1.4" fill="${C.gold500}" opacity="0.35"/>
  <rect width="${s}" height="${s}" filter="url(#grain${id})" opacity="0.3" fill="none"/>
</svg>`
}

/** Hero — a wide morning room: window light, two figures, a shared teacup moment. */
function hero({ w = 1400, h = 950 }) {
  const id = ++uid
  const ex = EXPOSURES.dawn
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Morning light falls across a living room as a caregiver sits with an elder">
  ${defs(id, ex)}
  <rect width="${w}" height="${h}" fill="url(#field${id})"/>
  <rect width="${w}" height="${h}" fill="url(#glow${id})"/>
  <!-- tall window, sheer light -->
  <g>
    <path d="M${w * 0.6} ${h * 0.62} v-${h * 0.34} a${w * 0.09} ${w * 0.09} 0 0 1 ${w * 0.18} 0 v${h * 0.34} z"
      fill="rgba(234,217,176,0.4)" stroke="rgba(10,27,46,0.16)" stroke-width="2.5"/>
    <line x1="${w * 0.69}" y1="${h * 0.22}" x2="${w * 0.69}" y2="${h * 0.62}" stroke="rgba(10,27,46,0.16)" stroke-width="2"/>
    <line x1="${w * 0.6}" y1="${h * 0.44}" x2="${w * 0.78}" y2="${h * 0.44}" stroke="rgba(10,27,46,0.16)" stroke-width="2"/>
  </g>
  <polygon points="${w * 0.58},${h * 0.2} ${w * 0.8},${h * 0.2} ${w * 0.52},${h * 1.02} ${w * 0.24},${h * 1.02}"
    fill="url(#shaft${id})" filter="url(#soft${id})"/>
  <!-- floor line -->
  <line x1="${w * 0.05}" y1="${h * 0.72}" x2="${w * 0.95}" y2="${h * 0.72}" stroke="rgba(10,27,46,0.14)" stroke-width="2"/>
  <!-- armchair + elder -->
  <g opacity="0.92">
    <path d="M${w * 0.24} ${h * 0.72} v-${h * 0.13} q0-${h * 0.035} ${w * 0.025}-${h * 0.035} h${w * 0.115} q${w * 0.025} 0 ${w * 0.025} ${h * 0.035} v${h * 0.13} z" fill="${C.teal600}" opacity="0.28"/>
    <circle cx="${w * 0.322}" cy="${h * 0.5}" r="${h * 0.045}" fill="${C.navy700}"/>
    <path d="M${w * 0.285} ${h * 0.72} c0-${h * 0.1} ${w * 0.008}-${h * 0.16} ${w * 0.037}-${h * 0.16} s${w * 0.037} ${h * 0.06} ${w * 0.037} ${h * 0.16} z" fill="${C.navy700}"/>
  </g>
  <!-- caregiver, leaning in with cup -->
  <g opacity="0.92">
    <circle cx="${w * 0.45}" cy="${h * 0.42}" r="${h * 0.04}" fill="${C.teal600}"/>
    <path d="M${w * 0.415} ${h * 0.72} c0-${h * 0.14} ${w * 0.01}-${h * 0.245} ${w * 0.035}-${h * 0.245} s${w * 0.035} ${h * 0.105} ${w * 0.035} ${h * 0.245} z" fill="${C.teal600}"/>
    <line x1="${w * 0.437}" y1="${h * 0.55}" x2="${w * 0.385}" y2="${h * 0.585}" stroke="${C.teal600}" stroke-width="9" stroke-linecap="round"/>
  </g>
  <!-- teacup between them -->
  <g>
    <ellipse cx="${w * 0.372}" cy="${h * 0.598}" rx="17" ry="6" fill="${C.gold500}" opacity="0.85"/>
    <path d="M${w * 0.372 - 15} ${h * 0.598} q15 22 30 0" fill="${C.gold500}" opacity="0.85"/>
    <path d="M${w * 0.372 - 4} ${h * 0.57} q4-8 8 0 M${w * 0.372 + 2} ${h * 0.56} q4-8 8 0" stroke="${C.gold500}" stroke-width="2" fill="none" opacity="0.6"/>
  </g>
  <!-- plant -->
  <g stroke="${C.emerald}" stroke-width="4" fill="none" opacity="0.55" stroke-linecap="round">
    <path d="M${w * 0.09} ${h * 0.72} q-2-${h * 0.09} -${w * 0.02}-${h * 0.13}"/>
    <path d="M${w * 0.09} ${h * 0.72} q2-${h * 0.1} ${w * 0.018}-${h * 0.145}"/>
    <path d="M${w * 0.09} ${h * 0.72} q0-${h * 0.12} 4-${h * 0.16}"/>
  </g>
  ${motes(id, w, h, false)}
  ${mark(w - 110, 42, 0.95, C.gold500, 0.8)}
  <rect width="${w}" height="${h}" filter="url(#grain${id})" opacity="0.35" fill="none"/>
</svg>`
}

const files = []
const add = (path, content) => files.push([path, content])

/* ── Hero & general ─────────────────────────────────────────── */
add('hero-banner.svg', hero({}))
add('about-story.svg', scene({ w: 1200, h: 800, exposure: 'dawn', overline: 'Our story', label: 'A decade of mornings', sub: 'Care that comes home — Dhrishta Health Care Services' }))
add('why-us.svg', scene({ w: 1200, h: 800, exposure: 'teal', overline: 'Why families trust us', label: 'Certified · Verified · 24/7', sub: 'Professional skill, genuine warmth' }))

/* ── Story chapters (home film, §S2 of the blueprint) ───────── */
const chapters = [
  ['chapter-1', 'dawn', 'Chapter I', 'A house full of mornings'],
  ['chapter-2', 'mist', 'Chapter II', 'Time moves quietly'],
  ['chapter-3', 'dusk', 'Chapter III', 'Life pulls everyone away'],
  ['chapter-4', 'teal', 'Chapter IV', 'Help knocks gently'],
  ['chapter-5', 'dawn', 'Chapter V', 'Mornings return'],
]
for (const [slug, exposure, overline, label] of chapters)
  add(`story/${slug}.svg`, scene({ w: 1440, h: 840, exposure, overline, label, showCaption: false }))

/* ── Services ───────────────────────────────────────────────── */
const services = [
  ['personal-care', 'teal', 'Personal Care'],
  ['home-nursing', 'dawn', 'Home Nursing'],
  ['elder-care', 'sage', 'Elder Care'],
  ['patient-care', 'clay', 'Patient Care'],
  ['child-care', 'rose', 'Child Care'],
  ['day-care', 'plum', 'Day Care'],
]
for (const [slug, exposure, label] of services)
  add(`services/${slug}.svg`, scene({ w: 1200, h: 800, exposure, overline: 'Objects of care', label, sub: 'Dhrishta Health Care Services' }))

/* ── Specialties ────────────────────────────────────────────── */
const specialties = [
  ['post-surgery-care', 'dawn', 'Post Surgery Care'],
  ['bedridden-patient-care', 'teal', 'Bedridden Patient Care'],
  ['dementia-care', 'plum', 'Dementia Care'],
  ['stroke-recovery-care', 'clay', 'Stroke Recovery'],
  ['palliative-care', 'sage', 'Palliative Care'],
  ['alzheimers-support', 'rose', "Alzheimer's Support"],
]
for (const [slug, exposure, label] of specialties)
  add(`specialties/${slug}.svg`, scene({ w: 1200, h: 800, exposure, overline: 'Specialized care', label, sub: 'Doctor-supervised care plans' }))

/* ── Gallery — a wall of moments (3 per category) ───────────── */
const galleryCats = [
  ['facilities', 'mist', 'Facilities'],
  ['daily-activities', 'dawn', 'Daily Activities'],
  ['care-programs', 'sage', 'Care Programs'],
  ['events', 'clay', 'Events'],
  ['team', 'teal', 'Our Team'],
  ['day-care', 'plum', 'Day Care'],
]
for (const [cat, exposure, label] of galleryCats)
  for (let i = 1; i <= 3; i++)
    add(`gallery/${cat}-${i}.svg`, scene({ w: 900, h: 1125, exposure, label: `${label} ${i}`, showCaption: false }))

/* ── Team portraits ─────────────────────────────────────────── */
const team = [
  ['doctor-1', 'dawn'], ['doctor-2', 'mist'],
  ['nurse-1', 'teal'], ['nurse-2', 'dawn'], ['nurse-3', 'teal'],
  ['caregiver-1', 'sage'], ['caregiver-2', 'dawn'],
  ['physio-1', 'clay'],
  ['support-1', 'plum'], ['support-2', 'teal'],
]
for (const [name, exposure] of team) add(`team/${name}.svg`, portrait({ size: 400, exposure }))

/* ── Testimonial avatars ────────────────────────────────────── */
const avatarExposures = ['dawn', 'teal', 'sage', 'mist', 'dawn', 'teal']
avatarExposures.forEach((exposure, i) => add(`avatars/avatar-${i + 1}.svg`, portrait({ size: 240, exposure })))

for (const [rel, content] of files) {
  const full = join(root, rel)
  mkdirSync(dirname(full), { recursive: true })
  writeFileSync(full, content)
}
console.log(`Generated ${files.length} placeholder images in public/images`)
