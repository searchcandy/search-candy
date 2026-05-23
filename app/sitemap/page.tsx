import Link from 'next/link'
import { getPostsForListing, getAllGlossaryEntriesForSitemap, getAllCategories } from '@/lib/api'
import { unna, nunitosans } from '@/components/fonts'
import styles from '@/styles/Page.module.css'

export const metadata = {
  title: 'Sitemap',
  description: 'A full directory of every page on Search Candy.',
  alternates: { canonical: 'https://searchcandy.uk/sitemap/' },
}

const formatDate = (value: string | number | Date) =>
  new Date(value).toLocaleString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })

export default async function HtmlSitemap() {
  // Fetch the two lists in parallel - independent queries.
  const [posts, glossary, categories] = await Promise.all([
    getPostsForListing({ first: 200 }),
    getAllGlossaryEntriesForSitemap(),
    getAllCategories(),
  ])

  return (
    <main className="main">
      <section className={styles.pageIntro}>
        <div className={styles.pageIntroInner}>
          <h1 className={unna.className}>Sitemap</h1>
          <p className={[styles.pageIntroLead, nunitosans.className].join(' ')}>
            Every page on Search Candy, grouped by section. The machine-readable version lives at{' '}
            <a href="/sitemap.xml">/sitemap.xml</a>.
          </p>
        </div>
      </section>

      <section className={[styles.pageBody, nunitosans.className].join(' ')}>
        <div className={styles.pageBodyInner}>
          <h2 className={unna.className}>Main pages</h2>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about/">About</Link></li>
            <li><Link href="/insights/">Insights</Link></li>
            <li><Link href="/seo/">SEO</Link></li>
            <li><Link href="/geo/">GEO &amp; AI Search</Link></li>
            <li><Link href="/seo/seo-glossary/">SEO Glossary</Link></li>
          </ul>

          <h2 className={unna.className}>Categories ({categories.length})</h2>
          {categories.length === 0 ? (
            <p>No categories found.</p>
          ) : (
            <ul>
              {categories.map((category) => {
                const count = category.count ?? 0

                return category.uri && category.name ? (
                  <li key={category.uri}>
                    <Link href={category.uri}>{category.name}</Link>{' '}
                    <span style={{ opacity: 0.6 }}>
                      - {count} {count === 1 ? 'post' : 'posts'}
                    </span>
                  </li>
                ) : null
              })}
            </ul>
          )}

          <h2 className={unna.className}>Writing ({posts.length})</h2>
          {posts.length === 0 ? (
            <p>No posts found.</p>
          ) : (
            <ul>
              {posts.map((post) => (
                <li key={post.uri}>
                  <Link href={post.uri}>{post.title}</Link>{' '}
                  <span style={{ opacity: 0.6 }}>- {formatDate(post.date)}</span>
                </li>
              ))}
            </ul>
          )}

          <h2 className={unna.className}>SEO Glossary ({glossary.length})</h2>
          {glossary.length === 0 ? (
            <p>No glossary entries found.</p>
          ) : (
            <ul>
              {glossary.map((entry) => (
                <li key={entry.uri}>
                  <Link href={entry.uri}>{entry.title}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  )
}
