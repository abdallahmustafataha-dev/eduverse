# EduVerse — Jewel of EduCo. PLAN (Level 2 — Agent-Ready)

> Everything the Egyptian student needs — Egyptian curricula only. The future revenue engine.

## 1. Role
- **Jewel / cash cow + traffic driver** of EduCo.
- Single destination for Egyptian curricula (no international curricula in Phase 0).
- Login via EduID (SSO from EduCo. — `supabase.auth.getUser()` same project, auto-login if already signed in).

## 2. Audience
- Egyptian students (primary), parents, teachers, sponsors, paid-course creators. Arabic is user language, site bilingual EN-default per EduCo.

## 3. Value Proposition
- One place for all subjects, grades, and years — Egyptian Ministry curricula only.
- Grounded answers via EduChat deep-link, but EduVerse itself is content/platform, not chatbot.

## 4. Ambition & Scale
- **Target**: 1M concurrent users in same second.
- **Phase 0 reality**: static + serverless on free tier (100k req/day), architecture documented to scale when revenue arrives — no over-engineering now.

## 5. Monetization (Future, not Phase 0)
- **Sponsors**: `sponsors` table, slot-based, curated, non-intrusive. Empty in Phase 0.
- **Paid courses**: `courses` table, creators upload, commission. Empty in Phase 0.
- **Free Start**: all core curricula free to grow MAU.

## 6. Core Features
- **Browse**: grade → term → subject → lesson (Egyptian system: 6 primary + 3 prep + 3 secondary).
- **Content**: lessons (text/video), PDFs, practice questions, past exams.
- **Search**: Postgres `tsvector` free in Phase 0 (no Vectorize cost).
- **Personal**: bookmarks, progress per EduID.
- **Creator portal (Phase 1)**: `/creators/apply` stubbed.

## 7. Sitemap (Bilingual, EN default)
| Route | Purpose | Auth |
|-------|---------|------|
| `/` | Hero + grade crawler + featured lessons + sponsor slot (empty) | public |
| `/grades/:gradeSlug` | Subjects of grade | public |
| `/grades/:grade/subjects/:subjectSlug` | Lessons of subject | public |
| `/lessons/:slug` | Lesson detail (body, PDF, questions, deep-link to Chat) | public |
| `/search?q=` | Full-text search | public |
| `/bookmarks` | User bookmarks | private |
| `/profile` | EduID profile (reuses EduCo. data) | private |
| `/creators/apply` | Stub (Phase 1) | private |

## 8. Content Pipeline (Deterministic)
1. Source PDFs/text of Ministry books → `scripts/ingest.ts` extracts text (pdf.js).
2. Chunk 800 tokens / overlap 100 → stored in `lessons.body` (Phase 0, no embeddings).
3. Editor tags `grade_id, subject_id, lesson slug` via Supabase dashboard.
4. No hallucinations — content is verbatim source.

## 9. Phases
- **Phase 0 (Free)**: static catalog, Supabase free DB, no paid walls, no sponsors.
- **Phase 1 (Funded)**: sponsor module + creator payouts + Vectorize search + R2.
- **Phase 2 (Scale)**: edge caching, read replicas, sharded search to chase 1M/sec.

## 10. Success Metrics
- MAU, lesson completion, bookmarks, search CTR, sponsor viewability (future).

## 11. Non-Goals
- No AI generation (→ Chat), no Islamic theology (→ Rafiq), no local harness (→ Agent).

## 12. Acceptance Criteria (Agent Must Pass)
- [ ] `/` shows grade crawler (all grades from DB), featured lessons (6), search bar works (tsvector), sponsor slot renders empty without error.
- [ ] Browse flow `grade → subject → lesson` works with bilingual slugs, lesson page shows PDF viewer (if pdf_url) + “Ask EduChat” deep-link `https://educhat.pages.dev?lesson=slug`.
- [ ] Search with Arabic and EN queries returns relevant lessons (test: “رياضيات” → math lessons, “photosynthesis” → science if tagged).
- [ ] `/bookmarks` is private (redirect to EduCo. `/login` if no session), add/remove bookmark persists per EduID, list shows only own bookmarks (RLS test).
- [ ] No paid wall or sponsor billing logic exists in Phase 0 (tables exist but empty, UI shows “Coming soon”).
- [ ] `npm run build` passes and deploys to Pages; no secrets committed.

## 13. File Structure
```
G:\EduVerse\
  PLAN.md, DESIGN.md, TECH.md
  src/pages/{index, grades/[grade], subjects/[subject], lessons/[slug], search, bookmarks, profile}
  src/lib/supabase.ts (same project as EduCo.)
  scripts/ingest.ts
```
