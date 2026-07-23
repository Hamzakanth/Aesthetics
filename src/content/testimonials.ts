import type { Testimonial } from "@/types"

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "We were losing about forty calls a day to voicemail. Aurelius answers all of them. We filled two extra chairs a week without adding a single front-desk hire.",
    author: "Dana Whitfield",
    role: "Practice Manager",
    company: "Cedar Park Family Medicine",
    initials: "DW",
  },
  {
    id: "t2",
    quote:
      "I had looked at three AI scribes and none of them touched my actual problem. My notes were fine. My phones, my authorisations and my aging bucket were not.",
    author: "Dr. Marcus Oyelaran",
    role: "Managing Partner",
    company: "Vantage Orthopaedics",
    initials: "MO",
  },
  {
    id: "t3",
    quote:
      "Prior auth used to be one full-time person and a lot of hold music. It is now a review queue somebody clears in an hour before lunch.",
    author: "Priya Raghunathan",
    role: "Director of Operations",
    company: "Lumen Health Partners",
    initials: "PR",
  },
  {
    id: "t4",
    quote:
      "Our no-show rate went from nineteen percent to eleven. Nobody changed how they work — the follow-up just actually happens now.",
    author: "Tomás Ferreira",
    role: "Chief Administrative Officer",
    company: "Aperture Pediatrics",
    initials: "TF",
  },
  {
    id: "t5",
    quote:
      "Two of my staff were ready to quit over the phone volume. Both are still here, and both now do work that requires a person.",
    author: "Helen Kowalski",
    role: "Clinic Director",
    company: "Meridian Women's Health",
    initials: "HK",
  },
]

/** Headline proof points shown above the testimonial rail. */
export const trustStats = [
  { value: "400+", label: "clinics running Aurelius" },
  { value: "4.9/5", label: "average customer rating" },
  { value: "97%", label: "renew after year one" },
  { value: "1.2M", label: "patient calls handled" },
] as const

export const logos = [
  "Cedar Park",
  "Vantage",
  "Lumen Health",
  "Aperture",
  "Meridian",
  "Halcyon Clinics",
]
