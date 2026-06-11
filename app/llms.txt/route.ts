// llms.txt - structured site index for LLM-based agents.
// Spec: https://llmstxt.org/
//
// Served at /llms.txt. The content list is generated dynamically from
// WordPress so it stays in sync with what's actually on the site.

import { getPostsForListing } from '@/lib/api'

export const revalidate = 86400 // 24 hours - new posts ship via redeploy anyway

const SITE_URL = 'https://searchcandy.uk'

const ensureTrailingSlash = (path: string) => (path.endsWith('/') ? path : `${path}/`)
const url = (path: string) => `${SITE_URL}${ensureTrailingSlash(path)}`

const formatDate = (value: string | number | Date) =>
  new Date(value).toLocaleString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })

const escapeMarkdown = (s: string | null | undefined) => (s || '').replace(/[\[\]]/g, '\\$&').replace(/\s+/g, ' ').trim()

export async function GET() {
  const posts = await getPostsForListing({ first: 20 })

  const recentWriting = posts
    .map((p) => `- [${escapeMarkdown(p.title)}](${url(p.uri)}): ${formatDate(p.date)}`)
    .join('\n')

  const body = `# Search Candy

> Notes on SEO, GEO, and AI search by Colin McDermott. Currently Head of SEO at Whop, twenty years in search.

Search Candy is a personal publication covering search engine optimisation (SEO), generative engine optimisation (GEO), and the new shape of AI-mediated search. Posts are written from practitioner experience working across enterprise ecommerce, finance, and publishing.

## Pages

- [Home](${url('/')}): Hero intro plus the latest writing and a newsletter signup
- [About](${url('/about/')}): Colin McDermott - bio, background, contact channels
- [Contact](${url('/contact/')}): Email and social channels
- [Writing](${url('/insights/')}): Full archive of posts

## Topics

- [SEO](${url('/seo/')}): Technical SEO, content, and organic strategy
- [GEO & AI Search](${url('/geo/')}): Generative Engine Optimisation, LLM visibility, prompt tracking
- [Ecommerce SEO](${url('/seo/ecommerce-seo/')}): Platform-specific ecommerce SEO - Magento, Shopify, headless

## Recent writing

${recentWriting || '_No posts available._'}

## Optional

- [RSS feed](${url('/feed/')}): Full-text feed of recent posts
- [XML sitemap](${url('/sitemap.xml')}): Machine-readable site index
- [HTML sitemap](${url('/sitemap/')}): Human-readable directory of all pages
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    },
  })
}
