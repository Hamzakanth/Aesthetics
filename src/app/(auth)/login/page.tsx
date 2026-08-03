import Link from "next/link"
import { Lock } from "lucide-react"

import { buildMetadata } from "@/lib/seo"
import { siteConfig } from "@/config/site"
import { Logo } from "@/components/layout/logo"
import { PointerStage } from "@/components/motion/pointer-stage"
import { AuthBackdrop } from "@/components/auth/auth-backdrop"
import { AuthPitch } from "@/components/auth/auth-pitch"
import { SignInCard } from "@/components/auth/sign-in-card"

export const metadata = buildMetadata({
  title: "Sign in",
  description: "Sign in to the Aurelius front-desk console.",
  path: "/login",
  // Auth screens have no business in an index, and a crawled login page is a
  // steady source of soft-404s and crawl budget waste.
  noIndex: true,
})

/**
 * Sign-in as a lit stage rather than a page.
 *
 * The previous version split the screen into a brand band and a white ground
 * with the card straddling the seam. It worked, but the depth was drawn — a
 * shadow standing in for a third dimension that was not there. This version
 * builds the dimension instead: one pointer-tracked light, five planes of
 * parallax behind the subject, and a card that turns to face the cursor with
 * its own contents standing off its face on separate Z planes.
 *
 * Three decisions hold the whole thing together:
 *
 *  · **Espresso in both themes.** This is a brand surface, like the closing
 *    CTA panel on the marketing site. Light and depth need somewhere dark to
 *    happen; a light-mode auth screen would be back to drawing shadows.
 *  · **The card stays themed.** It is the one object here that is *paper* —
 *    the thing you actually work on — so it follows `--card` and keeps its
 *    contrast in both themes while the room around it stays fixed.
 *  · **Restraint carries it.** Six degrees of tilt, sub-20px of parallax,
 *    one light. The scene should be felt before it is noticed; a screen that
 *    announces its animation is a screen that will be turned off by week two.
 *
 * Every effect degrades to a fade under `prefers-reduced-motion`, and the
 * whole pointer layer is inert on touch, where there is no cursor to track and
 * a tilt would only fight the scroll.
 */
export default function LoginPage() {
  return (
    <PointerStage className="relative isolate min-h-dvh overflow-hidden bg-[var(--stone-950)]">
      <AuthBackdrop />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-5 py-5 sm:px-8 sm:py-7">
        <header className="flex items-center justify-between gap-3">
          <Logo tone="inverted" />

          {/* The way out lives at the top, not buried in the footer. Someone
              who landed here by accident should not have to read a sign-in
              form to find the door. `shrink-0` because the logo will otherwise
              push it off the right edge on a narrow phone. */}
          <Link
            href="/"
            className="shrink-0 rounded-sm text-sm text-white/55 underline-offset-4 transition-colors duration-[--duration-fast] hover:text-white focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            Back to site
          </Link>
        </header>

        {/* Centred rather than top-aligned: the card is the subject of a
            composition now, and a subject sitting high on a dark stage reads
            as an accident. */}
        <div className="grid flex-1 items-center gap-7 py-7 sm:gap-12 sm:py-10 lg:grid-cols-[1fr_25.5rem] lg:gap-16 lg:py-14">
          <AuthPitch />
          <SignInCard />
        </div>

        <footer className="on-stage flex flex-col items-center gap-3 text-xs text-white/45 sm:flex-row sm:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <span className="flex items-center gap-1.5">
              <Lock aria-hidden className="size-3" />
              GDPR compliant · PCI DSS payments
            </span>

            {/* "Is it down, or is it me?" is the first question when a sign-in
                fails on a full day. Answer it before they ask. */}
            <a
              href={siteConfig.links.status}
              className="flex items-center gap-1.5 rounded-sm transition-colors duration-[--duration-fast] hover:text-white"
            >
              <span className="size-1.5 rounded-full bg-[var(--success)]" />
              All systems operational
            </a>
          </div>

          <div className="flex items-center gap-5">
            <Link
              href="/terms"
              className="rounded-sm transition-colors duration-[--duration-fast] hover:text-white"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="rounded-sm transition-colors duration-[--duration-fast] hover:text-white"
            >
              Privacy
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
