// GraphQL helpers for the headless WordPress CMS.
// All calls run in Server Components - no Apollo, no client.
//
// Resilience: the upstream WordPress site intermittently throws PHP 500s
// from the all-in-one-seo-pack plugin. We retry transient failures. List
// helpers can fall back only during next build, so runtime ISR failures throw
// and keep the previously cached good response.

import { cache } from 'react'

// Configure per environment. Production must provide the private CMS endpoint.
const API_URL = process.env.WP_GRAPHQL_ENDPOINT
const CF_ACCESS_CLIENT_ID = process.env.CF_ACCESS_CLIENT_ID
const CF_ACCESS_CLIENT_SECRET = process.env.CF_ACCESS_CLIENT_SECRET
// 24h ISR. Content changes ship via redeploys (dynamicParams = false on the
// dynamic routes), so revalidation is a freshness safety net, not the primary
// update path. Hourly revalidation of ~280 pages was exhausting the Vercel
// Hobby ISR write allowance on its own.
const DEFAULT_REVALIDATE = 86400
const MAX_ATTEMPTS = 3
const INITIAL_BACKOFF_MS = 800
const WPGRAPHQL_PAGE_SIZE = 100

class GraphQLAccessConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GraphQLAccessConfigError'
  }
}

class GraphQLHTTPError extends Error {
  constructor(
    readonly status: number,
    body: string
  ) {
    super(`GraphQL HTTP ${status}: ${body.slice(0, 200)}`)
    this.name = 'GraphQLHTTPError'
  }
}

type GraphQLResponse<TData extends SearchCandyGraphQLData> = {
  data?: TData
  errors?: unknown
}

type FetchConnectionOptions<TNode, TData extends SearchCandyGraphQLData> = {
  query: string
  variables?: Record<string, unknown>
  getConnection: (data: TData) => SearchCandyConnection<TNode> | null | undefined
  limit?: number
}

type PostURIConnectionData = {
  posts?: SearchCandyConnection<SearchCandyURIEntry> | null
}

type PostSitemapConnectionData = {
  posts?: SearchCandyConnection<SearchCandyPostSitemapEntry> | null
}

type PostsConnectionData = {
  posts?: SearchCandyConnection<SearchCandyPost> | null
}

type CategoriesConnectionData = {
  categories?: SearchCandyConnection<SearchCandyCategory> | null
}

type CategoryData = {
  category?: SearchCandyCategory | null
}

type PostData = {
  post?: SearchCandyPost | null
}

type GlossaryURIConnectionData = {
  pages?: SearchCandyConnection<SearchCandyURIEntry> | null
}

type GlossarySitemapConnectionData = {
  pages?: SearchCandyConnection<SearchCandyGlossarySitemapEntry> | null
}

type GlossaryEntryData = {
  pageBy?: SearchCandyGlossaryEntry | null
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const isProductionBuild = () => process.env.NEXT_PHASE === 'phase-production-build'
const isVercelProductionBuild = () =>
  process.env.VERCEL === '1' && process.env.VERCEL_ENV === 'production' && isProductionBuild()
const isAuthFailure = (err: unknown) =>
  err instanceof GraphQLHTTPError && (err.status === 401 || err.status === 403)
const isBuildBlockingFetchFailure = (err: unknown) =>
  err instanceof GraphQLAccessConfigError || isAuthFailure(err)

function getGraphQLEndpoint() {
  if (!API_URL) {
    throw new GraphQLAccessConfigError('WP_GRAPHQL_ENDPOINT must be set')
  }

  return API_URL
}

function getGraphQLHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (CF_ACCESS_CLIENT_ID && CF_ACCESS_CLIENT_SECRET) {
    headers['CF-Access-Client-Id'] = CF_ACCESS_CLIENT_ID
    headers['CF-Access-Client-Secret'] = CF_ACCESS_CLIENT_SECRET
    return headers
  }

  if (CF_ACCESS_CLIENT_ID || CF_ACCESS_CLIENT_SECRET) {
    throw new GraphQLAccessConfigError(
      'Both CF_ACCESS_CLIENT_ID and CF_ACCESS_CLIENT_SECRET must be set'
    )
  }

  if (isVercelProductionBuild()) {
    throw new GraphQLAccessConfigError(
      'CF_ACCESS_CLIENT_ID and CF_ACCESS_CLIENT_SECRET are required for Vercel production builds'
    )
  }

  return headers
}

