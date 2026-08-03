import Link from "next/link"
import { ShieldCheck } from "lucide-react"

import { buildMetadata } from "@/lib/seo"
import { siteConfig } from "@/config/site"
import { Logo } from "@/components/layout/logo"
import { PointerStage } from "@/components/motion/pointer-stage"
import { AuthBackdrop } from "@/components/auth/auth-backdrop"
import { WalkthroughCard } from "@/components/contact/walkthrough-card"
import {
  WalkthroughAssurances,
  WalkthroughPitch,
} from "@/components/contact/walkthrough-pitch"

export const metadata = buildMetadata({
  title: "Book a walkthrough",
  description:
    "Thirty minutes with the Aurelius team, run against your studio's own diary and message volume.",
  path: "/contact",
})

/**
 * Book a walkthrough, staged like sign-in.
 *
 * The old version was a marketing page: site chrome, a light ground, and a left
 * rail of assurances, stats and a pull quote that a phone had to scroll through
 * before reaching the first field. Two problems in one. The form is the page —
 * everything else is there to get someone into it — and a conversion screen
 * that looks nothing like the product it converts into is a seam the visitor
 * can feel even if they never name it.
 *
 * So it moves onto the same stage as `/login`: espresso in both themes, one
 * pointer-tracked light, the argument on the left leaning one way and the form
 * card on the right leaning the other. Both pages now share `PointerStage`,
 * `AuthBackdrop` and the same card physics, and the handoff between them —
 * "no account? book a walkthrough", "already a customer? sign in" — no longer
 * crosses a visual border.
 *
 * On a phone the persuasion collapses: mark, headline, form. The three
 * assurances move underneath, where they answer a hesitation instead of
 * creating one.
 */
export default function ContactPage() {
  return (
    <PointerStage className="relative isolate min-h-dvh overflow-hidden bg-[var(--stone-950)]">
      <AuthBackdrop />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-5 py-7 sm:px-8">
        <header className="flex items-center justify-between gap-4">
          <Logo tone="inverted" />

          <Link
            href="/"
            className="rounded-sm text-sm text-white/55 underline-offset-4 transition-colors duration-[--duration-fast] hover:text-white focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            Back to site
          </Link>
        </header>

        {/* `items-start` rather than centred: this card is a full form and
            taller than the pitch beside it, so centring would drag the
            headline down into the middle of an empty column. */}
        <div className="grid flex-1 items-start gap-10 py-10 lg:grid-cols-[1fr_31rem] lg:gap-16 lg:py-14">
          <WalkthroughPitch />

          <div className="flex flex-col gap-8">
            <WalkthroughCard />
            <WalkthroughAssurances />
          </div>
        </div>

        <footer className="on-stage flex flex-col items-center gap-3 text-xs text-white/45 sm:flex-row sm:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <span className="flex items-center gap-1.5">
              <ShieldCheck aria-hidden className="size-3" />
              GDPR compliant · Data processing agreement available · PCI DSS
              payments
            </span>
          </div>

          <div className="flex items-center gap-5">
            <Link
              href="/login"
              className="rounded-sm transition-colors duration-[--duration-fast] hover:text-white"
            >
              Already a customer? Sign in
            </Link>
            <span>
              © {new Date().getFullYear()} {siteConfig.name}
            </span>
          </div>
        </footer>
      </div>
    </PointerStage>
  )
}
