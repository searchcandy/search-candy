import { unna, nunitosans } from '@/components/fonts'
import styles from '@/styles/Page.module.css'

export const metadata = {
  title: 'Contact',
  description: 'Get in touch with Colin McDermott - email, X, and LinkedIn.',
  alternates: { canonical: 'https://searchcandy.uk/contact/' },
}

export default function Contact() {
  return (
    <main className="main">
      <section className={styles.pageIntro}>
        <div className={styles.pageIntroInner}>
          <h1 className={unna.className}>Contact</h1>
          <p className={[styles.pageIntroLead, nunitosans.className].join(' ')}>
            The fastest way to reach me is email. For shorter back-and-forth or public threads,
            X works.
          </p>
        </div>
      </section>

      <section className={[styles.pageBody, nunitosans.className].join(' ')}>
        <div className={styles.pageBodyInner}>
          <h2 className={unna.className}>Email</h2>
          <p>
            <a href="mailto:colin@searchcandy.uk">colin@searchcandy.uk</a>
          </p>
          <p>
            Quick guide on what gets a fast reply: SEO / GEO questions, speaking or workshop
            enquiries, and writing collaborations. Cold sales pitches and link-exchange asks will
            be ignored - please don&apos;t waste either of our time.
          </p>

          <h2 className={unna.className}>Elsewhere</h2>
          <ul>
            <li>
              X / Twitter:{' '}
              <a href="https://x.com/ColinMcDermott" target="_blank" rel="noopener noreferrer">
                @ColinMcDermott
              </a>
            </li>
            <li>
              {/* TODO: confirm LinkedIn URL */}
              LinkedIn:{' '}
              <a
                href="https://www.linkedin.com/in/colinmcdermott/"
                target="_blank"
                rel="noopener noreferrer"
              >
                colinmcdermott
              </a>
            </li>
          </ul>
        </div>
      </section>
    </main>
  )
}
