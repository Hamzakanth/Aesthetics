import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock } from "lucide-react"

import { buildMetadata } from "@/lib/seo"
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog"
import { Badge } from "@/components/ui/badge"
import { Container } from "@/components/primitives/container"
import { Section } from "@/components/primitives/section"
import { MdxContent } from "@/components/sections/mdx-content"
import { PostBanner } from "@/components/blog/post-banner"

interface PageProps {
  params: Promise<{ slug: string }>
}

/** Every file in src/content/blog becomes a static page at build time. */
export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) return buildMetadata({ title: "Post not found", noIndex: true })

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    // The banner doubles as the social preview; without one the site-wide
    // default still applies.
    ...(post.image ? { image: post.image } : {}),
  })
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) notFound()

  const date = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(post.date))

  return (
    <Section>
      <Container className="max-w-3xl">
        <Link
          href="/blog"
          className="group flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <ArrowLeft
            aria-hidden
            className="size-4 transition-transform duration-[--duration-fast] group-hover:-translate-x-1 motion-reduce:group-hover:translate-x-0"
          />
          All posts
        </Link>

        <article className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-mono text-[0.6875rem] tracking-[0.14em] text-muted-foreground uppercase">
              {post.category}
            </p>
            {post.version ? (
              <Badge variant="accent" className="px-2">
                {post.version}
              </Badge>
            ) : null}
          </div>

          <h1 className="mt-4 text-display-sm font-semibold tracking-[-0.03em]">
            {post.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border pb-6 text-sm text-muted-foreground">
            <span>{post.author}</span>
            <span aria-hidden>·</span>
            <time dateTime={post.date}>{date}</time>
            <span aria-hidden>·</span>
            <span className="flex items-center gap-1.5">
              <Clock aria-hidden className="size-3.5" />
              {post.readingMinutes} min read
            </span>
          </div>

          {/* The banner is the largest thing above the fold, so it loads
              eagerly rather than waiting on the lazy observer. */}
          <PostBanner
            post={post}
            alt={post.title}
            priority
            sizes="(min-width: 768px) 48rem, 100vw"
            className="mt-8 rounded-2xl"
          />

          <p className="mt-8 text-lg leading-relaxed text-muted-foreground text-balance">
            {post.excerpt}
          </p>

          <div className="mt-10">
            <MdxContent source={post.content} />
          </div>
        </article>

        <div className="mt-16 rounded-2xl border border-border bg-card p-7">
          <p className="text-lg font-medium">See it running in your studio</p>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Fifteen minutes, your diary, your treatments.{" "}
            <Link
              href="/contact"
              className="font-medium text-accent underline underline-offset-4"
            >
              Book a walkthrough
            </Link>
            .
          </p>
        </div>
      </Container>
    </Section>
  )
}
