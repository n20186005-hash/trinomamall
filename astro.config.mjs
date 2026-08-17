import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Production origin: set it here once (for example, your real registered domain).
// Keep empty until a domain is ready; the project still builds without it.
const site = '';

export default defineConfig({
  ...(site ? { site } : {}),
  integrations: site ? [sitemap()] : [],
  vite: {
    plugins: [tailwindcss()],
  },
});
