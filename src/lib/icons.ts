export const ICON_NAMES = [
  'home',
  'search',
  'continue',
  'quiz',
  'flashcards',
  'badge',
  'leaderboard',
  'grade',
  'subjects',
  'parent',
  'settings',
  'logout',
  'chevron',
  'spark',
  'clock',
  'book',
  'menu',
] as const;

export type IconName = (typeof ICON_NAMES)[number];
