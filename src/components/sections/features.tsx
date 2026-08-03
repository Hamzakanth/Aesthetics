import { Container } from "@/components/primitives/container"
import { Section } from "@/components/primitives/section"
import { SectionHeading } from "@/components/primitives/section-heading"
import { FeatureShowcase } from "@/components/sections/feature-showcase"
import { FeatureShowcaseMobile } from "@/components/sections/feature-showcase-mobile"

export function Features() {
  return (
    <Section id="features" aria-labelledby="features-heading">
      <Container>
        <SectionHeading
          headingId="features-heading"
          eyebrow="What it does"
          title="Five jobs your front desk no longer has to do"
          description="Turn them on one at a time or all at once. Each one is measured against the work it replaced, not against a demo."
        />

        {/* Not five static cards but one device doing all five jobs. Two
            layouts, because the shape of that idea is different on each: a
            control/display split on a wide screen, one swipeable card per job
            on a phone. Each owns its own motion, autoplay and reduced-motion
            fallbacks, and only the visible one runs its timer. */}
        <FeatureShowcase />
        <FeatureShowcaseMobile />
      </Container>
    </Section>
  )
}