async function fetchAPI<TData extends SearchCandyGraphQLData = SearchCandyGraphQLData>(
  query: string,
  { variables, revalidate = DEFAULT_REVALIDATE }: SearchCandyFetchAPIOptions = {}
): Promise<TData> {
  let lastError: unknown

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(getGraphQLEndpoint(), {
        method: 'POST',
        headers: getGraphQLHeaders(),
        body: JSON.stringify({ query, variables }),
        next: { revalidate },
      })

      if (!res.ok) {
        const body = await res.text()
        const err = new GraphQLHTTPError(res.status, body)
        // Retry on server errors; 4xx is a client problem so don't retry.
        if (res.status >= 500 && attempt < MAX_ATTEMPTS) {
          lastError = err
          await sleep(INITIAL_BACKOFF_MS * 2 ** (attempt - 1))
          continue
        }
        throw err
      }

      const json = (await res.json()) as GraphQLResponse<TData>
      if (json.errors) {
        console.error('GraphQL errors:', json.errors, { variables })
        throw new Error('GraphQL query returned errors')
      }
      return json.data ?? ({} as TData)
    } catch (err) {
      lastError = err
      // 4xx never succeeds on retry (and 401/403 must fail fast so builds block).
      const isClientHTTPError = err instanceof GraphQLHTTPError && err.status < 500
      if (err instanceof GraphQLAccessConfigError || isClientHTTPError || attempt >= MAX_ATTEMPTS) {
        throw err
      }
      await sleep(INITIAL_BACKOFF_MS * 2 ** (attempt - 1))
    }
  }
  throw lastError
}

async function fetchWithBuildFallback<T>(
  label: string,
  fn: () => Promise<T>,
  fallbackValue: T
): Promise<T> {
  try {
    return await fn()
  } catch (err) {
    if (!isProductionBuild() || isBuildBlockingFetchFailure(err)) throw err
    const message = err instanceof Error ? err.message : String(err)
    console.warn(`[lib/api] ${label} failed during build, falling back:`, message)
    return fallbackValue
  }
}

async function fetchConnectionNodes<TNode, TData extends SearchCandyGraphQLData>({
  query,
  variables = {},
  getConnection,
  limit = Infinity,
}: FetchConnectionOptions<TNode, TData>): Promise<TNode[]> {
  const nodes: TNode[] = []
  let after: string | null = null

  while (nodes.length < limit) {
    const first = Number.isFinite(limit)
      ? Math.min(WPGRAPHQL_PAGE_SIZE, limit - nodes.length)
      : WPGRAPHQL_PAGE_SIZE
    const data = await fetchAPI<TData>(query, { variables: { ...variables, first, after } })
    const connection = getConnection(data)

    if (!connection) {
      throw new Error('GraphQL connection missing from response')
    }

    nodes.push(...(connection.nodes ?? connection.edges?.map(({ node }) => node) ?? []))

    if (!connection.pageInfo?.hasNextPage) break
    after = connection.pageInfo.endCursor ?? null
    if (!after) break
  }

  return nodes
}

// ---------- Posts (Insights) ----------

export async function getAllPostURIs(): Promise<string[]> {
  const nodes = await fetchWithBuildFallback(
    'getAllPostURIs',
    () =>
      fetchConnectionNodes<SearchCandyURIEntry, PostURIConnectionData>({
        query: `
        query AllPostURIs($first: Int!, $after: String) {
          posts(first: $first, after: $after) {
            nodes { uri }
            pageInfo { hasNextPage endCursor }
          }
        }
      `,
        getConnection: (data) => data.posts,
      }),
    []
  )
  return nodes.map((node) => node.uri)
}

export async function getAllPostEntriesForSitemap(): Promise<SearchCandyPostSitemapEntry[]> {
  return fetchWithBuildFallback(
    'getAllPostEntriesForSitemap',
    () =>
      fetchConnectionNodes<SearchCandyPostSitemapEntry, PostSitemapConnectionData>({
        query: `
        query AllPostSitemapEntries($first: Int!, $after: String) {
          posts(first: $first, after: $after) {
            nodes { uri modifiedGmt }
            pageInfo { hasNextPage endCursor }
          }
        }
      `,
        getConnection: (data) => data.posts,
      }),
    []
  )
}

const POST_FIELDS = `
  fragment PostFields on Post {
    title
    excerpt
    slug
    date
    modifiedGmt
    uri
    featuredImage { node { sourceUrl altText } }
    author {
      node {
        name
        firstName
        lastName
        avatar { url }
      }
    }
  }
`

export async function getPostsForListing({
  first = 100,
}: { first?: number } = {}): Promise<SearchCandyPost[]> {
  return fetchWithBuildFallback(
    'getPostsForListing',
    () =>
      fetchConnectionNodes<SearchCandyPost, PostsConnectionData>({
        query: `
        ${POST_FIELDS}
        query PostsForListing($first: Int!, $after: String) {
          posts(first: $first, after: $after, where: { orderby: { field: DATE, order: DESC } }) {
            nodes { ...PostFields }
            pageInfo { hasNextPage endCursor }
          }
        }
      `,
        getConnection: (data) => data.posts,
        limit: first,
      }),
    []
  )
}

export async function getPostsByCategorySlug({
  slug,
  first = 12,
}: { slug: string; first?: number }): Promise<SearchCandyPost[]> {
  return fetchWithBuildFallback(
    `getPostsByCategorySlug(${slug})`,
    () =>
      fetchConnectionNodes<SearchCandyPost, PostsConnectionData>({
        query: `
        query PostsByCategorySlug($slug: String!, $first: Int!, $after: String) {
          posts(first: $first, after: $after, where: { categoryName: $slug, orderby: { field: DATE, order: DESC } }) {
            nodes {
              title
              excerpt
              date
              uri
              categories(first: 1) {
                edges { node { name uri } }
              }
            }
            pageInfo { hasNextPage endCursor }
          }
        }
      `,
        variables: { slug },
        getConnection: (data) => data.posts,
        limit: first,
      }),
    []
  )
}

