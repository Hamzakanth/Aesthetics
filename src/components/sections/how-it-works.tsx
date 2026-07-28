"use client"

import * as React from "react"
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion"

import type { HowItWorksStep } from "@/types"
import { howItWorks } from "@/content/how-it-works"
import { cn } from "@/lib/utils"
import { Container } from "@/components/primitives/container"
import { Section } from "@/components/primitives/section"
import { SectionHeading } from "@/components/primitives/section-heading"
import { ProductFrame } from "@/components/sections/product-frame"

const COUNT = howItWorks.length

export function HowItWorks() {
  const railRef = React.useRef<HTMLOListElement>(null)
  const itemsRef = React.useRef<(HTMLLIElement | null)[]>([])
  const buttonsRef = React.useRef<(HTMLButtonElement | null)[]>([])

  const [active, setActive] = React.useState(0)

  /**
   * Scroll drives the section — no timer. Progress runs 0 → 1 as the rail
   * crosses a fixed line at 60% of the viewport, and each step owns an equal
   * slice of it. Steps are given a fixed desktop height so a step expanding
   * its description cannot shift the slice boundaries under the reader.
   */
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 60%", "end 60%"],
  })

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const i = Math.min(COUNT - 1, Math.max(0, Math.floor(p * COUNT)))
    setActive((current) => (current === i ? current : i))
  })

  // Clicking scrolls rather than setting state directly: scroll position is
  // the single source of truth, so anything else would be fought back.
  const select = React.useCallback((i: number) => {
    itemsRef.current[i]?.scrollIntoView({ block: "center", behavior: "smooth" })
  }, [])

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

        {/* One column on mobile with the panel pinned above the steps; two on
            desktop with the panel pinned beside them. Both are the same
            behaviour — the evidence stays put while the narrative scrolls. */}
        <div className="mt-14 lg:grid lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:items-start lg:gap-14">
          <div
            className={cn(
              "sticky top-20 z-10 -mx-5 bg-background px-5 pt-2 pb-6",
              "lg:top-28 lg:order-2 lg:mx-0 lg:px-0 lg:pt-0 lg:pb-0"
            )}
          >
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
        "relative pb-8 lg:h-[34vh] lg:min-h-[14rem] lg:pb-0",
        isLast && "pb-0"
      )}
    >
      {!isLast ? (
        <span
          aria-hidden
          className="absolute top-12 bottom-1 left-[1.375rem] w-px -translate-x-1/2 overflow-hidden bg-border"
        >
          <motion.span
            style={{ scaleY: fill }}
            className="block h-full w-full origin-top bg-accent"
          />
        </span>
      ) : null}

      <button
        type="button"
        ref={buttonRef}
        aria-pressed={isActive}
        tabIndex={isActive ? 0 : -1}
        onClick={() => onSelect(index)}
        className="group grid w-full grid-cols-[auto_1fr] items-start gap-4 rounded-lg text-left"
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

          {/* Collapses on desktop only, where the rail sits beside the panel
              and height matters. The text stays in the DOM either way. */}
          <span
            className={cn(
              "grid transition-[grid-template-rows,opacity] duration-[--duration-slow] ease-[--ease-out]",
              "grid-rows-[1fr] opacity-100",
              !isActive && "lg:grid-rows-[0fr] lg:opacity-0"
            )}
          >
            <span className="overflow-hidden">
              <span className="block pt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </span>
            </span>
          </span>
        </span>
      </button>
    </li>
  )
}
