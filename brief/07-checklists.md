# 07 — Checklists + Acceptance + Hard Lessons

## A. SEO/UX (19 — all mandatory)
1. Custom 404 page 2. CTA above the fold 3. Meta title per page
4. Meta description per page 5. Open Graph image (maroon + logo + tagline)
6. Favicon set 7. `robots.txt` 8. `sitemap.xml` (generated at build)
9. Alt text on every image 10. Mobile breakpoints (see 06-mobile)
11. Sticky mobile CTA 12. Loading states (skeletons, never blank)
13. Form error states (visible, text only) 14. Thank-you page (`/welcome`)
15. Privacy page 16. Terms page 17. Cookie banner (theme/locale + session note)
18. Cloudflare Web Analytics snippet 19. Real contact address
(contact: abdallah.mustafa.taha@gmail.com on `/contact`)

## B. Security (13 — all mandatory)
1. No secrets in repo (`.env` gitignored; anon key public by design is OK)
2. HTTPS only (Pages default) 3. Passwords hashed by Supabase (bcrypt —
   frontend never sees more than the form field)
4. Turnstile CAPTCHA on signup + login (free, Cloudflare)
5. Parameterized queries only (supabase-js / RPC — never string-built SQL)
6. CORS = Supabase allowlist (Site URL + Redirects configured)
7. Validate inputs (type/email/minlength/reportValidity) + render errors as
   TEXT (never `innerHTML` with server text)
8. Security headers via `public/_headers` (copy pattern from EduCo.;
   NO strict CSP — it breaks auth inline scripts)
9. No directory listing (static output only; nothing sensitive in `public/`)
10. Rate-limit resends (60s cooldown) + single vote enforced server-side
11. `npm audit` clean before every handoff
12. Generic user-facing errors (raw details to console only)
13. Leaked-password protection: enable when project reaches Pro plan
    (unavailable on Free — compensated by 8-char minimum + unified messages)

## C. Acceptance (human tests before handoff)
- [ ] All Section 04 routes render EN + AR with Section 01–03 copy
- [ ] New-student flow: landing → journey → signup → verify email →
  `/welcome` → `/dashboard` shows Search + Continue widgets
- [ ] SSO: signed in on EduCo. → instantly signed in here (and reverse)
- [] Grade → subject → empty-lesson ("Coming soon + Ask EduChat") path
- [ ] Search AR + EN return seeded rows; bookmarks/XP/pomodoro persist per user
- [ ] `npm run build` passes; built CSS contains `max-width:` and zero `width<=`
- [ ] Screenshots (desktop+mobile, EN+AR) of landing/login/dashboard/
  one subject page attached to the handoff

## D. Hard lessons from EduCo. (do not repeat)
- exFAT (G:\) breaks `npm install` (symlinks) → install/build on C: (NTFS),
  keep source of truth on G:\, verify hash equality before pushing.
- Never commit `package-lock.json` containing `file:` references.
- Git on exFAT needs `safe.directory` exception.
- Email links: accept BOTH `token` and `token_hash` params; implicit flow only
  (PKCE links die cross-browser — students open mail in-app).
- Supabase dashboard email templates must be pasted from SOURCE files
  (`G:\EduCo\emails\`), never from browser preview tabs (placeholders!).
- Gmail never renders SVG images — email logos must be hosted PNG.
- One token = one click: email links are single-use; always offer resend.
