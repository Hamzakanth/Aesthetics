import * as React from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

/**
 * Brand lockup: a gold hairline monogram followed by the wordmark.
 *
 * Drawn rather than shipped as a raster. The old PNG was a bold blue wordmark
 * with a stethoscope — a medical mark on a beauty-studio brand, and it went
 * soft on retina and could not be recoloured without a filter hack. As live
 * SVG + type it takes the display serif, inherits colour from the tone prop,
 * and stays crisp at any size.
 *
 * The monogram echoes the favicon (serif A, gold satellite dot) so the tab and
 * the header read as one mark.
 */
function Logo({
  className,
  href = "/",
  tone = "brand",
  ...props
}: Omit<React.ComponentProps<typeof Link>, "href"> & {
  href?: string
  /** `inverted` knocks the lockup out to ivory for use on a brand or ink surface. */
  tone?: "brand" | "inverted"
}) {
  return (
    <Link
      href={href}
      aria-label={`${siteConfig.name} — home`}
      className={cn(
        "group flex shrink-0 items-center gap-2.5 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        tone === "inverted" ? "text-primary-foreground" : "text-foreground",
        className
      )}
      {...props}
    >
      <svg
        viewBox="0 0 32 32"
        aria-hidden
        className={cn(
          "h-8 w-8 shrink-0 sm:h-9 sm:w-9",
          "transition-transform duration-[--duration-base] ease-[--ease-out]",
          "group-hover:rotate-[-4deg] motion-reduce:group-hover:rotate-0"
        )}
      >
        {/* Hairline ring — gold is the only accent this brand spends. */}
        <circle
          cx="16"
          cy="16"
          r="15"
          fill="none"
          stroke="var(--gold-500)"
          strokeWidth="1"
        />
        {/* Serif A, drawn as two strokes and a crossbar so the weight matches
            Cormorant rather than the UI sans. */}
        <path
          d="M9.5 23 16 8.6 22.5 23"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.6 18.4h8.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
        {/* Satellite dot: the apex mark from the favicon, held on the ring. */}
        <circle cx="26.4" cy="6.6" r="2.6" fill="var(--gold-500)" />
      </svg>

      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.35rem] leading-none font-medium tracking-[0.14em] sm:text-[1.5rem]">
          AURELIUS
        </span>
        {/* Kicker in the label face, sized down to a hairline so it reads as
            engraving rather than as a second line of copy. */}
        <span className="mt-[0.3em] hidden font-mono text-[0.5rem] tracking-[0.34em] text-current/55 uppercase sm:block">
          Studio Systems
        </span>
      </span>
    </Link>
  )
}

export { Logo }
