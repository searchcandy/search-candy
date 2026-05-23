// Crawl policy for the production Search Candy front-end.
export default function robots() {
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
