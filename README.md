# USDX-SMART — Dream • Draw • Win

A premium, cinematic, responsive rewards-campaign website for **USDX-SMART**.
Built with React + Vite + Tailwind CSS, Framer Motion, Lucide icons and a
localStorage-backed data layer that is shaped like a real backend API, so it
can be swapped for Supabase / Firebase / any REST backend later.

## Features

- **Cinematic home** — the `offerheroic.png` banner as hero background, gold
  dust particles, glassmorphism, metallic-gold gradients, editorial typography.
- **Live countdown** — `DAYS : HOURS : MINUTES : SECONDS`, updates every second,
  automatically switches to **CAMPAIGN ENDED** at expiry. Admins can configure,
  pause, resume, reset or end the timer.
- **Offers** — **LUCKY 50** (50 random rewards, $2,000 threshold, 1 entry per
  $2,000) and **TRIPLE CAR BONANZA** (top 3 leaders, $30,000+, cars valued
  ₹15–20 Lakhs). Both fully configurable and enable/disable-able.
- **Leaderboard** — rank-1/2/3 hero cards, search, offer filter, five sort
  modes, pagination, and mobile stacked cards.
- **Leader profiles** — stats, animated progress to the next lucky entry, car
  milestone, next-rank gap, eligibility and recent business-volume history.
- **Admin panel** — secured `/admin` interface (demo passcode `usdx2026`) with:
  Dashboard stats, Leader CRUD, Offer management (thresholds, rewards, images,
  dates), and Campaign/Countdown settings (dates, hero banner, announcement,
  start/pause/reset/end). Every change propagates instantly to the public site
  and persists in `localStorage`.

## Tech

- React 19 + Vite 8
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Framer Motion, Lucide React, React Router (hash routing)

## Project structure

```
src/
  lib/          # backend-shaped persistence + pure business logic (API-ready)
    seed.js     # initial demo data (used only on first run)
    store.js    # localStorage read/write + session (== future Supabase module)
    business.js # countdown, rank, entries, qualification, milestones (pure)
    format.js   # currency/date formatters
  store/        # React context bridging store.js to the UI
  components/   # reusable UI (Navbar, Countdown, GoldDust, OfferCard, admin/…)
  pages/        # Home, Offers, Lucky 50, Triple Car, Leaderboard, Leader Profile
  pages/admin/  # Login, Dashboard, Leaders, Offers, Campaign
```

The UI never computes campaign rules inline — it calls `lib/business.js`, and
it never touches `localStorage` directly — it goes through `lib/store.js`.
To connect a real database, re-implement `lib/store.js`'s surface
(`loadState`, `saveState`, session helpers) against your backend.

## Getting started

```bash
npm install
npm run dev       # start dev server
npm run build     # production build
npm run lint      # oxlint
npm run preview   # preview the production build
```

## Admin panel

- Visit `/#/admin/login`
- Demo passcode: `usdx2026` (stored in `state.settings.adminPassword`)
- Pages: Dashboard · Leaders · Offers · Campaign & Countdown

> Note: `offerheroic.png` is the campaign banner included with this project.