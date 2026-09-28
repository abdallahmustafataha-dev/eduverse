# 04 — All Remaining Pages + Features (EN primary, mirror in AR)

## Catalog (public)
- `/grades/:grade` — subjects grid of the grade (from `subjects`).
- `/grades/:grade/subjects/:subject` — lessons list. EMPTY state (current
  reality, lessons table is empty): `Content coming soon.` + `[Ask EduChat
  about <subject>]` deep-link `https://educhat.pages.dev?lesson=<slug>`.
  Never render a blank page.
- `/lessons/:slug` — title + body + PDF viewer (if `pdf_url`) + Like +
  Bookmark + Share (Web Share API, no backend) + Print stylesheet +
  `[Ask EduChat about this lesson]` + text-to-speech button (browser
  SpeechSynthesis API, zero backend).
- `/search?q=` — results across lessons (title/body/tags) + glossary terms.
  Empty query → show popular tags. No-results → friendly message + Ask EduChat.

## Practice (public to play; XP needs login)
- `/quiz/:subject?` — one question at a time, 4 options, instant correction +
  explanation. Correct = +10 XP (logged-in only).
- `/flashcards/:subject?` — tap-to-flip cards, shuffle, known/unknown piles.
- `/glossary` — searchable A–Z terms (EN+AR).
- `/exams` — countdown timers to `exam_dates` + past papers (`kind=exam`).
- `/calculator` — Thanaweya total/percentage calculator. PURE client JS,
  no backend calls at all.

## Personal (private)
- `/bookmarks` — saved lessons grid + remove. Empty: `Save lessons to find
  them here.`
- `/planner` — study lists (CRUD on `study_plans`) + **Pomodoro timer**
  (25 focus / 5 break, audible chime, client-side only) + focus stats from
  `focus_sessions` (today / week totals). Finishing a pomodoro = +20 XP.
- `/profile` — EduID email + editable display name + XP + streak + level
  (level = floor(xp/500)+1, client-side) + logout.
- `/polls` — one active poll: vote once (no change allowed) + live results
  via `poll_results` RPC.
- `/leaderboard` — top 10 via `leaderboard()` RPC (first names only, privacy).
- `/referrals` — personal invite link (`/signup?ref=<uid>`) + invited count.
  Bonus: when invitee confirms email, referrer gets +100 XP (client triggers
  `referrals` insert + XP update — see 05-backend-map).
- `/creators/apply` — form (name, subject, message) → stored, `Coming soon`
  note. No payments in v1.

## Static
- `/privacy`, `/terms` — short basic texts (owner supplies final wording;
  ship with clean placeholder copy, clearly marked TODO).
- `/contact` — email `abdallah.mustafa.taha@gmail.com` + response-time note.
- `/welcome` — thank-you after first signup (confetti-free, calm).
- `404` — branded + links home. `robots.txt` + `sitemap.xml` generated.
  OG image: maroon bg + logo + tagline. Favicon: logo mark. Alt on images.
  Cookie banner (theme/locale + Supabase session note). Cloudflare Web
  Analytics snippet.
