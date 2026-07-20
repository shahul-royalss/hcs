# Dhrishta Health Care Services — Website Platform

> **Your Family... Our Care and Responsibility**

Full-stack platform for Dhrishta Health Care Services, a home healthcare provider in
Chittoor, Andhra Pradesh — professional website, multi-step booking system, admin
portal, AI care assistant and multi-channel notifications.

Built strictly according to the architecture document in
[`docs/architecture/DHRISHTA_WEBSITE_STRUCTURE.pdf`](docs/architecture/DHRISHTA_WEBSITE_STRUCTURE.pdf).
The visual language follows the **"morning light"** design blueprint in
[`docs/design/MORNING_LIGHT_BLUEPRINT.md`](docs/design/MORNING_LIGHT_BLUEPRINT.md)
(ivory · navy ink · healing teal · soft gold; all imagery is generated placeholder
art — run `node scripts/fetch-photos.mjs` in `frontend/` on a machine with open
internet to install curated open-license photography over the same filenames,
or swap files in `frontend/public/images/` manually).
Project conventions and structure are documented in [`PROJECT_GUIDELINES.md`](PROJECT_GUIDELINES.md).

## Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React 18, Vite, Tailwind CSS, shadcn-style UI kit, React Router v6, React Hook Form, Framer Motion, GSAP + ScrollTrigger + SplitText, Lenis smooth scroll, Lucide icons, Axios |
| Backend    | FastAPI (Python 3.11), MongoDB (Motor async), JWT auth |
| Integrations | Stripe (payments), Twilio (SMS + WhatsApp), Resend (email), Anthropic Claude (AI chatbot) — all optional, gracefully disabled without API keys |
| Deployment | Docker + docker-compose (nginx serving the frontend), Supervisor config for bare-metal |

## Repository Layout

```
hcs/
├── docs/architecture/       # Source-of-truth architecture document (PDF + extracted text)
├── frontend/                # React app (public site + admin portal)
│   ├── public/              # Static assets (favicon, robots, sitemap, images)
│   ├── scripts/             # Placeholder-image generator
│   └── src/
│       ├── components/      # ui/ layout/ home/ services/ booking/ packages/
│       │                    # gallery/ team/ contact/ chatbot/ common/
│       ├── pages/           # One component per route
│       ├── admin/           # Admin portal (layout, pages, components)
│       ├── context/         # Auth, Booking, Chat providers
│       ├── hooks/           # useAuth, useBooking, useChat, useToast, useWhatsApp
│       ├── services/        # Axios API layer
│       ├── data/            # Site content (services, packages, team, …)
│       └── utils/           # cn, constants, helpers, validation, formatters
├── backend/                 # FastAPI app
│   ├── models/  routes/  services/  middleware/  utils/  scripts/
│   └── server.py            # Entry point (uvicorn server:app)
├── deploy/                  # Supervisor config
└── docker-compose.yml       # Full stack: mongo + backend + frontend
```

## Quick Start (Development)

### 1. Backend

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # fill in what you have; everything is optional in dev
uvicorn server:app --reload --port 8000
```

MongoDB: run locally (`mongod`) or `docker run -d -p 27017:27017 mongo:7`.
Seed demo content + admin user:

```bash
python scripts/seed_data.py   # admin@dhrishta.com / ChangeMe@123 (change it!)
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                   # http://localhost:3000 (proxies /api to :8000)
```

### 3. Full stack with Docker

```bash
docker compose up --build     # site on :8080, API on :8000, Mongo internal
```

## Key URLs

| Path | Purpose |
|------|---------|
| `/` | Public website (18+ pages) |
| `/book-consultation` | 7-step booking flow |
| `/emergency` | Emergency care request |
| `/admin` | Admin portal (JWT-protected) |
| `/api/health` | Backend health check |

## Admin Portal Access

Open `<site-url>/admin/login` (e.g. `http://localhost:3000/admin/login` in dev,
`http://localhost:8080/admin/login` with Docker).

Default credentials (auto-created on backend startup when the database has no
users yet — requires MongoDB to be running):

| Field | Value |
|-------|-------|
| Email | `admin@dhrishta.com` |
| Password | `ChangeMe@123` |

⚠️ **Change the password before going live**: set `SEED_ADMIN_PASSWORD` (and
optionally `ADMIN_EMAIL`) in `backend/.env` *before the first startup*, or
update the user in MongoDB afterwards. The backend logs a warning while the
default password is in use.

## Environment Variables

See `backend/.env.example` and `frontend/.env.example`. The app runs fully without
third-party keys — Stripe/Twilio/Resend/AI features simply switch to a disabled or
fallback mode until keys are provided.

## Contact

Dhrishta Health Care Services · +91 9959388374 · info@dhrishta.com
Near Reliance Smart Point, Bypass Road, Murakambattu, Chittoor – 517127 (AP)
