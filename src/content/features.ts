import {
  CalendarCheck,
  ClipboardList,
  CreditCard,
  MessageCircle,
  Repeat,
  Sparkles,
} from "lucide-react"

import type { Feature } from "@/types"

/**
 * Deliberately framed as front-of-house roles, not software modules. A studio
 * owner does not buy "a booking module" — they buy the chair being filled.
 */
export const features: Feature[] = [
  {
    id: "front-desk",
    eyebrow: "Front desk",
    title: "Every call and DM answered, in minutes",
    description:
      "Bookings, price lists, aftercare and directions — on the phone, on Instagram and over WhatsApp, in your studio's own tone of voice.",
    icon: MessageCircle,
    impact: "94% handled without your team",
  },
  {
    id: "diary",
    eyebrow: "The diary",
    title: "Gaps filled before you notice them",
    description:
      "The moment a client cancels, Aurelius works your waitlist by treatment and therapist and books the first person who confirms.",
    icon: CalendarCheck,
    impact: "Gaps refilled in under 5 min",
  },
  {
    id: "consultations",
    eyebrow: "Consultations",
    title: "Consultations and consents done before arrival",
    description:
      "Patch-test reminders, skin questionnaires, consent forms and before photos collected by text and filed against the client record.",
    icon: ClipboardList,
    impact: "Nobody arrives with paperwork",
  },
  {
    id: "deposits",
    eyebrow: "Deposits",
    title: "Deposits taken, no-shows chased",
    description:
      "Card held at booking, reminders on your cadence, late cancellations charged to your policy — without anyone having to have the conversation.",
    icon: CreditCard,
    impact: "41% fewer no-shows",
  },
  {
    id: "packages",
    eyebrow: "Revenue",
    title: "Courses, memberships and retail followed up",
    description:
      "Unused sessions, lapsed memberships and the homecare you recommended in the room — all followed up while the treatment is still fresh.",
    icon: Sparkles,
    impact: "+22% retail attachment",
  },
  {
    id: "rebooking",
    eyebrow: "Retention",
    title: "Rebooking and reviews, on time",
    description:
      "Every client invited back at the right interval for their treatment, and asked for a review on the day they are happiest with it.",
    icon: Repeat,
    impact: "63% rebook before the next cycle",
  },
]

/** Compact trust strip under the features heading. Four signals, no prose. */
export const trustSignals = [
  { label: "GDPR compliant", detail: "Client data stays your data" },
  { label: "PCI DSS payments", detail: "Deposits and card-on-file" },
  { label: "Your clients never train models", detail: "Per-studio encryption keys" },
  { label: "Works with your diary", detail: "20+ booking systems" },
] as const
