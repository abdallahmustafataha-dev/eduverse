# 01 — Landing Page (EN primary, mirror in AR)

Route: `/` (and `/en/`, `/ar/`). Public. CTA above the fold + sticky mobile CTA.

## Section 1 — HERO: "The Student Journey" (spec, do not genericize)
- **Concept:** a drawn road (single SVG) crossing the screen from **Grade 1
  Primary to Grade 3 Secondary** — 12 milestone nodes (one per grade, grade
  label under each). Main headline sits above the start; the **[Start your
  journey]** button sits exactly at the END of the road (the CTA is part of
  the story, not a floating button).
- **Motion:** road draws itself progressively on scroll (stroke-dashoffset);
  each milestone lights up when reached; small counter `Station 3 of 12`.
- **Desktop:** horizontal winding road (S-curve). Stats card near the end:
  `12 grades • 78 subjects • Egyptian curricula only`.
- **Mobile:** road turns VERTICAL (flows down with natural scroll), same 12
  stations; CTA at the end + sticky bottom CTA.
- **RTL (AR):** entire road mirrored (start on the right).
- **Colors (logo-floats rule):** background a shade deeper than paper
  (`#EFE3D2` suggested); road in maroon `#7F1D1D`; stations = white circles
  with maroon rings; big EduVerse logo floats above the start on a white card.
  Dark mode inverted.
- **Performance:** one lightweight SVG + CSS-only animation; honor
  `prefers-reduced-motion`. Zero image assets.
- **Accessibility:** road is `aria-hidden`; include a visually-hidden text list
  of the 12 grades for screen readers.
- **Copy — eyebrow:** `THE JEWEL OF EDUCO.` / AR: `جوهرة إديوكو`
- **Copy — title:** `Everything the Egyptian student needs.` / AR:
  `كل اللي يحتاجه الطالب المصري.`
- **Copy — sub:** `Egyptian curricula only — all grades, all subjects, one calm
  place to study.` / AR: `مناهج مصرية فقط — كل الصفوف، كل المواد، مكان هادي للمذاكرة.`
- **Copy — CTAs:** `[Start your journey]` / `[Explore grades]` / AR:
  `[ابدأ الرحلة]` `[استكشف الصفوف]`

## Section 2 — Vision & Goals
- Kicker: `WHY EDUVERSE EXISTS` / AR: `ليه إديوفيرس موجودة`
- 3 goal cards: `1M concurrent users one day.` / `Curriculum-grounded AI,
  never hallucinations (via EduChat).` / `Free core content forever — sponsors
  + paid courses fund it.` (+ AR translations in the same spirit)

## Section 3 — Founder
- Kicker: `MEET THE FOUNDER` / AR: `اتعرف على المؤسس`
- Text: `Abdallah Mustafa Taha, 14, founded EduCo. to give every Egyptian
  student everything they need in one place.` / AR: `عبدالله مصطفى طه، 14 سنة،
  أسس إديوكو عشان كل طالب مصري يلاقي كل اللي يحتاجه في مكان واحد.`
- Portrait placeholder (owner will supply photo later — design the slot now).

## Section 4 — Final CTA
- Big centered block: `Ready to start?` / AR: `جاهز تبدأ؟` + `[Start your
  journey]` / `[ابدأ الرحلة]` → scrolls to / goes to the auth gate.

## Section 5 — Footer
- Links: the 4 EduCo. apps + Account (login/signup) + `/privacy` + `/terms` +
  `/contact` + locale switch + theme toggle. © line.