export async function getAllCategories(): Promise<SearchCandyCategory[]> {
  return fetchWithBuildFallback(
    'getAllCategories',
    () =>
      fetchConnectionNodes<SearchCandyCategory, CategoriesConnectionData>({
        query: `
        query AllCategories($first: Int!, $after: String) {
          categories(first: $first, after: $after, where: { hideEmpty: true }) {
            nodes { name slug uri count }
            pageInfo { hasNextPage endCursor }
          }
        }
      `,
        getConnection: (data) => data.categories,
      }),
    []
  )
}

export const getCategoryBySlug: (slug: string) => Promise<SearchCandyCategory | null> = cache(
  async (slug: string) => {
    const data = await fetchAPI<CategoryData>(
      `
      query CategoryBySlug($id: ID!) {
        category(id: $id, idType: SLUG) {
          name
          slug
          uri
          count
        }
      }
    `,
      { variables: { id: slug } }
    )
    return data.category ?? null
  }
)

export async function getPostsForFeed({
  first = 20,
}: { first?: number } = {}): Promise<SearchCandyPost[]> {
  return fetchWithBuildFallback(
    'getPostsForFeed',
    () =>
      fetchConnectionNodes<SearchCandyPost, PostsConnectionData>({
        query: `
        query PostsForFeed($first: Int!, $after: String) {
          posts(first: $first, after: $after, where: { orderby: { field: DATE, order: DESC } }) {
            nodes {
              title
              excerpt
              content
              date
              uri
              author { node { name } }
              categories { edges { node { name } } }
            }
            pageInfo { hasNextPage endCursor }
          }
        }
      `,
        getConnection: (data) => data.posts,
        limit: first,
      }),
    []
  )
}

export async function getRecentPostsForHome({
  first = 6,
}: { first?: number } = {}): Promise<SearchCandyPost[]> {
  return fetchWithBuildFallback(
    'getRecentPostsForHome',
    () =>
      fetchConnectionNodes<SearchCandyPost, PostsConnectionData>({
        query: `
        query RecentPostsForHome($first: Int!, $after: String) {
          posts(first: $first, after: $after, where: { orderby: { field: DATE, order: DESC } }) {
            nodes {
              title
              excerpt
              date
              uri
              categories(first: 1) {
                edges { node { name uri } }
              }
            }
            pageInfo { hasNextPage endCursor }
          }
        }
      `,
        getConnection: (data) => data.posts,
        limit: first,
      }),
    []
  )
}

// Wrapped in React.cache so generateMetadata and the page component
// share a single fetch per request.
export const getPostBySlug: (slug: string) => Promise<SearchCandyPost | null> = cache(
  async (slug: string) => {
    const data = await fetchAPI<PostData>(
      `
    ${POST_FIELDS}
    query PostBySlug($id: ID!) {
      post(id: $id, idType: SLUG) {
        ...PostFields
        content
        categories { edges { node { name } } }
        tags { edges { node { name } } }
      }
    }
  `,
      { variables: { id: slug } }
    )
    return data.post ?? null
  }
)

// ---------- Glossary (WordPress pages with parent 3592) ----------

export async function getAllGlossaryURIs(): Promise<string[]> {
  const nodes = await fetchWithBuildFallback(
    'getAllGlossaryURIs',
    () =>
      fetchConnectionNodes<SearchCandyURIEntry, GlossaryURIConnectionData>({
        query: `
        query GlossaryURIs($first: Int!, $after: String) {
          pages(first: $first, after: $after, where: { parent: "3592" }) {
            nodes { uri }
            pageInfo { hasNextPage endCursor }
          }
        }
      `,
        getConnection: (data) => data.pages,
      }),
    []
  )
  return nodes.map((node) => node.uri)
}

export async function getAllGlossaryEntriesForSitemap(): Promise<
  SearchCandyGlossarySitemapEntry[]
> {
  return fetchWithBuildFallback(
    'getAllGlossaryEntriesForSitemap',
    () =>
      fetchConnectionNodes<SearchCandyGlossarySitemapEntry, GlossarySitemapConnectionData>({
        query: `
        query GlossaryEntries($first: Int!, $after: String) {
          pages(first: $first, after: $after, where: { parent: "3592", orderby: { field: TITLE, order: ASC } }) {
            nodes { uri title modifiedGmt }
            pageInfo { hasNextPage endCursor }
          }
        }
      `,
        getConnection: (data) => data.pages,
      }),
    []
  )
}

export const getGlossaryEntryByURI: (
  uri: string
) => Promise<SearchCandyGlossaryEntry | null> = cache(async (uri: string) => {
  const data = await fetchAPI<GlossaryEntryData>(
    `
    query GlossaryEntry($uri: String!) {
      pageBy(uri: $uri) {
        id
        title
        content
        uri
        dateGmt
        modifiedGmt
      }
    }
  `,
    { variables: { uri } }
  )
  return data.pageBy ?? null
})
