"use client"

import * as React from "react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion"
import { Pause, Play } from "lucide-react"

import { features, featureScreens } from "@/content/features"
import { useIsDesktop } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  ScreenAppBar,
  ScreenConversation,
} from "@/components/sections/feature-screen"

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
 *
 * This is the wide-screen layout only. The control/display split it is built
 * on does not survive a 390px viewport — see `feature-showcase-mobile.tsx`,
 * which pages the same content instead of stacking it.
 */

// Must stay in step with the `dot-progress` keyframe (globals.css, 4.5s) so
// the progress fill lands exactly on the advance.
const AUTOPLAY_DELAY = 4500

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
  const isDesktop = useIsDesktop()
  const [selected, setSelected] = React.useState(0)
  // The user's explicit intent (the pause button). Actual motion also depends
  // on hover/focus and the OS setting — see `playing` below.
  const [wantsPlay, setWantsPlay] = React.useState(true)
  const [isHovering, setIsHovering] = React.useState(false)

  // `isDesktop` because this layout stays mounted (CSS-hidden) on a phone,
  // where the mobile carousel is the one actually on screen.
  const playing = wantsPlay && isDesktop && !isHovering && !shouldReduceMotion

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
      className="mt-14 hidden lg:block"
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

                <ScreenAppBar screen={screen} className="mt-1" />

                {/* Conversation body — replays whenever the job changes. */}
                <ScreenConversation
                  jobId={active.id}
                  screen={screen}
                  reducedMotion={shouldReduceMotion}
                />

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
