import Link from "next/link"
import { ArrowRight, ShieldCheck } from "lucide-react"

import { trustSignals } from "@/content/features"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/primitives/container"
import { Section } from "@/components/primitives/section"
import { SectionHeading } from "@/components/primitives/section-heading"
import { Reveal } from "@/components/motion/reveal"
import { FeatureShowcase } from "@/components/sections/feature-showcase"

export function Features() {
  return (
    <Section id="features" aria-labelledby="features-heading">
      <Container>
        <SectionHeading
          headingId="features-heading"
          eyebrow="What it does"
          title="Five jobs your front desk no longer has to do"
          description="Turn them on one at a time or all at once. Each one is measured against the work it replaced, not against a demo."
        />

        {/* Not five static cards but one device doing all five jobs: pick a job
            on the left and watch it play out inside the phone. The showcase
            owns its own motion, autoplay and reduced-motion fallbacks. */}
        <FeatureShowcase />

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

