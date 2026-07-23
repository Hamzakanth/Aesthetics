export const siteConfig = {
  name: "Aurelius",
  shortName: "Aurelius",
  tagline: "The AI front desk for aesthetic and beauty studios",
  description:
    "Aurelius runs the front of house for aesthetic clinics, skin studios, nail bars and laser rooms — calls, DMs, bookings, consultations, deposits and rebooking. Not a chatbot: a front desk that never misses.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ogImage: "/og.png",
  locale: "en_US",
  keywords: [
    "aesthetic clinic software",
    "AI receptionist for salons",
    "med spa booking automation",
    "nail salon front desk automation",
    "skin studio client management",
    "salon deposits and no-show automation",
    "beauty studio rebooking software",
  ],
  links: {
    x: "https://x.com/aurelius",
    instagram: "https://instagram.com/aurelius",
    linkedin: "https://linkedin.com/company/aurelius",
    docs: "/docs",
    status: "https://status.aurelius.studio",
    email: "hello@aurelius.studio",
  },
  /** Front-of-house support. A studio that cannot sign in has a full waiting area. */
  support: {
    phone: "(415) 555-0142",
    hours: "8am–8pm, Mon–Sat",
  },
  company: {
    legalName: "Aurelius Studio Systems, Inc.",
    foundedYear: 2021,
    address: "One Market Plaza, San Francisco, CA",
  },
} as const

export type SiteConfig = typeof siteConfig
