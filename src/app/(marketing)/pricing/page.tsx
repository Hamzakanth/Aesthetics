import { faqs } from "@/content/faq"
import { buildMetadata, faqJsonLd } from "@/lib/seo"
import { PageField } from "@/components/primitives/page-field"
import { Pricing } from "@/components/sections/pricing"
import { Faq } from "@/components/sections/faq"
import { Cta } from "@/components/sections/cta"

export const metadata = buildMetadata({
  title: "Pricing",
  description:
    "Plans for single-room studios through to multi-site clinics, monthly or annual. No per-message billing and no setup fee.",
  path: "/pricing",
})

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Values are authored constants, not user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
      />

      <PageField>
        <Pricing />
      </PageField>
      <Faq />
      <Cta />
    </>
  )
}
