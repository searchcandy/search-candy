import type { ReactNode } from 'react'

export {}


declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ButtonHTMLAttributes<T> {
    popovertarget?: string
    popovertargetaction?: 'hide' | 'show' | 'toggle'
  }
}

declare global {
  type SearchCandyReactNode = ReactNode

  type SearchCandyRouteProps<T extends Record<string, string | string[]>> = {
    params: Promise<T>
  }

  type SearchCandyErrorProps = {
    error: Error & { digest?: string }
    reset: () => void
  }

  type SearchCandyEdge<T> = { node: T }

  type SearchCandyConnection<T> = {
    nodes?: T[]
    edges?: Array<SearchCandyEdge<T>>
    pageInfo?: {
      hasNextPage?: boolean
      endCursor?: string | null
    }
  }

  type SearchCandyGraphQLData = Record<string, unknown>

  type SearchCandyImage = {
    sourceUrl?: string
    url?: string
    altText?: string
  }

  type SearchCandyFeaturedImage = {
    node?: SearchCandyImage
  }

  type SearchCandyAuthor = {
    name?: string
    firstName?: string
    lastName?: string
    avatar?: SearchCandyImage
  }

  type SearchCandyCategory = {
    name?: string
    slug?: string
    uri?: string
    count?: number
  }

  type SearchCandyTaxonomyConnection = {
    edges?: Array<SearchCandyEdge<SearchCandyCategory>>
  }

  type SearchCandyPost = {
    title: string
    excerpt?: string
    content?: string
    slug?: string
    date: string
    modifiedGmt: string
    uri: string
    featuredImage?: SearchCandyFeaturedImage
    author?: { node?: SearchCandyAuthor }
    categories?: SearchCandyTaxonomyConnection
    tags?: SearchCandyTaxonomyConnection
  }

  type SearchCandyURIEntry = {
    uri: string
  }

  type SearchCandyGlossaryEntry = {
    id?: string
    title: string
    content?: string
    uri: string
    dateGmt: string
    modifiedGmt: string
  }

  type SearchCandyGlossarySitemapEntry = {
    uri: string
    title: string
  }

  type SearchCandyFetchAPIOptions = {
    variables?: Record<string, unknown>
    revalidate?: number
  }
}
