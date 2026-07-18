/**
 * Generates branded SVG placeholder images for the site.
 * Run: node scripts/generate-placeholders.mjs
 * Replace any generated file in public/images with a real photo (same name) when available.
 */
import { mkdirSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images')

const PALETTES = {
  navy: ['#1a3a6b', '#2f5490'],
  teal: ['#2d8b8b', '#3fa5a5'],
  navyTeal: ['#1a3a6b', '#2d8b8b'],
  pink: ['#c2185b', '#e91e63'],
  purple: ['#7b1fa2', '#9c27b0'],
  green: ['#2e7d32', '#43a047'],
  orange: ['#f57c00', '#fb8c00'],
}

const heart =
  'M0 18 C0 6 10-2 19 4 c3 2 5 5 6 8 1-3 3-6 6-8 9-6 19 2 19 14 0 14-18 24-25 28 C18 42 0 32 0 18z'

function svg({ w, h, palette, label, sub }) {
  const [c1, c2] = PALETTES[palette]
  const cx = w / 2
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <circle cx="${w * 0.85}" cy="${h * 0.2}" r="${h * 0.35}" fill="#ffffff" opacity="0.06"/>
  <circle cx="${w * 0.1}" cy="${h * 0.85}" r="${h * 0.3}" fill="#ffffff" opacity="0.06"/>
  <g transform="translate(${cx - 25}, ${h / 2 - 48}) scale(1)">
    <path d="${heart}" fill="#ffffff" opacity="0.9"/>
    <path d="M8 20 h10 l4-8 7 18 4-8 h11" stroke="${c1}" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <text x="${cx}" y="${h / 2 + 34}" text-anchor="middle" font-family="Manrope, Arial, sans-serif" font-size="${Math.max(20, w / 38)}" font-weight="700" fill="#ffffff">${label}</text>
  ${sub ? `<text x="${cx}" y="${h / 2 + 62}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="${Math.max(13, w / 70)}" fill="#ffffff" opacity="0.85">${sub}</text>` : ''}
</svg>`
}

function avatar({ initials, palette }) {
  const [c1, c2] = PALETTES[palette]
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
  <rect width="200" height="200" fill="url(#g)"/>
  <circle cx="100" cy="78" r="34" fill="#ffffff" opacity="0.92"/>
  <path d="M40 178 c8-36 32-52 60-52 s52 16 60 52 z" fill="#ffffff" opacity="0.92"/>
  <text x="100" y="192" text-anchor="middle" font-family="Manrope, Arial" font-size="0" fill="#fff">${initials}</text>
</svg>`
}

const files = []
const add = (path, content) => files.push([path, content])

// Hero and general
add('hero-banner.svg', svg({ w: 1400, h: 900, palette: 'navyTeal', label: 'Compassionate Care at Home', sub: 'Dhrishta Healthcare Services' }))
add('about-story.svg', svg({ w: 1200, h: 800, palette: 'navy', label: 'Our Story', sub: 'A decade of caring for families' }))
add('why-us.svg', svg({ w: 1200, h: 800, palette: 'teal', label: 'Why Families Trust Us', sub: 'Certified • Verified • 24/7' }))

// Services
const services = [
  ['personal-care', 'teal', 'Personal Care'],
  ['home-nursing', 'navy', 'Home Nursing'],
  ['elder-care', 'green', 'Elder Care'],
  ['patient-care', 'orange', 'Patient Care'],
  ['child-care', 'pink', 'Child Care'],
  ['day-care', 'purple', 'Day Care'],
]
for (const [slug, palette, label] of services)
  add(`services/${slug}.svg`, svg({ w: 1200, h: 800, palette, label, sub: 'Dhrishta Healthcare' }))

// Specialties
const specialties = [
  ['post-surgery-care', 'navy', 'Post Surgery Care'],
  ['bedridden-patient-care', 'teal', 'Bedridden Patient Care'],
  ['dementia-care', 'purple', 'Dementia Care'],
  ['stroke-recovery-care', 'orange', 'Stroke Recovery'],
  ['palliative-care', 'green', 'Palliative Care'],
  ['alzheimers-support', 'pink', "Alzheimer's Support"],
]
for (const [slug, palette, label] of specialties)
  add(`specialties/${slug}.svg`, svg({ w: 1200, h: 800, palette, label, sub: 'Specialized Care' }))

// Gallery (3 per category)
const galleryCats = [
  ['facilities', 'navy', 'Facilities'],
  ['daily-activities', 'teal', 'Daily Activities'],
  ['care-programs', 'green', 'Care Programs'],
  ['events', 'orange', 'Events'],
  ['team', 'navyTeal', 'Our Team'],
  ['day-care', 'purple', 'Day Care'],
]
for (const [cat, palette, label] of galleryCats)
  for (let i = 1; i <= 3; i++)
    add(`gallery/${cat}-${i}.svg`, svg({ w: 900, h: 700, palette, label: `${label} ${i}`, sub: 'Dhrishta Gallery' }))

// Team portraits
const team = [
  ['doctor-1', 'navy'], ['doctor-2', 'navy'],
  ['nurse-1', 'teal'], ['nurse-2', 'teal'], ['nurse-3', 'teal'],
  ['caregiver-1', 'green'], ['caregiver-2', 'green'],
  ['physio-1', 'orange'],
  ['support-1', 'purple'], ['support-2', 'purple'],
]
for (const [name, palette] of team) add(`team/${name}.svg`, avatar({ initials: '', palette }))

// Testimonial avatars
for (let i = 1; i <= 6; i++)
  add(`avatars/avatar-${i}.svg`, avatar({ initials: '', palette: i % 2 ? 'navy' : 'teal' }))

for (const [rel, content] of files) {
  const full = join(root, rel)
  mkdirSync(dirname(full), { recursive: true })
  writeFileSync(full, content)
}
console.log(`Generated ${files.length} placeholder images in public/images`)
