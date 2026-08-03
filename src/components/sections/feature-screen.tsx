"use client"

import * as React from "react"
import { AnimatePresence, motion, type Variants } from "framer-motion"
import { Star } from "lucide-react"

import type { FeatureScreen, ScreenLine } from "@/types"
import { cn } from "@/lib/utils"

/**
 * The phone screen content, shared by the desktop showcase and the mobile
 * carousel. Both surfaces play the same script; only the chrome around it
 * differs (a full device on desktop, a bare panel on a phone — see
 * `feature-showcase-mobile.tsx` for why).
 */

const screenContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.32, delayChildren: 0.12 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
}

const lineVariant: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
  },
}

const reducedLine: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
}

/** One rendered line of the phone conversation. */
export function ScreenLineView({ line }: { line: ScreenLine }) {
  switch (line.kind) {
    case "in":
      return (
        <div className="flex flex-col items-start gap-1">
          {line.via ? (
            <span className="px-1 text-[0.625rem] font-medium text-muted-foreground">
              {line.via}
            </span>
          ) : null}
          <p className="max-w-[85%] rounded-2xl rounded-bl-md bg-muted px-3.5 py-2 text-[0.8125rem] leading-snug text-foreground">
            {line.text}
          </p>
        </div>
      )

    case "out":
      return (
        <div className="flex justify-end">
          <p className="max-w-[85%] rounded-2xl rounded-br-md bg-accent px-3.5 py-2 text-[0.8125rem] leading-snug text-accent-foreground shadow-sm">
            {line.text}
          </p>
        </div>
      )

    case "typing":
      return (
        <div className="flex">
          <span className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-muted px-4 py-3">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 motion-reduce:animate-none"
                style={{ animationDelay: `${dot * 0.15}s` }}
              />
            ))}
          </span>
        </div>
      )

    case "status": {
      const Icon = line.icon
      const tone = line.tone ?? "done"
      return (
        <div
          className={cn(
            "flex items-center gap-2 rounded-xl border px-3 py-2 text-[0.75rem] font-medium",
            tone === "accent"
              ? "border-accent/35 bg-accent-subtle text-foreground"
              : tone === "pending"
                ? "border-border bg-background text-muted-foreground"
                : "border-success/30 bg-success/10 text-foreground"
          )}
        >
          {Icon ? (
            <Icon
              className={cn(
                "size-3.5 shrink-0",
                tone === "accent"
                  ? "text-accent"
                  : tone === "pending"
                    ? "text-muted-foreground"
                    : "text-success"
              )}
            />
          ) : null}
          <span className="truncate">{line.text}</span>
        </div>
      )
    }

    case "chip":
      return (
        <div className="flex justify-center">
          <span className="rounded-full border border-border bg-background px-3 py-1 font-mono text-[0.6875rem] tracking-wide text-muted-foreground">
            {line.text}
          </span>
        </div>
      )

    case "stars":
      return (
        <div className="flex justify-end gap-0.5">
          {Array.from({ length: line.count ?? 5 }).map((_, star) => (
            <Star key={star} aria-hidden className="size-4 fill-accent text-accent" />
          ))}
        </div>
      )
  }
}

/** The app bar above the conversation: which inbox this job happens in. */
export function ScreenAppBar({
  screen,
  className,
}: {
  screen: FeatureScreen
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 border-b border-border px-4 pb-2.5",
        className
      )}
    >
      <span className="flex size-7 items-center justify-center rounded-lg bg-accent-subtle">
        <screen.appIcon aria-hidden className="size-4 text-accent" />
      </span>
      <span className="text-[0.8125rem] font-semibold">{screen.app}</span>
      <span className="ml-auto flex items-center gap-1.5 font-mono text-[0.5625rem] tracking-wider text-muted-foreground uppercase">
        <span className="size-1.5 rounded-full bg-success" />
        Live
      </span>
    </div>
  )
}

/**
 * The conversation body. Keyed on the job id so switching jobs replays the
 * script line by line rather than swapping text in place.
 */
export function ScreenConversation({
  jobId,
  screen,
  reducedMotion,
  className,
}: {
  jobId: string
  screen: FeatureScreen
  reducedMotion: boolean | null
  className?: string
}) {
  return (
    <div className={cn("flex-1 px-4 py-4", className)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={jobId}
          variants={screenContainer}
          initial="hidden"
          animate="show"
          exit="exit"
          className="flex flex-col gap-2.5"
        >
          {screen.lines.map((line, i) => (
            <motion.div
              key={`${jobId}-${i}`}
              variants={reducedMotion ? reducedLine : lineVariant}
            >
              <ScreenLineView line={line} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
