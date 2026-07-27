"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"

/**
 * Toasts take the design-system tokens rather than Sonner's defaults, so a
 * toast never looks like a different product. Pinned light: the site has one
 * theme, and Sonner's "system" would hand a visitor on a dark OS a black
 * toast on an ivory page.
 */
function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="light"
      position="bottom-right"
      offset={20}
      toastOptions={{
        classNames: {
          toast:
            "!bg-popover !text-popover-foreground !border-border !rounded-lg !shadow-lg !font-sans",
          description: "!text-muted-foreground",
          actionButton: "!bg-primary !text-primary-foreground",
          cancelButton: "!bg-muted !text-muted-foreground",
          error: "!text-destructive",
          success: "!text-success",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
