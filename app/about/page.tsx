import { unna, nunitosans } from '@/components/fonts'
import styles from '@/styles/Page.module.css'

export const metadata = {
  title: 'About',
  description:
    'Colin McDermott - Head of SEO at Whop, twenty years in search, writing here about SEO, GEO, and AI search.',
  alternates: { canonical: 'https://searchcandy.uk/about/' },
}

export default function About() {
  return (
    <main className="main">
      <section className={styles.pageIntro}>
        <div className={styles.pageIntroInner}>
          <h1 className={unna.className}>About</h1>
          <p className={[styles.pageIntroLead, nunitosans.className].join(' ')}>
            I&apos;m Colin McDermott. I&apos;ve spent the last twenty years working in search,
            and I write here about SEO, GEO, and where the two are going next.
          </p>
        </div>
      </section>

      <section className={[styles.pageBody, nunitosans.className].join(' ')}>
        <div className={styles.pageBodyInner}>
          <h2 className={unna.className}>What I do now</h2>
          <p>
            I&apos;m Head of SEO at <a href="https://whop.com/" target="_blank" rel="noopener noreferrer">Whop</a>,
            where I lead the organic strategy across a fast-moving consumer marketplace. A big
            chunk of my work right now is GEO - Generative Engine Optimisation - and figuring out
            how brands earn visibility in ChatGPT, Perplexity, Google AI Overviews, and the rest
            of the LLM-shaped search landscape.
          </p>

          <h2 className={unna.className}>Previously</h2>
          <p>
            For the better part of a decade I ran Search Candy as an independent eCommerce SEO
            consultancy. Clients included <strong>The Times</strong>, <strong>CEF</strong>,{' '}
            <strong>Fired Earth</strong>, <strong>Lending Works</strong>, and{' '}
            <strong>Think Money</strong>, alongside dozens of smaller engagements.
          </p>
          <p>
            Before consulting, I spent years in-house and agency-side across enterprise ecommerce,
            finance, and publishing. The constant has always been organic search.
          </p>

          <h2 className={unna.className}>What this site is</h2>
          <p>
            Search Candy is the masthead - the publication. I&apos;m the person behind it. The
            things I publish here are notes from the field: what&apos;s actually working, what
            isn&apos;t, and the experiments I&apos;m running on real sites with real traffic.
          </p>
          <p>
            No course funnels. No certifications. No daily takes. Just writing about search when
            I&apos;ve got something worth saying.
          </p>

          <h2 className={unna.className}>Get in touch</h2>
          <ul>
            <li>
              X / Twitter:{' '}
              <a href="https://x.com/ColinMcDermott" target="_blank" rel="noopener noreferrer">
                @ColinMcDermott
              </a>
            </li>
            <li>
              LinkedIn:{' '}
              {/* TODO: confirm LinkedIn URL */}
              <a
                href="https://www.linkedin.com/in/colinmcdermott/"
                target="_blank"
                rel="noopener noreferrer"
              >
                colinmcdermott
              </a>
            </li>
            <li>
              Email: <a href="mailto:colin@searchcandy.uk">colin@searchcandy.uk</a>
            </li>
          </ul>
        </div>
      </section>
    </main>
  )
}
