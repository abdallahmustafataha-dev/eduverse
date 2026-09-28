// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  vite: {
    // DO NOT REMOVE. Keeps classic `@media (max-width: …)` in built CSS.
    // The default Lightning CSS minifier rewrites them to modern range syntax
    // `@media (width<=…)`, which older mobile browsers ignore — silently
    // dropping the entire responsive layout on phones. See brief/06-mobile.md.
    build: { cssMinify: 'esbuild' },
  },
});
