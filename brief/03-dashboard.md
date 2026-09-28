# 03 — Dashboard + Sidebar (Students edition)

Private (redirect to login if no session). Design rule from the owner: a
student's mind first — NEVER crowded. Exactly TWO widgets + sidebar.

## Widgets (only these two)
1. **Search** — big calm search bar (AR/EN full-text). Placeholder:
   `Search lessons, terms, exams…` / AR: `دوّر على دروس، مصطلحات، امتحانات…`
2. **Continue learning** — resumes the last opened lesson (`Continue: <title>`
   + progress %). Empty state: `Pick a subject to begin.` + link to grades.
   Source of truth: latest `focus_sessions` row OR last bookmark (see
   05-backend-map). NOTHING else on the dashboard. No banners, no carousels,
   no stats walls. (XP/streak live on `/profile`, not here.)

## Sidebar (everything lives here)
Sections (order fixed): Dashboard, My grades (grade → subject quick links),
Search, Bookmarks, Planner (study lists + Pomodoro), Quiz, Flashcards,
Glossary, Exams, Calculator, Polls, Leaderboard, Referrals, Ask EduChat
(external link `https://educhat.pages.dev`), Account (profile), Log out.
- Collapsible to icons on desktop; drawer (`☰`) on mobile with overlay.
- Active item highlighted; badge counts allowed ONLY on Bookmarks and Planner.
- Keyboard accessible (Esc closes drawer, focus trapped while open).

## States
- Loading: skeleton rows (never blank white).
- New user (no history): friendly empty states with ONE next action each.
- Offline (PWA later): show cached content note — Phase 1, stub the UI only.
