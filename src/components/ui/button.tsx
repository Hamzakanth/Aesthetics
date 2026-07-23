import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  cn(
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium",
    "cursor-pointer select-none outline-none",
    "transition-[color,background-color,border-color,box-shadow,transform] duration-[--duration-fast] ease-[--ease-out]",
    // Tactile press. Scale only — never animate width/height.
    "active:scale-[0.97] motion-reduce:active:scale-100",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
  ),
  {
    variants: {
      variant: {
        // Blue-tinted lift rather than a grey drop shadow — the filled button
        // should look like it is emitting the brand colour, not sitting on dirt.
        default:
          "bg-primary text-primary-foreground shadow-lift hover:bg-primary/90",
        accent:
          "bg-accent text-accent-foreground shadow-lift hover:bg-accent/90",
        outline:
          "border border-border bg-card text-foreground shadow-xs hover:bg-muted",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "text-foreground hover:bg-muted",
        link: "text-foreground underline-offset-4 hover:underline active:scale-100",
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
