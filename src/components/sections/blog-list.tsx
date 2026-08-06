"use client"

import * as React from "react"
import Link from "next/link"
import { Clock, Sparkles } from "lucide-react"

import { blogCategories, type BlogPost } from "@/content/blog"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { PostBanner } from "@/components/blog/post-banner"

const dateFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
})

export function PostMeta({
  post,
  className,
}: {
  post: BlogPost
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground",
        className
      )}
    >
      <time dateTime={post.date}>{dateFormat.format(new Date(post.date))}</time>
      <span aria-hidden>·</span>
      <span className="flex items-center gap-1.5">
        <Clock aria-hidden className="size-3.5" />
        {post.readingMinutes} min read
      </span>
      <span aria-hidden>·</span>
      <span>{post.author}</span>
    </div>
  )
}

export function BlogList({ posts }: { posts: BlogPost[] }) {
  const [active, setActive] = React.useState<string>("All")

  const filters = React.useMemo(() => {
    // Only offer a filter that actually has posts behind it.
    const present = new Set(posts.map((p) => p.category))
    return ["All", ...blogCategories.filter((c) => present.has(c))]
  }, [posts])

  const visible =
    active === "All" ? posts : posts.filter((p) => p.category === active)

  return (
    <div>
      {/* Filters are buttons rather than links: no navigation happens, and a
          fake link would lie to anyone using a screen reader. */}
      <div
        role="group"
        aria-label="Filter posts by topic"
        className="flex flex-wrap gap-2"
      >
        {filters.map((filter) => {
          const isActive = filter === active

          return (
            <button
              key={filter}
              type="button"
              onClick={() => setActive(filter)}
              aria-pressed={isActive}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium",
                "transition-[color,background-color,border-color] duration-[--duration-fast]",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
                isActive
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-accent/40 hover:text-foreground"
              )}
            >
              {filter}
            </button>
          )
        })}
      </div>

      <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((post) => (
          <li key={post.slug} className="flex">
            <Link
              href={`/blog/${post.slug}`}
              className={cn(
                "group flex w-full flex-col overflow-hidden rounded-xl border border-border bg-card p-6 shadow-xs",
                "transition-[border-color,box-shadow,transform] duration-[--duration-base] ease-[--ease-out]",
                "hover:-translate-y-1 hover:border-accent/40 hover:shadow-md motion-reduce:hover:translate-y-0",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
              )}
            >
              {/* Alt text is empty on purpose: the title sits right below and
                  the link would otherwise be announced twice. Without an
                  image, the category paints its own gradient. */}
              <PostBanner
                post={post}
                sizes="(min-width: 1024px) 22rem, (min-width: 768px) 45vw, 100vw"
                className="mb-5"
              />

              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-muted-foreground uppercase">
                  {post.category}
                </span>

                {/* Release tag, so an update is identifiable before the title
                    is read. */}
                {post.version ? (
                  <Badge variant="accent" className="gap-1 px-2">
                    <Sparkles aria-hidden className="size-3" />
                    {post.version}
                  </Badge>
                ) : null}
              </div>

              <h3 className="mt-3 text-lg leading-snug font-semibold transition-colors group-hover:text-accent">
                {post.title}
              </h3>

              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>

              <PostMeta post={post} className="mt-6 border-t border-border pt-4" />
            </Link>
          </li>
        ))}
      </ul>

      {visible.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          Nothing filed under {active} yet.
        </p>
      ) : null}

      {/* Announce the change without moving focus off the filter. */}
      <p aria-live="polite" className="sr-only">
        {visible.length} {visible.length === 1 ? "post" : "posts"} shown
        {active === "All" ? "" : ` in ${active}`}
      </p>
    </div>
  )
}
