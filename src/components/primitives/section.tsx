import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Vertical rhythm owner. Sections never set their own padding-block; they
 * pick a spacing step so the page keeps one mathematical scale.
 */
function Section({
  className,
  spacing = "default",
  ...props
}: React.ComponentProps<"section"> & {
  spacing?: "default" | "compact" | "loose" | "none"
}) {
  return (
    <section
      data-slot="section"
      className={cn(
        "relative",
        spacing === "compact" && "py-14 sm:py-16",
        spacing === "default" && "py-20 sm:py-28",
        spacing === "loose" && "py-24 sm:py-36",
        className
      )}
      {...props}
    />
  )
}

export { Section }
