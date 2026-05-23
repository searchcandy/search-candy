const PUBLIC_SITE_ORIGIN = 'https://searchcandy.uk'

type MediaUrlOptions = {
  absolute?: boolean
}

function getWordPressOrigin() {
  const endpoint = process.env.WP_GRAPHQL_ENDPOINT
  if (!endpoint) return null

  try {
    return new URL(endpoint).origin
  } catch {
    return null
  }
}

const WORDPRESS_ORIGIN = getWordPressOrigin()
const WORDPRESS_UPLOADS_PREFIX = WORDPRESS_ORIGIN
  ? `${WORDPRESS_ORIGIN}/wp-content/uploads/`
  : null

export function toPublicMediaUrl(
  value: string | null | undefined,
  { absolute = false }: MediaUrlOptions = {}
) {
  if (!value || !WORDPRESS_ORIGIN) return value ?? undefined

  try {
    const url = new URL(value)
    if (url.origin !== WORDPRESS_ORIGIN || !url.pathname.startsWith('/wp-content/uploads/')) {
      return value
    }

    const publicPath = `${url.pathname}${url.search}`
    return absolute ? `${PUBLIC_SITE_ORIGIN}${publicPath}` : publicPath
  } catch {
    return value
  }
}

function normalisePostContentMediaUrls(html: string) {
  if (!WORDPRESS_UPLOADS_PREFIX) return html
  return html.split(WORDPRESS_UPLOADS_PREFIX).join('/wp-content/uploads/')
}

type ImageOptimisationOptions = {
  eagerFirstImage?: boolean
}

const IMAGE_TAG_PATTERN = /<img\b[^>]*>/gi

const hasAttribute = (tag: string, attribute: string) =>
  new RegExp(String.raw`\s${attribute}\s*=`, 'i').test(tag)

const addAttribute = (tag: string, attribute: string, value: string) => {
  if (hasAttribute(tag, attribute)) return tag
  return tag.replace(/(\s*\/?>)$/i, ` ${attribute}="${value}"$1`)
}

const setAttribute = (tag: string, attribute: string, value: string) => {
  const pattern = new RegExp(
    String.raw`(\s${attribute}\s*=\s*)(?:"[^"]*"|'[^']*'|[^\s>]+)`,
    'i'
  )
  if (pattern.test(tag)) return tag.replace(pattern, `$1"${value}"`)
  return addAttribute(tag, attribute, value)
}

export function optimisePostContentImages(
  html: string,
  { eagerFirstImage = false }: ImageOptimisationOptions = {}
) {
  let imageIndex = 0
  const htmlWithPublicMedia = normalisePostContentMediaUrls(html)

  return htmlWithPublicMedia.replace(IMAGE_TAG_PATTERN, (tag) => {
    const isFirstImage = imageIndex === 0
    imageIndex += 1

    let nextTag = addAttribute(tag, 'decoding', 'async')

    if (isFirstImage && eagerFirstImage) {
      nextTag = setAttribute(nextTag, 'loading', 'eager')
      nextTag = addAttribute(nextTag, 'fetchpriority', 'high')
    } else {
      nextTag = addAttribute(nextTag, 'loading', 'lazy')
    }

    if (hasAttribute(nextTag, 'srcset')) {
      nextTag = addAttribute(nextTag, 'sizes', '(max-width: 880px) 100vw, 880px')
    }

    return nextTag
  })
}
