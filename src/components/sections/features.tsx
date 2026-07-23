import Link from "next/link"
import { ArrowRight, ShieldCheck } from "lucide-react"

import { features, trustSignals } from "@/content/features"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/primitives/container"
import { Section } from "@/components/primitives/section"
import { SectionHeading } from "@/components/primitives/section-heading"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"

export function Features() {
  return (
    <Section id="features" aria-labelledby="features-heading">
      <Container>
        <SectionHeading
          headingId="features-heading"
          eyebrow="What it does"
          title="Six jobs your front desk no longer has to do"
          description="Turn them on one at a time or all at once. Each one is measured against the work it replaced, not against a demo."
        />

        {/* Six cards, one weight. Two rows of three on desktop, three of two
            on tablet — the symmetry is the point: no job is the headline. */}
        <RevealGroup className="mt-14 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <RevealItem key={feature.id} className="h-full">
                {/* Not focusable: these cards have no action, and a tab stop
                    that does nothing is worse than no tab stop. */}
                <article
                  className={cn(
                    "group relative flex h-full flex-col gap-4 overflow-hidden rounded-xl border border-border bg-card p-6",
                    "transition-[border-color,box-shadow,transform] duration-[--duration-base] ease-[--ease-out]",
                    "hover:-translate-y-1 hover:border-accent/40 hover:shadow-md",
                    "motion-reduce:hover:translate-y-0"
                  )}
                >
                  {/* Accent wash that only resolves on hover/focus. */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent-subtle to-transparent opacity-0 transition-opacity duration-[--duration-slow] group-hover:opacity-100"
                  />

                  <div className="relative flex items-center gap-3">
                    <span
                      className={cn(
                        "flex size-10 items-center justify-center rounded-lg border border-border bg-background",
                        "transition-colors duration-[--duration-base]",
                        "group-hover:border-accent/40 group-hover:bg-accent-subtle",
                      )}
                    >
                      <Icon aria-hidden className="size-[1.15rem] text-accent" />
                    </span>
                    <span className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
                      {feature.eyebrow}
                    </span>
                  </div>

                  <div className="relative flex flex-col gap-2">
                    <h3 className="text-base font-semibold">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>

                  {/* One number per card. Pinned to the bottom so the chips
                      line up across a row of uneven-length descriptions. */}
                  <p className="relative mt-auto flex items-center gap-2 pt-2 text-sm font-medium text-accent">
                    <span
                      aria-hidden
                      className="h-px w-4 bg-accent transition-[width] duration-[--duration-base] ease-[--ease-out] group-hover:w-7"
                    />
                    {feature.impact}
                  </p>
                </article>
              </RevealItem>
            )
          })}
        </RevealGroup>

        {/* Trust strip. "Who holds my clients' data and their photos" is the
            first objection, so it sits with the capabilities rather than
            buried in the footer. */}
        <Reveal delay={0.1} className="mt-8">
          <div className="rounded-xl border border-border bg-muted/40 p-6 sm:p-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <ul className="grid flex-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {trustSignals.map((signal) => (
                  <li key={signal.label} className="flex items-start gap-2.5">
                    <ShieldCheck
                      aria-hidden
                      className="mt-0.5 size-4 shrink-0 text-accent"
                    />
                    <div>
                      <p className="text-sm font-medium">{signal.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {signal.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <Button variant="outline" className="shrink-0 lg:ml-4" asChild>
                <Link href="/security">
                  How we handle client data
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}

