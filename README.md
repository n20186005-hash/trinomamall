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

## Production domain: one setting only

Open `astro.config.mjs` and change only this line when the real production origin is known:

```js
const site = '';
```

For example, set it to your final HTTPS origin after registration. Do **not** add the domain elsewhere.

When `site` is empty:

- the project still builds;
- canonical, `og:url`, and absolute Open Graph image URLs are omitted rather than filled with a fake host;
- absolute `url` / `image` fields are omitted from the attraction JSON-LD;
- `@astrojs/sitemap` is not enabled, so no sitemap with a placeholder origin can be emitted.

When `site` is set, canonical / Open Graph / JSON-LD URLs derive from `Astro.site`, and the sitemap integration turns on automatically.

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
