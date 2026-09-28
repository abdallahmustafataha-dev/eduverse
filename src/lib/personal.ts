import { supabase } from './supabase';
import type { Locale } from './copy';
import { gradeName, lessonName, subjectName, type Grade, type Subject } from './data';

/* Personal (private) reads, client-side after `getUser()`.
   brief/05-backend-map.md: "Continue learning: latest `focus_sessions`
   (or latest bookmark) -> lesson slug".

   focus_sessions has no `lesson_id` column today, so a lesson-level resume is
   impossible until the backend adds one. We therefore TRY the lesson-level
   shape first and fall back to the subject level automatically: if the owner
   adds `focus_sessions.lesson_id`, this starts returning a real lesson with no
   code change. Nothing here invents a column — it just tolerates the absence. */

export interface ResumeTarget {
  kind: 'lesson' | 'subject';
  title: string;
  href: string;
  /** Only set when a real value exists — we never fabricate a percentage. */
  percent: number | null;
  /** Real data: total focused minutes behind this target. */
  focusMinutes: number;
}

interface NestedSubject {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  grades?: { slug: string }[] | { slug: string } | null;
}

function firstGradeSlug(value: NestedSubject['grades']): string | null {
  if (!value) return null;
  if (Array.isArray(value)) return value[0]?.slug ?? null;
  return value.slug ?? null;
}

const LESSON_LEVEL_SELECT = `
  id, duration_min, started_at, lesson_id,
  lesson:lessons(
    slug, title_en, title_ar,
    subject:subjects(id, slug, name_en, name_ar, grades:grades(slug))
  )
`;

const SUBJECT_LEVEL_SELECT = `
  id, duration_min, started_at, subject_id,
  subject:subjects(id, slug, name_en, name_ar, grades:grades(slug))
`;

/** A missing `lesson_id` comes back as a PostgREST column error — that is our
    signal to fall back, not something to surface to the student. */
function columnMissing(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  const code = (error.code || '').toUpperCase();
  const text = `${error.message || ''}`.toLowerCase();
  return (
    code === 'PGRST204' ||
    code === '42703' ||
    text.includes('could not find the column') ||
    text.includes('column') ||
    text.includes('does not exist')
  );
}

async function latestFocusSession(userId: string, withLesson: boolean) {
  const query = supabase
    .from('focus_sessions')
    .select(withLesson ? LESSON_LEVEL_SELECT : SUBJECT_LEVEL_SELECT)
    .eq('user_id', userId)
    .order('started_at', { ascending: false })
    .limit(1);
  const { data, error } = await query;
  if (error) return { row: null, missingColumn: columnMissing(error) };
  return { row: (data?.[0] ?? null) as Record<string, unknown> | null, missingColumn: false };
}

async function focusMinutesFor(userId: string, subjectId?: string | null): Promise<number> {
  let query = supabase
    .from('focus_sessions')
    .select('duration_min')
    .eq('user_id', userId);
  if (subjectId) query = query.eq('subject_id', subjectId);
  const { data } = await query;
  return (data ?? []).reduce<number>((total, row) => total + (row.duration_min ?? 0), 0);
}

export async function getContinueTarget(
  userId: string,
  locale: Locale,
): Promise<ResumeTarget | null> {
  // 1) Lesson level, if the backend ever exposes focus_sessions.lesson_id.
  const withLesson = await latestFocusSession(userId, true);
  if (withLesson.row && !withLesson.missingColumn) {
    const lesson = withLesson.row.lesson as
      | { slug: string; title_en: string; title_ar: string; subject: NestedSubject | null }
      | null;
    if (lesson?.subject) {
      const gradeSlug = firstGradeSlug(lesson.subject.grades);
      if (gradeSlug) {
        return {
          kind: 'lesson',
          title: locale === 'ar' ? lesson.title_ar : lesson.title_en,
          href: `/${locale}/lessons/${lesson.slug}/`,
          percent: null,
          focusMinutes: Number(withLesson.row.duration_min ?? 0),
        };
      }
    }
  }

  // 2) Subject level — what today's schema actually supports.
  const subjectLevel = await latestFocusSession(userId, false);
  const row = subjectLevel.row;
  if (row) {
    const subject = row.subject as NestedSubject | null;
    const gradeSlug = subject ? firstGradeSlug(subject.grades) : null;
    if (subject && gradeSlug) {
      return {
        kind: 'subject',
        title: subjectName(subject as Subject, locale),
        href: `/${locale}/grades/${gradeSlug}/subjects/${subject.slug}/`,
        percent: null,
        focusMinutes: await focusMinutesFor(userId, String(row.subject_id ?? '')),
      };
    }
  }

  // 3) Most recent bookmark, resolved through to its lesson.
  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('created_at, lesson:lessons(slug, title_en, title_ar, subject:subjects(id, slug, name_en, name_ar, grades:grades(slug)))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1);
  const lesson = (bookmarks?.[0]?.lesson ?? null) as {
    slug: string;
    title_en: string;
    title_ar: string;
    subject: NestedSubject | null;
  } | null;
  if (lesson) {
    return {
      kind: 'lesson',
      title: locale === 'ar' ? lesson.title_ar : lesson.title_en,
      href: `/${locale}/lessons/${lesson.slug}/`,
      percent: null,
      focusMinutes: 0,
    };
  }

  return null;
}

/** Sidebar badge counts — allowed ONLY on Bookmarks and Planner. */
export async function getBadgeCounts(userId: string): Promise<{ bookmarks: number; plans: number }> {
  const [bookmarks, plans] = await Promise.all([
    supabase.from('bookmarks').select('user_id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('study_plans').select('id', { count: 'exact', head: true }).eq('user_id', userId),
  ]);
  return { bookmarks: bookmarks.count ?? 0, plans: plans.count ?? 0 };
}

/** Redirect helper used by private pages. */
export async function requireSession(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export { gradeName, lessonName, subjectName };
export type { Grade, Subject };
