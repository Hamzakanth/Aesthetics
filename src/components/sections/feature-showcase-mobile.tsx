"use client"

import * as React from "react"
import { useReducedMotion } from "framer-motion"
import { ChevronRight } from "lucide-react"

import { features, featureScreens } from "@/content/features"
import { cn } from "@/lib/utils"
import {
  ScreenAppBar,
  ScreenConversation,
} from "@/components/sections/feature-screen"

/**
 * The five jobs on a phone.
 *
 * The desktop showcase is a two-column control/display split: pick a job in
 * the left column, watch it play in the device on the right. At 390px that
 * split stacks, which puts the control a full viewport above its own output —
 * so choosing a job meant scrolling down to see the result, then back up to
 * choose the next one. Five jobs, ten scroll trips.
 *
 * The fix is to stop stacking and start paging. Each job becomes one
 * self-contained card — headline, what it does, the outcome, and the screen it
 * happens on — sized to sit inside one phone viewport. You swipe sideways
 * between jobs (native scroll-snap, the gesture people already use on a
 * phone), or jump straight to one from the chip rail above. The control and
 * the result are never more than a thumb apart, and the whole section costs
 * one screenful of vertical scroll instead of six.
 *
 * Two deliberate subtractions from the desktop version:
 *  - No device bezel. The dynamic island, status bar and home indicator are
 *    ~90px of pure decoration; on a real phone the surrounding hardware is
 *    already the bezel, so a drawn one reads as a screenshot of a phone rather
 *    than the thing itself.
 *  - No autoplay, and so no play/pause control. Nothing advances on its own,
 *    which means nothing needs a stop button (WCAG 2.2.2 stops applying) and
 *    the rail never moves under the reader's thumb. The cost is that "there
 *    are four more of these" has to be carried entirely by the design, so it
 *    is stated three ways: each card stops short of the edge so the next one
 *    is visibly there, the chip rail names all five, and the footer counts
 *    them with an explicit swipe hint.
 */

