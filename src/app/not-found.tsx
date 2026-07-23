import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Container } from "@/components/primitives/container"
import { Section } from "@/components/primitives/section"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"

/**
 * Catches unmatched URLs across the whole app, so it renders under the root
 * layout and has to bring its own chrome — a 404 with no way out is worse
 * than the 404 itself.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" className="flex-1">
        <Section spacing="loose">
          <Container className="flex flex-col items-center text-center">
            <p className="font-mono text-sm tracking-[0.14em] text-accent uppercase">
              Error 404
            </p>
            <h1 className="mt-5 text-display-md font-semibold">
              This page is not in the graph
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              The link may be out of date, or the page may have moved. Neither
              is your fault.
            </p>
            <Button size="lg" className="mt-9" asChild>
              <Link href="/">
                <ArrowLeft />
                Back to home
              </Link>
            </Button>
          </Container>
        </Section>
      </main>
      <SiteFooter />
    </div>
  )
}
