"use client"

import * as React from "react"

/**
 * True once the page has scrolled past `threshold` px.
 * Listener is passive and state only flips on a crossing, so the header
 * does not re-render on every scroll frame.
 */
export function useScrollThreshold(threshold = 8): boolean {
  const [crossed, setCrossed] = React.useState(false)

  React.useEffect(() => {
    const update = () => setCrossed(window.scrollY > threshold)
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [threshold])

  return crossed
}
