import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Production origin: set it here once (for example, your real registered domain).
// When set, canonical/OG URLs, JSON-LD absolute URLs, and the sitemap are derived from it.
const site = 'https://trinomamall.com';

export default defineConfig({
  ...(site ? { site } : {}),
  integrations: site ? [sitemap()] : [],
  vite: {
    plugins: [tailwindcss()],
  },
});
