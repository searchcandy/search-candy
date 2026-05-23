---
name: searchcandy
description: Internal reference for the Search Candy front-end repo (searchcandy.uk) - a Next.js 16 App Router site that consumes a headless WordPress backend via WPGraphQL. Use this whenever working in the search-candy repository, editing any file under app/, components/, lib/, or styles/, or answering questions about how the site is wired up, where data comes from, the WordPress headless setup, the Whop newsletter integration, or build/deploy on Vercel. Triggers on mentions of "Search Candy", "searchcandy.uk", "Colin McDermott's site", "headless WordPress", or any task in this repo.
---

# Search Candy

A personal-brand publication for **Colin McDermott** (Head of SEO at Whop, twenty years in search), framed Stratechery-style: "Search Candy" is the masthead, Colin is the author. Built as a Next.js 16 front-end consuming a long-running WordPress install as a headless CMS.

The site went through a big rebuild in 2026: from agency-template `pages/` Next 13 to publication-style App Router on Next 16. The public site now runs on Vercel; WordPress remains the private headless CMS configured through environment variables.

## Stack

- **Next.js 16.2.6** (App Router, Turbopack default in 16)
- **React 19.2.6** with the **React Compiler enabled** (`reactCompiler: true` in `next.config.ts`, `babel-plugin-react-compiler` in devDeps). Most manual `React.memo`/`useMemo`/`useCallback` is unnecessary as a result, but explicit `useCallback` for callbacks crossing component boundaries is still fine.
- **Node 20.9+** required. Local dev uses Node 22 via nvm - `source $NVM_DIR/nvm.sh && nvm use 22` before running `next build`, `pnpm lint`, or `pnpm typecheck`.
- `next/font/google` for **Readex Pro**, **Unna**, **Nunito Sans** (see `components/fonts.ts`).
- **CSS Modules** under `styles/` (`Home.module.css`, `Page.module.css`, `Insights.module.css`, `SinglePost.module.css`, `GlossaryIndex.module.css`, `GlossarySinglePage.module.css`) plus `globals.css`.
- Path alias `@/*` -> project root via `tsconfig.json`. All imports use this style.
- `trailingSlash: true` in `next.config.ts`. URLs always end with `/`.
- Universal `box-sizing: border-box` in `globals.css`.

Source files are TypeScript (`.ts` / `.tsx`) with strict checking. Avoid `any`; shared project shapes live in `types/searchcandy.d.ts`.

## Data layer

All content comes from **WordPress + WPGraphQL** at a single endpoint. The endpoint is **env-configurable**:

```js
// lib/api.ts
const API_URL = process.env.WP_GRAPHQL_ENDPOINT
```

Production uses `WP_GRAPHQL_ENDPOINT` in Vercel env vars. Do not hardcode or document the CMS hostname in this public repo.

The GraphQL endpoint is protected by Cloudflare Access Service Auth in production. `lib/api.ts` sends `CF-Access-Client-Id` and `CF-Access-Client-Secret` headers when `CF_ACCESS_CLIENT_ID` and `CF_ACCESS_CLIENT_SECRET` are present. These env vars belong in Vercel only; never expose them to client components or `NEXT_PUBLIC_*` variables. Missing Access env vars on Vercel production builds, plus GraphQL 401/403 responses, are build-blocking by design so the site cannot deploy empty post lists.

Cloudflare Access policy shape:

- Protect the CMS GraphQL endpoint with a **Service Auth** policy that includes the Vercel service token.
- Protect browser admin paths such as `/wp-admin*` and `/wp-login.php` with the owner login policy.
- Keep `/wp-content/uploads/*` reachable through the public frontend so legacy media URLs, inline post images, and the Next.js media rewrite keep working.
- If Vercel build logs show `GraphQLHTTPError` with status `403`, treat it as Access policy/token/env configuration, not a Next.js caching issue.

### `lib/api.ts` patterns

- `fetchAPI()` is the low-level POST helper. It retries on 5xx up to 3 times with exponential backoff (800ms, 1600ms). The upstream WordPress occasionally throws PHP `TypeError`s from the AIOSEO plugin (`Addons.php:176`) and this resilience layer is here specifically to absorb that.
- `safeFetch(label, fn)` wraps every public helper. On failure it logs `console.warn` and returns `null`. Callers handle `null` gracefully:
  - `generateStaticParams` returns `[]` so the build still completes; missing routes resolve on-demand via ISR.
  - Page components call `notFound()` so users see a 404 rather than a 500.
- All page-detail fetchers (`getPostBySlug`, `getGlossaryEntryByURI`) are wrapped in **`React.cache()`** so `generateMetadata` and the page component share one fetch per render.
- Every fetch uses `{ next: { revalidate: 3600 } }` — 1-hour ISR.

