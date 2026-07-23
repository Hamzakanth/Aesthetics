import { cn } from "@/lib/utils"

interface GradientMeshProps extends React.ComponentProps<"div"> {
  /** `light` sits on the white page; `ink` sits on the dark CTA panel. */
  tone?: "light" | "ink"
  /** Fade the field out toward the bottom so it meets the page cleanly. */
  fade?: boolean
  /** Draw the Swiss hairline grid over the field. */
  rules?: boolean
}

/**
 * Animated gradient field, Stripe-register.
 *
 * Purely decorative: `aria-hidden`, never focusable, never carries meaning.
 * Three blurred blobs drift on independent cycles (22s / 28s / 34s) so the
 * composite never visibly loops. Because only `transform` and `opacity`
 * animate, the browser composites the whole field on the GPU — no paint, no
 * layout, no main-thread cost while scrolling.
 *
 * Under `prefers-reduced-motion` the blobs stop but stay in place: the colour
 * field is part of the design; only the movement is optional.
 */
export function GradientMesh({
  tone = "light",
  fade = true,
  rules = true,
  className,
  ...props
}: GradientMeshProps) {
  return (
    <div
      aria-hidden
      data-mesh-tone={tone}
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        fade && "mask-fade-b",
        className
      )}
      {...props}
    >
      {/* Blob A — primary blue, upper left. */}
      <div
        style={{ background: "var(--mesh-a)" }}
        className="absolute -top-1/3 -left-[15%] size-[46rem] animate-drift-a rounded-full blur-[110px] will-change-transform motion-reduce:animate-none"
      />

      {/* Blob B — deeper blue, right. Counter-drifts against A. */}
      <div
        style={{ background: "var(--mesh-b)" }}
        className="absolute -top-[10%] -right-[18%] size-[40rem] animate-drift-b rounded-full blur-[120px] will-change-transform motion-reduce:animate-none"
      />

      {/* Blob C — pale blue, centre low. Lifts the middle of the field. */}
      <div
        style={{ background: "var(--mesh-c)" }}
        className="absolute top-[25%] left-[28%] size-[34rem] animate-drift-c rounded-full blur-[130px] will-change-transform motion-reduce:animate-none"
      />

      {/* Breathing sheen over the top — what reads as "alive" rather than
          "a static gradient". */}
      <div
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, var(--accent-subtle), transparent 70%)",
        }}
        className="absolute inset-0 animate-sheen motion-reduce:animate-none"
      />

      {/* Hairline grid held at low opacity: reads as precision, not decoration.
          The Swiss substrate under the Stripe field. */}
      {rules ? <div className="grid-rules absolute inset-0 opacity-50" /> : null}
    </div>
  )
}
