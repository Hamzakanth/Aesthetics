"use client"

import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useTransform,
  type Variants,
} from "framer-motion"
import { Mail, ShieldCheck } from "lucide-react"

import { siteConfig } from "@/config/site"
import { ContactForm } from "@/components/forms/contact-form"
import { Parallax, Tilt, usePointer } from "@/components/motion/pointer-stage"

/**
 * The subject of the walkthrough stage: the same lit slab as the sign-in card.
 *
 * This is a deliberate copy of `SignInCard`'s construction rather than a shared
 * abstraction — the two cards hold different content at different heights and
 * the numbers here (tilt, Z planes, shadow spread) are tuned to a form three
 * times as tall. Factoring them together would mean a component with a prop for
 * every one of those decisions, which is a worse thing to own than a second
 * card that reads top to bottom.
 *
 * What must stay identical is the physics: ~6° of turn, contents on separate Z
 * planes, a specular highlight tracking the stage's one light, and a cast
 * shadow leaning *against* the tilt. Drop any of them and the card stops being
 * an object and goes back to being a rectangle.
 */

const TILT_DEGREES = 6

const cardIn: Variants = {
  hidden: { opacity: 0, y: 30, rotateX: 9, scale: 0.975 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1],
      delayChildren: 0.22,
      staggerChildren: 0.08,
    },
  },
}

const reducedCardIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, delayChildren: 0.1, staggerChildren: 0.05 },
  },
}

const planeIn: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

export function WalkthroughCard() {
  const shouldReduceMotion = useReducedMotion()
  const { lightX, lightY } = usePointer()

  const lightXPercent = useTransform(lightX, (value) => value * 100)
  const lightYPercent = useTransform(lightY, (value) => value * 100)

  const rimBackground = useMotionTemplate`
    radial-gradient(20rem 20rem at ${lightXPercent}% ${lightYPercent}%,
      var(--gold-200) 0%,
      color-mix(in oklab, var(--gold-500) 55%, transparent) 24%,
      transparent 58%),
    linear-gradient(180deg,
      color-mix(in oklab, #ffffff 26%, transparent) 0%,
      color-mix(in oklab, #ffffff 4%, transparent) 32%,
      transparent 64%)
  `

  const faceBackground = useMotionTemplate`
    radial-gradient(26rem 22rem at ${lightXPercent}% ${lightYPercent}%,
      color-mix(in oklab, var(--gold-500) 16%, transparent) 0%,
      transparent 62%)
  `

  return (
    <div className="relative isolate w-full">
      {/* --- Cast shadow -------------------------------------------------- */}
      <Parallax
        depth={-20}
        aria-hidden
        className="pointer-events-none absolute inset-x-8 top-14 bottom-[-2.5rem] -z-10"
      >
        <div className="size-full rounded-[2.5rem] bg-black/70 blur-[56px]" />
      </Parallax>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={shouldReduceMotion ? reducedCardIn : cardIn}
        style={{ transformPerspective: 1600 }}
      >
        <Tilt
          strength={TILT_DEGREES}
          perspective={1700}
          // Ink, not themed — the stage is espresso in both themes, so a card
          // following `--card` would arrive warm white on a near-black ground.
          // The whole subtree re-resolves off this one attribute: the form's
          // inputs, labels, select and hairlines all follow without knowing.
          data-surface="ink"
          className="relative rounded-2xl border border-white/10 bg-card p-6 text-card-foreground sm:p-8"
          style={{
            boxShadow:
              "0 2px 6px -2px rgb(0 0 0 / 0.5), 0 40px 90px -30px rgb(0 0 0 / 0.75)",
          }}
        >
          {/* --- Travelling rim light ----------------------------------- */}
          <motion.span
            aria-hidden
            className="rim-light pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ background: rimBackground }}
          />

          {/* --- Face bloom --------------------------------------------- */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
          >
            <span className="absolute inset-0 bg-[linear-gradient(180deg,rgb(255_255_255/0.08)_0%,rgb(255_255_255/0.02)_30%,transparent_60%)]" />
            <motion.span
              className="absolute inset-0"
              style={{ background: faceBackground }}
            />
          </span>

          {/* --- Plane 1: identity (furthest forward) -------------------- */}
          <motion.div
            variants={planeIn}
            style={{ z: 34 }}
            className="relative [transform-style:preserve-3d]"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.14em] text-muted-foreground uppercase">
                <ShieldCheck aria-hidden className="size-3 text-accent" />
                Five fields
              </span>

              <p className="text-right text-xs text-muted-foreground">
                Replies within
                <span className="block font-medium text-foreground">
                  one business day
                </span>
              </p>
            </div>

            <h2 className="mt-4 font-display text-[2.125rem] leading-none font-medium tracking-[-0.02em]">
              Request a walkthrough
            </h2>
          </motion.div>

          {/* --- Plane 2: the form -------------------------------------- */}
          <motion.div
            variants={planeIn}
            style={{ z: 18 }}
            className="relative mt-7 [transform-style:preserve-3d]"
          >
            <ContactForm />
          </motion.div>

          {/* --- Plane 3: the fallback (closest to the face) ------------- */}
          {/* Some people will not fill in a form under any circumstances.
              Giving them the address costs nothing and keeps the lead. */}
          <motion.div
            variants={planeIn}
            style={{ z: 6 }}
            className="relative mt-6 flex items-start gap-2.5 border-t border-border pt-5 text-sm text-muted-foreground [transform-style:preserve-3d]"
          >
            <Mail aria-hidden className="mt-0.5 size-3.5 shrink-0" />
            <p>
              Prefer email?{" "}
              <a
                href={`mailto:${siteConfig.links.email}`}
                className="rounded-sm font-medium text-foreground underline-offset-4 transition-colors duration-[--duration-fast] hover:text-accent hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {siteConfig.links.email}
              </a>
            </p>
          </motion.div>
        </Tilt>
      </motion.div>
    </div>
  )
}
