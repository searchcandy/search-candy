'use client'

export default function Error({ error, reset }: SearchCandyErrorProps) {
  void error

  return (
    <main className="main">
      <section style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <h1>Something went wrong</h1>
        <p>
          The page hit an unexpected error. We&apos;ve been notified. You can try again or head
          home.
        </p>
        <p style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={() => reset()} type="button">Try again</button>
          <a href="/">Back to homepage</a>
        </p>
      </section>
    </main>
  )
}
