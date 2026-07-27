import { DatabaseZap, MessagesSquare, SlidersHorizontal } from "lucide-react"

import type { HowItWorksStep } from "@/types"

/**
 * Sidebar of the mock product surface. Constant across steps — the panel is
 * meant to read as one app being driven, not three unrelated screenshots.
 */
export const panelNav = [
  "Today",
  "Inbox",
  "Workflows",
  "Integrations",
  "Payments",
] as const

/**
 * Ordered pipeline shown in the "How it works" section.
 *
 * Each step carries its own product panel. The claim in the copy and the
 * evidence on screen move together, which is the whole argument of the
 * section: you can see Aurelius's judgement before it can act on anything.
 */
export const howItWorks: HowItWorksStep[] = [
  {
    id: "connect",
    step: "01",
    title: "Connect your booking system",
    description:
      "Read-only to start. Aurelius maps your treatments, therapists, rooms and price list in an afternoon. Fresha, Phorest, Zenoti, Mindbody, Treatwell, Booksy, Vagaro, Timely and more.",
    panel: {
      path: "app.aurelius.studio/integrations",
      navIndex: 3,
      heading: "Fresha · Studio diary",
      statIcon: DatabaseZap,
      stat: "Read-only",
      footnote: "Mapped in 4 hours — no migration, no closed days.",
      rows: [
        {
          title: "Treatment menu",
          detail: "68 services across 2 locations",
          meta: "Mapped",
          state: "done",
        },
        {
          title: "Therapists and rooms",
          detail: "9 therapists · hours, rooms, skill matrix",
          meta: "Mapped",
          state: "done",
        },
        {
          title: "Price list and packages",
          detail: "34 prices, 6 courses, 2 memberships",
          meta: "Mapped",
          state: "done",
        },
        {
          title: "Patch-test rules",
          detail: "5 of 7 matched · 2 need your call",
          meta: "Review",
          state: "attention",
        },
        {
          title: "Client history",
          detail: "24 months imported · rebooking intervals fitting",
          meta: "Running",
          state: "pending",
        },
      ],
    },
  },
  {
    id: "choose",
    step: "02",
    title: "Choose what it handles",
    description:
      "Turn on one workflow or all six. Every reply carries a confidence threshold; anything below it — a reaction, a complaint, a question about a result — goes to a human with the full thread attached.",
    panel: {
      path: "app.aurelius.studio/workflows",
      navIndex: 2,
      heading: "Workflows",
      statIcon: SlidersHorizontal,
      stat: "4 of 6 live",
      footnote: "Below threshold, Aurelius asks instead of answering.",
      rows: [
        {
          title: "Front desk",
          detail: "Calls, Instagram DMs, WhatsApp, web chat",
          meta: "≥ 92%",
          state: "on",
        },
        {
          title: "The diary",
          detail: "Waitlist worked by treatment and therapist",
          meta: "≥ 95%",
          state: "on",
        },
        {
          title: "Consultations",
          detail: "Patch tests, questionnaires, consents",
          meta: "≥ 90%",
          state: "on",
        },
        {
          title: "Reminders",
          detail: "Confirmations sent, policy applied on lates",
          meta: "≥ 88%",
          state: "on",
        },
        {
          title: "Courses and retail",
          detail: "Starts in draft mode · week 3",
          meta: "Off",
          state: "off",
        },
        {
          title: "Rebooking and reviews",
          detail: "Enable once your intervals are approved",
          meta: "Off",
          state: "off",
        },
      ],
    },
  },
  {
    id: "supervise",
    step: "03",
    title: "Run the room, not the phone",
    description:
      "Your team moves from chasing messages to checking them. One inbox, one morning review, and a record behind every booking Aurelius took.",
    panel: {
      path: "app.aurelius.studio/inbox",
      navIndex: 1,
      heading: "Handled today",
      statIcon: MessagesSquare,
      stat: "186 messages",
      footnote: "One needs you. The other 185 do not.",
      rows: [
        {
          title: "Booked · Marisol A.",
          detail: "Instagram DM · new client · Tue 9:40am, hydrafacial",
          meta: "Front desk",
          state: "done",
        },
        {
          title: "Refilled · 2:15pm cancellation",
          detail: "Waitlist worked · confirmed in 4 min · reminder set",
          meta: "Diary",
          state: "done",
        },
        {
          title: "Patch test · laser, first session",
          detail: "Booked 48h ahead · consent form signed",
          meta: "Consultations",
          state: "pending",
        },
        {
          title: "Reaction reported · dermaplaning",
          detail: "Needs a human — client sent photos this morning",
          meta: "Front desk",
          state: "attention",
        },
        {
          title: "Rebooking · 34 clients due",
          detail: "Texts sent · 19 booked · 3 opted out",
          meta: "Retention",
          state: "done",
        },
      ],
    },
  },
]
