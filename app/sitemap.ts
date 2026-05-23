import { getAllPostURIs, getAllGlossaryURIs, getAllCategories } from '@/lib/api'

const BASE = 'https://searchcandy.uk'

const url = (path: string) => {
  const withSlash = path.endsWith('/') ? path : `${path}/`
  return `${BASE}${withSlash}`
}

export default async function sitemap() {
  // Fetch the dynamic URI lists in parallel - they share no dependencies.
  const [postURIs, glossaryURIs, categories] = await Promise.all([
    getAllPostURIs(),
    getAllGlossaryURIs(),
    getAllCategories(),
  ])

  const now = new Date()

  const staticEntries = [
    { url: url('/'), lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: url('/insights/'), lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: url('/seo/'), lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: url('/geo/'), lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: url('/seo/seo-glossary/'), lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: url('/about/'), lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ]

  const postEntries = postURIs.map((u) => ({
    url: url(u),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const glossaryEntries = glossaryURIs.map((u) => ({
    url: url(u),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const categoryEntries = categories
    .filter((category) => category.uri)
    .map((category) => ({
      url: url(category.uri as string),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    }))

  return [...staticEntries, ...categoryEntries, ...postEntries, ...glossaryEntries]
}
