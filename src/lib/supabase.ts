import { createClient } from '@supabase/supabase-js';

// NOTE: Auth is CLOUD (same Supabase project as EduCo.), not local.
// Env vars are inlined at build time; embedded public fallbacks guard flaky
// Pages injection. The anon key is public by design (RLS protects the data),
// never commit service_role.
const url =
  (import.meta.env.SUPABASE_URL as string) ||
  'https://qmvhbptvpdskyzbftabc.supabase.co';
const anon =
  (import.meta.env.SUPABASE_ANON_KEY as string) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtdmhicHR2cGRza3l6YmZ0YWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4NzcwMjMsImV4cCI6MjEwNTQ1MzAyM30.imv7tJGQSuYBMca_XG5rJj4dJHDFZ9BQkGr85q4GtMw';

// flowType 'implicit' (NOT pkce) — deliberate, do not "upgrade". Students open
// email links from phone Gmail apps / different browsers; PKCE stores its code
// verifier in the requesting browser, so those links die with
// "code verifier not found". Implicit sends token_hash links (verifyOtp works
// cross-browser). See brief/07-checklists.md hard lessons.
export const supabase = createClient(url, anon, {
  auth: { flowType: 'implicit', autoRefreshToken: true, persistSession: true },
});

export const SITE_URL =
  (import.meta.env.SITE_URL as string) ||
  (typeof location !== 'undefined' ? location.origin : 'http://localhost:4321');
