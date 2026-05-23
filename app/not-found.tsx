import Link from 'next/link'

export const metadata = {
  title: '404 - Not Found',
}

export default function NotFound() {
  return (
    <main className="main">
      <section style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h1>404 - Page not found</h1>
        <p>Sorry, we couldn&apos;t find what you were looking for.</p>
        <p>
          <Link href="/">Back to the homepage</Link>
        </p>
      </section>
    </main>
  )
}
