import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Container } from "@/components/primitives/container"
import { Section } from "@/components/primitives/section"
import { Reveal } from "@/components/motion/reveal"
import { GradientMesh } from "@/components/motion/gradient-mesh"

export function Cta() {
  return (
    <Section spacing="compact">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl bg-ink px-8 py-16 text-center sm:px-16">
            <GradientMesh tone="ink" fade={false} rules={false} className="-z-0" />

            <div className="relative z-10 flex flex-col items-center">
              <h2 className="max-w-2xl text-display-md font-medium text-ink-foreground">
                Give your studio its front desk back.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-foreground/70 sm:text-lg">
                Thirty minutes, against your own diary and message volume. We
                will tell you which workflows are worth automating and which are
                not.
              </p>

              <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Button size="lg" variant="accent" className="shadow-lift" asChild>
                  <Link href="/contact">
                    Book a walkthrough
                    <ArrowRight />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-ink-foreground hover:bg-ink-foreground/10"
                  asChild
                >
                  <Link href="/#pricing">See pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
