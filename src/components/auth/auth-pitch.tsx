"use client"

import { motion, useReducedMotion, type Variants } from "framer-motion"
import { CalendarCheck, MessageSquare, UserRound } from "lucide-react"

import { Armillary } from "@/components/auth/armillary"
import { Parallax, Tilt } from "@/components/motion/pointer-stage"

/**
 * The left half of the stage: what happened while the studio was closed.
 *
 * Written for the person actually signing in at 8:15am — a studio manager or
 * front-of-house lead — not for the person who bought it. It says what was
 * handled overnight and what is waiting, in their words.
 *
 * The overnight brief is a floating pane rather than a bullet list because it
 * has a second job here: it leans the *opposite* way to the sign-in card, and
 * two objects turning against each other is what separates the near plane from
 * the far one. A list of ticks would have said the same thing and left the
 * scene flat.
 *
 * Every claim on this side is decorative in the accessibility sense — the copy
 * states it too — but these are real, readable words, so they stay in the
 * accessibility tree rather than being hidden.
 */

const BRIEF = [
  {
    icon: MessageSquare,
    value: "14",
    label: "messages answered",
    detail: "Calls, DMs and texts",
  },
  {
    icon: CalendarCheck,
    value: "6",
    label: "appointments booked",
    detail: "Including two waitlist refills",
  },
  {
    icon: UserRound,
    value: "2",
    label: "held for a human",
    detail: "Waiting in one inbox",
  },
] as const

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

export function AuthPitch() {
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
      <motion.div variants={variants} className="flex items-center gap-3 sm:gap-4">
        <Armillary className="size-10 sm:size-12 lg:size-16" />
        <span className="font-mono text-[0.6875rem] leading-relaxed tracking-[0.22em] text-white/55 uppercase">
          Front desk
          <span className="block text-white/35">console</span>
        </span>
      </motion.div>

      {/* --- Headline ----------------------------------------------------- */}
      {/* Parallax on the copy, not tilt. Type that rotates has to keystone,
          and keystoned type at a display size is the fastest way to make an
          expensive-looking screen look cheap. A few px of drift gives it the
          same sense of standing in the scene at no cost to the letterforms. */}
      {/* Mobile trades display size for reach: at 2.5rem this ran to three
          lines and pushed the Sign in button under the fold, which is the one
          thing an auth screen cannot do. The line break is desktop-only for
          the same reason. */}
      <Parallax depth={-8} className="mt-5 max-w-lg sm:mt-8 lg:mt-10">
        <motion.h1
          variants={variants}
          className="font-display text-[1.75rem] leading-[1.12] font-medium tracking-[-0.015em] text-balance text-white sm:text-5xl sm:leading-[1.06] lg:text-[3.4rem]"
        >
          Your messages were answered.{" "}
          <br className="hidden sm:block" />
          <span className="text-[var(--gold-300)]">Your diary is full.</span>
        </motion.h1>

        {/* Persuasion is desktop-only. On a phone every line here is a line
            between the person and the password field. */}
        <motion.p
          variants={variants}
          className="mt-5 hidden max-w-md text-lg leading-relaxed text-white/70 lg:block"
        >
          Sign in to see what Aurelius handled overnight — and the few things it
          held back for a human.
        </motion.p>
      </Parallax>

      {/* --- Overnight brief ---------------------------------------------- */}
      {/* Held back below lg: at that width the stage is only tall enough for
          one object, and it has to be the card. */}
      <motion.div
        variants={variants}
        className="relative mt-12 hidden w-[22rem] lg:block"
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
              Overnight brief
            </p>
            <span className="on-stage flex items-center gap-1.5">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--success)] opacity-75 motion-reduce:hidden" />
                <span className="relative inline-flex size-1.5 rounded-full bg-[var(--success)]" />
              </span>
              <span className="font-mono text-[0.625rem] tracking-[0.14em] text-white/50 uppercase">
                11pm — 8:15am
              </span>
            </span>
          </div>

          <ul className="mt-4 flex flex-col gap-3.5 [transform:translateZ(12px)]">
            {BRIEF.map(({ icon: Icon, value, label, detail }) => (
              <li key={label} className="flex items-center gap-3.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <Icon
                    aria-hidden
                    className="size-4 text-[var(--gold-300)]"
                  />
                </span>
                <span className="min-w-0">
                  <span className="flex items-baseline gap-1.5">
                    <span className="font-display text-xl leading-none font-medium tabular-nums text-white">
                      {value}
                    </span>
                    <span className="text-sm text-white/80">{label}</span>
                  </span>
                  <span className="mt-0.5 block text-xs text-white/45">
                    {detail}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Tilt>

        {/* A second, smaller object at a different depth and a different
            rate. Two panes tell you there is a scene; one only ever tells you
            there is a card. */}
        <Tilt
          invert
          strength={13}
          perspective={1100}
          lift={70}
          aria-hidden
          className="glass-dark animate-float-slow absolute -right-16 -bottom-9 rounded-xl px-3.5 py-2.5 motion-reduce:animate-none"
        >
          <p className="font-mono text-[0.625rem] tracking-[0.14em] text-white/45 uppercase">
            2:15pm cancellation
          </p>
          <p className="mt-1 text-sm font-medium text-white">
            Refilled from the waitlist
          </p>
        </Tilt>
      </motion.div>
    </motion.div>
  )
}