### Public helpers in `lib/api.ts`

| Function | Returns | Used by |
| --- | --- | --- |
| `getAllPostURIs()` | `string[]` of post URIs | post catch-all `generateStaticParams`, sitemap |
| `getPostsForListing({ first })` | post nodes with title, excerpt, date, uri, featuredImage, author | `/insights/`, paginated insights, HTML sitemap |
| `getRecentPostsForHome({ first })` | post nodes with category | `RecentWriting` on homepage |
| `getPostsByCategorySlug({ slug, first })` | category-filtered posts | `/seo/`, `/geo/`, `/seo/ecommerce-seo/`, `/category/[...uri]/` |
| `getAllCategories()` | non-empty WP categories with name, slug, uri, count | category static params, XML/HTML sitemap |
| `getCategoryBySlug(slug)` | single WP category metadata | category archive page + metadata |
| `getPostsForFeed({ first })` | posts with content + author | RSS feed |
| `getPostBySlug(slug)` | single post by slug | post detail page + metadata |
| `getAllGlossaryURIs()` | glossary URIs | glossary catch-all `generateStaticParams`, sitemap |
| `getAllGlossaryEntriesForSitemap()` | `{ uri, title }` for glossary | HTML sitemap |
| `getGlossaryEntryByURI(uri)` | single glossary entry | glossary detail page + metadata |

### WordPress conventions

- **Posts** map to URIs like `/category/slug/` directly — WordPress slugs are unique site-wide, so the catch-all `[...uri]` page extracts the last segment as the slug.
- **Glossary entries** are WordPress **pages** with `parent: "3592"`. Not posts. Query uses `pages(where: { parent: "3592" })`.
- Image URLs in post content may reference the private CMS host, `searchcandy.uk`, or `www.searchcandy.uk`; `next.config.ts` derives the CMS image host from `WP_GRAPHQL_ENDPOINT`. Old `/wp-content/uploads/...` URLs are preserved via the Vercel rewrite to the CMS origin.

## Route map

```
app/
  layout.tsx                            root layout: metadata, Shell wrap
  page.tsx                              home
  not-found.tsx                         404
  error.tsx                             route-level error boundary
  global-error.tsx                      root-level error boundary
  robots.ts                            robots.txt allows indexing
  sitemap.ts                           XML sitemap, dynamic from WP
  sitemap/page.tsx                      HTML sitemap, dynamic from WP
  feed/route.ts                        RSS 2.0 feed
  llms.txt/route.ts                    llmstxt.org index
  newsletter/route.ts                  Whop newsletter checkout redirect
  about/page.tsx                        static About
  contact/page.tsx                      static Contact (email + socials)
  insights/
    page.tsx                            post archive p1 (10 posts)
    page/[page]/page.tsx                paginated archive (p2+)
  seo/
    page.tsx                            SEO topic hub (10 posts)
    ecommerce-seo/page.tsx              Ecommerce SEO topic hub (10 posts)
    seo-glossary/
      page.tsx                          A-Z glossary index (HAND-MAINTAINED HTML)
      [...uri]/page.tsx                 glossary entry detail
  geo/page.tsx                          GEO topic hub
  category/[...uri]/page.tsx            WordPress category archive pages, preserving /category/.../ legacy links
  [...uri]/page.tsx                     WordPress post catch-all
```

Total prerendered/static routes at last build: **268** (home, 72 posts, 7 paginated insights pages, 173 glossary entries, topic/static pages, feeds, and sitemaps; newsletter is a dynamic route handler).

### The glossary index is hand-maintained

`app/seo/seo-glossary/page.tsx` is a hand-maintained HTML listing of ~170 glossary entries grouped A-Z. Adding a new entry in WordPress requires also editing this file. **Flag this to the user before silently modifying it.**

## Component map

```
components/
  Shell.tsx               server: renders Header + children + Newsletter + Footer
  header.tsx              server: nav/header markup, plain anchors for static public links
  MobileMenu.tsx          server: native Popover API menu, no React hydration
  footer.tsx              server: footer markup, plain anchors for static public links
  fonts.ts               next/font/google exports (server-safe)
  NewsletterSignup.tsx    server: no-JS form posts to app/newsletter/route.ts
  RecentWriting.tsx       server: 6 recent posts on homepage, plain anchors
  shareButton.tsx         client: navigator.share, on glossary entries only
```

`lib/content.ts` contains `optimisePostContentImages()`, a small server-side transform used only for WordPress post body HTML. Featured images use `next/image`; body images arrive from WordPress as raw trusted HTML, so the transform adds native `loading`/`decoding`/`fetchpriority` attributes without introducing a client boundary.

