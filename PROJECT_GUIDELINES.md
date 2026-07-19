# PROJECT_GUIDELINES.md — Dhrishta Health Care Services

> Living document. **Update this file whenever the architecture or structure changes.**
> Source-of-truth architecture: `docs/architecture/DHRISHTA_WEBSITE_STRUCTURE.pdf`
> Last updated: 2026-07-19

## 1. What This Project Is

A production-grade home-healthcare platform for **Dhrishta Health Care Services**
(Chittoor, AP): public marketing/booking website, 7-step consultation booking flow,
JWT-protected admin portal, AI care assistant, and integration points for
WhatsApp/SMS/Email/Payments. Target users: families seeking elderly care, patient
care, child care and specialized medical services at home. Core goal: convert
visitors into service bookings with trust and professionalism.

## 2. Golden Rules

1. **The HCS repo root is the project root.** Everything lives here — code, assets,
   configs, docs. No files outside `frontend/`, `backend/`, `docs/`, `deploy/` and
   root configs.
2. **No duplicate files or folders.** Before adding anything, search for an existing
   implementation and reuse/extend it. One UI kit, one API layer, one data layer.
3. **Content lives in `frontend/src/data/`** — never hard-code business copy
   (phone numbers, prices, service lists) inside components. `siteConfig.js` is the
   single source for contact/business details.
4. **Follow the architecture document.** Deviations must be deliberate, minimal and
   recorded in §8 below.
5. **Update this file** after every significant structural/architectural change.
6. **Never commit secrets.** `.env` files are git-ignored; only `.env.example`
   templates are committed.

## 3. Repository Structure

```
hcs/
├── README.md                     # Setup & quick start
├── PROJECT_GUIDELINES.md         # This file — keep current
├── docker-compose.yml            # mongo + backend + frontend
├── .gitignore
├── docs/
│   └── architecture/             # Architecture PDF + extracted text (source of truth)
├── deploy/
│   └── supervisord.conf          # Bare-metal process manager config
├── frontend/                     # React 18 + Vite + Tailwind
│   ├── index.html                # Entry HTML (fonts, meta, schema.org)
│   ├── package.json              # Scripts: dev / build / preview / lint
│   ├── vite.config.js            # '@' alias → src/, /api proxy (dev + preview) → :8000
│   ├── tailwind.config.js        # Design tokens (colors, fonts, shadows)
│   ├── Dockerfile + deploy/nginx.conf
│   ├── scripts/generate-placeholders.mjs   # Regenerates public/images/*.svg
│   ├── public/                   # favicon.svg, robots.txt, sitemap.xml, images/,
│   │                             #  fonts/ (self-hosted woff2 + fonts.css)
│   └── src/
│       ├── index.jsx             # Providers: Language > Toast > Auth > Booking > Chat
│       ├── App.jsx               # All routes (lazy-loaded), app shell
│       ├── index.css             # Tailwind layers + container-site/section-padding/tagline
│       ├── components/
│       │   ├── ui/               # Design-system primitives (button, card, input,
│       │   │                     #  select, textarea, label, badge, dialog,
│       │   │                     #  accordion, carousel, skeleton, table)
│       │   ├── layout/           # Navbar, MobileMenu, Footer, PageHeader
│       │   ├── common/           # ErrorBoundary, LoadingSpinner, ScrollToTop, Seo,
│       │   │                     #  FloatingWhatsApp, CallButton, SectionHeading,
│       │   │                     #  AnimatedSection, ServiceIcon, StarRating
│       │   ├── home/             # 8 home-page sections
│       │   ├── services/         # ServiceCard, ServiceCategories, ServiceDetail
│       │   ├── packages/         # PackageCard, PackageComparison
│       │   ├── gallery/          # GalleryGrid, ImageCard, CategoryFilter, Lightbox
│       │   ├── team/             # TeamGrid, TeamMemberCard
│       │   ├── contact/          # ContactForm, ContactInfo, MapEmbed, ServiceAreaChecker
│       │   ├── booking/          # 7-step flow (BookingForm orchestrator + steps)
│       │   └── chatbot/          # ChatWidget, ChatWindow, ChatMessage
│       ├── pages/                # One default-export component per public route
│       ├── admin/                # AdminLayout + pages/ + components/ (lazy chunk)
│       ├── context/              # Auth, Booking, Chat, Language providers
│       ├── hooks/                # useAuth, useBooking, useChat, useToast,
│       │                         #  useWhatsApp, useLanguage
│       ├── services/             # api.js (axios) + per-domain API modules
│       ├── data/                 # ALL site content (services, specialties, packages,
│       │                         #  team, testimonials, gallery, faqs, whoWeServe,
│       │                         #  careers, blog, siteConfig, translations)
│       └── utils/                # cn, constants, helpers, validation, formatters,
│                                 #  analytics (GA4/Clarity bootstrap)
└── backend/                      # FastAPI + MongoDB (Motor)
    ├── server.py                 # App factory + router wiring (uvicorn server:app)
    ├── requirements.txt / .env.example / Dockerfile
    ├── models/                   # Pydantic v2 schemas per collection
    ├── routes/                   # Public routers under /api, admin under /api/admin
    ├── services/                 # ai, payment, notification, booking, storage logic
    ├── middleware/               # auth (JWT), CORS, error handler, rate limit
    ├── utils/                    # config (pydantic-settings), database (lazy Motor),
    │                             #  auth_utils, validators, helpers, constants
    └── scripts/seed_data.py      # Idempotent demo-content + admin-user seeding
```

