import type { NextConfig } from 'next'

const wordpressOrigin = getWordPressOrigin()
const wordpressHostname = wordpressOrigin ? new URL(wordpressOrigin).hostname : null

function getWordPressOrigin() {
  const endpoint = process.env.WP_GRAPHQL_ENDPOINT
  if (!endpoint) {
    if (process.env.VERCEL === '1' && process.env.VERCEL_ENV === 'production') {
      throw new Error('WP_GRAPHQL_ENDPOINT must be set for production builds')
    }
    return null
  }

  try {
    return new URL(endpoint).origin
  } catch {
    throw new Error('WP_GRAPHQL_ENDPOINT must be a valid URL')
  }
}

// Vercel already sends Strict-Transport-Security on the production domain.
// A full CSP is intentionally omitted: the site relies on inline scripts
// (JSON-LD, mobile menu, share button) and experimental.inlineCss.
const SECURITY_HEADERS = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  poweredByHeader: false,
  // Stable in Next 16. Auto-memoizes client components - eliminates the
  // need for most manual React.memo / useMemo / useCallback wrapping.
  reactCompiler: true,
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    inlineCss: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: SECURITY_HEADERS,
      },
    ]
  },
  async rewrites() {
    return {
      beforeFiles: wordpressOrigin
        ? [
            {
              // Preserve legacy WordPress media URLs through the public frontend.
              source: '/wp-content/uploads/:path*',
              destination: `${wordpressOrigin}/wp-content/uploads/:path*`,
            },
          ]
        : [],
    }
  },
  images: {
    // WP upload filenames change when media is replaced, so optimized
    // images can be cached for a long time. Cuts repeat optimizations
    // (a metered Vercel resource) for crawler-heavy traffic.
    minimumCacheTTL: 2678400, // 31 days
    qualities: [75, 80, 100],
    remotePatterns: [
      ...(wordpressHostname ? [{ protocol: 'https' as const, hostname: wordpressHostname }] : []),
      { protocol: 'https', hostname: 'www.searchcandy.uk' },
      { protocol: 'https', hostname: 'searchcandy.uk' },
      { protocol: 'https', hostname: 'secure.gravatar.com' },
    ],
  },
}

export default nextConfig
