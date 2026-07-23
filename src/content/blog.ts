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
  | "Front office"
  | "Revenue cycle"
  | "Case study"
  | "Security"
  | "Company"

/** Filter order. "All" is prepended by the list component. */
export const blogCategories: BlogCategory[] = [
  "Product update",
  "Front office",
  "Revenue cycle",
  "Case study",
  "Security",
  "Company",
]

export const blogPosts: BlogPost[] = [
  {
    slug: "release-2-8-multilingual-intake",
    title: "Aurelius 2.8 — multilingual intake and a rebuilt waitlist",
    excerpt:
      "Intake forms now run in Spanish and Mandarin end to end, the waitlist backfills from cancellations within ninety seconds, and eligibility results land on the appointment instead of in a separate queue.",
    category: "Product update",
    date: "2026-07-16",
    readingMinutes: 5,
    author: "Aurelius Product Team",
    version: "v2.8",
    featured: true,
  },
  {
    slug: "release-2-7-denial-appeals",
    title: "Aurelius 2.7 — automated denial appeals and payer rules",
    excerpt:
      "Denials now route by reason code, appeals draft themselves from the original claim and chart notes, and payer-specific rules are editable without a support ticket.",
    category: "Product update",
    date: "2026-06-18",
    readingMinutes: 6,
    author: "Aurelius Product Team",
    version: "v2.7",
  },
  {
    slug: "forty-calls-a-day-to-voicemail",
    title: "The forty calls a day your clinic never hears",
    excerpt:
      "Most practices measure abandoned calls at the switchboard and stop there. The bookings you lose happen after the caller hangs up — and they never show up in a report.",
    category: "Front office",
    date: "2026-07-09",
    readingMinutes: 7,
    author: "Dana Whitfield",
  },
  {
    slug: "prior-auth-is-a-queue-problem",
    title: "Prior authorisation is a queue problem, not a paperwork problem",
    excerpt:
      "Automating the form fills is the easy half. What actually clears the backlog is deciding what a human should still look at, and when.",
    category: "Revenue cycle",
    date: "2026-06-24",
    readingMinutes: 9,
    author: "Priya Raghunathan",
  },
  {
    slug: "release-2-6-epic-integration",
    title: "Aurelius 2.6 — Epic integration and audit exports",
    excerpt:
      "Bidirectional scheduling with Epic, plus signed audit exports you can hand straight to a compliance reviewer.",
    category: "Product update",
    date: "2026-05-21",
    readingMinutes: 4,
    author: "Aurelius Product Team",
    version: "v2.6",
  },
  {
    slug: "no-show-rate-nineteen-to-eleven",
    title: "How one group took its no-show rate from 19% to 11%",
    excerpt:
      "No new staff, no policy change, no deposits. Just follow-up that happens on the days everyone is too busy to make the calls.",
    category: "Case study",
    date: "2026-06-11",
    readingMinutes: 6,
    author: "Tomás Ferreira",
  },
  {
    slug: "what-hipaa-actually-requires-of-ai-vendors",
    title: "What HIPAA actually requires of an AI vendor",
    excerpt:
      "A plain reading of the parts that matter when you are evaluating anything that answers your phones or touches a chart — BAAs, minimum necessary, and audit trails.",
    category: "Security",
    date: "2026-05-28",
    readingMinutes: 11,
    author: "Aurelius Security Team",
  },
  {
    slug: "why-we-price-per-provider",
    title: "Why we price per provider and not per seat",
    excerpt:
      "Clinics add front-desk staff to survive admin load. Charging per seat bills you for the symptom, which is a strange thing to do to the customer you claim to be helping.",
    category: "Company",
    date: "2026-05-14",
    readingMinutes: 4,
    author: "Marcus Oyelaran",
  },
  {
    slug: "eligibility-checks-before-the-visit",
    title: "Running eligibility before the visit, not after the denial",
    excerpt:
      "Front-end eligibility is the cheapest denial you will ever prevent. Here is where the checks actually belong in an intake flow.",
    category: "Revenue cycle",
    date: "2026-04-30",
    readingMinutes: 8,
    author: "Helen Kowalski",
  },
]

/** Newest first, featured post hoisted to the top of the page. */
export const sortedPosts = [...blogPosts].sort(
  (a, b) => Date.parse(b.date) - Date.parse(a.date)
)
