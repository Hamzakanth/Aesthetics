import type { NavItem, NavSection } from "@/types"

/** Primary header navigation. Kept to 4 items — see UX rule `nav-hierarchy`. */
export const mainNav: NavItem[] = [
  { title: "What it does", href: "/#features" },
  { title: "How it works", href: "/#how-it-works" },
  { title: "Clinics", href: "/#testimonials" },
  { title: "Pricing", href: "/#pricing" },
]

export const footerNav: NavSection[] = [
  {
    title: "Product",
    items: [
      { title: "AI phone agent", href: "/#features" },
      { title: "Scheduling", href: "/#features" },
      { title: "Prior authorisation", href: "/#features" },
      { title: "Revenue cycle", href: "/#features" },
      { title: "EHR integrations", href: "/integrations" },
    ],
  },
  {
    title: "Company",
    items: [
      { title: "About", href: "/about" },
      { title: "Clinics", href: "/#testimonials" },
      { title: "Careers", href: "/careers" },
      { title: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    items: [
      { title: "Blog", href: "/blog" },
      { title: "Documentation", href: "/docs" },
      { title: "Implementation guide", href: "/docs/implementation" },
      { title: "Security & HIPAA", href: "/security" },
      { title: "System status", href: "/status", external: true },
    ],
  },
  {
    title: "Legal",
    items: [
      { title: "Privacy", href: "/privacy" },
      { title: "Terms", href: "/terms" },
      { title: "BAA", href: "/baa" },
      { title: "Subprocessors", href: "/subprocessors" },
    ],
  },
]
