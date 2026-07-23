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
  /**
   * Opt-in motion: the paper drifts by one cell, the rings breathe, and a
   * plotter head travels each struck line. Off by default — most surfaces
   * using this field sit behind reading copy, where drift is a distraction.
   * CSS-only, so the component stays a server component; the global
   * reduced-motion rule stops all of it.
   */
  animated?: boolean
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
 *
 * Each layer is a masked wrapper holding an inner element that does the
 * moving. The mask has to sit on something that stays put, or the fade
 * travels with the layer and the whole field visibly slides.
 */
export function LineField({
  className,
  originX = "78%",
  originY = "28%",
  spread = "120% 100%",
  plotted = true,
  animated = false,
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
      <div className="mask-radial absolute inset-0 opacity-[0.16]">
        <div
          className={cn(
            // Overdrawn past every edge so a drifting layer never exposes a
            // corner as it travels its one cell.
            "line-grid absolute -inset-[140px] [--line-cell:26px]",
            animated &&
              "animate-[field-drift_28s_linear_infinite] motion-reduce:animate-none"
          )}
        />
      </div>

      {/* Coarse grid — the major divisions, at exactly 5× the fine cell so
          the two never disagree about where a line belongs. Drifts on a 5×
          cycle too, which keeps the two grids in register for the whole loop
          instead of sliding through each other. */}
      <div className="mask-radial absolute inset-0 opacity-[0.22]">
        <div
          className={cn(
            "line-grid absolute -inset-[140px] [--line-cell:130px]",
            animated &&
              "animate-[field-drift_140s_linear_infinite] motion-reduce:animate-none"
          )}
        />
      </div>

      {/* Rings, struck from the same origin so the field has one centre. */}
      <div className="mask-radial absolute inset-0 opacity-[0.18]">
        <div
          style={{ "--ring-x": originX, "--ring-y": originY } as CSSProperties}
          className={cn(
            "line-rings absolute inset-0 [--ring-gap:96px]",
            animated &&
              "animate-[field-breathe_17s_ease-in-out_infinite] motion-reduce:animate-none"
          )}
        />
      </div>

      {plotted ? (
        <div className="mask-radial absolute inset-0 opacity-30">
          <span className="absolute top-0 left-[22%] h-full w-px bg-gradient-to-b from-transparent via-current to-transparent" />
          <span className="absolute top-[26%] left-0 h-px w-full bg-gradient-to-r from-transparent via-current to-transparent" />

          {animated ? (
            <>
              {/* Plotter heads. Clipped to the line's own track so the bright
                  segment can only ever appear on a line that is already
                  drawn — a light with no rail under it reads as a glitch.
                  Offset cycles so the two never cross at the intersection. */}
              <span className="absolute top-0 left-[22%] h-full w-px overflow-hidden">
                <span className="absolute inset-x-0 h-[22%] animate-[trace-y_13s_ease-in-out_infinite] bg-gradient-to-b from-transparent via-current to-transparent motion-reduce:animate-none" />
              </span>
              <span className="absolute top-[26%] left-0 h-px w-full overflow-hidden">
                <span className="absolute inset-y-0 w-[18%] animate-[trace-x_19s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-current to-transparent motion-reduce:animate-none" />
              </span>
            </>
          ) : null}
        </div>
      ) : null}

      {/* Accent glow tying the field back to the brand blue. */}
      <div
        className={cn(
          "absolute -top-1/4 right-[-10%] size-[36rem] rounded-full opacity-60 blur-3xl",
          animated &&
            "animate-[drift-c_31s_ease-in-out_infinite] motion-reduce:animate-none"
        )}
        style={{
          background:
            "radial-gradient(circle, var(--mesh-b) 0%, transparent 70%)",
        }}
      />
    </div>
  )
}
