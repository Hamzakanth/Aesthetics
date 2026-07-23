"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { CircleCheck, CircleDot, TriangleAlert } from "lucide-react"

import type { PanelRowState, ProductPanel } from "@/types"
import { panelNav } from "@/content/how-it-works"
import { cn } from "@/lib/utils"

const GLYPH = {
  done: { icon: CircleCheck, className: "text-success" },
  pending: { icon: CircleDot, className: "text-muted-foreground" },
  attention: { icon: TriangleAlert, className: "text-accent" },
} as const

/** Switch for the workflow rows; glyph for everything else. */
function RowIndicator({ state }: { state: PanelRowState }) {
  if (state === "on" || state === "off") {
    const on = state === "on"
    return (
      <span
        className={cn(
          "relative flex h-4 w-7 shrink-0 items-center rounded-full",
          "transition-colors duration-[--duration-base]",
          on ? "bg-accent" : "bg-border"
        )}
      >
        <span
          className={cn(
            "size-3 rounded-full bg-background shadow-xs",
            "transition-transform duration-[--duration-base] ease-[--ease-out]",
            on ? "translate-x-3.5" : "translate-x-0.5"
          )}
        />
      </span>
    )
  }

  const { icon: Icon, className } = GLYPH[state]
  return <Icon className={cn("size-4 shrink-0", className)} />
}

interface ProductFrameProps {
  panel: ProductPanel
  className?: string
}

/**
 * A DOM-rendered product surface rather than a screenshot: crisp at every
 * density, theme-aware, and zero image bytes. Decorative — hidden from
 * assistive tech, since the real content is the copy beside it.
 *
 * The chrome and sidebar are stable; only the body swaps between steps, so
 * the transition reads as navigating one app rather than cutting between
 * three marketing images.
 */
export function ProductFrame({ panel, className }: ProductFrameProps) {
  const shouldReduceMotion = useReducedMotion()
  const StatIcon = panel.statIcon

  const enter = shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0, filter: "blur(0px)" }
  const exit = shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, y: -8, filter: "blur(4px)" }
  const initial = shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, y: 8, filter: "blur(4px)" }

  return (
    <div
      aria-hidden
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg",
        className
      )}
    >
      {/* Window chrome */}
      <div className="flex h-11 items-center gap-2 border-b border-border bg-muted/50 px-4">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
        </div>
        <div className="mx-auto max-w-[60%] truncate rounded-md bg-background px-3 py-1 font-mono text-[0.6875rem] text-muted-foreground">
          {panel.path}
        </div>
        <span className="hidden items-center gap-1.5 font-mono text-[0.625rem] tracking-wider text-muted-foreground uppercase sm:flex">
          <span className="size-1.5 rounded-full bg-success" />
          Live
        </span>
      </div>

      <div className="grid sm:grid-cols-[11rem_1fr]">
        {/* Sidebar collapses away on small screens rather than squashing. */}
        <aside className="hidden flex-col gap-0.5 border-r border-border p-3 sm:flex">
          {panelNav.map((item, i) => (
            <span
              key={item}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-[0.8125rem]",
                "transition-colors duration-[--duration-base]",
                i === panel.navIndex
                  ? "bg-secondary font-medium text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item}
            </span>
          ))}
        </aside>

        {/* Fixed floor so the frame does not jump as row counts change. Kept
            shorter on mobile, where the panel is pinned above the steps and
            must not eat the viewport. */}
        <div className="flex min-h-[17rem] flex-col p-4 sm:min-h-[21rem] sm:p-5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={panel.path}
              initial={initial}
              animate={enter}
              exit={exit}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-1 flex-col"
            >
              <div className="mb-4 flex items-baseline justify-between gap-3">
                <span className="text-sm font-semibold">{panel.heading}</span>
                <span className="flex shrink-0 items-center gap-1.5 font-mono text-[0.6875rem] tracking-wider text-muted-foreground uppercase">
                  <StatIcon className="size-3 text-accent" />
                  {panel.stat}
                </span>
              </div>

              <ul className="flex flex-col gap-1.5">
                {panel.rows.map((row, i) => (
                  <motion.li
                    key={row.title}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.05 + i * 0.045,
                      duration: 0.3,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border px-3 py-2.5",
                      row.state === "attention"
                        ? "border-accent/35 bg-accent-subtle"
                        : "border-border/70 bg-background",
                      row.state === "off" && "opacity-60"
                    )}
                  >
                    <RowIndicator state={row.state} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[0.8125rem] font-medium text-foreground">
                        {row.title}
                      </p>
                      <p className="truncate text-[0.6875rem] text-muted-foreground">
                        {row.detail}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "hidden shrink-0 font-mono text-[0.6875rem] md:block",
                        row.state === "attention"
                          ? "text-accent"
                          : "text-muted-foreground"
                      )}
                    >
                      {row.meta}
                    </span>
                  </motion.li>
                ))}
              </ul>

              <p className="mt-auto pt-4 text-[0.6875rem] text-muted-foreground">
                {panel.footnote}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
