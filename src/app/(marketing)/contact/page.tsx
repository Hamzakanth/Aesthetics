import Link from "next/link"
import { CalendarClock, Mail, MessageSquare, ShieldCheck } from "lucide-react"

import { buildMetadata } from "@/lib/seo"
import { siteConfig } from "@/config/site"
import { testimonials, trustStats } from "@/content/testimonials"
import { Container } from "@/components/primitives/container"
import { Eyebrow } from "@/components/primitives/section-heading"
import { GradientMesh } from "@/components/motion/gradient-mesh"
import { ContactForm } from "@/components/forms/contact-form"

export const metadata = buildMetadata({
  title: "Book a demo",
  description:
    "Thirty minutes with the Aurelius team, run against your clinic's own schedule and call volume.",
  path: "/contact",
})

/** Three points, one supporting line each. Enough to answer "what am I
 *  signing up for" without turning the rail into a second page. */
const ASSURANCES = [
  {
    icon: CalendarClock,
    title: "Thirty minutes, one call",
    body: "Run against your own schedule and call volume — not a slide deck.",
  },
  {
    icon: MessageSquare,
    title: "An implementer, not a rep",
    body: "Whoever joins can answer EHR and payer questions on the spot.",
  },
  {
    icon: ShieldCheck,
    title: "Nothing touches your EHR",
    body: "The demo runs on sample data. No integration, no commitment.",
  },
]

/** The two numbers most likely to matter to someone still deciding. */
const RAIL_STATS = [trustStats[0], trustStats[2]]

/** The shortest quote in the set — the rail is supporting cast, and a
 *  four-line pull quote beside a form is a wall, not proof. */
const quote = testimonials[2]

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden">
      <GradientMesh rules={false} />

      <Container className="py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* ---- Left rail: what this is ---------------------------------- */}
          <div className="lg:col-span-5">
            {/* Sticks while the form scrolls, so the context stays visible on
                tall viewports without duplicating it inside the card. */}
            <div className="flex flex-col gap-8 lg:sticky lg:top-28">
              <div className="flex flex-col gap-4">
                <Eyebrow>Book a demo</Eyebrow>
                <h1 className="text-display-sm font-semibold text-gradient">
                  See Aurelius run your front office
                </h1>
                <p className="text-base leading-relaxed text-muted-foreground text-balance sm:text-lg">
                  Tell us your EHR and rough call volume. We&rsquo;ll arrive
                  with the relevant workflows already configured.
                </p>
              </div>

              {/* Numbered, because these read as a sequence: what the call is,
                  who joins, what it costs you to try. */}
              <ol className="flex flex-col">
                {ASSURANCES.map(({ icon: Icon, title, body }, i) => (
                  <li key={title} className="relative flex gap-4 pb-5 last:pb-0">
                    {/* Connector, drawn behind the markers and stopped short
                        of the last one. */}
                    {i < ASSURANCES.length - 1 ? (
                      <span
                        aria-hidden
                        className="absolute top-10 bottom-2 left-[1.125rem] w-px bg-border"
                      />
                    ) : null}

                    <span className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card shadow-xs">
                      <Icon aria-hidden className="size-4 text-accent" />
                    </span>

                    <div className="pt-1">
                      <p className="text-sm font-medium">{title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              {/* Proof, in the order it gets believed: numbers, then a person
                  who is willing to be named. */}
              <div className="flex flex-col gap-6 border-t border-border pt-7">
                <dl className="grid grid-cols-2 gap-6">
                  {RAIL_STATS.map((stat) => (
                    <div key={stat.label}>
                      <dt className="sr-only">{stat.label}</dt>
                      <dd className="font-display text-3xl font-semibold tracking-[-0.03em] tabular-nums">
                        {stat.value}
                      </dd>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </dl>

                {quote ? (
                  <figure className="rounded-xl border border-border bg-card/60 p-5 shadow-xs">
                    <blockquote className="text-sm leading-relaxed text-foreground">
                      &ldquo;{quote.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-4 flex items-center gap-3">
                      <span
                        aria-hidden
                        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-xs font-semibold text-accent"
                      >
                        {quote.initials}
                      </span>
                      <span className="text-sm">
                        <span className="font-medium">{quote.author}</span>
                        <span className="block text-xs text-muted-foreground">
                          {quote.role}, {quote.company}
                        </span>
                      </span>
                    </figcaption>
                  </figure>
                ) : null}

                <Link
                  href={`mailto:${siteConfig.links.email}`}
                  className="group flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <Mail
                    aria-hidden
                    className="size-4 transition-colors group-hover:text-accent"
                  />
                  Prefer email? {siteConfig.links.email}
                </Link>
              </div>
            </div>
          </div>

          {/* ---- Right: the form ----------------------------------------- */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-md sm:p-8">
              <div className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-border pb-5">
                <div className="flex flex-col gap-1.5">
                  <h2 className="text-lg font-semibold">Request a demo</h2>
                  <p className="text-sm text-muted-foreground">
                    Five fields. Replies within one business day.
                  </p>
                </div>

                {/* Availability signal, in the one place someone is deciding
                    whether the form is worth filling in. */}
                <span className="flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  <span aria-hidden className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent/70 motion-reduce:hidden" />
                    <span className="relative inline-flex size-2 rounded-full bg-accent" />
                  </span>
                  Booking this week
                </span>
              </div>

              <ContactForm />
            </div>

            {/* Compliance answers the objection the form itself raises. One
                line — the logo wall that used to sit here repeated the
                homepage and pushed the page a screen longer for nothing. */}
            <p className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
              <ShieldCheck aria-hidden className="size-3.5 text-accent" />
              HIPAA-eligible infrastructure · Signed BAA available · SOC 2 Type
              II
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
