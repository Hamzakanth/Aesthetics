"use client"

import * as React from "react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Variants,
} from "framer-motion"
import { Pause, Play, Star } from "lucide-react"

import type { ScreenLine } from "@/types"
import { features, featureScreens } from "@/content/features"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

/**
 * The six jobs, shown the way Apple shows a feature: not as a card, but as the
 * thing actually happening inside the device it happens on. This product lives
 * in DMs, WhatsApp and texts, so the device is a phone, and each job plays out
 * as a real client exchange that populates the screen line by line.
 *
 * Interaction budget, in the site's house style:
 *  - Pick a job on the left; the phone re-plays that job's script.
 *  - It also auto-advances, with a per-item progress bar and a pause control
 *    (WCAG 2.2.2 — anything moving > 5s needs one). Autoplay pauses under the
 *    cursor or keyboard focus and never stops permanently on a manual pick.
 *  - The phone tilts toward the pointer in a shallow 3D field for depth.
 * Everything degrades to a clean crossfade under prefers-reduced-motion.
 */

// Must stay in step with the `dot-progress` keyframe (globals.css, 4.5s) so
// the progress fill lands exactly on the advance.
const AUTOPLAY_DELAY = 4500

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
function ScreenLineView({ line }: { line: ScreenLine }) {
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

/** Minimal phone status-bar glyphs — enough to read as iOS, no more. */
function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3.5 pb-1 text-[0.625rem] font-semibold text-foreground">
      <span className="tabular-nums">9:41</span>
      <div className="flex items-center gap-1">
        <span className="flex items-end gap-px" aria-hidden>
          {[2, 3, 4, 5].map((h) => (
            <span
              key={h}
              className="w-0.5 rounded-full bg-foreground"
              style={{ height: `${h}px` }}
            />
          ))}
        </span>
        {/* Battery */}
        <span
          aria-hidden
          className="ml-0.5 flex h-2.5 w-5 items-center rounded-[3px] border border-foreground/70 px-px"
        >
          <span className="h-1.5 w-3/4 rounded-[1px] bg-foreground" />
        </span>
      </div>
    </div>
  )
}

