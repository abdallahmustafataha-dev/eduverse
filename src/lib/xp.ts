import { supabase } from './supabase';

/* XP + streak, exactly as brief/05-backend-map.md prescribes:
     "user_stats upsert own row {xp, streak_count, last_study_date};
      streak rule (client): if last_study_date == yesterday -> +1;
      if older -> reset 1"
   Amounts: quiz correct +10, lesson done +50, pomodoro +20, referral +100.

   This is a client-side tally by design (the brief calls for it), so it is
   friendly rather than authoritative — it must never gate anything that
   matters. Failures are swallowed: a student should still see their correct
   answer even if the XP write does not land. */

export const XP_AMOUNTS = {
  quizCorrect: 10,
  lessonDone: 50,
  pomodoro: 20,
  referral: 100,
} as const;

export interface UserStats {
  xp: number;
  streak_count: number;
  last_study_date: string | null;
}

export const EMPTY_STATS: UserStats = { xp: 0, streak_count: 0, last_study_date: null };

function isoDay(date: Date): string {
  // Local calendar day, not UTC: a streak must not roll over at 22:00.
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function getUserStats(userId: string): Promise<UserStats> {
  const { data, error } = await supabase
    .from('user_stats')
    .select('xp,streak_count,last_study_date')
    .eq('user_id', userId)
    .maybeSingle();
  if (error || !data) return { ...EMPTY_STATS };
  return {
    xp: Number(data.xp ?? 0),
    streak_count: Number(data.streak_count ?? 0),
    last_study_date: data.last_study_date ?? null,
  };
}

/** Level from XP, per brief/04-pages.md: level = floor(xp / 500) + 1. */
export function levelForXp(xp: number): number {
  return Math.floor(Math.max(0, xp) / 500) + 1;
}

/** Record today's study activity: add `amount` XP and advance the streak.
 *  Pass 0 for a streak-only update (no XP change). */
export async function awardXp(amount: number, userId?: string): Promise<UserStats | null> {
  try {
    /* A non-finite or negative amount would poison the stored xp, so it is
       rejected before any write. 0 is the documented streak-only case. */
    if (!Number.isFinite(amount) || amount < 0) return null;
    const delta = Math.floor(amount);

    let uid = userId;
    if (!uid) {
      const { data } = await supabase.auth.getUser();
      uid = data.user?.id ?? undefined;
    }
    if (!uid) return null;

    const current = await getUserStats(uid);
    const today = isoDay(new Date());

    let streak = current.streak_count;
    if (current.last_study_date === today) {
      // Already studied today: streak unchanged.
      streak = Math.max(1, streak);
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      streak = current.last_study_date === isoDay(yesterday) ? current.streak_count + 1 : 1;
    }

    const next: UserStats = {
      xp: Math.max(0, current.xp + delta),
      streak_count: streak,
      last_study_date: today,
    };

    const { error } = await supabase
      .from('user_stats')
      .upsert(
        { user_id: uid, xp: next.xp, streak_count: next.streak_count, last_study_date: next.last_study_date },
        { onConflict: 'user_id' },
      );
    if (error) return current;
    return next;
  } catch {
    return null;
  }
}
