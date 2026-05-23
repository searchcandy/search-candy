'use client'

// Catches errors thrown in the root layout itself. Must render <html>/<body>.
export default function GlobalError({ error, reset }: SearchCandyErrorProps) {
  void error

  return (
    <html lang="en">
      <body
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          margin: 0,
          padding: '4rem 1.25rem',
          textAlign: 'center',
          background: '#121212',
          color: '#fafafa',
          minHeight: '100vh',
        }}
      >
        <h1 style={{ fontSize: '32px', margin: '0 0 16px' }}>Something went wrong</h1>
        <p style={{ opacity: 0.8 }}>The site hit a critical error.</p>
        <p style={{ marginTop: '24px' }}>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              border: '1px solid currentColor',
              color: 'inherit',
              cursor: 'pointer',
              font: 'inherit',
            }}
          >
            Try again
          </button>
        </p>
      </body>
    </html>
  )
}
