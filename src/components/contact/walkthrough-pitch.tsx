"use client"

import { motion, useReducedMotion, type Variants } from "framer-motion"
import { CalendarClock, MessageSquare, ShieldCheck } from "lucide-react"

import { testimonials, trustStats } from "@/content/testimonials"
import { Armillary } from "@/components/auth/armillary"
import { Parallax, Tilt } from "@/components/motion/pointer-stage"

/**
 * The left half of the walkthrough stage — the sign-in page's `AuthPitch` with
 * a different argument to make.
 *
 * Same composition rules, deliberately: mark and eyebrow, a display headline
 * carrying the only gold in the copy, and a glass pane that leans *against* the
 * form card so the near plane separates from the far one. Two objects turning
 * opposite ways is what makes this read as a room; matching the sign-in page
 * exactly is what makes the two pages read as one product.
 *
 * The pane answers "what am I actually signing up for" — the question that
 * stops someone one field into a form. It is desktop-only, because on a phone
 * every line of it is a line between the person and the first field. The three
 * points come back under the form there (see `WalkthroughAssurances`), where
 * they reassure instead of delay.
 */

/** Three points, one supporting line each. Any more and the rail becomes a
 *  second page competing with the form it exists to support. */
const ASSURANCES = [
  {
    icon: CalendarClock,
    title: "Thirty minutes, one call",
    body: "Run against your own diary and message volume — not a slide deck.",
  },
  {
    icon: MessageSquare,
    title: "An implementer, not a rep",
    body: "Whoever joins can answer booking-system questions on the spot.",
  },
  {
    icon: ShieldCheck,
    title: "Nothing touches your diary",
    body: "The walkthrough runs on sample data. No integration, no commitment.",
  },
] as const

/** The two numbers most likely to matter to someone still deciding. */
const RAIL_STATS = [trustStats[0], trustStats[2]]

/** The shortest quote in the set — the pane is supporting cast, and a
 *  four-line pull quote beside a form is a wall, not proof. */
const quote = testimonials[2]

const group: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
}

const reducedItem: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
}

export function WalkthroughPitch() {
  const shouldReduceMotion = useReducedMotion()
  const variants = shouldReduceMotion ? reducedItem : item

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={group}
      className="relative flex flex-col"
    >
      {/* --- Mark + eyebrow ---------------------------------------------- */}
      <motion.div variants={variants} className="flex items-center gap-4">
        <Armillary className="size-12 lg:size-16" />
        <span className="font-mono text-[0.6875rem] leading-relaxed tracking-[0.22em] text-white/55 uppercase">
          Book a
          <span className="block text-white/35">walkthrough</span>
        </span>
      </motion.div>

      {/* --- Headline ----------------------------------------------------- */}
      {/* Parallax on the copy, not tilt: type that rotates has to keystone,
          and keystoned display type is the fastest way to make an expensive
          screen look cheap. */}
      <Parallax depth={-8} className="mt-8 max-w-lg lg:mt-10">
        <motion.h1
          variants={variants}
          className="font-display text-[2.5rem] leading-[1.06] font-medium tracking-[-0.015em] text-balance text-white sm:text-5xl lg:text-[3.4rem]"
        >
          See Aurelius run
          <br />
          <span className="text-[var(--gold-300)]">your front desk.</span>
        </motion.h1>

        <motion.p
          variants={variants}
          className="mt-5 hidden max-w-md text-lg leading-relaxed text-white/70 lg:block"
        >
          Tell us which booking system you use and roughly how many messages a
          day you get. We&rsquo;ll arrive with the relevant workflows already
          configured.
        </motion.p>
      </Parallax>

      {/* --- Assurance pane ----------------------------------------------- */}
      <motion.div
        variants={variants}
        className="relative mt-12 hidden w-[23rem] lg:block"
      >
        <Tilt
          invert
          strength={9}
          perspective={1300}
          lift={30}
          className="glass-dark relative rounded-2xl p-5"
        >
          <div className="flex items-center justify-between gap-3 [transform:translateZ(20px)]">
            <p className="font-mono text-[0.625rem] tracking-[0.18em] text-white/50 uppercase">
              What the call is
            </p>
            <span className="on-stage flex items-center gap-1.5">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--success)] opacity-75 motion-reduce:hidden" />
                <span className="relative inline-flex size-1.5 rounded-full bg-[var(--success)]" />
              </span>
              <span className="font-mono text-[0.625rem] tracking-[0.14em] text-white/50 uppercase">
                Booking this week
              </span>
            </span>
          </div>

          <ul className="mt-4 flex flex-col gap-3.5 [transform:translateZ(12px)]">
            {ASSURANCES.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex items-start gap-3.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <Icon aria-hidden className="size-4 text-[var(--gold-300)]" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm text-white/85">{title}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-white/45">
                    {body}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          {/* Proof, in the order it gets believed: numbers, then a person
              willing to be named. */}
          <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-4 [transform:translateZ(12px)]">
            {RAIL_STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display text-2xl leading-none font-medium tabular-nums text-white">
                  {stat.value}
                </dd>
                <p className="mt-1.5 text-xs text-white/45">{stat.label}</p>
              </div>
            ))}
          </dl>
        </Tilt>

        {/* A second, smaller object at a different depth and rate. Two panes
            tell you there is a scene; one only tells you there is a card. */}
        {quote ? (
          <Tilt
            invert
            strength={13}
            perspective={1100}
            lift={70}
            aria-hidden
            className="glass-dark animate-float-slow absolute -right-20 -bottom-10 w-[15rem] rounded-xl px-4 py-3 motion-reduce:animate-none"
          >
            <p className="text-xs leading-relaxed text-white/75">
              &ldquo;{quote.quote}&rdquo;
            </p>
            <p className="mt-2 font-mono text-[0.625rem] tracking-[0.14em] text-white/40 uppercase">
              {quote.author} · {quote.company}
            </p>
          </Tilt>
        ) : null}
      </motion.div>
    </motion.div>
  )
}

/**
 * The same three points, under the form, phone only.
 *
 * Flat and unanimated: by the time someone scrolls past the form they are
 * checking a fact, not being introduced to a scene.
 */
export function WalkthroughAssurances() {
  return (
    <ul className="flex flex-col gap-4 lg:hidden">
      {ASSURANCES.map(({ icon: Icon, title, body }) => (
        <li key={title} className="flex items-start gap-3.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <Icon aria-hidden className="size-4 text-[var(--gold-300)]" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm text-white/85">{title}</span>
            <span className="mt-0.5 block text-xs leading-relaxed text-white/45">
              {body}
            </span>
          </span>
        </li>
      ))}
    </ul>
  )
}
