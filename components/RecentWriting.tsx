import { getRecentPostsForHome } from '@/lib/api'
import { unna, nunitosans } from '@/components/fonts'
import styles from '@/styles/Home.module.css'

const formatDate = (value: string | number | Date) =>
  new Date(value).toLocaleString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })

export default async function RecentWriting() {
  const posts = await getRecentPostsForHome({ first: 6 })

  if (posts.length === 0) return null

  return (
    <section className={[styles.recentWriting, styles.blockContainer].join(' ')}>
      <div className={styles.recentWritingHeader}>
        <h2 className={unna.className}>Recent writing</h2>
      </div>

      <ul className={styles.recentWritingList}>
        {posts.map((post) => {
          const category = post.categories?.edges?.[0]?.node
          return (
            <li key={post.uri} className={[unna.className, styles.recentWritingItem].join(' ')}>
              <a href={post.uri} className={styles.recentWritingTitle}>
                {post.title}
              </a>
              <span className={styles.recentWritingMeta}>
                <time className={styles.recentWritingDate} dateTime={post.date}>
                  {formatDate(post.date)}
                </time>
                {category && (
                  <>
                    <span className={styles.recentWritingSep} aria-hidden="true">·</span>
                    <span className={styles.recentWritingCategory}>{category.name}</span>
                  </>
                )}
              </span>
            </li>
          )
        })}
      </ul>

      <p className={[nunitosans.className, styles.recentWritingMore].join(' ')}>
        <a href="/insights/">All writing &#x02192;</a>
      </p>
    </section>
  )
}
