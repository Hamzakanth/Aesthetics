export const siteConfig = {
  name: "Aurelius",
  shortName: "Aurelius",
  tagline: "The AI workforce built for modern healthcare",
  description:
    "Aurelius automates clinic operations — phones, scheduling, prior authorisations and billing. Not an AI scribe: an AI workforce for everything that happens outside the exam room.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ogImage: "/og.png",
  locale: "en_US",
  keywords: [
    "clinic operations automation",
    "healthcare AI agents",
    "medical front office automation",
    "AI phone agent for clinics",
    "prior authorization automation",
    "patient scheduling automation",
    "revenue cycle automation",
  ],
  links: {
    x: "https://x.com/aurelius",
    linkedin: "https://linkedin.com/company/aurelius",
    github: "https://github.com/aurelius",
    docs: "/docs",
    status: "https://status.aurelius.com",
    email: "hello@aurelius.com",
  },
  /** Front-desk support. A clinic that cannot sign in has a waiting room. */
  support: {
    phone: "(415) 555-0142",
    hours: "7am–7pm CT, Mon–Fri",
  },
  company: {
    legalName: "Aurelius Health, Inc.",
    foundedYear: 2021,
    address: "One Market Plaza, San Francisco, CA",
  },
} as const

export type SiteConfig = typeof siteConfig
