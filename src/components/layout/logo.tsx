import * as React from "react"
import Image from "next/image"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

import wordmark from "@/assets/aurelius-wordmark.png"

/**
 * Brand wordmark.
 *
 * The supplied asset already contains the name, so there is no separate text
 * label — rendering both would print "Aurelius" twice. The accessible name is
 * carried by the image's alt text instead.
 *
 * Sized by height so it sits on the same optical baseline as the nav links
 * regardless of the source file's aspect ratio.
 */
function Logo({
  className,
  href = "/",
  tone = "brand",
  ...props
}: Omit<React.ComponentProps<typeof Link>, "href"> & {
  href?: string
  /**
   * `inverted` knocks the wordmark out to solid white for use on a brand or
   * ink surface. The asset is a PNG, so this is a filter rather than a second
   * file — one less thing to keep in sync when the mark changes.
   */
  tone?: "brand" | "inverted"
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex shrink-0 items-center rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        className
      )}
      {...props}
    >
      <Image
        src={wordmark}
        alt={`${siteConfig.name} — home`}
        priority
        // Intrinsic height caps the rendered size so the browser never
        // upscales; width auto keeps the aspect ratio and avoids CLS.
        className={cn(
          "h-9 w-auto sm:h-10",
          "transition-transform duration-[--duration-base] ease-[--ease-out]",
          "group-hover:scale-[1.03] motion-reduce:group-hover:scale-100",
          tone === "inverted" && "brightness-0 invert"
        )}
      />
    </Link>
  )
}

export { Logo }
