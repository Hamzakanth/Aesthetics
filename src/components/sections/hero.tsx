import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ShieldCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/primitives/container"
import { RevealGroup, RevealItem } from "@/components/motion/reveal"
import { HeroFloatingTags } from "@/components/sections/hero-floating-tags"

import heroAesthetics from "@/assets/Aesthetics.png"

/* Channel chips. Small enough to read as texture rather than a feature list —
   they name the surfaces Aurelius answers on without pulling weight off the
   headline. */
const CHANNELS = [
  "Phone calls",
  "Instagram DMs",
  "WhatsApp",
  "Web enquiries",
  "Waitlist refills",
]

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/*
        The photograph is now the ground for the whole section rather than a
        right-hand column, so the copy sits centred over it. `priority` because
        this is the LCP element on the home page.
      */}
      <div aria-hidden className="absolute inset-0 -z-20">
        <Image
          src={heroAesthetics}
          alt=""
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          className="object-cover object-center"
        />
      </div>

      {/*
        Two scrims, not one. The flat ivory wash lifts the whole frame to the
        pale key the brand runs at; the vertical gradient then re-darkens the
        very top and bottom edges just enough that the section meets the header
        and the next block without a seam. Text contrast comes from the wash —
        without it the headline lands on the studio lighting and fails AA.
      */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-background/10" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-background/35 via-transparent to-background"
      />

      {/* A soft ellipse of ivory directly under the copy. This is what buys
          the headline its contrast now that the flat wash is light enough to
          let the room show through — local, so the photograph stays readable
          everywhere the text isn't. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 [background:radial-gradient(ellipse_55%_50%_at_50%_46%,var(--background)_0%,color-mix(in_oklab,var(--background)_72%,transparent)_42%,transparent_75%)]"
      />

      <HeroFloatingTags />

      <Container>
        <RevealGroup className="flex flex-col items-center py-20 text-center sm:py-28 lg:py-36">
          <RevealItem>
            <Badge
              variant="outline"
              className="gap-2 border-border/70 bg-background/60 py-1 pr-3 pl-1.5 backdrop-blur-sm"
            >
              <span className="rounded-full bg-accent-subtle px-2 py-0.5 font-mono text-[0.6875rem] tracking-wider text-accent uppercase">
                Not a chatbot
              </span>
              <span className="text-muted-foreground">
                A front desk that never misses
              </span>
            </Badge>
          </RevealItem>

          <RevealItem>
            {/* One h1. The second line is a span, not an h3 — a lower heading
                level above an h1 breaks the document outline. */}
            <h1 className="mt-7 max-w-4xl text-display-lg font-medium text-gradient">
              Every enquiry answered.
              <span className="block text-accent italic">
                Every chair filled.
              </span>
            </h1>
          </RevealItem>

          <RevealItem>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-balance">
              Aurelius runs your front of house. It answers the calls and the
              DMs, fills cancelled slots, confirms visits and brings clients
              back &mdash; so your team can look after the room instead of the
              phone.
            </p>
          </RevealItem>

          <RevealItem className="mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/contact">
                Book a walkthrough
                <ArrowRight />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/how-it-works">See how it works</Link>
            </Button>
          </RevealItem>

          <RevealItem>
            <p className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck aria-hidden className="size-4 text-accent" />
              GDPR compliant &middot; PCI DSS payments &middot; Works with your
              existing diary
            </p>
          </RevealItem>

          {/* Channel tags sit last: they answer the "on what, exactly?"
              question the paragraph raises, and only once the CTAs have had
              their moment. */}
          <RevealItem className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {CHANNELS.map((channel) => (
              <span
                key={channel}
                className="rounded-full border border-border/60 bg-background/55 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm"
              >
                {channel}
              </span>
            ))}
          </RevealItem>
        </RevealGroup>
      </Container>
    </section>
  )
}
