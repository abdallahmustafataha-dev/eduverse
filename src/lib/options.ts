/* `questions.options` and `polls.options` are jsonb with no check constraint and
   no seeded rows, so the exact shape is not pinned down by the database. This
   normalizer accepts every shape the codebase or a future seed might use and
   returns plain strings for the current locale. Unknown shapes degrade to an
   empty list rather than throwing, so a page never renders broken.

   Accepted:
     ["Egyptian", "Arabic"]                    -> array of strings
     [{ text_en, text_ar }]                   -> localized objects
     [{ en, ar }] / [{ text: { en, ar } }]
     [{ label_en, label_ar }]
     { "0": "Egyptian", "1": "Arabic" }       -> object map keyed by index
*/

export interface LocalizedOption {
  en: string;
  ar: string;
}

function pick(
  source: Record<string, unknown>,
  keys: readonly string[],
  locale: 'en' | 'ar',
): string {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'string' && value.trim()) return value;
  }
  // Fall back to any *_ar / *_en pair regardless of the exact prefix.
  for (const suffix of ['ar', 'en']) {
    for (const [key, value] of Object.entries(source)) {
      if (key.endsWith(`_${suffix}`) && typeof value === 'string' && value.trim()) {
        return suffix === locale ? value : '';
      }
    }
  }
  return '';
}

/** Turn one raw jsonb entry into a localized string (empty if unusable). */
function readOption(raw: unknown, locale: 'en' | 'ar'): string {
  if (typeof raw === 'string') return raw.trim();
  if (typeof raw === 'number') return String(raw);
  if (raw && typeof raw === 'object') {
    const source = raw as Record<string, unknown>;

    const nested = source.text;
    if (nested && typeof nested === 'object') {
      return readOption(nested, locale);
    }

    const direct = pick(
      source,
      locale === 'ar'
        ? ['text_ar', 'label_ar', 'option_ar', 'ar']
        : ['text_en', 'label_en', 'option_en', 'en'],
      locale,
    );
    if (direct) return direct;

    // A localized object in the other language is still better than nothing.
    return pick(
      source,
      locale === 'ar'
        ? ['text_en', 'label_en', 'option_en', 'en']
        : ['text_ar', 'label_ar', 'option_ar', 'ar'],
      locale,
    );
  }
  return '';
}

/** Normalize an `options` jsonb value into an array of localized strings. */
export function normalizeOptions(raw: unknown, locale: 'en' | 'ar'): string[] {
  if (raw == null) return [];

  const list = Array.isArray(raw)
    ? raw
    : typeof raw === 'object'
      // Object map keyed by option index: order numerically, not lexically.
      ? Object.entries(raw as Record<string, unknown>)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([, value]) => value)
      : [];

  return list.map((item) => readOption(item, locale)).filter((text) => text.length > 0);
}
