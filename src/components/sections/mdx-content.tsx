import Image from "next/image"
import Link from "next/link"
import { MDXRemote } from "next-mdx-remote/rsc"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"

import { cn } from "@/lib/utils"

/**
 * Markdown elements are mapped to the design system by hand rather than a
 * prose plugin, so a post looks like the rest of the site and writers never
 * touch a class name.
 */
const components = {
  h2: ({ className, ...props }: React.ComponentProps<"h2">) => (
    <h2
      className={cn(
        "mt-12 scroll-mt-24 text-2xl font-semibold tracking-[-0.02em] first:mt-0",
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.ComponentProps<"h3">) => (
    <h3
      className={cn("mt-9 scroll-mt-24 text-lg font-semibold", className)}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.ComponentProps<"p">) => (
    <p className={cn("mt-5 leading-relaxed text-muted-foreground", className)} {...props} />
  ),
  ul: ({ className, ...props }: React.ComponentProps<"ul">) => (
    <ul
      className={cn(
        "mt-5 flex list-disc flex-col gap-2 pl-5 leading-relaxed text-muted-foreground marker:text-accent",
        className
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }: React.ComponentProps<"ol">) => (
    <ol
      className={cn(
        "mt-5 flex list-decimal flex-col gap-2 pl-5 leading-relaxed text-muted-foreground marker:text-accent",
        className
      )}
      {...props}
    />
  ),
  strong: ({ className, ...props }: React.ComponentProps<"strong">) => (
    <strong className={cn("font-semibold text-foreground", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.ComponentProps<"blockquote">) => (
    <blockquote
      className={cn(
        "mt-7 border-l-2 border-accent pl-5 text-lg leading-relaxed text-foreground italic",
        className
      )}
      {...props}
    />
  ),
  hr: ({ className, ...props }: React.ComponentProps<"hr">) => (
    <hr className={cn("my-12 border-border", className)} {...props} />
  ),
  a: ({ href = "", className, ...props }: React.ComponentProps<"a">) => {
    const external = /^https?:\/\//.test(href)
    const classes = cn(
      "font-medium text-accent underline underline-offset-4 transition-colors hover:text-foreground",
      className
    )

    return external ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...props}
      />
    ) : (
      <Link href={href} className={classes} {...props} />
    )
  },
  // Images live in `src/content/blog/images/` next to the posts, and are
  // referenced as `/blog/images/name.jpg` — see the route of that name.
  //
  // Deliberately not a <figure>/<figcaption>: markdown wraps a lone image in a
  // paragraph, and a figure inside a <p> is invalid HTML that the browser
  // re-parents, which breaks hydration. Spans set to `display: block` give the
  // same layout with markup that is legal where it lands.
  //
  // Alt text does double duty — it is the visible caption and the description
  // read aloud. An empty alt means the image is decorative: no caption, and
  // nothing announced.
  img: ({ src, alt = "" }: React.ComponentProps<"img">) => (
    <span className="mt-8 block">
      <Image
        src={typeof src === "string" ? src : ""}
        alt={alt}
        width={1600}
        height={900}
        sizes="(min-width: 768px) 48rem, 100vw"
        className="w-full rounded-xl border border-border"
      />
      {alt ? (
        <span
          aria-hidden
          className="mt-3 block text-sm leading-relaxed text-muted-foreground"
        >
          {alt}
        </span>
      ) : null}
    </span>
  ),
  code: ({ className, ...props }: React.ComponentProps<"code">) => (
    <code
      className={cn(
        "rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground",
        className
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }: React.ComponentProps<"pre">) => (
    <pre
      className={cn(
        "mt-6 overflow-x-auto rounded-xl border border-border bg-muted p-5 font-mono text-sm",
        className
      )}
      {...props}
    />
  ),
  table: ({ className, ...props }: React.ComponentProps<"table">) => (
    <div className="mt-7 overflow-x-auto">
      <table className={cn("w-full text-left text-sm", className)} {...props} />
    </div>
  ),
  th: ({ className, ...props }: React.ComponentProps<"th">) => (
    <th
      className={cn("border-b border-border py-2 pr-4 font-medium", className)}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.ComponentProps<"td">) => (
    <td
      className={cn("border-b border-border py-2 pr-4 text-muted-foreground", className)}
      {...props}
    />
  ),
}

export function MdxContent({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          // GFM for tables and strikethrough; slugged headings so a section
          // can be linked to directly.
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug],
        },
      }}
    />
  )
}
