import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Monospace eyebrow. The one place mono type appears in the marketing site —
 * it reads as a system label, which is the Linear/Stripe cue.
 */
function Eyebrow({ className, children, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="eyebrow"
      className={cn(
        "flex items-center gap-2.5 font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase",
        className
      )}
      {...props}
    >
      <span aria-hidden className="h-px w-6 bg-accent" />
      {children}
    </p>
  )
}

interface SectionHeadingProps
  extends Omit<React.ComponentProps<"div">, "title"> {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  align?: "left" | "center"
  as?: "h1" | "h2" | "h3"
  /** Applied to the heading itself so `aria-labelledby` names the section
   *  with the title alone, not the eyebrow and description as well. */
  headingId?: string
}

function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Heading = "h2",
  headingId,
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div
      data-slot="section-heading"
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
      {...props}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Heading id={headingId} className="max-w-2xl text-display-sm font-semibold">
        {title}
      </Heading>
      {description ? (
        <p
          className={cn(
            "max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}

export { Eyebrow, SectionHeading }
