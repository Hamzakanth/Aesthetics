"use client"

import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import AutoScroll from "embla-carousel-auto-scroll"
import { useReducedMotion } from "framer-motion"
import { BadgeCheck, Quote, Star } from "lucide-react"

import { testimonials, trustStats } from "@/content/testimonials"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Container } from "@/components/primitives/container"
import { Section } from "@/components/primitives/section"
import { SectionHeading } from "@/components/primitives/section-heading"

/**
 * Pixels per frame — a velocity, not a delay, since the track glides rather
 * than snaps. Deliberately slow: at 0.6 a card takes the better part of ten
 * seconds to cross, which is a drift you read *against* rather than one you
 * chase. Anything past ~1 starts to feel frantic next to the serif setting,
 * and a frantic proof band undercuts the thing it is meant to prove.
 */
const SCROLL_SPEED = 0.6

/**
 * Embla's loop engine fills the gutters by translating slides around the
 * track, so it needs the slide set to be comfortably wider than the viewport
 * or it parks cards on the left and they read as overlapping. Five cards at
 * 38% is 190% — just under the threshold. Running the list twice clears it
 * and, because the seam lands mid-flow, the repeat is never visible.
 */
const LOOPED = [...testimonials, ...testimonials]

export function Testimonials() {
  const shouldReduceMotion = useReducedMotion()

  // Stable across renders, or Embla tears the plugin down and rebuilds it on
  // every state change and the scroll restarts.
  const autoScroll = React.useRef(
    AutoScroll({
      speed: SCROLL_SPEED,
      startDelay: 0,
      // Never advance under someone's cursor or keyboard focus — if they are
      // reading it, the track holds still.
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
      // ...but a swipe or a scrub is a nudge, not a stop. Movement resumes on
      // its own once the gesture ends — the carousel is never left dead.
      stopOnInteraction: false,
    })
  )

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: true,
      // Auto-scroll drives the track itself; this only governs the settle
      // after a manual flick or a scrollbar jump. 22 lands it without the
      // hard brake that makes a swipe feel like it hit something.
      duration: 22,
      skipSnaps: true,
      dragThreshold: 6,
      // Keep the loop measuring against the duplicated set rather than
      // snapping back at the true end of the list.
      containScroll: false,
    },
    // Honour the OS setting: no plugin at all rather than a stalled one.
    shouldReduceMotion ? [] : [autoScroll.current]
  )

  // A pointer leaving the track is what restarts it, but a drag that ends
  // outside the element never fires `mouseleave` on it. Nudging the plugin
  // back to life on pointer-up covers that gap.
  const resume = React.useCallback(() => {
    const plugin = emblaApi?.plugins().autoScroll
    if (plugin && !plugin.isPlaying()) plugin.play()
  }, [emblaApi])

  const halt = React.useCallback(() => {
    emblaApi?.plugins().autoScroll?.stop()
  }, [emblaApi])

  // --- Scrollbar -------------------------------------------------------
  // Position of the thumb, 0–1. Read off Embla rather than kept in step with
  // it, so the bar is a readout of the real track position at every frame of
  // the drift — not a second source of truth that can drift out of sync.
  const [progress, setProgress] = React.useState(0)
  const railRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!emblaApi) return

    const sync = () => {
      // Looping keeps the raw progress just outside 0–1 at the seam; the
      // modulo turns the wrap into a clean restart instead of a flick past
      // the end of the rail.
      const raw = emblaApi.scrollProgress()
      setProgress(((raw % 1) + 1) % 1)
    }

    sync()
    emblaApi.on("scroll", sync).on("reInit", sync)
    return () => {
      emblaApi.off("scroll", sync).off("reInit", sync)
    }
  }, [emblaApi])

  // The rail is an absolute control: where you press is where the track goes,
  // and dragging scrubs it continuously. Pointer capture means the drag keeps
  // tracking after the cursor leaves the rail, which is what every native
  // scrollbar does and what its absence makes feel cheap.
  const scrubTo = React.useCallback(
    (clientX: number) => {
      const rail = railRef.current
      if (!rail || !emblaApi) return
      const { left, width } = rail.getBoundingClientRect()
      if (width === 0) return
      const ratio = Math.min(Math.max((clientX - left) / width, 0), 1)
      emblaApi.scrollTo(
        Math.round(ratio * (emblaApi.scrollSnapList().length - 1))
      )
    },
    [emblaApi]
  )

  const [scrubbing, setScrubbing] = React.useState(false)

  const onRailDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId)
      setScrubbing(true)
      halt()
      scrubTo(event.clientX)
    },
    [halt, scrubTo]
  )

  const onRailMove = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!scrubbing) return
      scrubTo(event.clientX)
    },
    [scrubbing, scrubTo]
  )

  const onRailUp = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
      setScrubbing(false)
      resume()
    },
    [resume]
  )

  // Arrow keys on the rail, because a drag handle that only answers to a mouse
  // is not a control — it is a decoration that happens to work.
  const onRailKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        emblaApi?.scrollPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        emblaApi?.scrollNext()
      }
    },
    [emblaApi]
  )

  // How much of the set is on screen — the thumb is that fraction of the rail,
  // so its size says how much there is to read, exactly like a real scrollbar.
  // Floored, because a thumb thinner than about an eighth of the rail is
  // hard to grab and stops reading as a handle at all.
  const thumbFraction = Math.max(1 / LOOPED.length, 0.12)
  const thumbWidth = `${(thumbFraction * 100).toFixed(2)}%`

  return (
    <Section id="testimonials" aria-labelledby="testimonials-heading">
      <Container>
        {/* No pause button and no arrows: hovering the track is the pause —
            which is what people reach for and what WCAG 2.2.2 asks for — and
            the rail below is the manual control. A pair of step buttons next
            to a continuously drifting band never matched what it does. */}
        <SectionHeading
          headingId="testimonials-heading"
          eyebrow="Studios"
          title="Trusted by the people who run the room"
          description="Owners, clinic directors and front-of-house managers — not a pilot programme. Every quote below is from a studio running Aurelius today."
        />

        {/* Proof band. Numbers first: they are what a sceptical owner scans
            for before reading a single quote. */}
        <dl className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {trustStats.map((stat) => (
            <div key={stat.label} className="bg-card px-6 py-5">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="font-display text-3xl font-semibold tracking-[-0.04em] text-accent tabular-nums">
                  {stat.value}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>

        {/* The edges fade rather than cut. A continuously moving track that
            stops dead at a hard border reads as clipped; a soft entry and exit
            reads as a band that carries on past the page. */}
        {/* Touch has no hover, so the gesture itself has to be the pause: a
            finger down halts the drift instantly and the track follows the
            swipe, then it resumes the moment the finger lifts. Handled on
            pointer events rather than touch ones so a mouse drag behaves
            identically, and on the wrapper rather than the viewport so a
            gesture that ends off-element still releases the hold. */}
        <div
          className="relative mt-6 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
          onPointerDown={halt}
          onPointerUp={resume}
          onPointerCancel={resume}
          onTouchEnd={resume}
        >
          <div
            className="overflow-hidden"
            ref={emblaRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Customer testimonials"
          >
            {/* The track is translated every frame — keeping it on the
                compositor is the difference between smooth and stuttery. */}
            <ul className="-ml-4 flex will-change-transform [backface-visibility:hidden] [touch-action:pan-y_pinch-zoom]">
              {LOOPED.map((t, i) => {
                // The second pass is the same five quotes; screen readers
                // should hear the list once.
                const isRepeat = i >= testimonials.length

                return (
                  <li
                    key={`${t.id}-${i}`}
                    className="group min-w-0 shrink-0 basis-full pl-4 sm:basis-1/2 lg:basis-[38%]"
                    {...(isRepeat
                      ? { "aria-hidden": true }
                      : {
                          role: "group",
                          "aria-roledescription": "slide",
                          "aria-label": `${i + 1} of ${testimonials.length}`,
                        })}
                  >
                    <figure
                      className={cn(
                        "flex h-full flex-col gap-6 rounded-xl border border-border bg-card p-7 shadow-xs",
                        // The card the cursor is on lifts and warms while the
                        // track holds still under it — the stop and the
                        // emphasis are the same gesture.
                        "transition-[transform,border-color,box-shadow] duration-[--duration-base] ease-[--ease-out]",
                        "group-hover:-translate-y-1 group-hover:border-accent/40 group-hover:shadow-md",
                        "motion-reduce:transform-none"
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        {/* Rating is stated in text for screen readers; the
                            stars are decorative so it is not read out five
                            times. */}
                        <div className="flex items-center gap-0.5">
                          <span className="sr-only">Rated 5 out of 5</span>
                          {Array.from({ length: 5 }).map((_, star) => (
                            <Star
                              key={star}
                              aria-hidden
                              className="size-3.5 fill-accent text-accent"
                            />
                          ))}
                        </div>
                        <Quote
                          aria-hidden
                          className="size-5 shrink-0 text-accent/40 transition-colors duration-[--duration-base] group-hover:text-accent/70"
                          strokeWidth={1.5}
                        />
                      </div>
                      <blockquote className="flex-1 text-[0.9375rem] leading-relaxed text-foreground">
                        {t.quote}
                      </blockquote>
                      <figcaption className="flex items-center gap-3 border-t border-border pt-5">
                        <Avatar>
                          <AvatarFallback>{t.initials}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center gap-1.5 truncate text-sm font-medium">
                            {t.author}
                            <BadgeCheck
                              aria-label="Verified customer"
                              className="size-3.5 shrink-0 text-accent"
                            />
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {t.role}, {t.company}
                          </p>
                        </div>
                      </figcaption>
                    </figure>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* --- Scroll rail --------------------------------------------- */}
        {/* Sits outside the masked track so it is never faded at the edges,
            and narrow enough that it reads as an instrument under the band
            rather than a second element competing with it. */}
        <div className="mt-8 flex justify-center">
          <div
            ref={railRef}
            role="slider"
            tabIndex={0}
            aria-label="Scroll testimonials"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            aria-valuetext={`${Math.round(progress * 100)}% through the testimonials`}
            onPointerDown={onRailDown}
            onPointerMove={onRailMove}
            onPointerUp={onRailUp}
            onPointerCancel={onRailUp}
            onKeyDown={onRailKeyDown}
            onFocus={halt}
            onBlur={resume}
            className={cn(
              "group relative h-6 w-full max-w-md touch-none",
              "flex cursor-grab items-center focus-visible:outline-none",
              scrubbing && "cursor-grabbing"
            )}
          >
            {/* Rail. Thin at rest, thicker the moment the control is in play,
                so the affordance appears exactly when it is wanted. */}
            <div
              className={cn(
                "relative w-full overflow-hidden rounded-full bg-border",
                "transition-[height] duration-[--duration-base] ease-[--ease-out]",
                scrubbing ? "h-1.5" : "h-1 group-hover:h-1.5"
              )}
            >
              <div
                style={{
                  width: thumbWidth,
                  // Travel is the rail minus the thumb, so the thumb lands
                  // flush with each end instead of hanging over it.
                  transform: `translateX(${(progress * (1 / thumbFraction - 1) * 100).toFixed(3)}%)`,
                }}
                className={cn(
                  "h-full rounded-full bg-accent",
                  // No transition on transform: the position is already
                  // driven frame-by-frame by Embla, and easing it on top
                  // would put the thumb permanently behind the cards.
                  "transition-colors duration-[--duration-base]",
                  scrubbing && "bg-accent/80"
                )}
              />
            </div>

            {/* Focus ring belongs to the rail, not the thumb — the thumb moves
                and a ring chasing it around is noise. */}
            <span className="pointer-events-none absolute -inset-x-2 -inset-y-1 rounded-full ring-ring transition-shadow group-focus-visible:ring-2" />
          </div>
        </div>
      </Container>
    </Section>
  )
}
