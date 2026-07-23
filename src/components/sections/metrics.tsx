"use client"

import dynamic from "next/dynamic"
import CountUp from "react-countup"
import { useReducedMotion } from "framer-motion"

import { metrics } from "@/content/metrics"
import { Container } from "@/components/primitives/container"
import { Section } from "@/components/primitives/section"
import { SectionHeading } from "@/components/primitives/section-heading"
import { RevealGroup, RevealItem } from "@/components/motion/reveal"
import { Skeleton } from "@/components/ui/skeleton"

// Recharts is heavy and below the fold — keep it out of the initial bundle.
const CoverageChart = dynamic(
  () => import("@/components/charts/coverage-chart").then((m) => m.CoverageChart),
  {
    ssr: false,
    loading: () => <Skeleton className="h-72 w-full" />,
  }
)

export function Metrics() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <Section
      id="metrics"
      aria-labelledby="metrics-heading"
      className="border-y border-border bg-muted/30"
    >
      <Container>
        <SectionHeading
          headingId="metrics-heading"
          eyebrow="Outcomes"
          title="Measured across 400+ clinics"
          description="Aggregated from customer telemetry over the trailing twelve months. Medians, not best cases."
        />

        <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <RevealItem key={metric.id} className="bg-card p-6">
              <p className="font-display text-4xl font-semibold tracking-[-0.04em] tabular-nums">
                {metric.prefix}
                {shouldReduceMotion ? (
                  metric.value.toFixed(metric.decimals ?? 0)
                ) : (
                  <CountUp
                    end={metric.value}
                    decimals={metric.decimals ?? 0}
                    duration={1.8}
                    enableScrollSpy
                    scrollSpyOnce
                  />
                )}
                <span className="text-accent">{metric.suffix}</span>
              </p>
              <p className="mt-2 text-sm font-medium">{metric.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {metric.description}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          <h3 className="text-base font-semibold">
            Front-office tasks: automated vs. manual
          </h3>
          <p className="mt-1 mb-6 text-sm text-muted-foreground">
            A representative four-provider group through its first eight months.
          </p>
          <CoverageChart />
        </div>
      </Container>
    </Section>
  )
}
