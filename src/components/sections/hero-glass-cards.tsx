import { CalendarCheck, PhoneIncoming, TrendingUp } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Frosted cards floating over the hero photograph.
 *
 * These do the work a stock photo cannot: they say what the product actually
 * does, at the moment the eye lands on the image. Decorative from an a11y
 * standpoint — every claim here is also stated in the hero copy — so the whole
 * layer is `aria-hidden` rather than read out as orphaned numbers.
 *
 * Positioned in percentages so they track the image as it crops, and hidden
 * below `lg` where the image is a short banner with no room for them.
 */

const LIVE_CALL = {
  icon: PhoneIncoming,
  label: "Incoming call",
  value: "Booked in 38s",
  detail: "New patient · Tue 9:40am",
}

const SLOT = {
  icon: CalendarCheck,
  label: "2:15pm cancellation",
  value: "Backfilled",
  detail: "Waitlist worked automatically",
}

export function HeroGlassCards() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
      {/* Upper card — sits over the glazing, away from faces. */}
      <GlassCard
        icon={LIVE_CALL.icon}
        label={LIVE_CALL.label}
        value={LIVE_CALL.value}
        detail={LIVE_CALL.detail}
        live
        className="animate-float-slow top-[16%] left-[4%] w-60"
      />

      {/* Lower card — offset on both axes so the two never read as a column. */}
      <GlassCard
        icon={SLOT.icon}
        label={SLOT.label}
        value={SLOT.value}
        detail={SLOT.detail}
        className="animate-float-slower bottom-[14%] left-[20%] w-64"
      />

      {/* Compact metric chip, bottom right, anchoring the composition. */}
      <div
        className={cn(
          "glass animate-float-slow absolute top-[46%] right-[6%] rounded-2xl px-4 py-3",
          "motion-reduce:animate-none"
        )}
      >
        <div className="flex items-center gap-2.5">
          <TrendingUp className="size-4 text-accent" />
          <div>
            <p className="font-display text-xl leading-none font-semibold tabular-nums">
              214
            </p>
            <p className="mt-1 text-[0.6875rem] text-muted-foreground">
              calls handled today
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function GlassCard({
  icon: Icon,
  label,
  value,
  detail,
  live = false,
  className,
}: {
  icon: React.ElementType
  label: string
  value: string
  detail: string
  live?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        "glass absolute rounded-2xl p-4 motion-reduce:animate-none",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-lg bg-accent-subtle">
          <Icon className="size-3.5 text-accent" />
        </span>
        <span className="text-[0.6875rem] font-medium text-muted-foreground">
          {label}
        </span>
        {live ? (
          <span className="ml-auto flex items-center gap-1.5">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75 motion-reduce:hidden" />
              <span className="relative inline-flex size-1.5 rounded-full bg-success" />
            </span>
            <span className="font-mono text-[0.625rem] tracking-wider text-success uppercase">
              Live
            </span>
          </span>
        ) : null}
      </div>

      <p className="mt-3 text-sm font-semibold">{value}</p>
      <p className="mt-0.5 text-[0.6875rem] leading-relaxed text-muted-foreground">
        {detail}
      </p>
    </div>
  )
}
