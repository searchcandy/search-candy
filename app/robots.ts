import type { MetadataRoute } from 'next'

// Crawl policy for the production Search Candy front-end.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://searchcandy.uk/sitemap.xml',
  }
}
