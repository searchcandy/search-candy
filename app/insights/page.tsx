import Image from 'next/image'
import Link from 'next/link'
import { getPostsForListing } from '@/lib/api'
import { toPublicMediaUrl } from '@/lib/content'
import styles from '@/styles/Insights.module.css'
import { unna, nunitosans } from '@/components/fonts'

const POSTS_PER_PAGE = 10

export const metadata = {
  title: 'Blog - Insights from Search Candy',
  description:
    'Browse the latest SEO, ecommerce, and search marketing news and guides from our insights section.',
  alternates: { canonical: 'https://searchcandy.uk/insights/' },
}

const formatDate = (value: string | number | Date) =>
  new Date(value).toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })

export default async function InsightsIndex() {
  // One fetch covers both the visible slice and the total-count for pagination.
  const allPosts = await getPostsForListing({ first: 200 })
  const posts = allPosts.slice(0, POSTS_PER_PAGE)
  const totalPages = Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE))

  return (
    <main className="main">
      <div className={styles.insightsPostsContainer}>
        {posts.map((post) => {
          const featuredImageUrl = toPublicMediaUrl(post.featuredImage?.node?.sourceUrl)

          return (
            <div className={styles.insightsPostCard} key={post.uri}>
              <div className={styles.insightsPostsTitleMeta}>
                <h2 className={unna.className}>
                  <Link href={post.uri}>{post.title}</Link>
                </h2>
                <p className={nunitosans.className}>{formatDate(post.date)}</p>
              </div>
              <div>
                <Link href={post.uri}>
                  {featuredImageUrl ? (
                    <Image
                      src={featuredImageUrl}
                      alt={post.title}
                      width={384}
                      height={216}
                      sizes="(max-width: 768px) 100vw, 384px"
                    />
                  ) : null}
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      <div className={styles.paginationContainer}>
        <nav className={[styles.pagination, nunitosans.className].join(' ')}>
          <ul>
            {totalPages > 1 && (
              <li>
                <Link href="/insights/page/2/">Next &#8594;</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </main>
  )
}
