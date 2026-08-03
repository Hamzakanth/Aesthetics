import { cn } from "@/lib/utils"

import { GradientMesh } from "@/components/motion/gradient-mesh"

/**
 * The gradient field behind the top of an inner page.
 *
 * The home page's hero stands in a lit field; every page reached from the nav
 * used to open on flat white, so moving between them read as leaving the site
 * and arriving somewhere plainer. This puts the same field behind the first
 * section of those pages — capped to roughly the first screen and faded out
 * from there, so it frames the heading and then gets out of the way of the
 * content underneath.
 *
 * Costs nothing at runtime worth naming: it is a server component wrapping the
 * `GradientMesh` already shipped for the home page, blog index and CTA panel —
 * no new JavaScript, no new CSS. The mesh animates only `transform` and
 * `opacity`, so the browser composites it on the GPU without paint or layout,
 * and it stops (in place) under `prefers-reduced-motion`. The blur radius is
 * the only real expense, which is why the field is capped in height rather than
 * run down the whole page.
 *
 * `rules` stays off. The hairline grid belongs to the home page's hero, where
 * it is the substrate under the headline; repeated on every page it becomes
 * wallpaper.
 */
export function PageField({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("relative isolate", className)} {...props}>
      {/* `bottom-auto` releases the mesh's own `inset-0`, without which the
          height below is ignored — an absolutely positioned box with both
          edges pinned takes its height from the pin, not the property. */}
      <GradientMesh rules={false} className="bottom-auto h-[36rem]" />
      {children}
    </div>
  )
}
