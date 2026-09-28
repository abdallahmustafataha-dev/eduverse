import ar from '../i18n/ar.json';
import en from '../i18n/en.json';

export const dictionaries = { en, ar } as const;

export type Locale = keyof typeof dictionaries;
export type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: string | null | undefined): Dictionary {
  return locale === 'ar' ? ar : en;
}

/** Fill `{token}` placeholders: fmt(t['dash.progressLabel'], { n: 40 }). */
export function fmt(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : match,
  );
}

/** 12 -> "١٢" for Arabic-Indic numerals. Used for the journey station labels. */
export function toArabicDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
}
