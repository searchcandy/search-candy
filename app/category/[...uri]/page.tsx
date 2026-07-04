import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'
import { getAllCategories, getCategoryBySlug, getPostsByCategorySlug } from '@/lib/api'
import { htmlToPlainText } from '@/lib/content'
import { unna, nunitosans } from '@/components/fonts'
import styles from '@/styles/Page.module.css'

// Unknown category URLs 404 statically instead of triggering ISR renders.
export const dynamicParams = false

const BASE = 'https://searchcandy.uk'

const formatDate = (value: string | number | Date) =>
  new Date(value).toLocaleString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })

// Empty input yields '' → slug lookup misses → notFound().
const slugFromParts = (parts: string[]) => parts[parts.length - 1] ?? ''

const pathPartsFromCategoryURI = (uri: string) => {
  const parts = uri.replace(/^\/|\/$/g, '').split('/').filter(Boolean)
  return parts[0] === 'category' ? parts.slice(1) : parts
}

const categoryPath = (parts: string[]) => `/category/${parts.join('/')}/`

export async function generateStaticParams() {
  const categories = await getAllCategories()

  return categories
    .map((category) => pathPartsFromCategoryURI(category.uri || `/category/${category.slug || ''}/`))
    .filter((uri) => uri.length > 0)
    .map((uri) => ({ uri }))
}

export async function generateMetadata({ params }: SearchCandyRouteProps<{ uri: string[] }>) {
  const { uri } = await params
  const category = await getCategoryBySlug(slugFromParts(uri))

  if (!category?.name) return {}

  const canonical = `${BASE}${category.uri || categoryPath(uri)}`

  return {
    title: `${category.name} - category archive`,
    description: `Posts filed under ${category.name} on Search Candy.`,
    alternates: { canonical },
    openGraph: {
      title: `${category.name} - category archive`,
      description: `Posts filed under ${category.name} on Search Candy.`,
      url: canonical,
      siteName: 'Search Candy',
    },
  }
}

export default async function CategoryArchive({ params }: SearchCandyRouteProps<{ uri: string[] }>) {
  const { uri } = await params
  const slug = slugFromParts(uri)
  const category = await getCategoryBySlug(slug)

  if (!category?.name || !category.slug) notFound()

  const canonicalPath = category.uri || categoryPath(uri)
  if (canonicalPath !== categoryPath(uri)) permanentRedirect(canonicalPath)

  const posts = await getPostsByCategorySlug({ slug: category.slug, first: 200 })
  const postCount = category.count ?? posts.length

  return (
    <main className="main">
      <section className={styles.pageIntro}>
        <div className={styles.pageIntroInner}>
          <h1 className={unna.className}>{category.name}</h1>
        </div>
      </section>

      <section className={styles.hubPosts}>
        <div className={styles.hubPostsHeader}>
          <h2 className={unna.className}>{postCount === 1 ? '1 post' : `${postCount} posts`}</h2>
        </div>

        {posts.length === 0 ? (
          <p className={[styles.hubPostsEmpty, nunitosans.className].join(' ')}>
            No posts found in this category right now. Try{' '}
            <Link href="/insights/">all writing</Link>.
          </p>
        ) : (
          <ul className={[nunitosans.className, styles.hubPostsList].join(' ')}>
            {posts.map((post) => (
              <li key={post.uri} className={styles.hubPostsItem}>
                <p className={styles.hubPostsMeta}>
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </p>
                <h3 className={unna.className}>
                  <Link href={post.uri}>{post.title}</Link>
                </h3>
                {post.excerpt && (
                  <p className={styles.hubPostsExcerpt}>{htmlToPlainText(post.excerpt)}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
