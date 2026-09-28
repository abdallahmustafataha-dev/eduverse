# 02 — Auth Gate + Login + Dashboard Entry (EN primary, mirror in AR)

Same EduID as EduCo. (shared Supabase project). A user signed in on EduCo. is
instantly signed in here — verify with `supabase.auth.getUser()`, never with a
local store. Login methods: Email+Password + Google ONLY. No Facebook.

## Auth gate (end of landing specificity)
After [Start your journey]: if session exists → go `/dashboard`. If not →
stay on an auth panel ON THE SAME PAGE offering both paths:
- `New here? Create your EduID` → opens signup (same page or `/signup`)
- `Have an EduID? Log in` → opens login (same page or `/login`)
- Google button available on BOTH paths (new users often own no password).

## Split login page (`/login`, `/signup`)
- **Desktop:** split screen. Logo panel on the LEFT in EN / RIGHT in AR
  (mirrored by `dir`, not by separate layouts): big EduVerse logo floating on a
  contrasting card (logo-floats rule) + one-line promise.
  Other side: the form (email + password ≥8 chars + submit) + divider `or` +
  `[Continue with Google]` + links (forgot / no-account / has-account).
- **Mobile:** stacked — logo compact on top, form below, all buttons full-width.
- Reuse EduCo. flows exactly: signup requires email confirmation (+ resend);
  Google is instant; forgot sends 1h link; reset sets new password + auto-login.
- Duplicate-email signup MUST say `An account with this email already exists.`
  (pre-check via `email_exists` RPC — see 05-backend-map).
- Login failures (wrong email and/or wrong password) MUST show ONE unified
  message: `Invalid email or password.` / AR: `الإيميل أو الباسورد غير صحيح.`
  Exception: unconfirmed email shows the resend flow instead.
- Every auth error visible on screen (never silent). Rate-limit resends
  (60s cooldown). Turnstile CAPTCHA on signup + login (free).

## Post-auth landing
- First screen after registration = `/dashboard` (calm, see 03-dashboard).
- `/verify` handles confirmation links: success → auto-login → `/dashboard`;
  expired/invalid → error + resend. Accept BOTH `token_hash` and `token` params
  (Supabase uses both formats across versions) + `code` exchange fallback.
- `/welcome` (thank-you page) shown once after first-ever login.
- `/apps`-style deep links carry `?eduid=<token>` for siblings (EduChat link
  from lessons uses `?lesson=<slug>`).
