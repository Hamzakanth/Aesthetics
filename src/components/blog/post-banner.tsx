import Image from "next/image"
import {
  Building2,
  Phone,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react"

import type { BlogCategory, BlogPost } from "@/content/blog"
import { cn } from "@/lib/utils"

/**
 * Banner artwork for a post. Real images win; when a post ships without one
 * the category paints its own gradient instead, so the grid never has a hole
 * in it and a reader can tell a release note from a case study before reading
 * a word.
 *
 * The palette stays inside the Quiet Luxury range — a single hue per category,
 * kept low-saturation so six cards side by side still read as one page.
 */
type Art = {
  /** Two stops, light theme. */
  from: string
  to: string
  /** Same hue, dimmed for the dark ground. */
  darkFrom: string
  darkTo: string
  /** Colour of the watermark and the drifting shapes. */
  ink: string
  icon: LucideIcon
}

const ART: Record<BlogCategory, Art> = {
  "Product update": {
    from: "oklch(0.96 0.035 82)",
    to: "oklch(0.90 0.070 78)",
    darkFrom: "oklch(0.32 0.030 82)",
    darkTo: "oklch(0.25 0.045 78)",
    ink: "oklch(0.55 0.095 72)",
    icon: Sparkles,
  },
  "Front of house": {
    from: "oklch(0.96 0.025 40)",
    to: "oklch(0.90 0.050 28)",
    darkFrom: "oklch(0.32 0.025 40)",
    darkTo: "oklch(0.25 0.038 28)",
    ink: "oklch(0.56 0.075 30)",
    icon: Phone,
  },
  Retention: {
    from: "oklch(0.96 0.025 155)",
    to: "oklch(0.89 0.048 158)",
    darkFrom: "oklch(0.31 0.026 155)",
    darkTo: "oklch(0.24 0.038 158)",
    ink: "oklch(0.54 0.070 158)",
    icon: RefreshCw,
  },
  "Case study": {
    from: "oklch(0.96 0.022 60)",
    to: "oklch(0.89 0.045 48)",
    darkFrom: "oklch(0.31 0.024 60)",
    darkTo: "oklch(0.24 0.036 48)",
    ink: "oklch(0.55 0.070 52)",
    icon: TrendingUp,
  },
  "Client data": {
    from: "oklch(0.96 0.025 285)",
    to: "oklch(0.89 0.050 280)",
    darkFrom: "oklch(0.32 0.028 285)",
    darkTo: "oklch(0.25 0.042 280)",
    ink: "oklch(0.56 0.080 282)",
    icon: ShieldCheck,
  },
  Company: {
    from: "oklch(0.96 0.012 250)",
    to: "oklch(0.89 0.022 245)",
    darkFrom: "oklch(0.31 0.014 250)",
    darkTo: "oklch(0.24 0.022 245)",
    ink: "oklch(0.54 0.035 248)",
    icon: Building2,
  },
}

/** Deterministic 0–1 from the slug, so a post's shapes never move between builds. */
function seed(slug: string) {
  let h = 0
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) % 9973
  return h / 9973
}

export function PostBanner({
  post,
  className,
  sizes,
  priority,
  alt,
}: {
  post: BlogPost
  className?: string
  sizes?: string
  /** The banner above the fold on a post page skips the lazy observer. */
  priority?: boolean
  /**
   * Alt text. Cards pass nothing and get `""` — the title sits right below,
   * so describing the banner would announce the link twice. Standalone
   * banners pass the title.
   */
  alt?: string
}) {
  const shape = cn("aspect-[16/9] w-full overflow-hidden rounded-lg border border-border", className)

  if (post.image) {
    return (
      <Image
        src={post.image}
        alt={post.imageAlt ?? alt ?? ""}
        width={1600}
        height={900}
        sizes={sizes}
        priority={priority}
        className={cn(shape, "object-cover")}
      />
    )
  }

  const art = ART[post.category]
  const Icon = art.icon
  const n = seed(post.slug)
  // Two blobs, nudged by the slug so no two fallbacks in a row look identical.
  const x1 = 18 + n * 26
  const y1 = 22 + n * 18
  const x2 = 68 + (1 - n) * 20
  const y2 = 70 - n * 22

  return (
    <div
      aria-hidden
      className={cn(shape, "relative isolate")}
      style={
        {
          "--art-from": art.from,
          "--art-to": art.to,
          "--art-dark-from": art.darkFrom,
          "--art-dark-to": art.darkTo,
          "--art-ink": art.ink,
          backgroundImage:
            `radial-gradient(60% 70% at ${x1}% ${y1}%, color-mix(in oklab, var(--art-ink) 16%, transparent), transparent 70%),` +
            `radial-gradient(50% 60% at ${x2}% ${y2}%, color-mix(in oklab, #fff 55%, transparent), transparent 72%),` +
            `linear-gradient(135deg, var(--art-from), var(--art-to))`,
        } as React.CSSProperties
      }
    >
      {/* Dark theme repaints the same hue rather than dimming the whole tile,
          which would grey the accent out. */}
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          backgroundImage:
            `radial-gradient(60% 70% at ${x1}% ${y1}%, color-mix(in oklab, var(--art-ink) 26%, transparent), transparent 70%),` +
            `linear-gradient(135deg, var(--art-dark-from), var(--art-dark-to))`,
        }}
      />

      {/* Fine grid, barely there — keeps a large flat tile from looking empty. */}
      <div
        className="absolute inset-0 opacity-[0.10] dark:opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px)," +
            "linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          color: "var(--art-ink)",
          maskImage: "radial-gradient(80% 80% at 50% 50%, #000, transparent)",
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <Icon
          className="size-14 opacity-45 sm:size-16 dark:opacity-60"
          strokeWidth={1.25}
          style={{ color: "var(--art-ink)" }}
        />
      </div>

      <span
        className="absolute right-4 bottom-3 font-mono text-[0.625rem] tracking-[0.16em] uppercase opacity-55 dark:opacity-70"
        style={{ color: "var(--art-ink)" }}
      >
        {post.category}
      </span>
    </div>
  )
}
