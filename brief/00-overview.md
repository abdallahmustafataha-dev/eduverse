# 00 — EduVerse Students: Overview (read first)

## Product
EduVerse is the jewel of EduCo.: everything the Egyptian student needs in one
place — **Egyptian Ministry curricula ONLY** (no international content in v1).
Future goal: 1M concurrent users in the same second. Revenue later: sponsors +
paid courses. This build is the **Students edition** (Community and Courses
editions come later — their backend tables already exist but stay empty/locked).

## Audience & language
Egyptian students (primary), parents, teachers. Bilingual, **English default**
(`/en`, LTR), Arabic secondary (`/ar`, RTL). Same content both languages.
Locale switcher persists choice.

## Flow (see 01/02/03 for specs)
Epic landing → vision & goals → founder → [Start your journey] → auth gate
(create EduID inline, or instant SSO login) → calm Dashboard (Search +
Continue-learning widgets only) + sidebar with everything.

## Tech constraints (do not change)
- Static Astro site → Cloudflare Pages project `eduverse-eg` →
  `https://eduverse-eg.pages.dev`. `npm run build` must pass. No secrets in
  repo (`.env` gitignored, `.env.example` committed).
- Same Supabase project as EduCo. (`SUPABASE_URL` shared). **Auth is CLOUD,
  not local** — a user signed in on EduCo. is instantly signed in here.
- Login: Email+Password + Google only. No Facebook. Email confirmation required.
- Reuse the `src/lib/supabase.ts` pattern from the scaffold (implicit flow +
  embedded public fallbacks — proven live on EduCo.; PKCE is banned for email
  links because students open them cross-browser).
- Keep `eduverse-logos/` untouched. PDFs via Supabase Storage later; videos as
  YouTube-Unlisted links only (never upload video to our storage).

## Brand (the ONLY design inputs)
- Logo light: `G:\EduVerse\eduverse-logos\eduverse-light.svg` (maroon `#7F1D1D`
  mark on paper `#F5F1E8`); dark: `eduverse-dark.svg` (full inverse).
- Palette family: paper `#F5F1E8`, maroon `#7F1D1D`, card `#FFFBF5`,
  muted `#8A6B6B`. Dark mode = full inverse per logo.
- **Rule #1 — the logo floats, never melts:** page backgrounds must be a
  SHADE away from the logo colors (darker cream `#EFE3D2` or lighter
  `#FCFAF4`), the logo always sits on a contrasting card/panel. Never place
  the maroon mark on a maroon background or the paper mark on paper.
- Everything else (layout, type, components, motion): YOUR design.

## File map
- `01-landing.md` — landing page (incl. the Journey Hero spec)
- `02-auth.md` — auth gate + split login page + all EduID states
- `03-dashboard.md` — calm dashboard + sidebar
- `04-pages.md` — all remaining pages + the 30 features
- `05-backend-map.md` — every feature ↔ its table/query/RLS
- `06-mobile.md` — mobile-only rules (standalone)
- `07-checklists.md` — 19 SEO/UX + 13 security items + acceptance + hard lessons
