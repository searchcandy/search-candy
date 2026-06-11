import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getAllPostURIs, getPostBySlug } from '@/lib/api'
import { optimisePostContentImages, toPublicMediaUrl } from '@/lib/content'
import styles from '@/styles/SinglePost.module.css'
import { nunitosans } from '@/components/fonts'

// Unknown URLs get the prebuilt 404 instead of an on-demand ISR render.
// Bot/scanner traffic to arbitrary paths was generating an ISR cache write
// per unique URL. New WordPress posts need a redeploy to appear.
export const dynamicParams = false

const sluggify = (uriParts: string[]) => uriParts[uriParts.length - 1]

const formatDate = (value: string | number | Date) =>
  new Date(value).toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })

export async function generateStaticParams() {
  const uris = await getAllPostURIs()
  return uris
    .map((u) => u.replace(/^\/|\/$/g, '').split('/'))
    .filter((parts) => parts.length > 0)
    .map((parts) => ({ uri: parts }))
}

export async function generateMetadata({ params }: SearchCandyRouteProps<{ uri: string[] }>) {
  const { uri } = await params
  const slug = sluggify(uri)
  const post = await getPostBySlug(slug)
  if (!post) return {}
  const canonical = post.uri?.startsWith('http')
    ? post.uri
    : `https://searchcandy.uk${post.uri}`
  const ogImage = toPublicMediaUrl(post.featuredImage?.node?.sourceUrl, { absolute: true })
  return {
    title: post.title,
    description: post.excerpt?.replace(/<[^>]*>/g, '').trim() || undefined,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title: post.title,
      url: canonical,
      description: post.excerpt?.replace(/<[^>]*>/g, '').trim() || undefined,
      siteName: 'Search Candy',
      ...(ogImage ? { images: [ogImage] } : {}),
      authors: post.author?.node?.name ? [post.author.node.name] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      site: '@searchcandy',
      creator: '@colinmcdermott',
      title: post.title,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }
}

export default async function Post({ params }: SearchCandyRouteProps<{ uri: string[] }>) {
  const { uri } = await params
  const slug = sluggify(uri)
  const post = await getPostBySlug(slug)

  if (!post?.slug) notFound()

  const featuredImage = post.featuredImage?.node
  const featuredImageUrl = toPublicMediaUrl(featuredImage?.sourceUrl)
  const featuredImageHref = toPublicMediaUrl(featuredImage?.sourceUrl, { absolute: true })
  const content = optimisePostContentImages(post.content || '', {
    eagerFirstImage: !featuredImage?.sourceUrl,
  })

  return (
    <main className="main">
      <div className={[nunitosans.className, styles.articleContainer].join(' ')}>
        <article className={styles.article}>
          <div className={styles.postHeader}>
            {featuredImageUrl && (
              <div className={styles.featuredPostWrapper}>
                <a
                  href={featuredImageHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={featuredImageUrl}
                    alt={featuredImage?.altText || post.title}
                    width={880}
                    height={380}
                    quality={80}
                    preload
                    fetchPriority="high"
                    sizes="(max-width: 880px) 100vw, 880px"
                  />
                </a>
              </div>
            )}

            <h1>{post.title}</h1>

            <div className={styles.postMetaContainer}>
              <div className={styles.postMeta}>
                <p className={nunitosans.className}>
                  Published: <time dateTime={post.date}>{formatDate(post.date)}</time> - Last Updated:{' '}
                  <time dateTime={post.modifiedGmt}>{formatDate(post.modifiedGmt)}</time>
                </p>
              </div>

              {post.author?.node && (
                <div className={styles.author}>
                  {post.author.node.avatar?.url && (
                    <Image
                      src={post.author.node.avatar.url}
                      alt={post.author.node.name || 'Author avatar'}
                      width={50}
                      height={50}
                    />
                  )}
                  <p className={nunitosans.className}>
                    <a
                      href="https://x.com/ColinMcDermott"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {post.author.node.name}
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className={nunitosans.className}>
            <div
              className={styles.articleInner}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </article>
      </div>
    </main>
  )
}
