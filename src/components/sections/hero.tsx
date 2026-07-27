import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ShieldCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/primitives/container"
import { RevealGroup, RevealItem } from "@/components/motion/reveal"
import { GradientMesh } from "@/components/motion/gradient-mesh"
import { HeroGlassCards } from "@/components/sections/hero-glass-cards"

import heroAesthetics from "@/assets/Aesthetics.png"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Mesh sits behind the photograph and carries the empty left column.
          Rules are off here — the photo already supplies the visual texture. */}
      <GradientMesh rules={false} />

      <Container>
        <div className="grid items-center gap-0 lg:grid-cols-12">
          <RevealGroup className="flex flex-col items-start py-16 text-left sm:py-24 lg:col-span-6 lg:py-32">
            <RevealItem>
              <Badge variant="outline" className="gap-2 py-1 pr-3 pl-1.5">
                <span className="rounded-full bg-accent-subtle px-2 py-0.5 font-mono text-[0.6875rem] tracking-wider text-accent uppercase">
                  Not a chatbot
                </span>
                <span className="text-muted-foreground">
                  A front desk that never misses
                </span>
              </Badge>
            </RevealItem>

            <RevealItem>
              {/* One h1. The second line is a span, not an h3 — a lower
                  heading level above an h1 breaks the document outline. */}
              <h1 className="mt-7 max-w-2xl text-display-lg font-medium text-gradient">
                The AI front desk for
                <span className="block text-accent italic">
                  aesthetic studios
                </span>
              </h1>
            </RevealItem>

            <RevealItem>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-balance">
                Aurelius runs your front of house. It answers the calls and the
                DMs, fills cancelled slots, confirms visits and brings clients
                back &mdash; so your team can look after the room instead of the
                phone.
              </p>
            </RevealItem>

            <RevealItem className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/contact">
                  Book a walkthrough
                  <ArrowRight />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/#how-it-works">See how it works</Link>
              </Button>
            </RevealItem>

            <RevealItem>
              <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck aria-hidden className="size-4 text-accent" />
                GDPR compliant &middot; PCI DSS payments &middot; Works with your
                existing diary
              </p>
            </RevealItem>
          </RevealGroup>
        </div>
      </Container>

      {/*
        Unlike the photograph this replaced, the artwork carries its own tinted
        field all the way to the left edge — so the mask below is now load
        bearing rather than a refinement. Without it the image ends on a hard
        vertical seam against the ivory ground.

        One <Image> reflowed by breakpoint rather than two elements, so the
        browser only ever fetches the asset once. `priority` because this is
        the LCP element on the home page.
      */}
      <div
        className={
          "relative -mt-4 h-64 w-full sm:h-80 " +
          "lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:h-full lg:w-[56%]"
        }
      >
        {/* The mask lives on a wrapper, not on <Image> itself — masking the
            image directly would take the glass cards with it. */}
        <div className="mask-hero-b lg:mask-hero absolute inset-0">
          <Image
            src={heroAesthetics}
            alt="A client resting with her eyes closed after a facial treatment, her skin traced with fine contour lines."
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 56vw"
            placeholder="blur"
            // The subject sits in the right fifth of a 1.9:1 source; the rest
            // is soft field. The container is far taller than that ratio, so
            // cover crops horizontally — anchoring right is what keeps her in
            // frame at every width.
            className="object-cover object-right"
          />
        </div>

        <HeroGlassCards />
      </div>
    </section>
  )
}
