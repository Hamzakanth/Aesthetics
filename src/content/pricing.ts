import type {
  PricingComparisonGroup,
  PricingTier,
} from "@/types"

/**
 * Priced per provider, not per seat. Clinics add front-desk staff to survive
 * admin load; charging per seat would penalise exactly the customer whose
 * problem this solves.
 */
export const pricingTiers: PricingTier[] = [
  {
    id: "practice",
    name: "Practice",
    description: "For independent clinics of one to five providers.",
    monthlyPrice: 499,
    annualPrice: 399,
    features: [
      "AI phone agent, 24/7",
      "Scheduling and waitlist backfill",
      "Automated intake and eligibility",
      "One EHR integration",
      "Recall and no-show follow-up",
      "Email support",
    ],
    cta: "Start free pilot",
    href: "/signup?plan=practice",
  },
  {
    id: "group",
    name: "Group",
    description: "For multi-provider groups running more than one location.",
    monthlyPrice: 899,
    annualPrice: 719,
    features: [
      "Everything in Practice",
      "Prior authorisation automation",
      "Claim scrubbing and denial appeals",
      "Payment posting and reconciliation",
      "Multi-location routing",
      "Spanish and Mandarin call handling",
      "Dedicated success manager",
    ],
    cta: "Start free pilot",
    href: "/signup?plan=group",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Health system",
    description: "For systems, MSOs and networks with their own compliance bar.",
    monthlyPrice: null,
    annualPrice: null,
    features: [
      "Unlimited providers and locations",
      "Private cloud or in-VPC deployment",
      "Custom payer and workflow build-out",
      "SSO, SCIM and role-based access",
      "Signed BAA and security review",
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
        label: "Providers",
        values: {
          practice: "Up to 5",
          group: "Unlimited",
          enterprise: "Unlimited",
        },
      },
      {
        label: "Locations",
        values: {
          practice: "1",
          group: "Multi-location",
          enterprise: "Unlimited",
        },
      },
      {
        label: "Front-desk seats",
        hint: "Never billed per seat, on any plan.",
        values: {
          practice: "Unlimited",
          group: "Unlimited",
          enterprise: "Unlimited",
        },
      },
    ],
  },
  {
    id: "front-desk",
    title: "Front desk",
    rows: [
      {
        label: "AI phone agent",
        hint: "24/7, including after hours and holidays.",
        values: { practice: true, group: true, enterprise: true },
      },
      {
        label: "Scheduling and waitlist backfill",
        values: { practice: true, group: true, enterprise: true },
      },
      {
        label: "Recall and no-show follow-up",
        values: { practice: true, group: true, enterprise: true },
      },
      {
        label: "Multi-location call routing",
        values: { practice: false, group: true, enterprise: true },
      },
      {
        label: "Spanish and Mandarin call handling",
        values: { practice: false, group: true, enterprise: true },
      },
    ],
  },
  {
    id: "revenue-cycle",
    title: "Revenue cycle",
    rows: [
      {
        label: "Automated intake and eligibility",
        values: { practice: true, group: true, enterprise: true },
      },
      {
        label: "Prior authorisation automation",
        values: { practice: false, group: true, enterprise: true },
      },
      {
        label: "Claim scrubbing and denial appeals",
        values: { practice: false, group: true, enterprise: true },
      },
      {
        label: "Payment posting and reconciliation",
        values: { practice: false, group: true, enterprise: true },
      },
    ],
  },
  {
    id: "integrations",
    title: "Integrations and security",
    rows: [
      {
        label: "EHR integrations",
        values: { practice: "One", group: "Unlimited", enterprise: "Custom" },
      },
      {
        label: "SSO, SCIM and role-based access",
        values: { practice: false, group: false, enterprise: true },
      },
      {
        label: "Private cloud or in-VPC deployment",
        values: { practice: false, group: false, enterprise: true },
      },
      {
        label: "Signed BAA and security review",
        values: { practice: false, group: false, enterprise: true },
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
          practice: "Email",
          group: "Email and phone",
          enterprise: "24/7 priority",
        },
      },
      {
        label: "Dedicated success manager",
        values: { practice: false, group: true, enterprise: true },
      },
      {
        label: "Onboarding",
        values: {
          practice: "Guided",
          group: "White-glove",
          enterprise: "Custom",
        },
      },
      {
        label: "Uptime SLA",
        values: {
          practice: "99.9%",
          group: "99.9%",
          enterprise: "99.99%",
        },
      },
    ],
  },
]
