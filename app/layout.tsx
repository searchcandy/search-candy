import '@/styles/globals.css'
import Shell from '@/components/Shell'
import NewsletterSignup from '@/components/NewsletterSignup'

export const metadata = {
  metadataBase: new URL('https://searchcandy.uk'),
  title: {
    default: 'Search Candy - Ecommerce SEO Consultancy',
    template: '%s | Search Candy',
  },
  description:
    'At Search Candy we specialise 100% in SEO. Find out more about how we can help you get more organic traffic to your website.',
  icons: { icon: '/icon.svg' },
  openGraph: { siteName: 'Search Candy', type: 'website' },
  twitter: { card: 'summary_large_image', site: '@searchcandy', creator: '@colinmcdermott' },
  alternates: {
    types: {
      'application/rss+xml': '/feed/',
    },
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'dark light',
}

export default function RootLayout({ children }: { children: SearchCandyReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Shell newsletter={<NewsletterSignup />}>{children}</Shell>
      </body>
    </html>
  )
}
