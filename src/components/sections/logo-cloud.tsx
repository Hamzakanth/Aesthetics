import { cn } from "@/lib/utils"
import { logos } from "@/content/testimonials"
import { Container } from "@/components/primitives/container"

export function LogoCloud() {
  return (
    <section className="border-y border-border bg-muted/30 py-10">
      <Container>
        <p className="text-center font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
          Running the front desk at
        </p>

        {/* Duplicated track: the -50% translate makes the loop seamless.
            aria-hidden on the clone so the names are announced only once. */}
        <div className="mask-fade-x mt-7 overflow-hidden">
          <ul className="flex w-max animate-marquee items-center gap-14 motion-reduce:animate-none motion-reduce:justify-center motion-reduce:gap-10">
            {[false, true].map((isClone) =>
              logos.map((name) => (
                <li
                  key={`${name}-${String(isClone)}`}
                  aria-hidden={isClone || undefined}
                  className={cn(
                    "font-display text-xl font-semibold tracking-[-0.03em] text-muted-foreground/70",
                    "transition-colors duration-[--duration-base] hover:text-foreground",
                    // With the animation off, the duplicate track is dead weight.
                    isClone && "motion-reduce:hidden"
                  )}
                >
                  {name}
                </li>
              ))
            )}
          </ul>
        </div>
      </Container>
    </section>
  )
}
