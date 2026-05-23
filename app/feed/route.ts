// RSS 2.0 feed for Search Candy.
// Served at /feed/ - register it as the canonical feed URL on the site
// (root layout exposes <link rel="alternate" type="application/rss+xml">).

import { getPostsForFeed } from '@/lib/api'

export const revalidate = 3600 // 1 hour

const SITE_URL = 'https://searchcandy.uk'
const FEED_TITLE = 'Search Candy'
const FEED_DESCRIPTION =
  'Notes on SEO, GEO, and AI search by Colin McDermott.'
const FEED_LANGUAGE = 'en-gb'

// Minimal XML escaping for text nodes and attribute values.
const xmlEscape = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const cdata = (value: unknown) => `<![CDATA[${String(value ?? '').replace(/]]>/g, ']]]]><![CDATA[>')}]]>`

const ensureTrailingSlash = (path: string) => (path.endsWith('/') ? path : `${path}/`)

const toRfc822 = (value: string | number | Date | null | undefined) => (value ? new Date(value).toUTCString() : new Date().toUTCString())

const stripHtml = (html: string | null | undefined) => (html || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()

export async function GET() {
  const posts = await getPostsForFeed({ first: 20 })

  const lastBuildDate = toRfc822(posts[0]?.date)
  const selfHref = `${SITE_URL}/feed/`

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}${ensureTrailingSlash(post.uri)}`
      const author = post.author?.node?.name
      const categories = post.categories?.edges?.map(({ node }) => node.name).filter(Boolean) ?? []
      const description = stripHtml(post.excerpt)
      return `
    <item>
      <title>${xmlEscape(post.title)}</title>
      <link>${xmlEscape(url)}</link>
      <guid isPermaLink="true">${xmlEscape(url)}</guid>
      <pubDate>${toRfc822(post.date)}</pubDate>
      ${author ? `<dc:creator>${cdata(author)}</dc:creator>` : ''}
      ${categories.map((c) => `<category>${cdata(c)}</category>`).join('\n      ')}
      ${description ? `<description>${cdata(description)}</description>` : ''}
      ${post.content ? `<content:encoded>${cdata(post.content)}</content:encoded>` : ''}
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${xmlEscape(FEED_TITLE)}</title>
    <link>${xmlEscape(SITE_URL)}</link>
    <description>${xmlEscape(FEED_DESCRIPTION)}</description>
    <language>${FEED_LANGUAGE}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${xmlEscape(selfHref)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
