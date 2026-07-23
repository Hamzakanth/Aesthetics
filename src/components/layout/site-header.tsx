"use client"

import Link from "next/link"

import { mainNav } from "@/config/nav"
import { cn } from "@/lib/utils"
import { useScrollThreshold } from "@/hooks/use-scroll-threshold"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/layout/logo"
import { MobileNav } from "@/components/layout/mobile-nav"
import { ThemeToggle } from "@/components/layout/theme-toggle"

export function SiteHeader() {
  const scrolled = useScrollThreshold(8)

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full",
        "transition-[background-color,border-color,backdrop-filter] duration-[--duration-base] ease-[--ease-out]",
        scrolled
          ? "border-b border-border bg-background/75 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-5 sm:px-8">
        <Logo />

        <nav aria-label="Main" className="hidden lg:flex lg:items-center lg:gap-1">
          {mainNav.map((item) => (
            <Link
              key={item.href + item.title}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground",
                "transition-colors duration-[--duration-fast] hover:text-foreground",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />
          <Button variant="ghost" size="sm" className="hidden lg:inline-flex" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button size="sm" className="hidden lg:inline-flex" asChild>
            <Link href="/contact">Book a demo</Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
