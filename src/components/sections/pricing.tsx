"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

import { pricingTiers } from "@/content/pricing"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Container } from "@/components/primitives/container"
import { Section } from "@/components/primitives/section"
import { SectionHeading } from "@/components/primitives/section-heading"
import { RevealGroup, RevealItem } from "@/components/motion/reveal"
import { PricingComparison } from "@/components/sections/pricing-comparison"
import { PricingMobile } from "@/components/sections/pricing-mobile"

type Cycle = "monthly" | "annual"

export function Pricing() {
  const [cycle, setCycle] = React.useState<Cycle>("annual")
  const [selectedId, setSelectedId] = React.useState(
    pricingTiers.find((t) => t.popular)?.id ?? pricingTiers[0]?.id ?? ""
  )

  const selected = pricingTiers.find((t) => t.id === selectedId)
  const selectedPrice =
    cycle === "annual" ? selected?.annualPrice : selected?.monthlyPrice

  return (
    <Section id="pricing" aria-labelledby="pricing-heading">
      <Container>
        <div className="flex flex-col items-center gap-8">
          <SectionHeading
            headingId="pricing-heading"
            align="center"
            eyebrow="Pricing"
            title="Priced per location, not per seat"
            description="Add as many team logins as you like. Charging per seat would penalise exactly the studio whose problem this solves."
          />

          <Tabs
            value={cycle}
            onValueChange={(v) => setCycle(v as Cycle)}
            className="w-fit"
          >
            <TabsList aria-label="Billing period">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="annual">
                Annual
                <Badge variant="accent" className="ml-1 px-1.5">
                  −20%
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/*
          A native radio group. Using real inputs wrapped in labels means
          arrow-key navigation, roving focus, form semantics and the
          "one of several" announcement all come from the browser — no
          keyboard handlers to write and get subtly wrong.
        */}
        {/* Phones get the single-plan spec sheet instead of three cards plus a
            sideways-scrolling table. Both read the same content. */}
        <PricingMobile
          cycle={cycle}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />

        <fieldset className="mt-14 hidden lg:block">
          <legend className="sr-only">Choose a plan</legend>

          <RevealGroup className="grid items-start gap-6 lg:grid-cols-3">
            {pricingTiers.map((tier) => {
              const price =
                cycle === "annual" ? tier.annualPrice : tier.monthlyPrice
              const isSelected = tier.id === selectedId

              return (
                <RevealItem key={tier.id}>
                  <label
                    className={cn(
                      "group relative flex h-full cursor-pointer flex-col rounded-xl border bg-card p-7",
                      "transition-[border-color,box-shadow,transform] duration-[--duration-base] ease-[--ease-out]",
                      "hover:-translate-y-1 hover:shadow-md motion-reduce:hover:translate-y-0",
                      // Focus ring is driven by the visually hidden input, so
                      // keyboard users see exactly what mouse users click.
                      "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background",
                      isSelected
                        ? "border-accent shadow-md ring-1 ring-accent"
                        : "border-border shadow-xs hover:border-accent/40",
                      tier.popular && "lg:-my-3 lg:py-10"
                    )}
                  >
                    <input
                      type="radio"
                      name="pricing-tier"
                      value={tier.id}
                      checked={isSelected}
                      onChange={() => setSelectedId(tier.id)}
                      className="sr-only"
                    />

                    {tier.popular ? (
                      <Badge className="absolute -top-3 left-7 bg-accent text-accent-foreground">
                        Most popular
                      </Badge>
                    ) : null}

                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold">{tier.name}</h3>

                      {/* Selection indicator, styled like a radio because that
                          is exactly what it is. */}
                      <span
                        aria-hidden
                        className={cn(
                          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-[--duration-fast]",
                          isSelected
                            ? "border-accent bg-accent"
                            : "border-border group-hover:border-accent/50"
                        )}
                      >
                        {isSelected ? (
                          <Check className="size-3 text-accent-foreground" />
                        ) : null}
                      </span>
                    </div>

                    <p className="mt-2 min-h-10 text-sm leading-relaxed text-muted-foreground">
                      {tier.description}
                    </p>

                    <div className="mt-7 flex items-baseline gap-1.5">
                      {price === null ? (
                        <span className="font-display text-4xl font-semibold tracking-[-0.04em]">
                          Custom
                        </span>
                      ) : (
                        <>
                          <span className="font-display text-4xl font-semibold tracking-[-0.04em] tabular-nums">
                            ${price}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            / location / mo
                          </span>
                        </>
                      )}
                    </div>
                    <p className="mt-1.5 h-5 text-xs text-muted-foreground">
                      {price === null
                        ? "Annual contract, based on volume"
                        : cycle === "annual"
                          ? "Billed annually"
                          : "Billed monthly"}
                    </p>

                    <ul className="mt-8 flex flex-col gap-3.5 border-t border-border pt-7">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <Check
                            aria-hidden
                            className="mt-0.5 size-4 shrink-0 text-accent"
                          />
                          <span className="text-sm text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </label>
                </RevealItem>
              )
            })}
          </RevealGroup>
        </fieldset>

        <RevealGroup className="hidden lg:block">
          <RevealItem>
            <PricingComparison
              cycle={cycle}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </RevealItem>
        </RevealGroup>

        {/* Single CTA reflecting the current selection. One decision, one
            button — rather than three competing buttons on the page. */}
        {selected ? (
          <div className="mt-16 hidden flex-col items-center gap-5 rounded-xl border border-border bg-muted/40 p-6 lg:flex lg:flex-row lg:justify-between lg:p-7">
            <div className="text-center sm:text-left">
              <p className="text-sm text-muted-foreground">Selected plan</p>
              <p className="mt-1 text-lg font-semibold">
                {selected.name}
                <span className="ml-2 font-normal text-muted-foreground">
                  {selectedPrice === null
                    ? "· custom pricing"
                    : `· $${selectedPrice} per location / month, billed ${
                        cycle === "annual" ? "annually" : "monthly"
                      }`}
                </span>
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Talk to us</Link>
              </Button>
              <Button size="lg" variant="accent" asChild>
                <Link href={selected.href}>
                  {selected.cta}
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        ) : null}

        {/* Announce selection changes without moving focus. */}
        <p aria-live="polite" className="sr-only">
          {selected
            ? `${selected.name} plan selected, ${
                selectedPrice === null
                  ? "custom pricing"
                  : `$${selectedPrice} per location per month`
              }`
            : ""}
        </p>
      </Container>
    </Section>
  )
}
