"use client"

import * as React from "react"
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion"
import { ChevronDown } from "lucide-react"

import type { HowItWorksStep } from "@/types"
import { howItWorks } from "@/content/how-it-works"
import { cn } from "@/lib/utils"
import { Container } from "@/components/primitives/container"
import { Section } from "@/components/primitives/section"
import { SectionHeading } from "@/components/primitives/section-heading"
import { ProductFrame } from "@/components/sections/product-frame"

const COUNT = howItWorks.length

/** Matches the `lg` breakpoint the two layouts split on. */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = React.useState(false)

  React.useEffect(() => {
    const query = window.matchMedia("(min-width: 64rem)")
    const sync = () => setIsDesktop(query.matches)

    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  return isDesktop
}

export function HowItWorks() {
  const railRef = React.useRef<HTMLOListElement>(null)
  const itemsRef = React.useRef<(HTMLLIElement | null)[]>([])
  const buttonsRef = React.useRef<(HTMLButtonElement | null)[]>([])

  const [active, setActive] = React.useState(0)
  const isDesktop = useIsDesktop()

  /**
   * Desktop only. Scroll drives the section — no timer. Progress runs 0 → 1 as
   * the rail crosses a fixed line at 60% of the viewport, and each step owns an
   * equal slice of it. Steps are given a fixed desktop height so a step
   * expanding its description cannot shift the slice boundaries under the
   * reader. On mobile the reader taps instead, so scroll must not fight them.
   */
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 60%", "end 60%"],
  })

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!isDesktop) return
    const i = Math.min(COUNT - 1, Math.max(0, Math.floor(p * COUNT)))
    setActive((current) => (current === i ? current : i))
  })

  // On desktop, clicking scrolls rather than setting state directly: scroll
  // position is the single source of truth there, so anything else would be
  // fought back. On mobile the tap is the source of truth.
  const select = React.useCallback(
    (i: number) => {
      if (!isDesktop) {
        setActive(i)
        return
      }
      itemsRef.current[i]?.scrollIntoView({
        block: "center",
        behavior: "smooth",
      })
    },
    [isDesktop]
  )

  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = COUNT - 1
    const next = {
      ArrowDown: Math.min(active + 1, last),
      ArrowUp: Math.max(active - 1, 0),
      Home: 0,
      End: last,
    }[event.key]

    if (next === undefined) return
    event.preventDefault()
    buttonsRef.current[next]?.focus({ preventScroll: true })
    select(next)
  }

  const activeStep = howItWorks[active] ?? howItWorks[0]!

  return (
    <Section id="how-it-works" aria-labelledby="how-heading">
      <Container>
        <SectionHeading
          headingId="how-heading"
          eyebrow="How it works"
          title="Live in a week, not a season"
          description="Aurelius starts read-only and earns write access. You see its judgement against your real diary before it touches anything."
        />

        {/* Two behaviours, one argument. On desktop the panel is pinned beside
            the steps and swaps as they scroll. On mobile that pinning would eat
            most of the viewport, and one panel per step would triple the
            section's length — so the steps collapse to a tappable rail and only
            the open one shows its panel. Either way the claim and its evidence
            are on screen together. */}
        <div className="mt-14 lg:grid lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:items-start lg:gap-14">
          <div className="hidden lg:sticky lg:top-28 lg:order-2 lg:block">
            <ProductFrame panel={activeStep.panel} />
          </div>

          <ol ref={railRef} onKeyDown={onKeyDown} className="relative lg:order-1">
            {howItWorks.map((item, i) => (
              <Step
                key={item.id}
                item={item}
                index={i}
                isActive={i === active}
                progress={scrollYProgress}
                onSelect={select}
                itemRef={(el) => {
                  itemsRef.current[i] = el
                }}
                buttonRef={(el) => {
                  buttonsRef.current[i] = el
                }}
              />
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  )
}

interface StepProps {
  item: HowItWorksStep
  index: number
  isActive: boolean
  progress: MotionValue<number>
  onSelect: (index: number) => void
  itemRef: (el: HTMLLIElement | null) => void
  buttonRef: (el: HTMLButtonElement | null) => void
}

function Step({
  item,
  index,
  isActive,
  progress,
  onSelect,
  itemRef,
  buttonRef,
}: StepProps) {
  const isLast = index === COUNT - 1

  // The connector fills with this step's slice of scroll progress, so the
  // rail reads as a position indicator rather than decoration.
  const fill = useTransform(
    progress,
    [index / COUNT, (index + 1) / COUNT],
    [0, 1],
    { clamp: true }
  )

  return (
    <li
      ref={itemRef}
      /* Every step is the same height on desktop so each owns an exactly
         equal slice of scroll progress — including the last, whose block is
         what keeps the panel pinned while step 03 is read. */
      className={cn(
        "relative pb-6 lg:h-[34vh] lg:min-h-[14rem] lg:pb-0",
        isLast && "pb-0"
      )}
    >
      {!isLast ? (
        <>
          {/* Mobile: a plain connector, running past the open step's panel so
              the sequence reads as one thread rather than three cards. */}
          <span
            aria-hidden
            className="absolute top-12 bottom-0 left-[1.375rem] w-px -translate-x-1/2 bg-border lg:hidden"
          />
          {/* Desktop: the same connector, filled by this step's slice of
              scroll progress so the rail reads as a position indicator. */}
          <span
            aria-hidden
            className="absolute top-12 bottom-1 left-[1.375rem] hidden w-px -translate-x-1/2 overflow-hidden bg-border lg:block"
          >
            <motion.span
              style={{ scaleY: fill }}
              className="block h-full w-full origin-top bg-accent"
            />
          </span>
        </>
      ) : null}

      <button
        type="button"
        ref={buttonRef}
        aria-pressed={isActive}
        aria-expanded={isActive}
        tabIndex={isActive ? 0 : -1}
        onClick={() => onSelect(index)}
        className="group grid w-full grid-cols-[auto_1fr_auto] items-start gap-4 rounded-lg text-left lg:grid-cols-[auto_1fr]"
      >
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-full border font-mono text-[0.8125rem]",
            "transition-[color,background-color,border-color] duration-[--duration-base]",
            isActive
              ? "border-accent/40 bg-accent-subtle text-accent"
              : "border-border bg-card text-muted-foreground group-hover:border-accent/30 group-hover:text-foreground"
          )}
        >
          {item.step}
        </span>

        <span className="pt-2">
          <span
            className={cn(
              "block text-base font-semibold transition-colors duration-[--duration-base]",
              isActive
                ? "text-foreground"
                : "text-muted-foreground group-hover:text-foreground"
            )}
          >
            {item.title}
          </span>

          {/* Only the open step carries its description, so a closed rail stays
              three lines tall. The text stays in the DOM either way. */}
          <span
            className={cn(
              "grid transition-[grid-template-rows,opacity] duration-[--duration-slow] ease-[--ease-out]",
              isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}
          >
            <span className="overflow-hidden">
              <span className="block pt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </span>
            </span>
          </span>
        </span>

        {/* Mobile needs to look tappable; desktop is driven by scroll. */}
        <ChevronDown
          aria-hidden
          className={cn(
            "mt-3.5 size-4 shrink-0 text-muted-foreground lg:hidden",
            "transition-transform duration-[--duration-base] ease-[--ease-out]",
            isActive && "rotate-180 text-accent"
          )}
        />
      </button>

      {/* The evidence for the open step, directly under its claim. Indented to
          the copy column so the connector still runs alongside it. */}
      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-[--duration-slow] ease-[--ease-out] lg:hidden",
          isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="mt-5 ml-[3.75rem]">
            <ProductFrame panel={item.panel} />
          </div>
        </div>
      </div>
    </li>
  )
}
