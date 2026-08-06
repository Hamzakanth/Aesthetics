import "server-only"

import fs from "node:fs"
import path from "node:path"

import matter from "gray-matter"
import readingTime from "reading-time"

import {
  blogCategories,
  type BlogCategory,
  type BlogPost,
  type BlogPostWithContent,
} from "@/content/blog"

/**
 * The posts directory is the database. One `.mdx` file per post, filename =
 * URL slug. Nothing is registered anywhere: adding a file adds a route,
 * because `generateStaticParams` reads this same folder at build time.
 */
const POSTS_DIR = path.join(process.cwd(), "src", "content", "blog")

/** `_`-prefixed files are templates and drafts, never routes. */
function isPostFile(filename: string) {
  return filename.endsWith(".mdx") && !filename.startsWith("_")
}

/**
 * Frontmatter is written by hand, so it is validated rather than trusted.
 * A bad post fails the build loudly instead of shipping a blank page.
 */
function parse(slug: string, raw: string): BlogPostWithContent {
  const { data, content } = matter(raw)
  const where = `src/content/blog/${slug}.mdx`

  // YAML parses a bare `2026-05-14` into a Date, so the date is normalised
  // back to a plain ISO day before anything else looks at it. Writers should
  // not have to remember to quote it.
  if (data.date instanceof Date) {
    data.date = data.date.toISOString().slice(0, 10)
  }

  const required = ["title", "excerpt", "category", "date", "author"] as const
  for (const key of required) {
    if (typeof data[key] !== "string" || !data[key].trim()) {
      throw new Error(`${where}: frontmatter is missing "${key}".`)
    }
  }

  if (!blogCategories.includes(data.category as BlogCategory)) {
    throw new Error(
      `${where}: category "${data.category}" is not one of ${blogCategories
        .map((c) => `"${c}"`)
        .join(", ")}.`
    )
  }

  if (Number.isNaN(Date.parse(data.date))) {
    throw new Error(`${where}: date "${data.date}" is not YYYY-MM-DD.`)
  }

  // A banner typed as `blog/x.jpg` would 404 silently in three places at once,
  // so the shape is checked here instead.
  if (data.image && !/^(\/blog\/images\/|https:\/\/)/.test(String(data.image))) {
    throw new Error(
      `${where}: image "${data.image}" must be "/blog/images/your-file.jpg" (a file in src/content/blog/images/) or an "https://" address.`
    )
  }

  return {
    slug,
    title: data.title,
    excerpt: data.excerpt,
    category: data.category as BlogCategory,
    date: data.date,
    author: data.author,
    // "5 min read" comes from the body, so it cannot drift from the writing.
    readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
    ...(data.version ? { version: String(data.version) } : {}),
    ...(data.featured ? { featured: true } : {}),
    ...(data.image ? { image: String(data.image) } : {}),
    ...(data.imageAlt ? { imageAlt: String(data.imageAlt) } : {}),
    content,
  }
}

/** Every post, newest first. */
export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(POSTS_DIR)) return []

  return fs
    .readdirSync(POSTS_DIR)
    .filter(isPostFile)
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "")
      const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf8")
      // The list never renders bodies; drop them so they stay out of the
      // serialised props of the page.
      const post = parse(slug, raw)
      delete (post as Partial<BlogPostWithContent>).content
      return post
    })
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
}

/** One post with its body, or null when the slug does not exist. */
export function getPostBySlug(slug: string): BlogPostWithContent | null {
  // Defend the filesystem read against a slug arriving from the URL.
  if (!/^[a-z0-9-]+$/.test(slug)) return null

  const file = path.join(POSTS_DIR, `${slug}.mdx`)
  if (!fs.existsSync(file)) return null

  return parse(slug, fs.readFileSync(file, "utf8"))
}

/** Slugs only — for `generateStaticParams` and the sitemap. */
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return []

  return fs
    .readdirSync(POSTS_DIR)
    .filter(isPostFile)
    .map((filename) => filename.replace(/\.mdx$/, ""))
}
