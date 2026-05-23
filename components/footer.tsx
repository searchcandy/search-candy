import { nunitosans } from '@/components/fonts'

const FOOTER_LINKS = [
  { href: '/about/', label: 'About' },
  { href: '/insights/', label: 'Writing' },
  { href: '/seo/seo-glossary/', label: 'SEO A-Z' },
  { href: '/contact/', label: 'Contact' },
  { href: '#newsletter', label: 'Newsletter' },
]

const SOCIAL_LINKS = [
  { href: 'https://x.com/ColinMcDermott', label: 'X', external: true },
  // TODO: confirm LinkedIn URL
  { href: 'https://www.linkedin.com/in/colinmcdermott/', label: 'LinkedIn', external: true },
  { href: '/sitemap/', label: 'Sitemap', external: false },
]

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={nunitosans.className}>
      <nav>
        <ul>
          {FOOTER_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <nav aria-label="Social">
        <ul>
          {SOCIAL_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                {...(link.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <p>&copy; Search Candy 2014–{currentYear}</p>
    </footer>
  )
}

export default Footer
