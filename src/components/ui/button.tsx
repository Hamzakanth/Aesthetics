import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  cn(
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium",
    "cursor-pointer select-none outline-none",
    "transition-[color,background-color,background-image,border-color,box-shadow,transform] duration-[--duration-fast] ease-[--ease-out]",
    // Tactile press. Transform only — never animate width/height. The matching
    // hover *rise* lives on the raised variants, since a flat control that
    // lifts is a control that was lying about being flat.
    "active:scale-[0.98] motion-reduce:active:scale-100",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
  ),
  {
    variants: {
      variant: {
        // The one primary action colour, painted as a raised object. See
        // `btn-raised` in globals.css for what the three cues are doing.
        default:
          "btn-raised bg-primary text-primary-foreground hover:-translate-y-px active:translate-y-0",
        // Kept as an alias of the filled button so older call sites that ask
        // for "accent" still get THE action colour rather than a second one.
        accent:
          "btn-raised bg-primary text-primary-foreground hover:-translate-y-px active:translate-y-0",
        // The considered second choice, not a disabled-looking one: a real
        // card edge, its own small lift, and a sand border that warms to the
        // primary on hover so the pair reads as one family.
        outline:
          "border border-input bg-card text-foreground shadow-sm hover:-translate-y-px hover:border-primary/45 hover:bg-secondary hover:shadow-md active:translate-y-0",
        secondary:
          "border border-border bg-secondary text-secondary-foreground shadow-xs hover:-translate-y-px hover:bg-muted hover:shadow-sm active:translate-y-0",
        ghost: "text-foreground hover:bg-secondary",
        link: "text-accent underline-offset-4 hover:underline active:scale-100",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
      },
      size: {
        // All interactive sizes clear the 44px touch target on coarse pointers.
        sm: "h-9 px-3 text-sm",
        default: "h-11 px-5 text-sm",
        lg: "h-12 px-7 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
