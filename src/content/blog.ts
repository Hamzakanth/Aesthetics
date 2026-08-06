/**
 * Types only. No `fs` in here — client components (the filter bar, the cards)
 * import `BlogPost`, and a filesystem import would break the client bundle.
 * The posts themselves live in `src/content/blog/*.mdx`; `src/lib/blog.ts`
 * is the only file that reads them.
 */

export interface BlogPost {
  /** Filename without the extension. Also the URL. */
  slug: string
  title: string
  excerpt: string
  /** Drives the filter bar on /blog. Keep to the set below. */
  category: BlogCategory
  /** ISO date — formatted at render so the list stays locale-correct. */
  date: string
  /** Derived from the body at build time, never written by hand. */
  readingMinutes: number
  author: string
  /** Release tag, product updates only. Rendered as a chip on the card. */
  version?: string
  featured?: boolean
  /**
   * Banner. A path under `public/` (`/blog/name.jpg`) or an absolute https URL.
   * Renders on the post, both cards, and the social preview — one field, four
   * places, so a post cannot look right on /blog and wrong on LinkedIn.
   */
  image?: string
  /** Alt text for `image`. Falls back to the title when absent. */
  imageAlt?: string
}

/** A post plus its raw MDX body. Server-side only. */
export interface BlogPostWithContent extends BlogPost {
  content: string
}

export type BlogCategory =
  | "Product update"
  | "Front of house"
  | "Retention"
  | "Case study"
  | "Client data"
  | "Company"

/** Filter order. "All" is prepended by the list component. */
export const blogCategories: BlogCategory[] = [
  "Product update",
  "Front of house",
  "Retention",
  "Case study",
  "Client data",
  "Company",
]
