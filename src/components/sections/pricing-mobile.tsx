"use client"

import Link from "next/link"
import { ArrowRight, Check, Minus } from "lucide-react"

import { pricingComparison, pricingTiers } from "@/content/pricing"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PricingMobileProps {
  cycle: "monthly" | "annual"
  selectedId: string
  onSelect: (id: string) => void
}

/**
 * Phone pricing: one column of plans, one column of values.
 *
 * The desktop table compares three tiers side by side, which is the right
 * answer on a wide screen and an unreadable one at 390px — it turns into a
 * horizontally scrolled grid where no row and no column is ever fully on
 * screen. So the phone gets the streaming-service pattern instead: pick a
 * plan from a compact row of tabs, and read that single plan's spec sheet
 * underneath. Every value is legible, and switching plans re-renders the same
 * rows in place so differences register as changes rather than as columns.
 */
export function PricingMobile({
  cycle,
  selectedId,
  onSelect,
}: PricingMobileProps) {
  const selected = pricingTiers.find((t) => t.id === selectedId)
  const price = cycle === "annual" ? selected?.annualPrice : selected?.monthlyPrice

  if (!selected) return null

  return (
    <div className="mt-10 lg:hidden">
      {/*
        Plan tabs. A real radiogroup rather than buttons, so arrow keys and the
        "2 of 3" announcement come from the browser.

        The three cards are identical in size and share one bottom edge; the
        "Most popular" flag sits *above* the popular card rather than inside
        it, so that one tab is taller overall and reads as raised out of the
        row. Getting there needs `items-end` on the row (bottom edges align)
        and the flag pulled out of the normal flow of the label, or the flag's
        height would eat into the card it is advertising.
      */}
      <fieldset>
        <legend className="sr-only">Choose a plan</legend>

        <div className="flex items-end gap-2">
          {pricingTiers.map((tier) => {
            const isSelected = tier.id === selectedId

            return (
              <label
                key={tier.id}
                className={cn(
                  "flex flex-1 cursor-pointer flex-col overflow-hidden rounded-xl border",
                  "transition-colors duration-[--duration-fast] ease-[--ease-out]",
                  "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card"
                )}
              >
                <input
                  type="radio"
                  name="pricing-tier-mobile"
                  value={tier.id}
                  checked={isSelected}
                  onChange={() => onSelect(tier.id)}
                  className="sr-only"
                />

                {/* In normal flow, not absolutely positioned: the flag is part
                    of the card, so it can never drift away from it. Because
                    the row is bottom-aligned and only this tab has a flag,
                    its 20px is what makes the popular tab the taller one. */}
                {tier.popular ? (
                  <span
                    className={cn(
                      "flex h-5 items-center justify-center text-[0.625rem] font-semibold tracking-wide uppercase",
                      isSelected
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    Most popular
                  </span>
                ) : null}

                {/* A floor rather than a fixed height: bottom-aligned cards
                    only look equal if their content agrees, and "Growing
                    groups" wraps to two lines where "Single site" does not. */}
                <span className="flex min-h-[5rem] flex-1 flex-col justify-end p-3">
                  <span className="flex items-center gap-1 text-sm font-semibold">
                    {tier.name}
                    {isSelected ? (
                      <>
                        <Check
                          aria-hidden
                          strokeWidth={3}
                          className="size-3.5 shrink-0"
                        />
                        <span className="sr-only">Selected</span>
                      </>
                    ) : null}
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 text-xs leading-snug text-balance",
                      isSelected
                        ? "text-primary-foreground/75"
                        : "text-muted-foreground"
                    )}
                  >
                    {tier.shortFor}
                  </span>
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      {/* Spec sheet for the selected plan. Rows are flattened out of the same
          comparison content the desktop table uses, so the two can never drift
          apart. */}
      <dl className="mt-9">
        <Row
          label={cycle === "annual" ? "Annual price" : "Monthly price"}
          value={
            price === null ? (
              <span className="font-display text-2xl font-semibold tracking-[-0.03em]">
                Custom
              </span>
            ) : (
              <span className="font-display text-2xl font-semibold tracking-[-0.03em] tabular-nums">
                ${price}
                <span className="ml-0.5 text-sm font-normal text-muted-foreground">
                  /mo
                </span>
              </span>
            )
          }
        />

        <Row label="Best for" value={selected.shortFor} />

        {pricingComparison.flatMap((group) =>
          group.rows.map((row) => {
            const value = row.values[selected.id] ?? false

            return (
              <Row
                key={`${group.id}-${row.label}`}
                label={row.label}
                muted={value === false}
                value={
                  typeof value === "string" ? (
                    value
                  ) : value ? (
                    <>
                      <Check
                        aria-hidden
                        strokeWidth={2.5}
                        className="size-[1.125rem] text-accent"
                      />
                      <span className="sr-only">Included</span>
                    </>
                  ) : (
                    <>
                      <Minus
                        aria-hidden
                        className="size-4 text-muted-foreground/40"
                      />
                      <span className="sr-only">Not included</span>
                    </>
                  )
                }
              />
            )
          })
        )}
      </dl>

      <Button size="lg" className="mt-8 w-full" asChild>
        <Link href={selected.href}>
          {selected.cta}
          <ArrowRight />
        </Link>
      </Button>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        {price === null
          ? "Annual contract, based on volume"
          : `Per location · billed ${cycle === "annual" ? "annually" : "monthly"}`}
      </p>
    </div>
  )
}

/**
 * Label left, value right, hairline under. `muted` greys the label of a row
 * the plan does not include, so an unavailable feature reads as absent at a
 * glance instead of only via its dash.
 */
function Row({
  label,
  value,
  muted = false,
}: {
  label: string
  value: React.ReactNode
  muted?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-border/60 py-3.5">
      <dt
        className={cn(
          "text-sm",
          muted ? "text-muted-foreground/60" : "text-muted-foreground"
        )}
      >
        {label}
      </dt>
      <dd className="flex shrink-0 items-center text-right text-sm font-semibold text-foreground">
        {value}
      </dd>
    </div>
  )
}