### Server/client boundary notes

- **Shell is a server component.** Keep shared chrome server-rendered by default.
- **MobileMenu is server-rendered** and uses the native Popover API (`popoverTarget` / `popoverTargetAction`) rather than React state. Do not reintroduce a client menu unless there is a clear accessibility or browser-support reason.
- **NewsletterSignup is rendered from the root layout** as a slot prop to `Shell`. Its form posts to `app/newsletter/route.ts`, so it does not need `useActionState` or a client component.
- The Newsletter section appears on **every page** of the site via this slot. Anchor links use `href="#newsletter"` (not `/#newsletter`) because the target now exists on the current page.

## Newsletter integration (Whop)

Newsletter signups go through **Whop checkout**, not the Whop API. Whop doesn't expose a "create member by email" endpoint — memberships are only created via completed checkouts.

Flow:

1. User types email into the server-rendered form in `NewsletterSignup`.
2. Form POSTs to `app/newsletter/route.ts`.
3. The route handler validates email, then 303 redirects to `https://whop.com/checkout/<WHOP_NEWSLETTER_PLAN_ID>?email=<email>&email.disabled=1`.
4. User lands on Whop's hosted checkout with email pre-filled and locked. One click to claim the free plan.

**Required env var:** `WHOP_NEWSLETTER_PLAN_ID` (e.g. `plan_XXXXXXXXX`). Create a free plan in Whop Dashboard → Checkout links to get the ID. Without it the route logs a server-side error and redirects back to `/#newsletter` (graceful degradation; safe to deploy without the env var set).

**Performance:** zero newsletter client JS. No React form state, no Whop SDK, no embed iframe, no API key.

## Quality checks

- `pnpm lint` runs ESLint CLI with `eslint-config-next/core-web-vitals`. Next 16 removed `next lint`; use the script instead.
- `pnpm typecheck` runs `tsc --noEmit` over the TypeScript source. Prefer concrete exported/global types in `types/searchcandy.d.ts` rather than introducing `any`.
- `pnpm build` also runs the TypeScript pass before prerendering.
- `eslint.config.mjs` has a narrow `@next/next/no-html-link-for-pages` exception for the homepage/chrome files that intentionally use plain anchors to keep `next/link` out of the homepage client bundle.

## Build & deploy

- Hosted on **Vercel**. Repo: `searchcandy/search-candy` (GitHub). Branch: `main` deploys to production.
- `searchcandy.uk` is the canonical live Vercel front-end. `www.searchcandy.uk` redirects to the apex. WordPress is the private headless CMS configured via Vercel env vars.
- Build runs with Turbopack. Compile time ~1.5s, page generation ~10s for 187 pages.

### Resilient builds

If WordPress has transient upstream failures at build time, list helpers can still fall back so the build is resilient to intermittent AIOSEO/PHP 500s. Cloudflare Access failures are different: missing Vercel service-token env vars and GraphQL 401/403 responses intentionally fail the build, because otherwise Vercel can publish empty homepage and archive pages.

### Vercel env vars

- `WP_GRAPHQL_ENDPOINT` — private production WPGraphQL endpoint. Production required.
- `CF_ACCESS_CLIENT_ID` — Cloudflare Access service token client ID for server-side WPGraphQL requests. Production required.
- `CF_ACCESS_CLIENT_SECRET` — Cloudflare Access service token secret for server-side WPGraphQL requests. Production required.
- `WHOP_NEWSLETTER_PLAN_ID` — required for newsletter signups.
- Legacy media URLs under `/wp-content/uploads/:path*` are preserved by a Next.js `beforeFiles` rewrite whose destination is derived from `WP_GRAPHQL_ENDPOINT`. Keep this while old WordPress image URLs remain in content or backlinks.

## Conventions to keep when editing

- **Server components by default.** Add `'use client'` only at boundaries that need state, effects, or browser APIs. The whole `app/` tree is mostly server.
- **Async `params`** — Next 15+ pattern. Every dynamic route does `const { uri } = await params`.
- **Every dynamic route** has `generateStaticParams` + `generateMetadata`, both wrapped in `safeFetch` (via the lib helpers).
- **Metadata** lives in `metadata` / `generateMetadata` exports. No `<Head>` usage anywhere.
- **No em dashes** in user-facing copy. They were swapped to hyphens (`-`). The en dash in `2014–YYYY` (year range) is fine.
- **British English** (optimisation, not optimization).
- **First person**, publication tone. No "we / our team". No "innovative / leading / enterprise / solutions" — see brief in commit messages from the rebuild.
- **Don't reintroduce** Apollo Client, `@next/font`, or Pages Router. All three were intentionally dropped.

