"use client"

import * as React from "react"

/**
 * SSR-safe media query. Uses useSyncExternalStore so the value is never
 * read during render on the server — that is what causes hydration
 * mismatches in the usual useEffect implementation.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query)
      list.addEventListener("change", onChange)
      return () => list.removeEventListener("change", onChange)
    },
    [query]
  )

  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  )
}

export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)")
