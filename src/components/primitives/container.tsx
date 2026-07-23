import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * The single horizontal measure for the whole site. Nothing sets its own
 * max-width — every section composes this, which is what keeps the Swiss
 * grid from drifting section to section.
 */
function Container({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "narrow" | "wide" }) {
  return (
    <div
      data-slot="container"
      className={cn(
        "mx-auto w-full px-5 sm:px-8",
        size === "narrow" && "max-w-3xl",
        size === "default" && "max-w-6xl",
        size === "wide" && "max-w-7xl",
        className
      )}
      {...props}
    />
  )
}

export { Container }
