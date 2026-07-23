import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

import { buildMetadata } from "@/lib/seo"
import { sortedPosts } from "@/content/blog"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Container } from "@/components/primitives/container"
import { Section } from "@/components/primitives/section"
import { Eyebrow } from "@/components/primitives/section-heading"
import { GradientMesh } from "@/components/motion/gradient-mesh"
import { BlogList, PostMeta } from "@/components/sections/blog-list"

export const metadata = buildMetadata({
  title: "Journal and product updates",
  description:
    "Release notes, front-of-house craft and retention notes from the team setting Aurelius up in real studios.",
  path: "/blog",
})

export default function BlogPage() {
  // Newest post leads regardless of type; an explicit `featured` flag can
  // override that when a release deserves the slot longer than a week.
  const featured = sortedPosts.find((p) => p.featured) ?? sortedPosts[0]
  const rest = sortedPosts.filter((p) => p.slug !== featured?.slug)

  return (
    <>
      <section className="relative overflow-hidden">
        <GradientMesh rules={false} />

        <Container className="py-16 sm:py-24">
          <div className="flex max-w-2xl flex-col gap-5">
            <Eyebrow>Journal</Eyebrow>
            <h1 className="text-display-md font-medium text-gradient">
              Product updates and notes from the front desk
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground text-balance">
              Everything we ship, plus what we learn setting Aurelius up in real
              studios — the diary, deposits, rebooking, and holding client data
              you would not want leaked.
            </p>
          </div>
        </Container>
      </section>

      <Section spacing="compact" className="pt-0">
        <Container>
          {/* Lead story gets the wide treatment; the rest read as a grid. */}
          {featured ? (
            <Link
              href={`/blog/${featured.slug}`}
              className={cn(
                "group grid gap-8 rounded-2xl border border-border bg-card p-7 shadow-xs sm:p-9 lg:grid-cols-12",
                "transition-[border-color,box-shadow,transform] duration-[--duration-base] ease-[--ease-out]",
                "hover:-translate-y-1 hover:border-accent/40 hover:shadow-md motion-reduce:hover:translate-y-0",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
              )}
            >
              <div className="flex flex-col gap-4 lg:col-span-8">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="accent" className="gap-1">
                    <Sparkles aria-hidden className="size-3" />
                    {featured.version ? `Latest release · ${featured.version}` : "Latest"}
                  </Badge>
                  <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-muted-foreground uppercase">
                    {featured.category}
                  </span>
                </div>

                <h2 className="text-display-sm font-semibold tracking-[-0.03em] transition-colors group-hover:text-accent">
                  {featured.title}
                </h2>

                <p className="max-w-xl leading-relaxed text-muted-foreground">
                  {featured.excerpt}
                </p>

                <PostMeta post={featured} className="mt-1" />
              </div>

              <div className="flex items-end lg:col-span-4 lg:justify-end">
                <span className="flex items-center gap-2 text-sm font-medium text-accent">
                  Read the post
                  <ArrowRight
                    aria-hidden
                    className="size-4 transition-transform duration-[--duration-fast] group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
                  />
                </span>
              </div>
            </Link>
          ) : null}

          <div className="mt-12">
            <BlogList posts={rest} />
          </div>
        </Container>
      </Section>
    </>
  )
}
