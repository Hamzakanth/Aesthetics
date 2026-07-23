import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ShieldCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/primitives/container"
import { RevealGroup, RevealItem } from "@/components/motion/reveal"
import { GradientMesh } from "@/components/motion/gradient-mesh"
import { HeroGlassCards } from "@/components/sections/hero-glass-cards"

import heroClinic from "@/assets/hero-clinic.png"

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
                  Not a scribe
                </span>
                <span className="text-muted-foreground">
                  An AI workforce for the front office
                </span>
              </Badge>
            </RevealItem>

            <RevealItem>
              {/* One h1. The second line is a span, not an h3 — a lower
                  heading level above an h1 breaks the document outline. */}
              <h1 className="mt-7 max-w-2xl text-display-lg font-semibold text-gradient">
                The AI workforce built for
                <span className="block text-accent">modern healthcare</span>
              </h1>
            </RevealItem>

            <RevealItem>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-balance">
                Aurelius runs your clinic&rsquo;s operations. It answers the
                phones, fills cancelled slots, chases prior authorisations and
                posts payments &mdash; so your staff can look after patients
                instead of paperwork.
              </p>
            </RevealItem>

            <RevealItem className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/contact">
                  Book a demo
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
                HIPAA compliant &middot; SOC 2 Type II &middot; Works with your
                existing EHR
              </p>
            </RevealItem>
          </RevealGroup>
        </div>
      </Container>

      {/*
        The photograph is authored with a white gradient falling off to the
        left, so it dissolves into the page rather than sitting in a box —
        no mask or overlay needed on a white ground.

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
            src={heroClinic}
            alt="A clinic receptionist taking a call at the front desk while two clinicians confer behind her."
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 56vw"
            placeholder="blur"
            // The subject (reception desk) sits in the right third of the
            // source image; the left two thirds are its white fall-off.
            // Anchoring right keeps the people in frame at every crop width.
            className="object-cover object-right"
          />
        </div>

        <HeroGlassCards />
      </div>
    </section>
  )
}
