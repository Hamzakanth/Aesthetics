"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import { mainNav } from "@/config/nav"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Logo } from "@/components/layout/logo"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  // Any navigation closes the sheet, including hash links to the current page
  // which do not change `pathname` and so would otherwise leave it open.
  React.useEffect(() => setOpen(false), [pathname])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="size-[1.15rem]" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="p-6">
        <SheetTitle asChild>
          <Logo onClick={() => setOpen(false)} />
        </SheetTitle>
        <SheetDescription className="sr-only">
          Main site navigation
        </SheetDescription>

        <nav className="mt-6 flex flex-col">
          {mainNav.map((item) => (
            <SheetClose asChild key={item.href + item.title}>
              <Link
                href={item.href}
                className="border-b border-border py-4 text-base font-medium transition-colors hover:text-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {item.title}
              </Link>
            </SheetClose>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          <Button variant="outline" size="lg" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button size="lg" asChild>
            <Link href="/contact">Book a walkthrough</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
