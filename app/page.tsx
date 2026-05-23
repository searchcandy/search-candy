import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import { unna, readexpro, nunitosans } from '@/components/fonts'
import RecentWriting from '@/components/RecentWriting'

export const metadata = {
  title: 'Search Candy - SEO and GEO, by Colin McDermott',
  description:
    "Notes on SEO, GEO, and AI search by Colin McDermott. Currently Head of SEO at Whop, twenty years in search.",
  alternates: { canonical: 'https://searchcandy.uk/' },
  openGraph: {
    title: 'Search Candy - SEO and GEO, by Colin McDermott',
    description:
      "Notes on SEO, GEO, and AI search by Colin McDermott. Currently Head of SEO at Whop, twenty years in search.",
    url: 'https://searchcandy.uk/',
  },
}

export default function Home() {
  return (
    <main className="main">
      <section className={styles.hero}>
        <div className={styles.heroColumn1}>
          <h1 className={unna.className}>
            I&apos;m Colin McDermott. I write about SEO, GEO, and AI search.
          </h1>
          <p className={[readexpro.className, styles.heroCredibility].join(' ')}>
            Currently: Head of SEO at{' '}
            <a href="https://whop.com/" target="_blank" rel="noopener noreferrer">Whop</a>.
            Previously: Search Candy clients including The Times, CEF, Fired Earth, Lending Works,
            Think Money.
          </p>
        </div>
        {/* TODO: swap commerce-hero.webp for a photo of Colin (or a better topical image) */}
        <div className={styles.heroColumn2} aria-hidden="true">
          <Image
            src="/commerce-hero.webp"
            alt=""
            fill
            preload
            fetchPriority="high"
            quality={80}
            sizes="(max-width: 949px) 100vw, 50vw"
            className={styles.heroImage}
          />
        </div>
      </section>

      <section id="services" className={[styles.services, styles.blockContainer].join(' ')}>
        <div className={styles.card}>
          <h2 className={unna.className}>
            <a href="/seo/">SEO</a>
          </h2>
          <p className={nunitosans.className}>
            Two decades of notes, posts, and resources on technical SEO, content, and organic
            strategy. The fundamentals haven&apos;t gone anywhere - they&apos;ve just got more
            interesting.
          </p>
          <p className={nunitosans.className}>
            <a href="/seo/">Explore SEO &#x02192;</a>
          </p>
        </div>

        <div className={styles.card}>
          <h2 className={unna.className}>
            {/* TODO: build /geo/ hub page. Linking ahead of time so the homepage is correct. */}
            <a href="/geo/">GEO &amp; AI Search</a>
          </h2>
          <p className={nunitosans.className}>
            Generative Engine Optimisation, LLM visibility, prompt tracking, and the new shape of
            search. Roughly half my practice now lives here. Notes from the frontier.
          </p>
          <p className={nunitosans.className}>
            <a href="/geo/">Explore GEO &#x02192;</a>
          </p>
        </div>

        <div className={styles.card}>
          <h2 className={unna.className}>
            <a href="/seo/ecommerce-seo/">Ecommerce SEO</a>
          </h2>
          <p className={nunitosans.className}>
            Platform-specific guides, technical deep-dives, and category-level strategy for
            ecommerce. Magento, Shopify, headless, and everything in between.
          </p>
          <p className={nunitosans.className}>
            <a href="/seo/ecommerce-seo/">Explore Ecommerce SEO &#x02192;</a>
          </p>
        </div>
      </section>

      <RecentWriting />
    </main>
  )
}
