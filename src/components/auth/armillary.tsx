import type { CSSProperties } from "react"

import { cn } from "@/lib/utils"

/**
 * The auth screen's signature mark: three gold hoops turning on their own axes
 * around a lit core.
 *
 * The reference is an armillary sphere — the brass instrument, which is where
 * the brand's Roman name and its gold both already point. It earns its place
 * for a second reason: a sign-in is a wait, and an object that is visibly
 * *turning* tells you the screen is alive during the second or two before the
 * password lands.
 *
 * Genuinely three-dimensional, not a drawing of one. Each ring is a plain
 * circular border rotating about Y; the foreshortening that collapses it to a
 * line and opens it out again is the browser projecting a real rotation, which
 * is why it never reads as a spinner. Pure CSS, so this stays a server
 * component with no hydration cost and no client JS.
 *
 * `--orbit-tilt` and `--orbit-pitch` give each hoop its resting attitude, and
 * mismatched, prime-ish periods keep the three from ever re-synchronising into
 * an obvious loop.
 */

interface ArmillaryProps {
  className?: string
}

const RINGS = [
  {
    inset: "inset-0",
    border: "border-[color:var(--gold-500)]/70",
    style: { "--orbit-tilt": "0deg", "--orbit-pitch": "-14deg" },
    animation: "orbit 19s linear infinite",
  },
  {
    inset: "inset-[13%]",
    border: "border-[color:var(--gold-300)]/55",
    style: { "--orbit-tilt": "62deg", "--orbit-pitch": "-8deg" },
    animation: "orbit 27s linear infinite reverse",
  },
  {
    inset: "inset-[27%]",
    border: "border-white/35",
    style: { "--orbit-tilt": "-48deg", "--orbit-pitch": "-20deg" },
    animation: "orbit 13s linear infinite",
  },
] as const

export function Armillary({ className }: ArmillaryProps) {
  return (
    <div
      aria-hidden
      className={cn("relative size-16 shrink-0", className)}
      // The whole instrument is pitched back a little so the hoops are read
      // from slightly above. Flat on, three rotating circles just look like
      // circles.
      style={{
        transform: "perspective(520px) rotateX(16deg)",
        transformStyle: "preserve-3d",
      }}
    >
      {RINGS.map((ring) => (
        <span
          key={ring.inset}
          className={cn(
            "absolute rounded-full border motion-reduce:animate-none",
            ring.inset,
            ring.border
          )}
          style={
            {
              ...ring.style,
              animation: ring.animation,
              transformStyle: "preserve-3d",
            } as CSSProperties
          }
        />
      ))}

      {/* The core. Sits on the sphere's centre plane rather than on the front
          face, so the near half of every hoop passes in front of it — the one
          detail that stops the whole thing reading as flat. */}
      <span
        className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--gold-300)]"
        style={{
          boxShadow:
            "0 0 18px 4px color-mix(in oklab, var(--gold-400) 70%, transparent)",
        }}
      />
    </div>
  )
}
