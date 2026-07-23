import Link from "next/link"
import { Check, Lock, Phone } from "lucide-react"

import { buildMetadata } from "@/lib/seo"
import { siteConfig } from "@/config/site"
import { Logo } from "@/components/layout/logo"
import { LineField } from "@/components/motion/line-field"
import { LoginForm } from "@/components/forms/login-form"

export const metadata = buildMetadata({
  title: "Sign in",
  description: "Sign in to the Aurelius front-desk console.",
  path: "/login",
  // Auth screens have no business in an index, and a crawled login page is a
  // steady source of soft-404s and crawl budget waste.
  noIndex: true,
})

/**
 * Brand band across the top with the card straddling its lower edge. The
 * overlap is the whole trick: it ties the two halves into one composition and
 * puts the card on a boundary, which is the most attention-holding place on
 * the page.
 *
 * The band is a fixed share of the viewport rather than a fixed height, so
 * the card crosses it at the same point on every screen.
 */
export default function LoginPage() {
  return (
    <div className="relative isolate min-h-dvh overflow-hidden bg-background">
      {/* ---- Brand band ------------------------------------------------- */}
      {/* Espresso in both themes: this is a brand surface, like the ink CTA
          panel on the marketing site, not a themed one. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[40%] min-h-[15rem] overflow-hidden bg-[linear-gradient(135deg,var(--stone-950)_0%,var(--stone-900)_45%,var(--stone-700)_100%)] lg:h-[72%] lg:min-h-[26rem]"
      >
        {/* Animated here and nowhere else: a sign-in screen is a wait, not a
            read, so slow drift on the band gives the eye something to do
            without competing with the form. */}
        <LineField
          className="text-white"
          originX="34%"
          originY="46%"
          animated
        />
        {/* Softens the hard bottom edge into the page below it. */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-black/10" />
      </div>

      <div className="relative mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-5 py-7 sm:px-8">
        <Logo tone="inverted" />

        <div className="grid flex-1 items-start gap-7 pt-7 lg:grid-cols-[1fr_25.5rem] lg:items-stretch lg:gap-14 lg:pt-12">
          {/* ---- Left: the pitch, then the device's own accounts --------- */}
          {/* Centred against the card now that nothing sits beneath it. */}
          <div className="flex h-full flex-col lg:justify-center lg:pb-20">
            {/* Written for the person actually signing in at 8:15am — a studio
                manager or front-of-house lead — not for the person who bought
                it. It says what happened while they were closed and what is
                waiting, in their words. */}
            <div className="max-w-md">
              <h1 className="font-display text-3xl leading-[1.1] font-medium tracking-[-0.012em] text-balance text-white sm:text-4xl lg:text-[3rem]">
                Your messages were answered.
                <br />
                Your diary is full.
              </h1>
              {/* Persuasion is desktop-only. On a phone every line here is a
                  line between the person and the password field. */}
              <p className="mt-4 hidden text-lg leading-relaxed font-medium text-white/85 lg:block">
                Sign in to see what Aurelius handled overnight — and the few
                things it held back for a human.
              </p>

              <ul className="mt-7 hidden flex-col gap-2.5 text-sm text-white/75 lg:flex">
                {[
                  "Calls, DMs and cancellations already worked",
                  "Deposits taken, patch tests booked",
                  "Anything uncertain waiting in one inbox",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2.5">
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ---- Right: the card straddling the band edge ---------------- */}
          {/* `self-start` so the card keeps its natural height — the column
              stretches to centre the copy beside it, the card must not. */}
          <div className="w-full self-start rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Welcome to{" "}
                <span className="font-semibold text-accent">
                  {siteConfig.name}
                </span>
              </p>
              <p className="text-right text-xs text-muted-foreground">
                No account?{" "}
                <Link
                  href="/contact"
                  className="block rounded-sm font-medium text-accent underline-offset-4 transition-colors duration-[--duration-fast] hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  Book a walkthrough
                </Link>
              </p>
            </div>

            <h2 className="mt-2 mb-7 text-3xl font-semibold tracking-[-0.03em]">
              Sign in
            </h2>

            <LoginForm />

            {/* A locked-out front desk has clients in reception and a phone
                ringing. A phone number beats a help centre article. */}
            <div className="mt-6 flex items-start gap-2.5 border-t border-border pt-5 text-sm text-muted-foreground">
              <Phone aria-hidden className="mt-0.5 size-3.5 shrink-0" />
              <p>
                Locked out mid-shift?{" "}
                <a
                  href={`tel:${siteConfig.support.phone.replace(/[^+\d]/g, "")}`}
                  className="rounded-sm font-medium text-foreground underline-offset-4 transition-colors duration-[--duration-fast] hover:text-accent hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {siteConfig.support.phone}
                </a>
                <span className="mt-0.5 block text-xs">
                  {siteConfig.support.hours}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <span className="flex items-center gap-1.5">
              <Lock aria-hidden className="size-3" />
              GDPR compliant · PCI DSS payments
            </span>

            {/* "Is it down, or is it me?" is the first question when a sign-in
                fails on a full day. Answer it before they ask. */}
            <a
              href={siteConfig.links.status}
              className="flex items-center gap-1.5 rounded-sm transition-colors duration-[--duration-fast] hover:text-foreground"
            >
              <span className="size-1.5 rounded-full bg-success" />
              All systems operational
            </a>
          </div>

          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="rounded-sm transition-colors duration-[--duration-fast] hover:text-foreground"
            >
              Back to site
            </Link>
            <Link
              href="/terms"
              className="rounded-sm transition-colors duration-[--duration-fast] hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="rounded-sm transition-colors duration-[--duration-fast] hover:text-foreground"
            >
              Privacy
            </Link>
            <span>
              © {new Date().getFullYear()} {siteConfig.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
