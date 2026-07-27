export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  /** Drives the filter bar on /blog. Keep to the set below. */
  category: BlogCategory
  /** ISO date — formatted at render so the list stays locale-correct. */
  date: string
  readingMinutes: number
  author: string
  /** Release tag, product updates only. Rendered as a chip on the card. */
  version?: string
  featured?: boolean
}

export type BlogCategory =
  | "Product update"
  | "Front of house"
  | "Retention"
  | "Case study"
  | "Client data"
  | "Company"

/** Filter order. "All" is prepended by the list component. */
export const blogCategories: BlogCategory[] = [
  "Product update",
  "Front of house",
  "Retention",
  "Case study",
  "Client data",
  "Company",
]

export const blogPosts: BlogPost[] = [
  {
    slug: "release-2-8-dm-booking-and-waitlist",
    title: "Aurelius 2.8 — Instagram booking and a rebuilt waitlist",
    excerpt:
      "DMs now book end to end without leaving the thread, the waitlist refills a cancellation within ninety seconds, and patch-test rules sit on the treatment instead of in someone's head.",
    category: "Product update",
    date: "2026-07-16",
    readingMinutes: 5,
    author: "Aurelius Product Team",
    version: "v2.8",
    featured: true,
  },
  {
    slug: "release-2-7-reminders-and-policies",
    title: "Aurelius 2.7 — reminders, confirmations and policy rules",
    excerpt:
      "Reminders now follow your own cancellation policy, confirmations chase themselves, and the awkward late-cancellation message is written for you.",
    category: "Product update",
    date: "2026-06-18",
    readingMinutes: 6,
    author: "Aurelius Product Team",
    version: "v2.7",
  },
  {
    slug: "thirty-dms-a-day-your-studio-never-reads",
    title: "The thirty DMs a day your studio never reads",
    excerpt:
      "Most owners measure missed calls and stop there. The bookings you lose happen in an inbox nobody owns — and they never show up in a report.",
    category: "Front of house",
    date: "2026-07-09",
    readingMinutes: 7,
    author: "Dana Whitfield",
  },
  {
    slug: "rebooking-is-an-interval-problem",
    title: "Rebooking is an interval problem, not a reminder problem",
    excerpt:
      "Sending everyone a text at six weeks is not retention. What actually fills the diary is knowing which treatment wants which gap, and asking then.",
    category: "Retention",
    date: "2026-06-24",
    readingMinutes: 9,
    author: "Priya Raghunathan",
  },
  {
    slug: "release-2-6-fresha-integration",
    title: "Aurelius 2.6 — Fresha integration and consent exports",
    excerpt:
      "Two-way diary sync with Fresha, plus signed consent and patch-test exports you can hand straight to an insurer.",
    category: "Product update",
    date: "2026-05-21",
    readingMinutes: 4,
    author: "Aurelius Product Team",
    version: "v2.6",
  },
  {
    slug: "no-show-rate-nineteen-to-eleven",
    title: "How one clinic took its no-show rate from 19% to 11%",
    excerpt:
      "No new staff, no price change, no shouting about policies. Just follow-up that happens on the days everyone is too busy to send it.",
    category: "Case study",
    date: "2026-06-11",
    readingMinutes: 6,
    author: "Tomás Ferreira",
  },
  {
    slug: "what-gdpr-asks-of-a-beauty-studio",
    title: "What GDPR actually asks of a beauty studio",
    excerpt:
      "A plain reading of the parts that matter when you hold skin histories, consent forms and before photos — lawful basis, retention, and who gets to see the pictures.",
    category: "Client data",
    date: "2026-05-28",
    readingMinutes: 11,
    author: "Aurelius Data Team",
  },
  {
    slug: "why-we-price-per-location",
    title: "Why we price per location and not per seat",
    excerpt:
      "Studios add front-desk cover to survive the message volume. Charging per seat bills you for the symptom, which is a strange thing to do to the customer you claim to be helping.",
    category: "Company",
    date: "2026-05-14",
    readingMinutes: 4,
    author: "Marcus Oyelaran",
  },
  {
    slug: "consultations-before-the-chair",
    title: "Run the consultation before they sit in the chair",
    excerpt:
      "A questionnaire filled in at the door is a questionnaire nobody reads. Here is where the consent, the patch test and the photos actually belong in a booking flow.",
    category: "Front of house",
    date: "2026-04-30",
    readingMinutes: 8,
    author: "Helen Kowalski",
  },
]

/** Newest first, featured post hoisted to the top of the page. */
export const sortedPosts = [...blogPosts].sort(
  (a, b) => Date.parse(b.date) - Date.parse(a.date)
)
