"use client"

import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { useReducedMotion } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Pause,
  Play,
  Quote,
  Star,
} from "lucide-react"

import { testimonials, trustStats } from "@/content/testimonials"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/primitives/container"
import { Section } from "@/components/primitives/section"
import { SectionHeading } from "@/components/primitives/section-heading"

const AUTOPLAY_DELAY = 4500

export function Testimonials() {
  const shouldReduceMotion = useReducedMotion()

  // The plugin instance must be stable across renders, or Embla tears down and
  // rebuilds autoplay on every state change and the timer never completes.
  const autoplay = React.useRef(
    Autoplay({
      delay: AUTOPLAY_DELAY,
      // Keep rolling after a manual nudge — stopping forever on first touch is
      // the single most common autoplay mistake.
      stopOnInteraction: false,
      // But never advance under someone's cursor or keyboard focus.
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
    })
  )

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      // Deliberately NOT looped. Embla's loop engine fills the gutters by
      // translating slides around the track, and with only five testimonials
      // there is never enough to fill the left side — so it parks slides
      // there, which reads as cards overlapping and mis-aligned. Autoplay
      // still cycles: at the last snap it rewinds to the first.
      // Revisit only if the testimonial count grows well past the number
      // visible at once.
      loop: false,
      // Embla's default is 25, which reads as syrupy next to the 220ms the
      // rest of the site moves at. 10 is a fast native-feeling swipe —
      // roughly 180ms end to end. Below ~8 the cards teleport and the eye
      // loses track of which one moved where.
      duration: 10,
      // Let a fast flick travel more than one slide instead of braking hard
      // at the next snap — the main thing that makes a carousel feel sticky.
      skipSnaps: true,
      // Start tracking the drag sooner, so a swipe never feels like it has
      // to overcome friction before the track responds.
      dragThreshold: 6,
    },
    // Honour the OS setting: no plugin at all rather than a paused one.
    shouldReduceMotion ? [] : [autoplay.current]
  )

  const [selected, setSelected] = React.useState(0)
  const [isPlaying, setIsPlaying] = React.useState(!shouldReduceMotion)

  React.useEffect(() => {
    if (!emblaApi) return

    const sync = () => setSelected(emblaApi.selectedScrollSnap())
    const syncPlayState = () => {
      const plugin = emblaApi.plugins().autoplay
      if (plugin) setIsPlaying(plugin.isPlaying())
    }

    sync()
    syncPlayState()

    emblaApi.on("select", sync).on("reInit", sync)
    emblaApi
      .on("autoplay:play", syncPlayState)
      .on("autoplay:stop", syncPlayState)
      .on("reInit", syncPlayState)

    return () => {
      emblaApi.off("select", sync).off("reInit", sync)
      emblaApi
        .off("autoplay:play", syncPlayState)
        .off("autoplay:stop", syncPlayState)
        .off("reInit", syncPlayState)
    }
  }, [emblaApi])

  const toggleAutoplay = React.useCallback(() => {
    const plugin = emblaApi?.plugins().autoplay
    if (!plugin) return
    if (plugin.isPlaying()) plugin.stop()
    else plugin.play()
  }, [emblaApi])

  return (
    <Section id="testimonials" aria-labelledby="testimonials-heading">
      <Container>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            headingId="testimonials-heading"
            eyebrow="Studios"
            title="Trusted by the people who run the room"
            description="Owners, clinic directors and front-of-house managers — not a pilot programme. Every quote below is from a studio running Aurelius today."
          />

          <div className="flex gap-2">
            {/* WCAG 2.2.2: anything that moves automatically for more than
                five seconds needs an explicit pause control. */}
            {!shouldReduceMotion ? (
              <Button
                variant="outline"
                size="icon"
                onClick={toggleAutoplay}
                aria-label={
                  isPlaying
                    ? "Pause automatic rotation"
                    : "Resume automatic rotation"
                }
              >
                {isPlaying ? <Pause /> : <Play />}
              </Button>
            ) : null}

            <Button
              variant="outline"
              size="icon"
              onClick={() => emblaApi?.scrollPrev()}
              aria-label="Previous testimonial"
            >
              <ArrowLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => emblaApi?.scrollNext()}
              aria-label="Next testimonial"
            >
              <ArrowRight />
            </Button>
          </div>
        </div>

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

        <div
          className="mt-6 overflow-hidden"
          ref={emblaRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer testimonials"
        >
          {/* The track is translated every frame of a drag — keeping it on
              the compositor is the difference between smooth and stuttery. */}
          <ul className="-ml-4 flex will-change-transform [backface-visibility:hidden] [touch-action:pan-y_pinch-zoom]">
            {testimonials.map((t, i) => (
              <li
                key={t.id}
                /* The 38% peek is safe now that the track does not loop: a
                   partial third card signals "there is more" without the
                   loop engine needing slides to fill the gutter. */
                className="min-w-0 shrink-0 basis-full pl-4 sm:basis-1/2 lg:basis-[38%]"
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${testimonials.length}`}
              >
                <figure
                  className={cn(
                    "flex h-full flex-col gap-6 rounded-xl border bg-card p-7",
                    "transition-[border-color,box-shadow,opacity] duration-[--duration-base] ease-[--ease-out]",
                    i === selected
                      ? "border-accent/40 opacity-100 shadow-md"
                      : "border-border opacity-70 shadow-xs"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    {/* Rating is stated in text for screen readers; the stars
                        are decorative so it is not read out five times. */}
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
                      className="size-5 shrink-0 text-accent/40"
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
            ))}
          </ul>
        </div>

        {/* Dots double as position indicator and jump control. The active one
            carries a progress fill so the rotation feels intentional rather
            than something that just happens to you. */}
        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              aria-current={i === selected}
              className="group cursor-pointer p-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <span
                className={cn(
                  "relative block h-1 overflow-hidden rounded-full transition-all duration-[--duration-base] ease-[--ease-out]",
                  i === selected
                    ? "w-8 bg-border"
                    : "w-3 bg-border group-hover:bg-muted-foreground"
                )}
              >
                {i === selected ? (
                  <span
                    key={`${t.id}-${String(isPlaying)}`}
                    className={cn(
                      "absolute inset-0 origin-left rounded-full bg-accent",
                      isPlaying && !shouldReduceMotion
                        ? "animate-dot-progress"
                        : "scale-x-100"
                    )}
                  />
                ) : null}
              </span>
            </button>
          ))}
        </div>

        {/* Announce slide changes to screen readers without moving focus. */}
        <p aria-live="polite" aria-atomic className="sr-only">
          {`Testimonial ${selected + 1} of ${testimonials.length}: ${
            testimonials[selected]?.author ?? ""
          }, ${testimonials[selected]?.company ?? ""}`}
        </p>
      </Container>
    </Section>
  )
}