## Common gotchas

- **CSS specificity vs `.main section { padding: 0 }`.** `globals.css` zeros section padding inside `<main className="main">`. Module-level rules that need to override use `:global(.main) .selector { … }` or `section.classname { … }` to bump specificity above 0,1,1.
- **`box-sizing: border-box` is on globally.** Sections with `width: 100%` and horizontal padding work without overflowing.
- **Topic tiles use a viewport breakpoint at 880px** to skip the awkward 2-on-top + 1-orphan flex-wrap result, dropping straight to a single column.
- **Recent Writing on the homepage** uses `color-mix(in srgb, currentColor 15%, transparent)` for soft dividers between rows.
- **`content-visibility: auto` is only for below-the-fold sections.** Do not apply it to `header`, `main`, or the first content section; it can inflate LCP element render delay when the hero image is ready but painting is deferred.
- **`Cache Components` (`cacheComponents: true`) is deliberately OFF.** Flipping the framework default to dynamic is wrong for this fully-static ISR site. Don't turn it on without rearchitecting.
- **Header / MobileMenu / Footer nav arrays are hoisted to module scope** as `const NAV_LINKS = [...]` etc. Don't move them inside the component body.
- **Native Popover mobile menu colours:** light mode uses `--lightFontColor` background with `--greyFontColor` text; dark mode must also set `.overlayMenu { color: var(--lightFontColor); }` when switching the background to `--darkBackColor`.
- **Native Popover link clicks do not close the menu by default.** `MobileMenu.tsx` includes a tiny inline delegated listener (`mobile-menu-close-on-link`) that calls `hidePopover()` for menu links without adding a React client boundary.
- **Newsletter anchor links use `#newsletter`, not `/#newsletter`.** The latter caused weird `/#services#newsletter` URL concatenation under `trailingSlash: true` when navigating from a page with an existing hash. Plain anchor `<a>` avoids the issue and keeps static navigation out of the client bundle.
- **The homepage client-reference manifest should not include app-owned menu/newsletter clients or `next/link`.** Check `.next/server/app/page_client-reference-manifest.js` after bundle-sensitive changes.
- **Old media URLs are intentionally proxied.** Do not remove the `/wp-content/uploads/:path*` rewrite unless old `searchcandy.uk/wp-content/uploads/...` URLs have been migrated or intentionally retired.
- **Legacy category URLs are preserved.** `/category/[...uri]/` is generated from WPGraphQL categories so old post links such as `/category/ecommerce/` resolve to a static archive page. Use the final path segment as the category slug, but keep the canonical URI from WordPress for nested categories.
- **Blog image handling is split.** Featured images use `next/image` with `preload` and `fetchPriority="high"`; inline post-content images stay as WordPress HTML and pass through `optimisePostContentImages()` for native lazy/eager loading attributes.
- **The local bash environment exits 144 mid-build sometimes.** When verifying a build, run `./node_modules/.bin/next build 2>&1 | tee /tmp/b.log | tail -40` (with `tee`) rather than `> /tmp/b.log` — the redirect form gets killed by the wrapper before output flushes.

## Editorial / authoring

- **Posts** are authored in WordPress. Categories used by the site: `seo` (~12 posts), `ecommerce` (~11), plus `geo` once created. Categories drive the topic hub queries.
- **Glossary entries** are WordPress pages with parent `3592`. Need to add to the hand-maintained A-Z index file when adding new entries.
- **The most recent post is from 2023-09** at time of writing. The frontmatter framing acknowledges this honestly rather than hiding dates — it's a content problem, not a UI problem.

## Quick orientation checklist when picking this up

1. Read `CLAUDE.md` in the repo root for the project-level brief.
2. Confirm required env vars are available before production builds: `WP_GRAPHQL_ENDPOINT`, `CF_ACCESS_CLIENT_ID`, `CF_ACCESS_CLIENT_SECRET`, and `WHOP_NEWSLETTER_PLAN_ID`.
3. Run `pnpm install` then verify `./node_modules/.bin/next build` succeeds.
4. If the build fails with GraphQL `401`/`403`, check Cloudflare Access and Vercel service-token env vars. If it fails with intermittent WP 500s, that's usually the upstream AIOSEO PHP issue.
5. Local dev server: `pnpm dev` (or `./node_modules/.bin/next dev`). Don't forget `nvm use 22`.

## References

- Project brief: `/CLAUDE.md` (repo root)
- React perf rules: `/.agents/skills/vercel-react-best-practices/`
- Next perf rules: `/.agents/skills/next-best-practices/`
