# 05 — Backend Map: every feature ↔ its data (same Supabase project as EduCo.)

Conventions: public tables = SELECT for everyone. Private tables = RLS
`auth.uid() = user_id` (select/insert/update/delete own rows only — already
enforced server-side). Never invent new tables/columns without asking the
human. Amounts: XP correct +10, lesson done +50, pomodoro +20, referral +100.

## Catalog (public read, already seeded: 12 grades, 78 subjects)
- Grade crawler/hero stats: `select * from grades order by sort_order`
- Subjects of grade: `from('subjects').select().eq('grade_id', id)`
- Lessons of subject: `from('lessons').select().eq('subject_id', id)`
- Lesson detail: `from('lessons').select().eq('slug', slug).single()`
- Search: `from('lessons').select('id,slug,title_en,title_ar').textSearch('search_vector', q, { type:'plain', config:'simple' }).limit(20)` (+ same on `glossary` via ilike on term_en/term_ar)
- PDF: `pdf_url` column (Supabase Storage `lesson-pdfs` bucket, 1GB free)

## Personal (private)
- Bookmarks: `bookmarks` insert/delete `{user_id, lesson_id}`; list join lessons
- Likes: `lesson_likes` same pattern (toggle)
- Study plans: `study_plans` full CRUD own rows (`items` jsonb array)
- Pomodoro: on finish → insert `focus_sessions {user_id, duration_min, subject_id?}` + bump XP (below)
- Continue learning: latest `focus_sessions` → `lesson_id` (uuid, nullable, FK lessons)
  if set → lesson slug; else `subject_id` → subject page; else latest bookmark;
  else empty state. (Column added 2026-09-27; RLS unchanged, row-level.)
- Quiz XP / progress: no table — XP goes to `user_stats`, progress derived
- Polls: vote → insert `poll_votes {poll_id, user_id, option_index}` (ONE vote:
  no update policy by design); results → `select * from rpc('poll_results', {poll_id})`
- Leaderboard: `select * from rpc('leaderboard', {limit_n: 10})` (safe: names only)
- Referrals: link `/signup?ref=<uid>`; on signup read `ref` param, store for
  post-confirm; on confirm insert `referrals {referrer_id, referred_user_id}` +
  award +100 XP to referrer
- XP/streak: `user_stats` upsert own row `{xp, streak_count, last_study_date}`;
  streak rule (client): if last_study_date == yesterday → +1; if older → reset 1
- Profile: `profiles` select/update own `{display_name, locale}`
- Creator apply: insert `creator_applications {user_id, name, subject, message}`
- Duplicate-email check (signup): `rpc('email_exists', {check_email})` → true =
  show "already exists", do NOT call signUp

## Locked / future (DO NOT build UI writes against these yet)
- `comments`: RLS denies everything until Community edition (reads fail by design)
- `sponsors`, `courses`: empty until Courses edition (read-only slots OK)

## Storage
- Bucket `lesson-pdfs` (public read). Videos: YouTube-Unlisted links in lesson
  body ONLY — never upload video to our storage.