export function FeatureShowcaseMobile() {
  const shouldReduceMotion = useReducedMotion()
  const [selected, setSelected] = React.useState(0)

  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const chipsRef = React.useRef<HTMLDivElement>(null)

  // Only used to narrate the current slide — each card renders its own screen.
  const active = features[selected] ?? features[0]!

  /**
   * Slides no longer fill the scroller, so their pitch is card width + gap
   * rather than clientWidth. Measured off the DOM instead of recomputed from
   * the class names, so the two can't disagree.
   */
  const slideMetrics = (el: HTMLElement) => {
    const first = el.children[0]
    const second = el.children[1]
    if (!(first instanceof HTMLElement)) return null
    const pitch =
      second instanceof HTMLElement
        ? second.offsetLeft - first.offsetLeft
        : el.clientWidth
    return pitch > 0 ? { origin: first.offsetLeft, pitch } : null
  }

  // Keep the rail on the selected slide. Skipped when it is already roughly in
  // place, which is exactly the case when the change *came* from a swipe —
  // that is what stops the two from chasing each other.
  React.useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const m = slideMetrics(el)
    if (!m) return

    const target = selected * m.pitch
    if (Math.abs(el.scrollLeft - target) < m.pitch * 0.5) return

    el.scrollTo({
      left: target,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    })
  }, [selected, shouldReduceMotion])

  // Five chips are wider than a phone, so the rail centres the active one.
  // Without this, swiping to a later job leaves its chip off screen and the
  // rail stops telling you where you are.
  React.useEffect(() => {
    const rail = chipsRef.current
    const chip = rail?.children[selected]
    if (!rail || !(chip instanceof HTMLElement)) return

    rail.scrollTo({
      left: chip.offsetLeft - (rail.clientWidth - chip.clientWidth) / 2,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    })
  }, [selected, shouldReduceMotion])

  const handleScroll = () => {
    const el = scrollerRef.current
    if (!el) return
    const m = slideMetrics(el)
    if (!m) return

    const index = Math.min(
      features.length - 1,
      Math.max(0, Math.round(el.scrollLeft / m.pitch))
    )
    if (index !== selected) setSelected(index)
  }

  return (
    <div className="mt-10 lg:hidden">
      {/* ---- Chip rail: direct access to any job, one tap ---- */}
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
        <div
          ref={chipsRef}
          role="group"
          aria-label="Pick a job"
          className="no-scrollbar flex gap-2 overflow-x-auto pb-1"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isActive = index === selected
            return (
              <button
                key={feature.id}
                type="button"
                onClick={() => setSelected(index)}
                aria-current={isActive}
                className={cn(
                  "flex shrink-0 cursor-pointer items-center gap-2 rounded-full border py-2 pr-4 pl-2.5",
                  "text-[0.8125rem] font-semibold whitespace-nowrap",
                  "transition-colors duration-[--duration-base] ease-[--ease-out]",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  isActive
                    ? "border-accent/40 bg-accent-subtle text-foreground"
                    : "border-border bg-card text-muted-foreground"
                )}
              >
                <Icon
                  aria-hidden
                  className={cn(
                    "size-4 shrink-0",
                    isActive ? "text-accent" : "text-muted-foreground"
                  )}
                />
                {feature.eyebrow}
              </button>
            )
          })}
        </div>
      </div>

      {/* ---- Swipeable job cards ---- */}
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        role="group"
        aria-roledescription="carousel"
        aria-label="What each job looks like"
        tabIndex={0}
        className={cn(
          "no-scrollbar -mx-4 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-4 scroll-px-4",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        )}
      >
        {features.map((feature, index) => {
          const jobScreen = featureScreens[feature.id]
          if (!jobScreen) return null

          return (
            <div
              key={feature.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${features.length}: ${feature.title}`}
              /* Stops short of the viewport so the next card's edge is always
                 visible — the swipe affordance that costs no chrome. The last
                 slide carries the missing width as margin so it can still
                 snap flush to the left. */
              className="w-[86%] shrink-0 snap-start last:mr-[14%] sm:w-[68%] sm:last:mr-[32%]"
            >
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
                <div className="px-4 pt-4 pb-3.5">
                  <h3 className="text-[1.0625rem] leading-snug font-semibold text-balance text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                  <p className="mt-3 flex items-center gap-2 text-[0.8125rem] font-medium text-accent">
                    <span aria-hidden className="h-px w-5 shrink-0 bg-accent" />
                    {feature.impact}
                  </p>
                </div>

                {/* The screen, bezel-free — the phone in your hand is the
                    bezel. All five cards share the tallest one's height so the
                    rail never reflows mid-swipe, and `flex-1` runs the screen
                    colour to the bottom edge on the shorter scripts rather
                    than leaving a slab of card under it. */}
                <div className="flex min-h-[17rem] flex-1 flex-col border-t border-border bg-background pt-3">
                  <ScreenAppBar screen={jobScreen} />
                  <ScreenConversation
                    jobId={feature.id}
                    screen={jobScreen}
                    reducedMotion={shouldReduceMotion}
                  />
                </div>
              </article>
            </div>
          )
        })}
      </div>

      {/*
        ---- Position + swipe hint ----
        Nothing moves on its own any more, so this row's whole job is to say
        "there are more of these, and you get to them by swiping". The dots
        give the count and the position, the words give the gesture, and the
        chevron nudges in the direction of travel until you have used it once.
      */}
      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5" aria-hidden>
          {features.map((feature, index) => (
            <span
              key={feature.id}
              className={cn(
                "h-1.5 rounded-full transition-all duration-[--duration-base] ease-[--ease-out]",
                index === selected ? "w-6 bg-accent" : "w-1.5 bg-border"
              )}
            />
          ))}
        </div>

        <p className="flex items-center gap-1.5 text-[0.75rem] font-medium text-muted-foreground">
          <span className="font-mono tracking-[0.12em] uppercase tabular-nums">
            {selected + 1} / {features.length}
          </span>
          {selected < features.length - 1 ? (
            <>
              <span aria-hidden className="text-border">
                ·
              </span>
              <span>Swipe for more</span>
              <ChevronRight
                aria-hidden
                className={cn(
                  "size-3.5 text-accent",
                  // Rests as soon as the reader has swiped once — the nudge is
                  // there to teach the gesture, not to keep selling it.
                  selected === 0 && !shouldReduceMotion && "animate-nudge-x"
                )}
              />
            </>
          ) : null}
        </p>
      </div>

      {/* The screen itself is decorative, so the selected job is narrated. */}
      <p aria-live="polite" aria-atomic className="sr-only">
        {`${active.title}. ${active.description} ${active.impact}.`}
      </p>
    </div>
  )
}
