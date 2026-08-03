import {
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Instagram,
  MessageCircle,
  Repeat,
  Sparkles,
  TriangleAlert,
} from "lucide-react"

import type { Feature, FeatureScreen } from "@/types"

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

/**
 * What each feature looks like happening — the script that plays inside the
 * phone in the interactive showcase, keyed by `Feature["id"]`. Written as real
 * front-of-house exchanges, not feature bullets: the point is to show the job
 * being done, in the studio's voice, the way a client would actually see it.
 */
export const featureScreens: Record<string, FeatureScreen> = {
  "front-desk": {
    app: "Instagram · Direct",
    appIcon: Instagram,
    lines: [
      { kind: "in", via: "@ellierose", text: "Hi! Any lip filler slots this week? 💋" },
      { kind: "typing" },
      { kind: "out", text: "We do — Thu 2pm or Fri 10am with Dr Amara. Want me to hold one?" },
      { kind: "in", via: "@ellierose", text: "Thursday 2pm please!" },
      { kind: "out", text: "Booked. I've sent your consult form and aftercare notes ✨" },
      { kind: "status", tone: "done", icon: CheckCircle2, text: "Booked · Thu 14:00 · Lip filler" },
    ],
  },
  diary: {
    app: "The diary",
    appIcon: CalendarCheck,
    lines: [
      { kind: "status", tone: "accent", icon: TriangleAlert, text: "Cancellation · Sat 11:00 · Signature facial" },
      { kind: "out", text: "Matching your waitlist by treatment and therapist…" },
      { kind: "chip", text: "3 clients notified" },
      { kind: "in", via: "Priya K.", text: "Yes! I'll take the 11 o'clock 🙌" },
      { kind: "status", tone: "done", icon: CheckCircle2, text: "Gap refilled in 4 minutes" },
    ],
  },
  consultations: {
    app: "Consultations",
    appIcon: ClipboardList,
    lines: [
      { kind: "out", text: "Before Thursday, a few things to complete:" },
      { kind: "status", tone: "done", icon: CheckCircle2, text: "Medical questionnaire" },
      { kind: "status", tone: "done", icon: CheckCircle2, text: "Consent form signed" },
      { kind: "status", tone: "done", icon: CheckCircle2, text: "Patch test confirmed" },
      { kind: "status", tone: "done", icon: CheckCircle2, text: "Before photos received" },
      { kind: "chip", text: "Filed to client record" },
    ],
  },
  packages: {
    app: "Follow-up",
    appIcon: Sparkles,
    lines: [
      { kind: "out", text: "Loved today's facial? The Vitamin-C serum Dr Amara used is 15% off this week." },
      { kind: "chip", text: "Vitamin-C serum · £48" },
      { kind: "in", via: "Sofia M.", text: "Ooh yes — add it to my order!" },
      { kind: "status", tone: "done", icon: CheckCircle2, text: "Retail added · +£48" },
      { kind: "out", text: "You've 2 sessions left on your course — shall I book them in?" },
    ],
  },
  rebooking: {
    app: "Rebooking",
    appIcon: Repeat,
    lines: [
      { kind: "out", text: "It's been 6 weeks — time to keep those results glowing. Rebook your facial?" },
      { kind: "in", via: "Hannah P.", text: "Yes please, same time works!" },
      { kind: "status", tone: "done", icon: CheckCircle2, text: "Rebooked · in 4 weeks" },
      { kind: "out", text: "So glad you're happy 💛 Mind leaving us a quick review?" },
      { kind: "stars", count: 5 },
    ],
  },
}