## 4. Frontend Conventions

- **Routing:** React Router v6; all routes declared in `App.jsx`; pages are
  lazy-loaded (route-based code splitting; admin is a separate chunk).
- **Imports:** always via the `@/` alias (maps to `src/`).
- **Design system** (from the architecture doc):
  - Colors: `primary` #1a3a6b (navy) · `secondary` #2d8b8b (teal) · `accent` #d32f2f
    · `success` #2e7d32 · `warning` #f57c00 · `childcare` #c2185b · `daycare` #7b1fa2
    · `surface` #f5f5f5 · `ink` #212121 / `ink-light` #757575. Use theme tokens, never
    raw hex in components.
  - Fonts: Manrope (`font-heading`), Inter (`font-body`), Crimson Text
    (`font-accent` / `.tagline`), Noto Sans Devanagari (Hindi fallback in every
    stack). All fonts are **self-hosted** from `public/fonts/` (`fonts.css` +
    woff2 files) — no Google Fonts requests at runtime.
  - Buttons are pill-shaped (`ui/button.jsx` variants); cards use soft shadows
    (`shadow-card`, `rounded-card`).
  - Dynamic per-item colors must go through a static lookup map of full Tailwind
    class strings (Tailwind cannot see computed class names).
- **Layout helpers:** `container-site` (max-w-7xl + padding), `section-padding`,
  `SectionHeading`, `PageHeader` (inner-page hero + breadcrumbs),
  `AnimatedSection` (scroll fade-in-up).
- **Forms:** React Hook Form + shared `rules` from `utils/validation.js`; every field
  has a `Label` with `htmlFor`; errors render as small accent text; API failures must
  degrade to call/WhatsApp guidance — never a dead end.
- **State:** Context API only (Auth, Booking, Chat) + local state; no external state
  library.
- **API:** all HTTP through `services/api.js` (axios instance, JWT header, 401
  auto-logout). Per-domain modules: auth, booking, service, contact, chat, payment,
  admin. Base URL `/api` (Vite dev proxy → `VITE_BACKEND_URL`).
- **Content pages render from `src/data/`**; the backend serves the same content for
  the admin portal and future CMS use (seeded by `backend/scripts/seed_data.py`).
- **Packages staging:** only packages flagged `active: true` in `data/packages.js`
  are offered (currently **Custom Plans only** — the standard hourly/daily/weekly/
  monthly plans are staged for a later launch; flip their flag to re-enable).
  `backend/scripts/seed_data.py` and the chatbot's pricing copy in
  `backend/services/ai_service.py` mirror this — keep all three in sync.
- **SEO:** `Seo` component sets title/description per page; static meta, Open Graph
  and Schema.org in `index.html`; `sitemap.xml` + `robots.txt` in `public/`.
- **Icons:** lucide-react only (Font Awesome from the spec intentionally dropped to
  avoid two icon systems — see §8). Data files store icon *names*; resolve via
  `common/ServiceIcon.jsx` (add new icons to its map).
- **i18n (English/Hindi/Telugu):** header globe dropdown
  (`common/LanguageSelector.jsx`) → `LanguageContext` (persisted in localStorage,
  sets `<html lang>`). The language list lives in `LANGUAGES` in
  `data/translations.js`; UI strings come from the same file via
  `useLanguage().t('key')`, with missing keys falling back to English. Phase 1
  covers site chrome (nav, hero, stats, emergency band, footer, CTAs); long-form
  content in `data/*.js` stays English until translated copy is approved — add
  `hi`/`te` keys as coverage grows. Never hard-code a user-visible chrome string
  without a translation key. Fonts: Noto Sans Devanagari + Noto Sans Telugu are
  self-hosted and in every font stack.
