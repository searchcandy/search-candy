# Search Candy (searchcandy.uk)

Marketing site for the Search Candy eCommerce SEO consultancy. Next.js front-end backed by a headless WordPress CMS (GraphQL).

## Stack

- **Next.js 16** (App Router, Turbopack default)
- **React 19.2**
- **Node 24.x** required
- **pnpm 10.33.4** via Corepack (`packageManager` is pinned in `package.json`)
- Plain `fetch` against GraphQL (no Apollo) — all data fetching happens in Server Components
- `next/font/google` for Readex Pro, Unna, Nunito Sans
- CSS Modules under `styles/`
- TypeScript source files (`.ts`/`.tsx`) with strict type checking
- Path alias `@/*` -> project root via `tsconfig.json`

## Data source

Production WPGraphQL is configured in Vercel via `WP_GRAPHQL_ENDPOINT`. Do not commit the CMS hostname; `lib/api.ts` requires the endpoint from the environment.

Cloudflare Access protects the production GraphQL endpoint. Server-side GraphQL requests send `CF-Access-Client-Id` and `CF-Access-Client-Secret` when `CF_ACCESS_CLIENT_ID` and `CF_ACCESS_CLIENT_SECRET` are present. Vercel Production must have `WP_GRAPHQL_ENDPOINT`, `CF_ACCESS_CLIENT_ID`, and `CF_ACCESS_CLIENT_SECRET`. The Access application/policy must allow the Vercel service token with a **Service Auth** policy. GraphQL `401`/`403` responses and missing Vercel Access env vars are build-blocking by design, so Vercel cannot deploy empty post lists.

Access should protect the CMS GraphQL/admin paths; keep `/wp-content/uploads/*` publicly reachable through the public frontend so legacy media URLs and post images keep working.

The public canonical front-end is `https://searchcandy.uk`; `https://www.searchcandy.uk` redirects to the apex from Vercel. Helpers live in `lib/api.ts`. All fetches use `next: { revalidate: 3600 }` (1h ISR) by default. Image hosts that need to be in `next.config.ts` → `images.remotePatterns`:
- the private CMS hostname derived from `WP_GRAPHQL_ENDPOINT` — headless WP uploads and optimized images
- `www.searchcandy.uk` and `searchcandy.uk` — legacy WP upload URLs during transition
- `secure.gravatar.com` — author avatars

## Route map

```
app/
  layout.tsx                            root layout (html/body, metadata, Shell wrapper)
  page.tsx                              home (static)
  not-found.tsx                         404
  robots.ts                            robots.txt allows indexing
  newsletter/route.ts                   Whop newsletter checkout redirect
  [...uri]/page.tsx                     WordPress post detail (SSG via generateStaticParams)
  insights/
    page.tsx                            blog index page 1 (10 posts)
    page/[page]/page.tsx                paginated index (page 2+)
  seo/seo-glossary/
    page.tsx                            glossary A–Z index (hand-maintained)
    [...uri]/page.tsx                   glossary entry detail (SSG, WP parent=3592)
```

`trailingSlash: true` is on, so external URLs always end with `/`.

## Components

```
components/
  Shell.tsx              server wrapper; renders Header + children + Newsletter + Footer
  header.tsx             server component; plain anchors for static public navigation
  footer.tsx             server component; plain anchors for static public navigation
  MobileMenu.tsx         server component; native Popover API, no React hydration
  NewsletterSignup.tsx   server component; posts to app/newsletter/route.ts
  shareButton.tsx        server; native Web Share progressive enhancement
  fonts.ts              next/font/google exports
```

The Shell wraps `{children}` in the root layout - individual page files just render their own `<main>`. Header, footer, mobile menu, and newsletter signup are server-rendered; keep static public navigation as plain anchors unless client-side routing is genuinely needed.

## Architecture notes

- **No `<Head>` anywhere** — use `metadata`/`generateMetadata` exports (App Router native).
- **No Apollo** — Server Components fetch GraphQL directly with native `fetch`.
- **Static public navigation uses plain anchors** in the homepage/chrome path to avoid shipping `next/link` client runtime for first load. `eslint.config.mjs` has a narrow `@next/next/no-html-link-for-pages` exception for those files.
- **The glossary A–Z index page is hand-maintained HTML** in `app/seo/seo-glossary/page.tsx`. Adding a new entry in WordPress requires also adding it here. Flag this to the user before editing.
- **The `[...uri]` catch-all** sluggifies via `parts[parts.length - 1]` and looks up the post by SLUG. Works because WP slugs are unique sitewide.

## Commands

```bash
pnpm dev        # turbopack dev server (outputs to .next/dev)
pnpm build      # turbopack production build
pnpm lint       # ESLint CLI with Next core web vitals rules
pnpm typecheck  # strict TypeScript check
pnpm start      # serve the prebuilt output
```

## Known upstream issue

WordPress's `all-in-one-seo-pack` plugin currently throws PHP `TypeError` on some GraphQL responses (`array_filter()` arg type error in `Addons.php:176`). This is intermittent and lives on the WP side - not something the Next.js app can fix. If pages 500 during ISR revalidation, the cached prerendered HTML keeps serving until the next successful revalidation. Do not treat Cloudflare Access `401`/`403` responses as flaky WordPress failures; those indicate Access policy or Vercel service-token configuration is wrong.

## When making changes

- Default to Server Components. Add `'use client'` only at boundaries that need state, effects, or browser APIs.
- For data fetched on multiple pages of the same request, consider `React.cache()` to dedupe.
- Don't reintroduce Apollo or `@next/font` — those were dropped during the App Router migration.
- The build is fully static (`generateStaticParams` for every dynamic route). Keep it that way unless there's a real reason to go dynamic.
