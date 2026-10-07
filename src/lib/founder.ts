import { existsSync } from 'node:fs';
import { join } from 'node:path';

/* Founder portrait (brief/01 section 3). Resolution order:
 *   1. PUBLIC_FOUNDER_PORTRAIT if the owner sets an explicit path
 *   2. public/founder.jpg, if that file is actually on disk
 *   3. null, which renders the monogram placeholder
 * The build never fails on a missing photo: step 2 is a plain fs check, and
 * the markup carries a runtime onerror fallback for a corrupt file.

 * This module is deliberately separate from src/lib/site.ts. site.ts is
 * imported by the client script on every page (logDetail, localePath), and
 * node:fs / node:path cannot be bundled for the browser — they resolve to
 * externalized stubs. Only server-rendered components (Landing.astro) may read
 * the filesystem, so the fs import must never sit in a module the client pulls
 * in. */
const FOUNDER_FILE = 'founder.jpg';

function founderPhotoExists(): boolean {
  try {
    return existsSync(join(process.cwd(), 'public', FOUNDER_FILE));
  } catch {
    return false;
  }
}

export const FOUNDER_PORTRAIT: string | null =
  (import.meta.env.PUBLIC_FOUNDER_PORTRAIT as string) ||
  (founderPhotoExists() ? `/${FOUNDER_FILE}` : null);