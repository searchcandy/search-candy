import { readexpro } from '@/components/fonts'

const MENU_LINKS = [
  { href: '/about/', label: 'About' },
  { href: '/insights/', label: 'Writing' },
  { href: '/contact/', label: 'Contact' },
  { href: '#newsletter', label: 'Newsletter' },
]
const MOBILE_MENU_SCRIPT = `
(() => {
  const menu = document.getElementById('overlay-menu')
  const openButton = document.querySelector('[popovertarget="overlay-menu"]')
  const closeButton = menu?.querySelector('[popovertargetaction="hide"]')

  if (!menu || menu.dataset.menuBound === 'true') return

  const supportsPopover = 'popover' in HTMLElement.prototype && typeof menu.hidePopover === 'function'

  menu.dataset.menuBound = 'true'

  const setExpanded = (isOpen) => {
    if (openButton) openButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false')
  }

  const openFallbackMenu = () => {
    menu.dataset.fallbackOpen = 'true'
    setExpanded(true)
    menu.querySelector('a[href], button')?.focus()
  }

  const closeFallbackMenu = () => {
    delete menu.dataset.fallbackOpen
    setExpanded(false)
    openButton?.focus()
  }

  if (supportsPopover) {
    menu.addEventListener('toggle', (event) => {
      setExpanded(event.newState === 'open')
    })
  } else {
    openButton?.addEventListener('click', () => {
      if (menu.dataset.fallbackOpen === 'true') {
        closeFallbackMenu()
      } else {
        openFallbackMenu()
      }
    })
    closeButton?.addEventListener('click', closeFallbackMenu)
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menu.dataset.fallbackOpen === 'true') closeFallbackMenu()
    })
  }

  menu.addEventListener('click', (event) => {
    const target = event.target
    const link = target instanceof Element ? target.closest('a[href]') : null
    const clickedBackdrop = target === menu

    if (!link && !clickedBackdrop) return

    if (supportsPopover) {
      try {
        menu.hidePopover()
      } catch {}
    } else {
      closeFallbackMenu()
    }
  })
})()
`

export default function MobileMenu() {
  return (
    <>
      <button
        type="button"
        className="hamburgerIcon"
        aria-label="Open menu"
        aria-controls="overlay-menu"
        aria-expanded="false"
        popovertarget="overlay-menu"
        popovertargetaction="toggle"
      >
        <span aria-hidden="true">
          <svg viewBox="0 0 100 80" width="20" height="16" aria-hidden="true" focusable="false">
            <rect width="100" height="14"></rect>
            <rect y="30" width="100" height="14"></rect>
            <rect y="60" width="100" height="14"></rect>
          </svg>
        </span>
      </button>
      <div id="overlay-menu" className="overlayMenu" popover="auto">
        <nav className="overlayMenuInner">
          <ul className={readexpro.className}>
            {MENU_LINKS.map((link) => (
              <li key={link.href + link.label}>
                <a href={link.href}>{link.label} &#x02192;</a>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          className="overlayMenuCloseButton"
          aria-label="Close menu"
          popovertarget="overlay-menu"
          popovertargetaction="hide"
        >
          <span className={readexpro.className} aria-hidden="true">X</span>
        </button>
      </div>
      <script
        id="mobile-menu-close-on-link"
        dangerouslySetInnerHTML={{ __html: MOBILE_MENU_SCRIPT }}
      />
    </>
  )
}
