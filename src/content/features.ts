import {
  CalendarCheck,
  ClipboardList,
  FileCheck2,
  PhoneCall,
  Receipt,
  Repeat,
} from "lucide-react"

import type { Feature } from "@/types"

/**
 * Deliberately framed as staff roles, not software modules. Clinics do not
 * buy "a scheduling module" — they buy the work getting done.
 */
export const features: Feature[] = [
  {
    id: "phones",
    eyebrow: "Front desk",
    title: "Every call answered, on the first ring",
    description:
      "Booking, rescheduling, refills, directions and insurance questions — in the caller's language, with anything clinical escalated to a human.",
    icon: PhoneCall,
    impact: "92% resolved without staff",
  },
  {
    id: "scheduling",
    eyebrow: "Scheduling",
    title: "Cancellations refilled automatically",
    description:
      "The moment a slot opens, Aurelius works your waitlist by clinical priority and books the first patient who confirms.",
    icon: CalendarCheck,
    impact: "Slots refilled in under 5 min",
  },
  {
    id: "intake",
    eyebrow: "Intake",
    title: "Paperwork done before arrival",
    description:
      "Forms, consents, insurance cards and eligibility checks collected by text, then written straight into the chart.",
    icon: ClipboardList,
    impact: "Zero clipboards at check-in",
  },
  {
    id: "prior-auth",
    eyebrow: "Authorisations",
    title: "Prior auths chased end to end",
    description:
      "Aurelius assembles the packet, submits to the payer, sits in the queue and follows up until there is a decision.",
    icon: FileCheck2,
    impact: "9 days down to 2",
  },
  {
    id: "billing",
    eyebrow: "Revenue",
    title: "Claims scrubbed, denials worked",
    description:
      "Coding checked before submission, denials triaged and appealed, payments posted and reconciled the same day.",
    icon: Receipt,
    impact: "Same-day payment posting",
  },
  {
    id: "recall",
    eyebrow: "Retention",
    title: "Recalls and no-shows pursued",
    description:
      "Overdue patients, annual wellness visits and missed appointments followed up on a cadence that actually converts.",
    icon: Repeat,
    impact: "38% fewer no-shows",
  },
]

/** Compact trust strip under the features heading. Four signals, no prose. */
export const trustSignals = [
  { label: "HIPAA compliant", detail: "BAA signed on every plan" },
  { label: "SOC 2 Type II", detail: "Audited annually" },
  { label: "PHI never trains models", detail: "Per-tenant encryption keys" },
  { label: "Works with your EHR", detail: "25+ integrations" },
] as const
