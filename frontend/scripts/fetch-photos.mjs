/**
 * fetch-photos.mjs — installs real, copyright-safe photography into every
 * image slot on the site.
 *
 *   node scripts/fetch-photos.mjs            # fill every slot
 *   node scripts/fetch-photos.mjs hero       # only slots whose file matches "hero"
 *
 * How it works
 * ------------
 * • Searches the Openverse API (https://api.openverse.org — the WordPress
 *   openly-licensed media index) per slot, restricted to commercial-safe
 *   licenses: CC0, Public Domain Mark, CC-BY, CC-BY-SA.
 * • Downloads the best match and wraps the JPEG/PNG bytes inside an SVG
 *   shell saved over the slot's EXISTING filename (e.g. hero-banner.svg),
 *   so no component or data file needs to change — the art-directed
 *   placeholder is simply replaced by the photo, cover-fitted.
 * • Writes docs/PHOTO_CREDITS.md with attribution for every installed photo
 *   (required by CC-BY / CC-BY-SA; good manners for the rest).
 * • Any slot that fails (no result, network error) keeps its placeholder
 *   and is listed at the end — rerun later or tweak that slot's query.
 *
 * Run this on a machine with normal internet access (the Claude sandbox
 * blocks image CDNs). Node 18+ required (built-in fetch). No dependencies.
 * After it finishes: `npm run build` to bundle the new images.
 */
import { mkdirSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const imagesDir = join(root, 'public', 'images')
const creditsPath = join(root, '..', 'docs', 'PHOTO_CREDITS.md')

const API = 'https://api.openverse.org/v1/images/'
const LICENSES = 'cc0,pdm,by,by-sa' // commercial-safe, no NC/ND
const MIN_SCENE_WIDTH = 900
const MIN_PORTRAIT_WIDTH = 400

/* ── Slots: file → search query (+ aspect) ─────────────────────────────
   Queries are tuned for home-healthcare warmth; edit freely and rerun. */
const scene = (file, w, h, q) => ({ file, w, h, q, kind: 'scene' })
const portrait = (file, size, q) => ({ file, w: size, h: size, q, kind: 'portrait' })

const SLOTS = [
  scene('hero-banner.svg', 1400, 950, 'caregiver elderly woman home smiling tea'),
  scene('about-story.svg', 1200, 800, 'nurse helping senior woman home care'),
  scene('why-us.svg', 1200, 800, 'caregiver holding hands elderly patient'),

  scene('story/chapter-1.svg', 1440, 840, 'indian family breakfast table morning'),
  scene('story/chapter-2.svg', 1440, 840, 'empty chairs kitchen table window light'),
  scene('story/chapter-3.svg', 1440, 840, 'lonely elderly man window evening'),
  scene('story/chapter-4.svg', 1440, 840, 'nurse doorway home visit smiling'),
  scene('story/chapter-5.svg', 1440, 840, 'elderly couple walking garden morning'),

  scene('services/personal-care.svg', 1200, 800, 'caregiver assisting elderly daily living'),
  scene('services/home-nursing.svg', 1200, 800, 'home nurse blood pressure patient'),
  scene('services/elder-care.svg', 1200, 800, 'elder care companionship senior smiling'),
  scene('services/patient-care.svg', 1200, 800, 'patient care bed rest home'),
  scene('services/child-care.svg', 1200, 800, 'nanny child care playing home'),
  scene('services/day-care.svg', 1200, 800, 'seniors activity group day care'),

  scene('specialties/post-surgery-care.svg', 1200, 800, 'wound dressing nurse home patient'),
  scene('specialties/bedridden-patient-care.svg', 1200, 800, 'bedridden patient care nurse'),
  scene('specialties/dementia-care.svg', 1200, 800, 'dementia care elderly memory'),
  scene('specialties/stroke-recovery-care.svg', 1200, 800, 'physiotherapy rehabilitation elderly'),
  scene('specialties/palliative-care.svg', 1200, 800, 'holding hands hospital comfort'),
  scene('specialties/alzheimers-support.svg', 1200, 800, 'alzheimer elderly support family'),

  scene('gallery/facilities-1.svg', 900, 1125, 'bright clean care room interior'),
  scene('gallery/facilities-2.svg', 900, 1125, 'medical equipment home care'),
  scene('gallery/facilities-3.svg', 900, 1125, 'cozy rest room armchair natural light'),
  scene('gallery/daily-activities-1.svg', 900, 1125, 'caregiver serving meal senior'),
  scene('gallery/daily-activities-2.svg', 900, 1125, 'elderly light exercise stretching'),
  scene('gallery/daily-activities-3.svg', 900, 1125, 'senior reading book companionship'),
  scene('gallery/care-programs-1.svg', 900, 1125, 'physiotherapy session elderly'),
  scene('gallery/care-programs-2.svg', 900, 1125, 'nurse medication management pills'),
  scene('gallery/care-programs-3.svg', 900, 1125, 'blood pressure check home visit'),
  scene('gallery/events-1.svg', 900, 1125, 'birthday celebration elderly family'),
  scene('gallery/events-2.svg', 900, 1125, 'community health camp india'),
  scene('gallery/events-3.svg', 900, 1125, 'family gathering multigenerational'),
  scene('gallery/team-1.svg', 900, 1125, 'nurses team smiling scrubs'),
  scene('gallery/team-2.svg', 900, 1125, 'healthcare worker helping patient walk'),
  scene('gallery/team-3.svg', 900, 1125, 'medical training workshop nurses'),
  scene('gallery/day-care-1.svg', 900, 1125, 'senior center activity room'),
  scene('gallery/day-care-2.svg', 900, 1125, 'elderly crafts activity together'),
  scene('gallery/day-care-3.svg', 900, 1125, 'seniors playing board game laughing'),

  portrait('team/doctor-1.svg', 500, 'indian doctor portrait man'),
  portrait('team/doctor-2.svg', 500, 'indian doctor portrait woman'),
  portrait('team/nurse-1.svg', 500, 'nurse portrait woman scrubs'),
  portrait('team/nurse-2.svg', 500, 'indian nurse portrait smiling'),
  portrait('team/nurse-3.svg', 500, 'male nurse portrait'),
  portrait('team/caregiver-1.svg', 500, 'caregiver portrait woman warm'),
  portrait('team/caregiver-2.svg', 500, 'care worker portrait man'),
  portrait('team/physio-1.svg', 500, 'physiotherapist portrait'),
  portrait('team/support-1.svg', 500, 'healthcare coordinator portrait woman'),
  portrait('team/support-2.svg', 500, 'office professional portrait india'),

  portrait('avatars/avatar-1.svg', 300, 'middle aged indian man portrait'),
  portrait('avatars/avatar-2.svg', 300, 'indian woman portrait smiling'),
  portrait('avatars/avatar-3.svg', 300, 'young indian man portrait'),
  portrait('avatars/avatar-4.svg', 300, 'senior indian woman portrait'),
  portrait('avatars/avatar-5.svg', 300, 'indian professional woman portrait'),
  portrait('avatars/avatar-6.svg', 300, 'smiling man portrait outdoors'),
]

/* ── Helpers ──────────────────────────────────────────────────────────── */

const usedIds = new Set()

async function searchOpenverse(slot) {
  const params = new URLSearchParams({
    q: slot.q,
    license: LICENSES,
    page_size: '20',
    aspect_ratio: slot.kind === 'portrait' ? 'square' : slot.h > slot.w ? 'tall' : 'wide',
  })
  const res = await fetch(`${API}?${params}`, { headers: { 'User-Agent': 'dhrishta-site-builder/1.0' } })
  if (!res.ok) throw new Error(`Openverse ${res.status}`)
  const data = await res.json()
  const minWidth = slot.kind === 'portrait' ? MIN_PORTRAIT_WIDTH : MIN_SCENE_WIDTH
  return (data.results || []).filter(
    (r) => !usedIds.has(r.id) && (r.width || 0) >= minWidth && /jpe?g|png/i.test(r.url || '')
  )
}

async function download(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'dhrishta-site-builder/1.0' }, redirect: 'follow' })
  if (!res.ok) throw new Error(`download ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const isJpeg = buf[0] === 0xff && buf[1] === 0xd8
  const isPng = buf[0] === 0x89 && buf[1] === 0x50
  if (!isJpeg && !isPng) throw new Error('not a JPEG/PNG')
  if (buf.length < 15_000) throw new Error('file too small')
  if (buf.length > 6_000_000) throw new Error('file too large')
  return { buf, mime: isJpeg ? 'image/jpeg' : 'image/png' }
}

/** Cover-fit photo inside an SVG shell — same filename, zero code changes. */
function photoSvg(slot, { buf, mime }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${slot.w} ${slot.h}" width="${slot.w}" height="${slot.h}">
  <image href="data:${mime};base64,${buf.toString('base64')}" x="0" y="0" width="${slot.w}" height="${slot.h}" preserveAspectRatio="xMidYMid slice"/>
</svg>`
}

