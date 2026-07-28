import { buildMetadata } from "@/lib/seo"
import { HowItWorks } from "@/components/sections/how-it-works"
import { Metrics } from "@/components/sections/metrics"
import { Cta } from "@/components/sections/cta"

export const metadata = buildMetadata({
  title: "How Aurelius works",
  description:
    "Live in a week, not a season. Aurelius starts read-only and earns write access — you see its judgement against your real diary before it touches anything.",
  path: "/how-it-works",
})

export default function HowItWorksPage() {
  return (
    <>
      <HowItWorks />
      <Metrics />
      <Cta />
    </>
  )
}
