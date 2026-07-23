import type {
  PricingComparisonGroup,
  PricingTier,
} from "@/types"

/**
 * Priced per location, not per seat. Studios add front-desk cover to survive
 * the message volume; charging per seat would penalise exactly the owner whose
 * problem this solves.
 */
export const pricingTiers: PricingTier[] = [
  {
    id: "studio",
    name: "Studio",
    description: "For a single clinic, salon or treatment room.",
    monthlyPrice: 249,
    annualPrice: 199,
    features: [
      "AI front desk — calls, DMs, WhatsApp",
      "Diary management and waitlist refill",
      "Consultation forms and consents",
      "One booking-system integration",
      "Rebooking and review requests",
      "Email support",
    ],
    cta: "Start free pilot",
    href: "/signup?plan=studio",
  },
  {
    id: "group",
    name: "Group",
    description: "For multi-room clinics and small studio groups.",
    monthlyPrice: 449,
    annualPrice: 359,
    features: [
      "Everything in Studio",
      "Deposits, card-on-file and late-cancellation policy",
      "Courses, memberships and retail follow-up",
      "Patch-test and aftercare automation",
      "Multi-location routing",
      "Second-language message handling",
      "Dedicated onboarding manager",
    ],
    cta: "Start free pilot",
    href: "/signup?plan=group",
    popular: true,
  },
  {
    id: "brand",
    name: "Brand",
    description: "For chains, franchises and multi-site beauty brands.",
    monthlyPrice: null,
    annualPrice: null,
    features: [
      "Unlimited locations and treatment rooms",
      "Brand-wide tone of voice and approval flows",
      "Custom workflows and reporting",
      "SSO, SCIM and role-based access",
      "Franchisee onboarding and training",
      "99.99% uptime SLA",
    ],
    cta: "Talk to us",
    href: "/contact",
  },
]

/**
 * Feature-by-feature comparison. Keyed by tier id rather than column position so
 * reordering or adding a tier cannot silently shift a row's values.
 *
 * `true` renders an included mark, `false` a dash, a string renders verbatim.
 */
export const pricingComparison: PricingComparisonGroup[] = [
  {
    id: "scale",
    title: "Scale",
    rows: [
      {
        label: "Locations",
        values: {
          studio: "1",
          group: "Up to 5",
          brand: "Unlimited",
        },
      },
      {
        label: "Treatment rooms",
        values: {
          studio: "Up to 3",
          group: "Unlimited",
          brand: "Unlimited",
        },
      },
      {
        label: "Team logins",
        hint: "Never billed per seat, on any plan.",
        values: {
          studio: "Unlimited",
          group: "Unlimited",
          brand: "Unlimited",
        },
      },
    ],
  },
  {
    id: "front-desk",
    title: "Front desk",
    rows: [
      {
        label: "Calls, Instagram DMs and WhatsApp",
        hint: "Answered outside opening hours, including Sundays.",
        values: { studio: true, group: true, brand: true },
      },
      {
        label: "Diary management and waitlist refill",
        values: { studio: true, group: true, brand: true },
      },
      {
        label: "Rebooking and review requests",
        values: { studio: true, group: true, brand: true },
      },
      {
        label: "Multi-location routing",
        values: { studio: false, group: true, brand: true },
      },
      {
        label: "Second-language message handling",
        values: { studio: false, group: true, brand: true },
      },
    ],
  },
  {
    id: "revenue",
    title: "Revenue",
    rows: [
      {
        label: "Consultation forms and consents",
        values: { studio: true, group: true, brand: true },
      },
      {
        label: "Deposits and card-on-file",
        values: { studio: false, group: true, brand: true },
      },
      {
        label: "Late-cancellation policy enforcement",
        values: { studio: false, group: true, brand: true },
      },
      {
        label: "Courses, memberships and retail follow-up",
        values: { studio: false, group: true, brand: true },
      },
    ],
  },
  {
    id: "integrations",
    title: "Integrations and data",
    rows: [
      {
        label: "Booking-system integrations",
        values: { studio: "One", group: "Unlimited", brand: "Custom" },
      },
      {
        label: "SSO, SCIM and role-based access",
        values: { studio: false, group: false, brand: true },
      },
      {
        label: "Brand-wide tone of voice controls",
        values: { studio: false, group: false, brand: true },
      },
      {
        label: "Data processing agreement and review",
        values: { studio: false, group: false, brand: true },
      },
    ],
  },
  {
    id: "support",
    title: "Support",
    rows: [
      {
        label: "Support channel",
        values: {
          studio: "Email",
          group: "Email and phone",
          brand: "7-day priority",
        },
      },
      {
        label: "Dedicated onboarding manager",
        values: { studio: false, group: true, brand: true },
      },
      {
        label: "Onboarding",
        values: {
          studio: "Guided",
          group: "White-glove",
          brand: "Custom",
        },
      },
      {
        label: "Uptime SLA",
        values: {
          studio: "99.9%",
          group: "99.9%",
          brand: "99.99%",
        },
      },
    ],
  },
]
