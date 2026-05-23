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

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  // Stable in Next 16. Auto-memoizes client components - eliminates the
  // need for most manual React.memo / useMemo / useCallback wrapping.
  reactCompiler: true,
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    inlineCss: true,
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
