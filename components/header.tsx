import MobileMenu from '@/components/MobileMenu'
import { readexpro, nunitosans } from '@/components/fonts'

const NAV_LINKS = [
  { href: '/about/', label: 'About' },
  { href: '/insights/', label: 'Writing' },
  { href: '/contact/', label: 'Contact' },
  { href: '#newsletter', label: 'Newsletter' },
]

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <p className={readexpro.className}>
          <a href="/">Search Candy</a>
        </p>
      </div>
      <nav>
        <ul className={nunitosans.className}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
          <li className="mobileMenuIcon">
            <MobileMenu />
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
