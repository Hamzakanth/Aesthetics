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

  return (
    <Section id="testimonials" aria-labelledby="testimonials-heading">
      <Container>
        {/* No visible controls at all: hovering or touching the track is the
            pause — which is what people reach for and what WCAG 2.2.2 asks
            for — and dragging it is the manual scrub. Step buttons and a
            scroll rail both read as chrome under a band that is already
            self-evidently draggable. */}
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

      </Container>
    </Section>
  )
}
