"use client"

import * as React from "react"
import Link from "next/link"
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useTransform,
  type Variants,
} from "framer-motion"
import { Phone, ShieldCheck } from "lucide-react"

import { siteConfig } from "@/config/site"
import { LoginForm } from "@/components/forms/login-form"
import { Parallax, Tilt, usePointer } from "@/components/motion/pointer-stage"

/**
 * The subject of the composition: a lit slab standing on the stage.
 *
 * Four things together make it read as an object rather than as a rectangle
 * with a tilt effect bolted on, and dropping any one of them collapses the
 * illusion:
 *
 *  1. It turns to face the pointer — but only ~6°. Past about 10° the type
 *     starts to keystone and the whole thing reads as a novelty.
 *  2. Its contents stand on separate Z planes, so turning it produces real
 *     parallax between the heading, the form and the footer. This is the part
 *     almost nobody does, and it is the part the eye actually reads as depth.
 *  3. A specular highlight travels its edge, tracking the same light every
 *     other layer on the stage agrees on.
 *  4. Its cast shadow leans *against* the tilt. The light is fixed; the object
 *     moves. A shadow that leans with the object is the tell that there was
 *     never any light at all.
 */

/** Peak rotation at the far edge of the viewport. Restraint is the design. */
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

/**
 * Content arrives from *behind* its resting plane, not from below it. On a
 * stage this deep, a plain fade-up reads as a web page pasted onto the object;
 * coming forward in Z reads as the object assembling.
 */
const planeIn: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

export function SignInCard() {
  const shouldReduceMotion = useReducedMotion()
  const { lightX, lightY } = usePointer()

  // The light is tracked across the whole viewport and mapped onto the card,
  // so a hand crossing the screen sweeps the highlight right around the edge.
  // Physically generous, but a highlight that only lives while the cursor is
  // over the card is a highlight nobody ever sees.
  const lightXPercent = useTransform(lightX, (value) => value * 100)
  const lightYPercent = useTransform(lightY, (value) => value * 100)

  // Gold at the hot spot, falling to nothing — plus a fixed top-edge sheen so
  // the card still has a lit edge before the pointer has moved at all.
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

  // Warm bloom where the light lands, and a matching shade on the far side.
  // The shade is what curves the face. A highlight on its own just looks like
  // a stain, and it is also the only version of this that survives the light
  // theme, where a white glare on a warm-white card is invisible.
  const faceBackground = useMotionTemplate`
    radial-gradient(26rem 22rem at ${lightXPercent}% ${lightYPercent}%,
      color-mix(in oklab, var(--gold-500) 16%, transparent) 0%,
      transparent 62%)
  `

  // The wrapper takes `isolate`, deliberately not `perspective`. The camera
  // belongs to the object (see Tilt) — a perspective here would compose with
  // the entrance transform's own and quietly deepen it. All this wrapper owes
  // the composition is a stacking context to hold the shadow behind the card.
  return (
    <div className="relative isolate w-full">
      {/* --- Cast shadow -------------------------------------------------- */}
      {/* Behind and below, leaning against the tilt. Blurred once and then
          only ever translated, so it costs nothing per frame. */}
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
          // Ink, not themed. The stage is espresso in both themes, so a card
          // following `--card` arrives warm white on a near-black ground —
          // a cut-out rather than an object standing in the room. The whole
          // subtree re-resolves off this one attribute: the filled button
          // becomes gold on dark, the fields go espresso, every label and
          // hairline follows. Nothing inside had to know.
          data-surface="ink"
          className="relative rounded-2xl border border-white/10 bg-card p-6 text-card-foreground sm:p-8"
          style={{
            // Two shadows: a tight contact edge that keeps the card attached
            // to the stage, and a wide soft one that gives it height above it.
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
          {/* Clipped, so it needs its own rounding — and being a leaf, its
              flattening context cannot reach the Z planes below. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
          >
            {/* Fixed lift, under the moving light. Espresso on espresso is
                only a few points of luminance apart, so without a lit top
                edge the card reads as a hole cut in the stage rather than a
                slab standing on it. The shadows give it height; this is what
                gives it a top face. */}
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
                Secure sign-in
              </span>

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

            <h2 className="mt-4 font-display text-[2.125rem] leading-none font-medium tracking-[-0.02em]">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to the {siteConfig.name} front-desk console.
            </p>
          </motion.div>

          {/* --- Plane 2: the form -------------------------------------- */}
          <motion.div
            variants={planeIn}
            style={{ z: 18 }}
            className="relative mt-7 [transform-style:preserve-3d]"
          >
            <LoginForm />
          </motion.div>

          {/* --- Plane 3: the fallback (closest to the face) ------------- */}
          {/* A locked-out front desk has clients in reception and a phone
              ringing. A phone number beats a help centre article. */}
          <motion.div
            variants={planeIn}
            style={{ z: 6 }}
            className="relative mt-6 flex items-start gap-2.5 border-t border-border pt-5 text-sm text-muted-foreground [transform-style:preserve-3d]"
          >
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
          </motion.div>
        </Tilt>
      </motion.div>
    </div>
  )
}
