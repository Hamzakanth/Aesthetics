"use client"

import type { CSSProperties } from "react"

import { LineField } from "@/components/motion/line-field"
import { Parallax } from "@/components/motion/pointer-stage"

/**
 * The room the sign-in card stands in.
 *
 * Espresso in both themes. This is a brand surface, like the closing CTA panel
 * on the marketing site — not a themed one. A light-mode auth screen would
 * have to fake its depth with drop shadows; a dark one can use actual light,
 * which is the whole point of the composition.
 *
 * Five planes, back to front: ground, aurora, drafting field, dust, vignette.
 * Each moves at its own rate against the pointer. Motion parallax is the only
 * depth cue on a flat screen that the eye trusts without being told, and it is
 * why this reads as a room rather than as a gradient.
 */

/**
 * Fixed, never random. The server and the client have to draw the same sky,
 * and `Math.random()` in a component body guarantees they will not.
 *
 * Three bands, tuned so the near dust is larger, brighter and faster than the
 * far dust. Uniform particles read as noise; graded ones read as distance.
 */
const MOTE_BANDS = [
  {
    depth: -10,
    blur: "blur-[1.5px]",
    motes: [
      { left: "12%", top: "22%", size: 3, duration: 11, delay: 0 },
      { left: "31%", top: "68%", size: 2, duration: 14, delay: 2.4 },
      { left: "58%", top: "16%", size: 2, duration: 12, delay: 5.1 },
      { left: "77%", top: "74%", size: 3, duration: 15, delay: 1.2 },
      { left: "91%", top: "38%", size: 2, duration: 13, delay: 3.7 },
    ],
  },
  {
    depth: 16,
    blur: "blur-[0.5px]",
    motes: [
      { left: "22%", top: "44%", size: 4, duration: 9, delay: 1.6 },
      { left: "44%", top: "82%", size: 3, duration: 10.5, delay: 4.2 },
      { left: "66%", top: "30%", size: 4, duration: 8.5, delay: 0.8 },
      { left: "84%", top: "58%", size: 3, duration: 11.5, delay: 2.9 },
    ],
  },
  {
    depth: 42,
    blur: "",
    motes: [
      { left: "17%", top: "56%", size: 5, duration: 7, delay: 3.1 },
      { left: "50%", top: "12%", size: 4, duration: 7.8, delay: 0.4 },
      { left: "72%", top: "88%", size: 5, duration: 6.6, delay: 5.6 },
    ],
  },
] as const

export function AuthBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* --- Ground ------------------------------------------------------ */}
      {/* Lit from the upper left and falling to near-black at the lower
          right, so the scene has a light direction before a single object is
          placed in it. Everything below agrees with this one decision. */}
      <div className="absolute inset-0 bg-[radial-gradient(125%_105%_at_16%_-8%,var(--stone-700)_0%,var(--stone-900)_34%,var(--stone-950)_72%)]" />

      {/* --- Aurora ------------------------------------------------------ */}
      {/* Furthest plane, so it moves least and against the pointer. Gold is
          the only colour this brand spends, and here it is spent as light
          rather than as paint. */}
      <Parallax depth={-24} className="absolute inset-0">
        <div
          className="animate-drift-a absolute -top-[22%] -left-[10%] size-[46rem] rounded-full opacity-[0.55] blur-[130px] motion-reduce:animate-none"
          style={{
            background:
              "radial-gradient(circle, var(--gold-600) 0%, transparent 68%)",
          }}
        />
        <div
          className="animate-drift-b absolute top-[38%] -right-[14%] size-[40rem] rounded-full opacity-40 blur-[140px] motion-reduce:animate-none"
          style={{
            background:
              "radial-gradient(circle, var(--gold-500) 0%, transparent 70%)",
          }}
        />
        {/* One cool note against two warm ones. Without it the whole field
            goes monochrome amber and stops reading as light in a room. */}
        <div
          className="animate-drift-c absolute bottom-[-18%] left-[26%] size-[34rem] rounded-full opacity-30 blur-[120px] motion-reduce:animate-none"
          style={{
            background:
              "radial-gradient(circle, var(--stone-400) 0%, transparent 72%)",
          }}
        />
      </Parallax>

      {/* --- Drafting field ---------------------------------------------- */}
      {/* The house texture, kept from the previous screen because it is the
          one element here that is unmistakably Aurelius. Sits between the
          aurora and the dust so the grid reads as a wall, not as an overlay. */}
      <Parallax depth={-12} className="absolute inset-0">
        <LineField
          className="text-white"
          originX="26%"
          originY="40%"
          spread="140% 120%"
          animated
        />
      </Parallax>

      {/* --- Dust -------------------------------------------------------- */}
      {MOTE_BANDS.map((band) => (
        <Parallax
          key={band.depth}
          depth={band.depth}
          className="absolute inset-0 hidden lg:block"
        >
          {band.motes.map((mote) => (
            <span
              key={`${mote.left}-${mote.top}`}
              className={`absolute rounded-full bg-[var(--gold-300)] motion-reduce:animate-none ${band.blur}`}
              style={
                {
                  left: mote.left,
                  top: mote.top,
                  width: mote.size,
                  height: mote.size,
                  boxShadow: "0 0 12px 2px color-mix(in oklab, var(--gold-400) 55%, transparent)",
                  animation: `mote ${mote.duration}s var(--ease-in-out) ${mote.delay}s infinite`,
                } as CSSProperties
              }
            />
          ))}
        </Parallax>
      ))}

      {/* --- Vignette + horizon ------------------------------------------ */}
      {/* Pulls the corners down so the eye lands on the card without anything
          having to shout. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_95%_at_50%_42%,transparent_28%,rgb(0_0_0/0.62)_100%)]" />
      {/* A single bright hairline along the top edge. Cheap, and it is what
          stops a dark screen looking like an unpainted one. */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
    </div>
  )
}
