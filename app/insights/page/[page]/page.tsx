import Image from 'next/image'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getPostsForListing } from '@/lib/api'
import { toPublicMediaUrl } from '@/lib/content'
import styles from '@/styles/Insights.module.css'
import { unna, nunitosans } from '@/components/fonts'

const POSTS_PER_PAGE = 10

const formatDate = (value: string | number | Date) =>
  new Date(value).toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })

export async function generateStaticParams() {
  const all = await getPostsForListing({ first: 200 })
  const totalPages = Math.max(1, Math.ceil(all.length / POSTS_PER_PAGE))
  // /insights/ already covers page 1
  return Array.from({ length: totalPages - 1 }, (_, i) => ({ page: String(i + 2) }))
}

export async function generateMetadata({ params }: SearchCandyRouteProps<{ page: string }>) {
  const { page } = await params
  const currentPage = parseInt(page, 10)
  return {
    title: `Insights Page ${currentPage}`,
    description:
      'Browse the latest SEO, ecommerce, and search marketing news and guides from our insights section.',
    alternates: { canonical: `https://searchcandy.uk/insights/page/${currentPage}/` },
  }
}

export default async function InsightsPaginated({ params }: SearchCandyRouteProps<{ page: string }>) {
  const { page } = await params
  const currentPage = parseInt(page, 10)

  if (!Number.isInteger(currentPage) || currentPage < 1) notFound()
  if (currentPage === 1) redirect('/insights/')

  const allPosts = await getPostsForListing({ first: 200 })
  const totalPages = Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE))

  if (currentPage > totalPages) notFound()

  const start = (currentPage - 1) * POSTS_PER_PAGE
  const currentPosts = allPosts.slice(start, start + POSTS_PER_PAGE)

  return (
    <main className="main">
      <div className={styles.insightsPostsContainer}>
        {currentPosts.map((post) => {
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
        <nav className={styles.pagination}>
          <ul>
            {currentPage > 1 && (
              <li>
                <Link
                  href={currentPage === 2 ? '/insights/' : `/insights/page/${currentPage - 1}/`}
                >
                  &#8592; Back
                </Link>
              </li>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <li className={styles.paginationNumberItem} key={n}>
                <Link href={n === 1 ? '/insights/' : `/insights/page/${n}/`}>{n}</Link>
              </li>
            ))}
            {currentPage < totalPages && (
              <li>
                <Link href={`/insights/page/${currentPage + 1}/`}>Next &#8594;</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </main>
  )
}
