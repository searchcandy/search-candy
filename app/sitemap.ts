import type { MetadataRoute } from 'next'
import { getAllPostEntriesForSitemap, getAllGlossaryEntriesForSitemap, getAllCategories } from '@/lib/api'

const BASE = 'https://searchcandy.uk'

const url = (path: string) => {
  const withSlash = path.endsWith('/') ? path : `${path}/`
  return `${BASE}${withSlash}`
}

// WPGraphQL *Gmt fields are UTC but come without a timezone suffix.
const utcDate = (value: string | undefined) =>
  value ? new Date(/Z$|[+-]\d\d:\d\d$/.test(value) ? value : `${value}Z`) : undefined

const hasCategoryURI = (category: SearchCandyCategory): category is SearchCandyCategory & { uri: string } =>
  Boolean(category.uri)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch the dynamic URI lists in parallel - they share no dependencies.
  const [posts, glossaryEntries, categories] = await Promise.all([
    getAllPostEntriesForSitemap(),
    getAllGlossaryEntriesForSitemap(),
    getAllCategories(),
  ])

  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = [
    { url: url('/'), lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: url('/insights/'), lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: url('/seo/'), lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: url('/geo/'), lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: url('/seo/seo-glossary/'), lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: url('/about/'), lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ]

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: url(post.uri),
    lastModified: utcDate(post.modifiedGmt) ?? now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const glossaryPageEntries: MetadataRoute.Sitemap = glossaryEntries.map((entry) => ({
    url: url(entry.uri),
    lastModified: utcDate(entry.modifiedGmt) ?? now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const categoryEntries: MetadataRoute.Sitemap = categories
    .filter(hasCategoryURI)
    .map((category) => ({
      url: url(category.uri),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    }))

  return [...staticEntries, ...categoryEntries, ...postEntries, ...glossaryPageEntries]
}
