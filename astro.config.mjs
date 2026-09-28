// @ts-check
import { defineConfig } from 'astro/config';
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_ORIGIN = 'https://eduverse-eg.pages.dev';

/**
 * Writes sitemap.xml + robots.txt from the pages that were actually generated,
 * so neither can drift from the build output. No extra dependency.
 * @returns {import('astro').AstroIntegration}
 */
function seoFiles() {
  return {
    name: 'eduverse-seo-files',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const raw = process.env.SITE_URL || process.env.PUBLIC_SITE_URL;
        const base = (raw || DEFAULT_ORIGIN).replace(/\/+$/, '');

        if (!raw) {
          logger.warn(
            'SITE_URL is not set — sitemap.xml/robots.txt use ' +
              `${DEFAULT_ORIGIN}. Set SITE_URL in the Cloudflare Pages build env.`,
          );
        }

        /** @type {string[]} */
        const locs = [];
        /** Pages that must never be advertised. */
        const skip = new Set(['404.html']);

        /** @param {string} dirAbs */
        const walk = (dirAbs) => {
          for (const entry of readdirSync(dirAbs)) {
            const full = join(dirAbs, entry);
            if (statSync(full).isDirectory()) {
              walk(full);
              continue;
            }
            if (!entry.endsWith('.html')) continue;
            const rel = relative(root, full).split(sep).join('/');
            if (skip.has(rel)) continue;
            locs.push(
              entry === 'index.html'
                ? `/${rel.replace(/index\.html$/, '')}`
                : `/${rel.replace(/\.html$/, '')}`,
            );
          }
        };

        walk(root);

        const list = [...new Set(locs)].sort((a, b) => a.localeCompare(b));

        // Pair EN/AR siblings so hreflang can be emitted for both.
        /** @type {Map<string, { en?: string, ar?: string }>} */
        const mates = new Map();
        for (const loc of list) {
          const m = loc.match(/^\/(en|ar)\/(.*)$/);
          if (!m) continue;
          const lang = /** @type {'en'|'ar'} */ (m[1]);
          const key = m[2];
          const entry = mates.get(key) || {};
          entry[lang] = loc;
          mates.set(key, entry);
        }

        /** @param {string} loc */
        const entryXml = (loc) => {
          const key = loc.replace(/^\/(en|ar)\//, '');
          const pair = mates.get(key) || {};
          const links = [];
          if (pair.en) links.push(`    <xhtml:link rel="alternate" hreflang="en" href="${base}${pair.en}"/>`);
          if (pair.ar) links.push(`    <xhtml:link rel="alternate" hreflang="ar" href="${base}${pair.ar}"/>`);
          const fallback = pair.en || pair.ar;
          if (fallback) {
            links.push(
              `    <xhtml:link rel="alternate" hreflang="x-default" href="${base}${fallback}"/>`,
            );
          }

          const depth = loc.split('/').filter(Boolean).length;
          const changefreq = depth <= 1 ? 'weekly' : 'monthly';
          const priority = depth <= 1 ? '1.0' : depth === 2 ? '0.8' : '0.5';

          return [
            '  <url>',
            `    <loc>${base}${loc}</loc>`,
            `    <changefreq>${changefreq}</changefreq>`,
            `    <priority>${priority}</priority>`,
            ...links,
            '  </url>',
          ].join('\n');
        };

        writeFileSync(
          join(root, 'sitemap.xml'),
          '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ' +
            'xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
            `${list.map(entryXml).join('\n')}\n` +
            '</urlset>\n',
          'utf8',
        );

        writeFileSync(
          join(root, 'robots.txt'),
          `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`,
          'utf8',
        );

        logger.info(`SEO: sitemap.xml (${list.length} urls) + robots.txt written`);
      },
    },
  };
}

export default defineConfig({
  output: 'static',
  integrations: [seoFiles()],
  vite: {
    // DO NOT REMOVE. Keeps classic `@media (max-width: …)` in built CSS.
    // The default Lightning CSS minifier rewrites them to modern range syntax
    // `@media (width<=…)`, which older mobile browsers ignore — silently
    // dropping the entire responsive layout on phones. See brief/06-mobile.md.
    build: { cssMinify: 'esbuild' },
  },
});
