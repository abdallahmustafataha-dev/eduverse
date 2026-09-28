# 06 — Mobile Rules (standalone, MUST follow)

Context: on EduCo. we learned that modern range syntax `@media (width<=Npx)`
is ignored by older mobile browsers AND the Astro build minifier rewrites
classic syntax into it. These rules prevent a repeat.

## Hard requirements
1. Write ALL media queries in classic syntax: `@media (max-width: 760px)`.
2. `astro.config.mjs` MUST contain `vite.build.cssMinify: 'esbuild'` (already
   in the scaffold — never remove it; it stops the minifier rewrite above).
3. Every responsive override lives AFTER base rules (append mobile blocks at
   the END of the stylesheet or in a later file).
4. Breakpoints: `1020px` (2-col), `760px` (stack), `560px` (compact).
5. Hero road turns VERTICAL under 760px; CTA full-width; sticky bottom CTA.
6. All buttons/links ≥44px touch targets; auth + dashboard buttons full-width
   under 560px.
7. Long Arabic titles: `overflow-wrap: break-word`, never fixed heights on text
   containers, `max-width` in `ch` only with generous values.
8. Login split stacks (logo compact top, form below); sidebar becomes a drawer
   with overlay + Esc to close; tables/lists become cards (no horizontal scroll
   except grade nav with scroll-snap).
9. Emails/phones break with `overflow-wrap: anywhere`.
10. Test on a REAL phone (not just devtools): landing, login, dashboard,
    one empty subject page. Screenshot all four (EN+AR) before handoff.

## Forbidden
- `@media (width<=…)` range syntax anywhere (source or output — verify the
  BUILT css contains `max-width:` and zero `width<=`).
- `white-space: nowrap` on any user-facing text or button label.
- Fixed `height` on text containers; `100vw` without overflow guard.
- Local `file:` dependencies in package-lock (poisons Pages builds — never
  commit a lockfile containing them).
