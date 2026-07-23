import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock } from "lucide-react"

import { buildMetadata } from "@/lib/seo"
import { blogPosts } from "@/content/blog"
import { Badge } from "@/components/ui/badge"
import { Container } from "@/components/primitives/container"
import { Section } from "@/components/primitives/section"

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) return buildMetadata({ title: "Post not found", noIndex: true })

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
  })
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)

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

          <p className="mt-8 text-lg leading-relaxed text-muted-foreground text-balance">
            {post.excerpt}
          </p>

          {/* Body copy lands here once posts move to MDX. Until then the page
              exists so the index has somewhere real to link to. */}
          <p className="mt-6 leading-relaxed text-muted-foreground">
            The full article is being prepared. In the meantime,{" "}
            <Link
              href="/contact"
              className="font-medium text-accent underline underline-offset-4"
            >
              book a demo
            </Link>{" "}
            and we will walk you through it directly.
          </p>
        </article>
      </Container>
    </Section>
  )
}
