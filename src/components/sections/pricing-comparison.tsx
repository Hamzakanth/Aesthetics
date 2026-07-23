"use client"

import * as React from "react"
import { Check, Info, Minus } from "lucide-react"

import { pricingComparison, pricingTiers } from "@/content/pricing"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { SectionHeading } from "@/components/primitives/section-heading"

interface PricingComparisonProps {
  cycle: "monthly" | "annual"
  /** Mirrors the card selection above so the table can name the current plan. */
  selectedId: string
  onSelect: (id: string) => void
}

/**
 * Booleans render as marks with a visually hidden word — a bare icon tells a
 * screen reader nothing about the row it sits in.
 */
function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span className="text-sm text-foreground">{value}</span>
  }

  return value ? (
    <>
      <Check
        aria-hidden
        strokeWidth={2.25}
        className="mx-auto size-[1.125rem] text-accent"
      />
      <span className="sr-only">Included</span>
    </>
  ) : (
    <>
      <Minus aria-hidden className="mx-auto size-4 text-muted-foreground/30" />
      <span className="sr-only">Not included</span>
    </>
  )
}

export function PricingComparison({
  cycle,
  selectedId,
  onSelect,
}: PricingComparisonProps) {
  const columnCount = pricingTiers.length + 1
  const selected = pricingTiers.find((t) => t.id === selectedId)
  const selectedPrice =
    cycle === "annual" ? selected?.annualPrice : selected?.monthlyPrice

  /**
   * Only the popular column is banded, in a neutral tone. The cards above
   * already own plan selection; repeating that state here as a second accent
   * highlight just gave the eye two things to track.
   */
  const columnTone = (popular?: boolean) => (popular ? "bg-muted/35" : "")

  /**
   * The feature column is pinned so labels stay on screen while the tier
   * columns scroll under the thumb. Pinned cells need an opaque background of
   * their own, or the scrolling content shows through.
   */
  const stickyLabel = "sticky left-0 z-10 bg-card"

  return (
    <div className="mt-24">
      <SectionHeading
        align="center"
        as="h3"
        eyebrow="Full breakdown"
        title="Compare every plan"
        description="Unlimited team logins, GDPR-compliant data handling and a free pilot come with all three."
        className="mx-auto"
      />

      <TooltipProvider delayDuration={150}>
        <div className="relative mt-12">
          {/* Card frame: the table shares the border, radius and elevation of
              the plan cards above it rather than floating on the page. */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
            <div className="overflow-x-auto [scrollbar-width:thin]">
              <table className="w-full min-w-[820px] border-collapse text-left">
                <caption className="sr-only">
                  Feature comparison across the Practice, Group and Health
                  system plans, priced{" "}
                  {cycle === "annual" ? "annually" : "monthly"}.
                </caption>

                {/* Fixed widths stop the layout reflowing when the billing
                    toggle swaps a three-digit price for "Custom". */}
                <colgroup>
                  <col className="w-[34%]" />
                  {pricingTiers.map((tier) => (
                    <col key={tier.id} className="w-[22%]" />
                  ))}
                </colgroup>

                <thead>
                  <tr className="border-b border-border">
                    <th
                      scope="col"
                      className={cn("px-6 pb-6 align-bottom", stickyLabel)}
                    >
                      <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-muted-foreground uppercase">
                        {cycle === "annual"
                          ? "Billed annually"
                          : "Billed monthly"}
                      </span>
                    </th>

                    {pricingTiers.map((tier) => {
                      const price =
                        cycle === "annual"
                          ? tier.annualPrice
                          : tier.monthlyPrice

                      return (
                        <th
                          key={tier.id}
                          scope="col"
                          className={cn(
                            "px-4 pt-7 pb-6 text-center align-bottom font-normal",
                            columnTone(tier.popular)
                          )}
                        >
                          {/* Fixed-height badge slot keeps all three headers
                              on the same baseline. */}
                          <div className="flex h-6 items-start justify-center">
                            {tier.popular ? (
                              <Badge
                                variant="accent"
                                className="px-2 text-[0.6875rem]"
                              >
                                Most popular
                              </Badge>
                            ) : null}
                          </div>

                          <span className="block text-[0.9375rem] font-semibold text-foreground">
                            {tier.name}
                          </span>

                          {/* Names the current plan in place, so the column
                              you are reading is self-identifying. */}
                          <span
                            className={cn(
                              "mx-auto mt-1 block h-4 text-[0.6875rem] font-medium text-accent",
                              tier.id === selectedId ? "visible" : "invisible"
                            )}
                          >
                            Your plan
                          </span>

                          <span className="mt-1.5 flex items-baseline justify-center gap-1">
                            {price === null ? (
                              <span className="font-display text-2xl font-semibold tracking-[-0.03em]">
                                Custom
                              </span>
                            ) : (
                              <>
                                <span className="font-display text-2xl font-semibold tracking-[-0.03em] tabular-nums">
                                  ${price}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  / location
                                </span>
                              </>
                            )}
                          </span>
                        </th>
                      )
                    })}
                  </tr>
                </thead>

                {pricingComparison.map((group) => (
                  <tbody key={group.id}>
                    <tr>
                      <th
                        scope="colgroup"
                        colSpan={columnCount}
                        className="border-b border-border/60 bg-muted/50 px-6 py-2.5 text-left font-mono text-[0.6875rem] tracking-[0.16em] text-muted-foreground uppercase"
                      >
                        {group.title}
                      </th>
                    </tr>

                    {group.rows.map((row) => (
                      <tr
                        key={row.label}
                        className="border-b border-border/50 last:border-b-0"
                      >
                        <th
                          scope="row"
                          className={cn(
                            "px-6 py-4 align-middle text-sm font-normal",
                            stickyLabel
                          )}
                        >
                          <span className="inline-flex items-center gap-1.5 text-foreground">
                            {row.label}

                            {row.hint ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    type="button"
                                    className="rounded-full text-muted-foreground/50 transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                  >
                                    <Info aria-hidden className="size-3.5" />
                                    <span className="sr-only">
                                      More about {row.label}
                                    </span>
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-56">
                                  {row.hint}
                                </TooltipContent>
                              </Tooltip>
                            ) : null}
                          </span>
                        </th>

                        {pricingTiers.map((tier) => (
                          <td
                            key={tier.id}
                            className={cn(
                              "px-4 py-4 text-center align-middle",
                              columnTone(tier.popular)
                            )}
                          >
                            <CellValue value={row.values[tier.id] ?? false} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                ))}
              </table>
            </div>

            {/* Plan switcher pinned to the foot of the card. After scrolling
                twenty rows you should not have to go back up to remember which
                plan you picked — or to change it. */}
            <div className="flex flex-col items-center gap-4 border-t border-border bg-muted/30 px-6 py-5 sm:flex-row sm:justify-between">
              <p className="text-center text-sm sm:text-left">
                <span className="text-muted-foreground">
                  You&rsquo;re viewing{" "}
                </span>
                <span className="font-semibold text-foreground">
                  {selected?.name ?? "—"}
                </span>
                {selected ? (
                  <span className="text-muted-foreground">
                    {selectedPrice === null
                      ? " · custom pricing"
                      : ` · $${selectedPrice} per location / month`}
                  </span>
                ) : null}
              </p>

              <Tabs
                value={selectedId}
                onValueChange={onSelect}
                className="w-full sm:w-auto"
              >
                <TabsList aria-label="Switch plan" className="w-full sm:w-auto">
                  {pricingTiers.map((tier) => (
                    <TabsTrigger key={tier.id} value={tier.id}>
                      {tier.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Edge fade, decorative — signals there is more table to the right
              while the container still overflows. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-16 rounded-r-2xl bg-gradient-to-l from-card to-transparent lg:hidden"
          />
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground lg:hidden">
          Scroll the table sideways to compare all three plans
        </p>
      </TooltipProvider>
    </div>
  )
}
