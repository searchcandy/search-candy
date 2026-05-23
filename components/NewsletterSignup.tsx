import { unna, nunitosans } from '@/components/fonts'
import styles from '@/styles/NewsletterSignup.module.css'

export default function NewsletterSignup() {
  return (
    <section id="newsletter" className={styles.newsletter}>
      <div className={styles.newsletterInner}>
        <h2 className={unna.className}>Get the newsletter</h2>
        <p className={nunitosans.className}>
          Occasional notes on SEO, GEO, and where search is going. No fluff, no schedule, no promises.
        </p>
        <form
          action="/newsletter/"
          method="post"
          className={[nunitosans.className, styles.newsletterForm].join(' ')}
          noValidate={false}
        >
          <label htmlFor="newsletter-email" className={styles.visuallyHidden}>
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
            inputMode="email"
            enterKeyHint="send"
            required
          />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </section>
  )
}
