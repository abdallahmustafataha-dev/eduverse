import { supabase } from './supabase';

/* Build-time (static) data access. Every query here comes straight from
   brief/05-backend-map.md — catalog reads only. Nothing else is touched. */

export type GradeLevel = 'primary' | 'prep' | 'secondary';

export interface Grade {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  level: GradeLevel;
  sort_order: number;
}

export interface Subject {
  id: string;
  grade_id: string;
  slug: string;
  name_en: string;
  name_ar: string;
}

export interface Lesson {
  id: string;
  subject_id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  body: string;
  pdf_url: string | null;
  kind: 'lesson' | 'summary' | 'exam' | 'past_paper';
  tags: string[] | null;
}

export function localized(ar: string, en: string, locale: string): string {
  return locale === 'ar' ? ar : en;
}

export function gradeName(grade: Grade, locale: string): string {
  return localized(grade.name_ar, grade.name_en, locale);
}

export function subjectName(subject: Subject, locale: string): string {
  return localized(subject.name_ar, subject.name_en, locale);
}

export function lessonName(lesson: Lesson, locale: string): string {
  return localized(lesson.title_ar, lesson.title_en, locale);
}

/** `select * from grades order by sort_order` — the journey road + crawler. */
export async function getGrades(): Promise<Grade[]> {
  const { data, error } = await supabase
    .from('grades')
    .select('id,slug,name_en,name_ar,level,sort_order')
    .order('sort_order');
  if (error) return [];
  return (data ?? []) as Grade[];
}

export async function getGradeBySlug(slug: string): Promise<Grade | null> {
  const { data, error } = await supabase
    .from('grades')
    .select('id,slug,name_en,name_ar,level,sort_order')
    .eq('slug', slug)
    .maybeSingle();
  if (error) return null;
  return (data as Grade | null) ?? null;
}

/** `from('subjects').select().eq('grade_id', id)` */
export async function getSubjects(gradeId: string): Promise<Subject[]> {
  const { data, error } = await supabase
    .from('subjects')
    .select('id,grade_id,slug,name_en,name_ar')
    .eq('grade_id', gradeId)
    .order('name_en');
  if (error) return [];
  return (data ?? []) as Subject[];
}

export async function getSubjectBySlug(gradeId: string, slug: string): Promise<Subject | null> {
  const subjects = await getSubjects(gradeId);
  return subjects.find((subject) => subject.slug === slug) ?? null;
}

/** `from('lessons').select().eq('subject_id', id)` — the lessons table is
    intentionally empty for now, so this is the "Content coming soon" path. */
export async function getLessons(subjectId: string): Promise<Lesson[]> {
  const { data, error } = await supabase
    .from('lessons')
    .select('id,subject_id,slug,title_en,title_ar,body,pdf_url,kind,tags')
    .eq('subject_id', subjectId)
    .order('created_at');
  if (error) return [];
  return (data ?? []) as Lesson[];
}

/** `from('lessons').select().eq('slug', slug).single()` */
export async function getLessonBySlug(slug: string): Promise<Lesson | null> {
  const { data, error } = await supabase
    .from('lessons')
    .select('id,subject_id,slug,title_en,title_ar,body,pdf_url,kind,tags')
    .eq('slug', slug)
    .maybeSingle();
  if (error) return null;
  return (data as Lesson | null) ?? null;
}

/** Hero + stats card: `12 grades • 78 subjects`. */
export async function getCatalogCounts(): Promise<{ grades: number; subjects: number }> {
  const [gradeRows, subjectRows] = await Promise.all([
    supabase.from('grades').select('id', { count: 'exact', head: true }),
    supabase.from('subjects').select('id', { count: 'exact', head: true }),
  ]);
  return { grades: gradeRows.count ?? 0, subjects: subjectRows.count ?? 0 };
}

/** Grades + their subject counts, for the sidebar "My grades" quick links. */
export async function getGradesWithSubjectCounts(): Promise<
  { grade: Grade; subjects: Subject[] }[]
> {
  const grades = await getGrades();
  if (grades.length === 0) return [];
  const { data: subjects, error } = await supabase
    .from('subjects')
    .select('id,grade_id,slug,name_en,name_ar')
    .in('grade_id', grades.map((grade) => grade.id))
    .order('name_en');
  if (error) return grades.map((grade) => ({ grade, subjects: [] }));
  const all = (subjects ?? []) as Subject[];
  return grades.map((grade) => ({
    grade,
    subjects: all.filter((subject) => subject.grade_id === grade.id),
  }));
}
