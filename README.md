# Search Candy

Internal Next.js front-end for Search Candy, now live as the canonical public site at `https://searchcandy.uk`.

The app is a static/ISR Next.js App Router site backed by the existing WordPress install through WPGraphQL. WordPress remains the CMS; this repo owns the front-end experience, routes, styling, RSS feed, sitemap, and newsletter checkout redirect.

## Stack

- Next.js 16
- React 19.2
- Node 20.9+
- App Router
- CSS Modules
- `next/font/google`
- Native `fetch` to WPGraphQL, no Apollo
- ESLint + strict TypeScript for linting and type safety
- Path alias `@/*` configured in `tsconfig.json`

## Local Commands

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm start
```

Local development normally runs in WSL. If builds behave oddly, use the WSL shell with Node 20.9+ rather than Windows PowerShell, because the installed pnpm dependencies use WSL/Linux symlinks.

## Environment

Production Vercel requires:

```bash
WP_GRAPHQL_ENDPOINT=<private WPGraphQL endpoint>
CF_ACCESS_CLIENT_ID=...
CF_ACCESS_CLIENT_SECRET=...
WHOP_NEWSLETTER_PLAN_ID=plan_...
```

`WP_GRAPHQL_ENDPOINT` points server-side data fetching at the headless WordPress CMS. `CF_ACCESS_CLIENT_ID` and `CF_ACCESS_CLIENT_SECRET` are the Cloudflare Access service-token credentials used by `lib/api.ts` for WPGraphQL requests. They must be Vercel server env vars only, never `NEXT_PUBLIC_*`.

Cloudflare Access should protect the CMS GraphQL endpoint with a Service Auth policy that includes the Vercel service token. Keep `/wp-content/uploads/*` reachable through the public frontend so legacy media URLs and post images continue to load. GraphQL `401`/`403` responses fail production builds by design to avoid deploying empty post lists.

`WHOP_NEWSLETTER_PLAN_ID` enables the newsletter signup redirect to Whop checkout. Without it, the form degrades gracefully.

## Important Notes

- The site is live on Vercel. `app/robots.ts` allows indexing and points crawlers to the production sitemap.
- The glossary index at `app/seo/seo-glossary/page.tsx` is hand-maintained and must be updated manually when new glossary pages are added in WordPress.
- Dynamic routes are pre-rendered with `generateStaticParams`; keep the app static/ISR unless there is a deliberate reason to change that.
- See `AGENTS.md` and `CLAUDE.md` for the project brief and conventions.
