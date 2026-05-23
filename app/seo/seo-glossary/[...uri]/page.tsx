import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllGlossaryURIs, getGlossaryEntryByURI } from '@/lib/api'
import ShareButton from '@/components/shareButton'
import styles from '@/styles/GlossarySinglePage.module.css'

const buildURI = (parts: string[]) => '/seo/seo-glossary/' + parts.join('/') + '/'

const formatDate = (value: string | number | Date) =>
  new Date(value).toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })

export async function generateStaticParams() {
  const uris = await getAllGlossaryURIs()
  return uris
    .map((uri) => uri.replace(/^\/seo\/seo-glossary\//, '').replace(/\/$/, '').split('/'))
    .filter((parts) => parts.length > 0 && parts[0])
    .map((parts) => ({ uri: parts }))
}

export async function generateMetadata({ params }: SearchCandyRouteProps<{ uri: string[] }>) {
  const { uri } = await params
  const fullUri = buildURI(uri)
  const entry = await getGlossaryEntryByURI(fullUri)
  if (!entry) return {}
  return {
    title: entry.title,
    alternates: { canonical: `https://searchcandy.uk${fullUri}` },
  }
}

export default async function GlossaryEntry({ params }: SearchCandyRouteProps<{ uri: string[] }>) {
  const { uri } = await params
  const fullUri = buildURI(uri)
  const entry = await getGlossaryEntryByURI(fullUri)

  if (!entry) notFound()

  return (
    <main className="main">
      <div className={styles.articleHeader}>
        <div className={styles.articleHeaderInner}>
          <div className={styles.breadcrumbs}>
            <p>
              <Link href="/seo/seo-glossary/">SEO Glossary</Link> &gt; {entry.title}
            </p>
          </div>

          <h1>{entry.title}</h1>

          <div className={styles.metaBox}>
            <div className={styles.date}>
              Created:{' '}
              <time dateTime={entry.dateGmt}>
                <span>{formatDate(entry.dateGmt)}</span>
              </time>
            </div>
            <div className={styles.modified}>
              Last Updated:{' '}
              <time dateTime={entry.modifiedGmt}>
                <span>{formatDate(entry.modifiedGmt)}</span>
              </time>
            </div>
            <div className={styles.author}>
              Author: <span>Colin McDermott</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.articleOuter}>
        <div className={styles.articleContainer}>
          <article className={styles.article}>
            <div dangerouslySetInnerHTML={{ __html: entry.content || '' }} />
          </article>

          <aside className={styles.aside}>
            <div>
              <input type="checkbox" id="accordion-1" className={styles.accordionInput} />
              <label htmlFor="accordion-1" className={styles.accordionLabel}>
                What is this content?
              </label>
              <div className={styles.accordionContent}>
                <p>
                  This article is part of an{' '}
                  <Link href="/seo/seo-glossary/">SEO glossary and reference guide</Link> created by{' '}
                  <a href="https://searchcandy.uk/">Search Candy</a>, an SEO consultancy based in
                  the UK.
                </p>
                <p>
                  The Search Candy team is committed to providing content that adheres to the highest
                  editorial standards.
                </p>
                <p>The date this article was last checked for accuracy is: {formatDate(entry.modifiedGmt)}.</p>
                <p>To reuse this content please get in touch via our contact form.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className={styles.socialShareButtonContainer}>
        <ShareButton />
      </div>
    </main>
  )
}