export function FeatureShowcase() {
  const shouldReduceMotion = useReducedMotion()
  const [selected, setSelected] = React.useState(0)
  // The user's explicit intent (the pause button). Actual motion also depends
  // on hover/focus and the OS setting — see `playing` below.
  const [wantsPlay, setWantsPlay] = React.useState(true)
  const [isHovering, setIsHovering] = React.useState(false)

  const playing = wantsPlay && !isHovering && !shouldReduceMotion

  // `features` is a fixed, non-empty list and `selected` is always a valid
  // index, so the fallbacks only exist to satisfy noUncheckedIndexedAccess.
  const active = features[selected] ?? features[0]!
  const screen = featureScreens[active.id] ?? featureScreens[features[0]!.id]!

  // Auto-advance. Depending on `selected` restarts the timer whenever the user
  // makes a manual pick, so their choice gets a full interval before moving on.
  React.useEffect(() => {
    if (!playing) return
    const id = window.setTimeout(() => {
      setSelected((s) => (s + 1) % features.length)
    }, AUTOPLAY_DELAY)
    return () => window.clearTimeout(id)
  }, [playing, selected])

  // Pointer-driven 3D tilt. Springs so the phone eases toward the cursor
  // rather than snapping, and returns to rest when the pointer leaves.
  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)
  const spring = { stiffness: 140, damping: 18, mass: 0.4 }
  const rotateX = useSpring(tiltX, spring)
  const rotateY = useSpring(tiltY, spring)

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    tiltY.set(px * 12)
    tiltX.set(-py * 12)
  }

  const resetTilt = () => {
    tiltX.set(0)
    tiltY.set(0)
  }

  return (
    <div
      className="mt-14"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onFocusCapture={() => setIsHovering(true)}
      onBlurCapture={() => setIsHovering(false)}
    >
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
        {/* ---- Selectable job list ---- */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
              Pick a job
            </span>
            {!shouldReduceMotion ? (
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => setWantsPlay((p) => !p)}
                aria-label={
                  wantsPlay
                    ? "Pause automatic walkthrough"
                    : "Play automatic walkthrough"
                }
              >
                {wantsPlay ? <Pause /> : <Play />}
              </Button>
            ) : null}
          </div>

          <ul className="flex flex-col gap-1.5">
            {features.map((feature, index) => {
              const Icon = feature.icon
              const isActive = index === selected
              return (
                <li key={feature.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(index)}
                    aria-pressed={isActive}
                    className={cn(
                      "group w-full cursor-pointer rounded-xl border p-4 text-left",
                      "transition-[border-color,background-color,box-shadow] duration-[--duration-base] ease-[--ease-out]",
                      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                      isActive
                        ? "border-accent/40 bg-card shadow-sm"
                        : "border-transparent hover:border-border hover:bg-card/60"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-lg border",
                          "transition-colors duration-[--duration-base]",
                          isActive
                            ? "border-accent/40 bg-accent-subtle"
                            : "border-border bg-background"
                        )}
                      >
                        <Icon
                          aria-hidden
                          className={cn(
                            "size-[1.1rem] transition-colors duration-[--duration-base]",
                            isActive ? "text-accent" : "text-muted-foreground"
                          )}
                        />
                      </span>
                      <span
                        className={cn(
                          "text-sm font-semibold transition-colors duration-[--duration-base]",
                          isActive ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {feature.title}
                      </span>
                    </span>

                    {/* The active job expands to its detail and a progress
                        bar; the others stay one clean line. */}
                    <AnimatePresence initial={false}>
                      {isActive ? (
                        <motion.div
                          key="detail"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="pt-3 pl-12 text-sm leading-relaxed text-muted-foreground">
                            {feature.description}
                          </p>
                          <span className="mt-3 flex items-center gap-2 pl-12 text-sm font-medium text-accent">
                            <span aria-hidden className="h-px w-5 bg-accent" />
                            {feature.impact}
                          </span>

                          <span className="mt-3 ml-12 block h-0.5 overflow-hidden rounded-full bg-border">
                            <span
                              key={`${active.id}-${String(playing)}`}
                              className={cn(
                                "block h-full origin-left rounded-full bg-accent",
                                playing ? "animate-dot-progress" : "scale-x-100"
                              )}
                            />
                          </span>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* ---- Phone ---- */}
        <div
          className="relative mx-auto w-full max-w-[19rem] [perspective:1400px]"
          onPointerMove={handlePointerMove}
          onPointerLeave={resetTilt}
        >
          {/* Warm glow, so the device sits in light rather than on a flat plane. */}
          <div
            aria-hidden
            className="absolute -inset-10 -z-10 rounded-[50%] bg-accent/15 opacity-70 blur-3xl"
          />

          <motion.div
            animate={shouldReduceMotion ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
          >
            <motion.div
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
              className={cn(
                "relative rounded-[2.6rem] border border-border/80 p-2 shadow-2xl",
                "bg-gradient-to-b from-secondary to-muted"
              )}
            >
              {/* Screen */}
              <div
                aria-hidden
                className="relative flex min-h-[30rem] flex-col overflow-hidden rounded-[2.1rem] bg-background ring-1 ring-black/5"
              >
                {/* Dynamic island */}
                <span className="absolute top-2 left-1/2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-[#0b0b0c]" />

                <StatusBar />

                {/* App bar */}
                <div className="mt-1 flex items-center gap-2.5 border-b border-border px-4 pb-2.5">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-accent-subtle">
                    <screen.appIcon aria-hidden className="size-4 text-accent" />
                  </span>
                  <span className="text-[0.8125rem] font-semibold">{screen.app}</span>
                  <span className="ml-auto flex items-center gap-1.5 font-mono text-[0.5625rem] tracking-wider text-muted-foreground uppercase">
                    <span className="size-1.5 rounded-full bg-success" />
                    Live
                  </span>
                </div>

                {/* Conversation body — replays whenever the job changes. */}
                <div className="flex-1 px-4 py-4">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={active.id}
                      variants={screenContainer}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      className="flex flex-col gap-2.5"
                    >
                      {screen.lines.map((line, i) => (
                        <motion.div
                          key={`${active.id}-${i}`}
                          variants={shouldReduceMotion ? reducedLine : lineVariant}
                        >
                          <ScreenLineView line={line} />
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Home indicator */}
                <span className="mx-auto mb-2 h-1 w-28 self-center rounded-full bg-foreground/25" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Screen-reader narration of the selected job, since the phone itself is
          decorative. Mirrors the list, so nothing is only shown visually. */}
      <p aria-live="polite" aria-atomic className="sr-only">
        {`${active.title}. ${active.description} ${active.impact}.`}
      </p>
    </div>
  )
}
