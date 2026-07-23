import Link from "next/link"

import { footerNav } from "@/config/nav"
import { siteConfig } from "@/config/site"
import { Container } from "@/components/primitives/container"
import { Logo } from "@/components/layout/logo"
import { Badge } from "@/components/ui/badge"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-4">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {siteConfig.tagline}.
            </p>
            <Badge variant="success" className="mt-1">
              <span
                aria-hidden
                className="size-1.5 rounded-full bg-success"
              />
              All systems operational
            </Badge>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
            {footerNav.map((group) => (
              <nav key={group.title} aria-labelledby={`footer-${group.title}`}>
                <h2
                  id={`footer-${group.title}`}
                  className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase"
                >
                  {group.title}
                </h2>
                <ul className="mt-4 flex flex-col gap-3">
                  {group.items.map((item) => (
                    <li key={item.href + item.title}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground transition-colors duration-[--duration-fast] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        {...(item.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {siteConfig.company.legalName}. All
            rights reserved.
          </p>
          <p className="font-mono text-xs tracking-wider text-muted-foreground">
            HIPAA &middot; SOC 2 Type II &middot; BAA on every plan
          </p>
        </div>
      </Container>
    </footer>
  )
}
