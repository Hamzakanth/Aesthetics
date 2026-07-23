import type { NavItem, NavSection } from "@/types"

/** Primary header navigation. Kept to 4 items — see UX rule `nav-hierarchy`. */
export const mainNav: NavItem[] = [
  { title: "What it does", href: "/#features" },
  { title: "How it works", href: "/#how-it-works" },
  { title: "Studios", href: "/#testimonials" },
  { title: "Pricing", href: "/#pricing" },
]

export const footerNav: NavSection[] = [
  {
    title: "Product",
    items: [
      { title: "AI front desk", href: "/#features" },
      { title: "Booking and waitlist", href: "/#features" },
      { title: "Consultations and consents", href: "/#features" },
      { title: "Deposits and no-shows", href: "/#features" },
      { title: "Booking-system integrations", href: "/integrations" },
    ],
  },
  {
    title: "Company",
    items: [
      { title: "About", href: "/about" },
      { title: "Studios", href: "/#testimonials" },
      { title: "Careers", href: "/careers" },
      { title: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    items: [
      { title: "Journal", href: "/blog" },
      { title: "Documentation", href: "/docs" },
      { title: "Onboarding guide", href: "/docs/onboarding" },
      { title: "Client data and privacy", href: "/security" },
      { title: "System status", href: "/status", external: true },
    ],
  },
  {
    title: "Legal",
    items: [
      { title: "Privacy", href: "/privacy" },
      { title: "Terms", href: "/terms" },
      { title: "Data processing", href: "/dpa" },
      { title: "Subprocessors", href: "/subprocessors" },
    ],
  },
]
