import { buildMetadata } from "@/lib/seo"
import { Testimonials } from "@/components/sections/testimonials"
import { LogoCloud } from "@/components/sections/logo-cloud"
import { Metrics } from "@/components/sections/metrics"
import { Cta } from "@/components/sections/cta"

export const metadata = buildMetadata({
  title: "Studios using Aurelius",
  description:
    "The clinics and aesthetics studios running Aurelius as their front desk, in their own words — with the numbers behind them.",
  path: "/studios",
})

export default function StudiosPage() {
  return (
    <>
      <Testimonials />
      <LogoCloud />
      <Metrics />
      <Cta />
    </>
  )
}
