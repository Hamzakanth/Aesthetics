import { buildMetadata } from "@/lib/seo"
import { Features } from "@/components/sections/features"
import { Cta } from "@/components/sections/cta"

export const metadata = buildMetadata({
  title: "What Aurelius does",
  description:
    "An AI front desk for aesthetics studios: booking and waitlist, consultations and consents, reminders that cut no-shows — working inside the diary you already use.",
  path: "/features",
})

/**
 * The home page carries these sections as part of one scrolling narrative;
 * this route exists so the same material has a crawlable URL, its own title
 * and its own canonical. Home stays canonical for "/" — see `buildMetadata`.
 */
export default function FeaturesPage() {
  return (
    <>
      <Features />
      <Cta />
    </>
  )
}
