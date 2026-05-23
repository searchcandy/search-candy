import Link from 'next/link'
import { getPostsByCategorySlug } from '@/lib/api'
import { unna, nunitosans } from '@/components/fonts'
import styles from '@/styles/Page.module.css'

export const metadata = {
  title: 'GEO & AI Search - notes from the frontier',
  description:
    'Generative Engine Optimisation, LLM visibility, prompt tracking, and the new shape of search.',
  alternates: { canonical: 'https://searchcandy.uk/geo/' },
}

const stripHtml = (html: string | null | undefined) => (html || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()

const formatDate = (value: string | number | Date) =>
  new Date(value).toLocaleString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })

export default async function GeoHub() {
  // No "geo" category exists in WordPress yet. Fetching by slug returns []
  // until a category is created and posts are tagged. When it exists this
  // section will populate automatically.
  const posts = await getPostsByCategorySlug({ slug: 'geo', first: 10 })

  return (
    <main className="main">
      <section className={styles.pageIntro}>
        <div className={styles.pageIntroInner}>
          <h1 className={unna.className}>GEO &amp; AI Search</h1>
          <p className={[styles.pageIntroLead, nunitosans.className].join(' ')}>
            Generative Engine Optimisation, LLM visibility, prompt tracking, and the new shape of
            search. Roughly half my practice now lives here. Notes from the frontier.
          </p>
        </div>
      </section>

      <section className={styles.hubPosts}>
        <div className={styles.hubPostsHeader}>
          <h2 className={unna.className}>Posts in this topic</h2>
        </div>

        {posts.length === 0 ? (
          <p className={[styles.hubPostsEmpty, nunitosans.className].join(' ')}>
            Nothing here yet - this hub is being seeded. In the meantime, see{' '}
            <Link href="/insights/">all writing</Link>.
          </p>
        ) : (
          <ul className={[nunitosans.className, styles.hubPostsList].join(' ')}>
            {posts.map((post) => {
              const category = post.categories?.edges?.[0]?.node
              return (
                <li key={post.uri} className={styles.hubPostsItem}>
                  <p className={styles.hubPostsMeta}>
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    {category && (
                      <>
                        <span aria-hidden="true"> · </span>
                        <span>{category.name}</span>
                      </>
                    )}
                  </p>
                  <h3 className={unna.className}>
                    <Link href={post.uri}>{post.title}</Link>
                  </h3>
                  {post.excerpt && (
                    <p className={styles.hubPostsExcerpt}>{stripHtml(post.excerpt)}</p>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </main>
  )
}