/* ── Main ─────────────────────────────────────────────────────────────── */

const filter = process.argv[2]
const targets = filter ? SLOTS.filter((s) => s.file.includes(filter)) : SLOTS
const credits = []
const failures = []

console.log(`Fetching ${targets.length} photo slot(s) from Openverse (licenses: ${LICENSES})…`)

for (const slot of targets) {
  try {
    const results = await searchOpenverse(slot)
    let installed = false
    for (const result of results.slice(0, 5)) {
      try {
        const img = await download(result.url)
        const out = join(imagesDir, slot.file)
        mkdirSync(dirname(out), { recursive: true })
        writeFileSync(out, photoSvg(slot, img))
        usedIds.add(result.id)
        credits.push({
          file: slot.file,
          title: result.title || 'Untitled',
          creator: result.creator || 'Unknown',
          license: `${(result.license || '').toUpperCase()} ${result.license_version || ''}`.trim(),
          source: result.foreign_landing_url || result.url,
        })
        console.log(`  ✓ ${slot.file}  ←  "${result.title}" by ${result.creator} (${result.license})`)
        installed = true
        break
      } catch {
        // try the next candidate
      }
    }
    if (!installed) throw new Error('no downloadable result')
    await new Promise((r) => setTimeout(r, 350)) // stay politely under rate limits
  } catch (err) {
    failures.push(slot.file)
    console.warn(`  ✗ ${slot.file} — ${err.message} (placeholder kept)`)
  }
}

if (credits.length) {
  const lines = [
    '# Photo Credits',
    '',
    'Photography sourced via [Openverse](https://openverse.org) under commercial-safe',
    'open licenses (CC0 / Public Domain / CC-BY / CC-BY-SA), installed by',
    '`frontend/scripts/fetch-photos.mjs`. CC-BY and CC-BY-SA require this attribution.',
    '',
    '| Slot | Title | Creator | License | Source |',
    '|---|---|---|---|---|',
    ...credits.map((c) => `| \`${c.file}\` | ${c.title} | ${c.creator} | ${c.license} | [link](${c.source}) |`),
    '',
  ]
  mkdirSync(dirname(creditsPath), { recursive: true })
  writeFileSync(creditsPath, lines.join('\n'))
  console.log(`\nWrote ${credits.length} credit(s) to docs/PHOTO_CREDITS.md`)
}

console.log(`\nDone: ${credits.length} installed, ${failures.length} kept as placeholder art.`)
if (failures.length) console.log('Retry or adjust queries for:', failures.join(', '))
console.log('Review every installed photo before publishing — swap any that miss the mood')
console.log('by dropping your own image over the same filename, then run: npm run build')
