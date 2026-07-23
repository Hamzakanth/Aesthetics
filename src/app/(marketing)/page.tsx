import { faqs } from "@/content/faq"
import { faqJsonLd, organizationJsonLd } from "@/lib/seo"
import { Hero } from "@/components/sections/hero"
import { LogoCloud } from "@/components/sections/logo-cloud"
import { Features } from "@/components/sections/features"
import { HowItWorks } from "@/components/sections/how-it-works"
import { Metrics } from "@/components/sections/metrics"
import { Testimonials } from "@/components/sections/testimonials"
import { Pricing } from "@/components/sections/pricing"
import { Faq } from "@/components/sections/faq"
import { Cta } from "@/components/sections/cta"

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Values are authored constants, not user input.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([organizationJsonLd(), faqJsonLd(faqs)]),
        }}
      />

      <Hero />
      <LogoCloud />
      {/* Social proof sits immediately after the hero: an owner's first
          question is "which studios like mine use this", not "what are the
          features". */}
      <Testimonials />
      <Features />
      <HowItWorks />
      <Metrics />
      <Pricing />
      <Faq />
      <Cta />
    </>
  )
}