- **Analytics:** `utils/analytics.js` injects GA4 + Microsoft Clarity only when
  `VITE_GA_ID` / `VITE_CLARITY_ID` are set (no-op in dev). Internal analytics live
  in the admin portal.
- **Dark mode:** class-based (`dark` on `<html>`), controlled by `ThemeContext` +
  the `ThemeToggle` (🌙/☀️) beside the language selector (public navbar and admin
  top bar). First visit follows the system preference (and tracks live system
  changes); an explicit toggle persists to localStorage; a pre-hydration script in
  `index.html` applies the class before first paint. Styling comes from the
  dark-theme remap block at the bottom of `index.css`, which restyles the
  recurring surface utilities (`bg-white`, `bg-surface`, tints, borders, text
  tokens) — when adding new UI, stick to those existing tokens and dark mode
  works automatically; if you introduce a new light-only utility, add a matching
  `.dark` override to the same block. Gradient bands and `text-white` sections
  need no changes.

## 5. Backend Conventions

- **Entry:** `uvicorn server:app` — the server must start even with MongoDB down
  (lazy Motor client in `utils/database.py`).
- **Routers:** public under `/api/*`; admin under `/api/admin/*` guarded by the
  `require_admin` JWT dependency. Health: `GET /api/health`.
- **Auth:** JWT HS256 (`utils/auth_utils.py`), bcrypt password hashing, roles:
  admin | staff | manager.
- **Collections** (per spec): users, bookings, services, packages, staff, patients,
  testimonials, gallery, contacts, chat_conversations, team_members.
- **Booking IDs:** `BK<YYYYMMDD><seq>`; service-area pincodes in
  `utils/constants.py` (mirror of frontend list — keep in sync).
- **Integrations degrade gracefully:** Stripe / Twilio (SMS + WhatsApp) / Resend /
  Anthropic are called via httpx only when their keys are configured; otherwise they
  log a warning and return `{"status": "disabled"}`-style responses. The AI chatbot
  falls back to a rule-based intent responder so the widget always works.
- **Validation:** Pydantic v2 models per domain in `models/`; extra validators in
  `utils/validators.py` (Indian phone, 6-digit pincode).
- **Errors:** global handlers in `middleware/error_handler.py` return JSON `{detail}`.

## 6. Environments & Deployment

- Dev: `npm run dev` (:3000, proxies `/api`) + `uvicorn --reload` (:8000) + local Mongo.
- Docker: `docker compose up --build` → nginx-served frontend :8080, API :8000.
- Bare-metal: `deploy/supervisord.conf`.
- Env templates: `backend/.env.example`, `frontend/.env.example`. Real `.env` files
  are git-ignored.

## 7. Definition of Done (for any change)

1. `cd frontend && npm run build` passes.
2. Backend files compile (`python3 -m py_compile`) and `server:app` imports cleanly
   with dependencies installed.
3. No duplicated logic/content introduced; data lives in the data layer.
4. Responsive (mobile-first) and accessible (labels, alt text, keyboard support).
5. This file updated if structure/architecture changed.

## 8. Deliberate Deviations from the Architecture Doc

| Spec | Implementation | Why |
|------|----------------|-----|
| Create React App layout (`public/index.html`, `src/index.js`) | Vite (`index.html` at root, `src/index.jsx`) | CRA is deprecated; Vite is the current industry standard. Structure otherwise mirrors the spec exactly. |
| Shadcn/UI (Radix-based) | Self-contained shadcn-*style* UI kit in `components/ui/` | Same API/look with zero Radix dependencies — lighter bundle, no version churn. |
| Lucide **+ Font Awesome** | Lucide only | One icon system; avoids duplicate assets (Golden Rule 2). |
| GPT-5.2 / Claude chatbot | Anthropic API with rule-based offline fallback | Single provider path; works with no key configured. |
| Admin pages for testimonials/contacts moderation | Consolidated into Admin → Settings | Spec lists the APIs but no dedicated pages; consolidation keeps nav small. |
| Photography | Branded SVG placeholders in `public/images/` (generator script included) | No licensed photos available; swap files in place (same names) when real photos arrive. |

## 9. Roadmap (from the architecture doc)

- **Phase 1 (this repo):** full website, booking system, admin portal, AI chatbot,
  notification integration points, payment integration point, gallery/testimonials. ✅
- **Phase 2:** patient portal, video consultation, advanced analytics, mobile app,
  subscription plans.
- **Phase 3:** multi-location, franchisee management, ERP integration, advanced reporting.
