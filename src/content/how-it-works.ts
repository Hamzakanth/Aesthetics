import { DatabaseZap, PhoneIncoming, SlidersHorizontal } from "lucide-react"

import type { HowItWorksStep } from "@/types"

/**
 * Sidebar of the mock product surface. Constant across steps — the panel is
 * meant to read as one app being driven, not three unrelated screenshots.
 */
export const panelNav = [
  "Today",
  "Queue",
  "Workflows",
  "Integrations",
  "Billing",
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
    title: "Connect your EHR",
    description:
      "Read-only to start. Aurelius maps your schedule, providers, payers and templates in about a day. Epic, Athena, eClinicalWorks, Elation, DrChrono and 20 more.",
    panel: {
      path: "app.aurelius.health/integrations",
      navIndex: 3,
      heading: "Epic · MyChart",
      statIcon: DatabaseZap,
      stat: "Read-only",
      footnote: "Mapped in 19 hours — no interface engine, no downtime.",
      rows: [
        {
          title: "Schedule templates",
          detail: "41 templates across 3 sites",
          meta: "Mapped",
          state: "done",
        },
        {
          title: "Providers & locations",
          detail: "12 providers · hours, rooms, block rules",
          meta: "Mapped",
          state: "done",
        },
        {
          title: "Payer contracts",
          detail: "26 plans matched to fee schedules",
          meta: "Mapped",
          state: "done",
        },
        {
          title: "Appointment types",
          detail: "18 of 21 matched · 3 need a human decision",
          meta: "Review",
          state: "attention",
        },
        {
          title: "Historical no-shows",
          detail: "24 months imported · risk model fitting",
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
      "Turn on one workflow or all six. Every action carries a confidence threshold; anything below it routes to a human with the full context attached.",
    panel: {
      path: "app.aurelius.health/workflows",
      navIndex: 2,
      heading: "Workflows",
      statIcon: SlidersHorizontal,
      stat: "4 of 6 live",
      footnote: "Below threshold, Aurelius asks instead of acting.",
      rows: [
        {
          title: "Phones",
          detail: "Booking, rescheduling, refills, directions",
          meta: "≥ 92%",
          state: "on",
        },
        {
          title: "Scheduling",
          detail: "Waitlist worked by clinical priority",
          meta: "≥ 95%",
          state: "on",
        },
        {
          title: "Intake",
          detail: "Forms, consents, eligibility by text",
          meta: "≥ 90%",
          state: "on",
        },
        {
          title: "Prior authorisations",
          detail: "Packet assembled, submitted, chased",
          meta: "≥ 88%",
          state: "on",
        },
        {
          title: "Billing",
          detail: "Starts in shadow mode · week 3",
          meta: "Off",
          state: "off",
        },
        {
          title: "Recall",
          detail: "Enable once your cadence is approved",
          meta: "Off",
          state: "off",
        },
      ],
    },
  },
  {
    id: "supervise",
    step: "03",
    title: "Supervise, do not operate",
    description:
      "Your staff move from doing the work to reviewing it. One queue, one inbox, and an audit trail behind every decision Aurelius made.",
    panel: {
      path: "app.aurelius.health/queue",
      navIndex: 1,
      heading: "Handled today",
      statIcon: PhoneIncoming,
      stat: "214 calls",
      footnote: "One item needs a human. The other 213 do not.",
      rows: [
        {
          title: "Booked · Marisol A.",
          detail: "Inbound call · new patient · Tue 9:40am, Dr. Reyes",
          meta: "Front desk",
          state: "done",
        },
        {
          title: "Backfilled · 2:15pm cancellation",
          detail: "Waitlist worked · confirmed in 4 min",
          meta: "Scheduling",
          state: "done",
        },
        {
          title: "Prior auth · MRI lumbar spine",
          detail: "Submitted to Aetna · awaiting determination · day 2",
          meta: "Authorisations",
          state: "pending",
        },
        {
          title: "Denial · CPT 99214",
          detail: "Needs a human — payer requests clinical notes",
          meta: "Billing",
          state: "attention",
        },
        {
          title: "Recall · 34 overdue A1c",
          detail: "Texts sent · 11 booked · 3 opted out",
          meta: "Retention",
          state: "done",
        },
      ],
    },
  },
]
