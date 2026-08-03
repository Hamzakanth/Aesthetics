import { CalendarCheck, PhoneCall, MessageCircle, TrendingUp } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Frosted pills floating over the hero photograph.
 *
 * Deliberately smaller than cards: each one is a single fact the product
 * produces, placed in the quiet corners of the image so the centred headline
 * keeps the middle to itself. Decorative from an a11y standpoint — every
 * claim here is also stated in the hero copy — so the layer is `aria-hidden`
 * rather than read out as orphaned numbers.
 *
 * Positioned in percentages so they track the image as it crops, and hidden
 * below `lg` where there is no margin either side of the copy to hold them.
 */

const TAGS = [
  {
    icon: CalendarCheck,
    text: "Appointment booked in 38s",
    live: true,
    className: "animate-float-slow top-[22%] left-[3%]",
  },
  {
    icon: PhoneCall,
    text: "97 calls handled today",
    className: "animate-float-slower top-[38%] right-[4%]",
  },
  {
    icon: MessageCircle,
    text: "Instagram DM answered at 11:40pm",
    className: "animate-float-slower bottom-[26%] left-[7%]",
  },
  {
    icon: TrendingUp,
    text: "2:15pm cancellation refilled",
    className: "animate-float-slow bottom-[20%] right-[8%]",
  },
]

export function HeroFloatingTags() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden lg:block"
    >
      {TAGS.map(({ icon: Icon, text, live, className }) => (
        <div
          key={text}
          className={cn(
            "glass absolute flex items-center gap-2.5 rounded-full py-2 pr-4 pl-2.5",
            "motion-reduce:animate-none",
            className
          )}
        >
          <span className="flex size-6 items-center justify-center rounded-full bg-accent-subtle">
            <Icon className="size-3.5 text-accent" />
          </span>
          <span className="text-xs font-medium whitespace-nowrap">{text}</span>
          {live ? (
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75 motion-reduce:hidden" />
              <span className="relative inline-flex size-1.5 rounded-full bg-success" />
            </span>
          ) : null}
        </div>
      ))}
    </div>
  )
}
