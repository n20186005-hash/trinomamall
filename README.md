# TriNoma Visitor Guide

A single-page, independent visitor guide for **TriNoma Mall in Quezon City, Metro Manila, Philippines**. The visual direction is intentionally specific to TriNoma: dense North EDSA city energy contrasted with the mall's landscaped Garden Restaurants area.

## Stack

- Astro `7.2.2`
- Tailwind CSS `4.3.3` through `@tailwindcss/vite` `4.3.3`
- TypeScript `6.0.3` (kept on the newest stable TypeScript major supported by `@astrojs/check` `0.9.10`)
- `@astrojs/sitemap` `3.7.3`
- Wrangler `4.123.0`
- pnpm `11.22.0`
- Node.js `24.19.0` LTS
- Cloudflare Workers Static Assets

Every package listed in `package.json` uses an exact version. The package manager and runtime are pinned with `packageManager`, `engines`, and `.node-version`. This is a single-package project and intentionally has **no `pnpm-workspace.yaml`**.

## Local development

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Type-check and build:

```bash
pnpm check
pnpm build
```

## Production domain

The production origin is set once in `astro.config.mjs`:

```js
const site = 'https://trinomamall.com';
```

Set `site` there and nowhere else. When it is set:

- canonical, `og:url`, and absolute Open Graph image URLs derive from `Astro.site`;
- absolute `url` / `image` fields are added to the attraction JSON-LD;
- `@astrojs/sitemap` is enabled and emits `dist/sitemap-index.xml`;
- `public/robots.txt` already points to `https://trinomamall.com/sitemap-index.xml`.

## HTTPS and domain normalization

This static site is served from Cloudflare Workers Static Assets. To avoid the duplicate-content and weight-splitting seen in Search Console for `http://` and `www.` variants:

- enable **Always Use HTTPS** in the Cloudflare dashboard (HTTP → HTTPS 301);
- `public/_headers` ships an HSTS header (`Strict-Transport-Security`) for all responses;
- serve only the apex `https://trinomamall.com`; do not publish a `www.` hostname, or 301 it to the apex at the edge.

Static image assets under `/images/*` also get a long `Cache-Control` via `public/_headers`, which helps mobile Core Web Vitals.

## Cloudflare Workers deployment

This project is static, so it uses Cloudflare Workers Static Assets and does not need the Astro Cloudflare adapter. `wrangler.jsonc` points the Worker's assets directory to `./dist`.

```bash
pnpm deploy
```

For Cloudflare's build settings, use:

- Build command: `pnpm build`
- Assets directory: `dist`
- Node.js: `24.19.0`
- pnpm: project-pinned `11.22.0`

## Local-only itinerary

The "My day" feature stores selected stops under the browser key `trinoma-visitor-plan-v1` using `localStorage`. It performs no API call and sends no itinerary data to a server. There is no database, login, or CMS.

## Google Analytics

GA4 measurement ID: `G-HXM22WWPKP`.

The only intentional third-party script is the standard Google tag loader from `www.googletagmanager.com`. The embedded map is a Google Maps iframe localized with `hl=en&region=PH`.

## Content notes

Primary visitor facts were based on Ayala Malls' TriNoma listing and the supplied Google Maps location. Standard hours represented in the site are:

- Monday–Friday: 11:00 AM–9:00 PM
- Saturday–Sunday: 10:00 AM–10:00 PM

Parking, holiday schedules, transport departures, tenant mix, and ratings can change, so the page deliberately tells visitors to check live or on-site information for time-sensitive details.

Useful source pages:

- Ayala Malls TriNoma: https://www.ayalamalls.com/main/malls/ayala-trinoma
- Google Maps search for the supplied coordinates: https://www.google.com/maps/search/?api=1&query=14.6517913%2C121.0331526

## Real-photo licensing

The four locally served WebP photographs come from Wikimedia Commons photographs by **Ralff Nestor Nacor**, licensed under **CC BY-SA 4.0**. See `PHOTO-CREDITS.md` and the on-page credit block for individual source links. The files were resized and converted to WebP for the web; no generated replacement images are used.

## Pre-delivery check

The repository includes `scripts/self-check.sh`, which implements the requested sequence:

```bash
pnpm self-check
```

It removes `node_modules` and `dist`, runs a frozen CI install, runs `astro check` and the production build, validates `pnpm-workspace.yaml` if one ever appears, scans `dist` for forbidden placeholder/injected strings, and validates generated sitemap files for placeholder URLs and fabricated `<lastmod>` values.
