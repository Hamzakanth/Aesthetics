import type { CSSProperties } from "react"

import { cn } from "@/lib/utils"

interface LineFieldProps {
  className?: string
  /** Where the field is brightest, and the origin every layer fades from. */
  originX?: string
  originY?: string
  /** Size of the fade ellipse, as `<x> <y>`. */
  spread?: string
  /**
   * The two off-centre plotted lines. They give an off-centre composition a
   * subject; under a centred one they just read as a stray rule, so layouts
   * with their own focal point turn them off.
   */
  plotted?: boolean
}

/**
 * Static drafting field: two grids at a 1:5 ratio, concentric rings, and two
 * plotted lines. Pure CSS gradients — no SVG, no image bytes, no client JS,
 * and nothing random, so it renders identically on the server.
 *
 * Layered rather than drawn as one texture: each layer carries its own
 * opacity, which is what stops it reading as wallpaper. Colour comes from the
 * parent via `currentColor`; the fade origin is passed as inline custom
 * properties so it inherits to every layer and cannot be lost to class order.
 */
export function LineField({
  className,
  originX = "78%",
  originY = "28%",
  spread = "120% 100%",
  plotted = true,
}: LineFieldProps) {
  return (
    <div
      aria-hidden
      style={
        {
          "--mask-x": originX,
          "--mask-y": originY,
          "--mask-size": spread,
        } as CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      {/* Fine grid — the paper. */}
      <div className="line-grid mask-radial absolute inset-0 opacity-[0.16] [--line-cell:26px]" />

      {/* Coarse grid — the major divisions, at exactly 5× the fine cell so
          the two never disagree about where a line belongs. */}
      <div className="line-grid mask-radial absolute inset-0 opacity-[0.22] [--line-cell:130px]" />

      {/* Rings, struck from the same origin so the field has one centre. */}
      <div
        style={{ "--ring-x": originX, "--ring-y": originY } as CSSProperties}
        className="line-rings mask-radial absolute inset-0 opacity-[0.18] [--ring-gap:96px]"
      />

      {plotted ? (
        <div className="mask-radial absolute inset-0 opacity-30">
          <span className="absolute top-0 left-[22%] h-full w-px bg-gradient-to-b from-transparent via-current to-transparent" />
          <span className="absolute top-[26%] left-0 h-px w-full bg-gradient-to-r from-transparent via-current to-transparent" />
        </div>
      ) : null}

      {/* Accent glow tying the field back to the brand blue. */}
      <div
        className="absolute -top-1/4 right-[-10%] size-[36rem] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--mesh-b) 0%, transparent 70%)",
        }}
      />
    </div>
  )
}
