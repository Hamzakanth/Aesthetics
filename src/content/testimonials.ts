import type { Testimonial } from "@/types"

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "We were losing thirty enquiries a day to a DM folder nobody had time to open. Aurelius answers all of them. We filled two extra chairs a week without hiring a receptionist.",
    author: "Dana Whitfield",
    role: "Studio Owner",
    company: "Maison Skin",
    initials: "DW",
  },
  {
    id: "t2",
    quote:
      "I had trialled two booking chatbots and neither touched my actual problem. My website was fine. My Instagram inbox, my deposits and my empty Tuesdays were not.",
    author: "Marcus Oyelaran",
    role: "Founder",
    company: "Lumière Aesthetics",
    initials: "MO",
  },
  {
    id: "t3",
    quote:
      "Chasing deposits used to be the job nobody wanted. It is now a list somebody glances at with a coffee before the first client.",
    author: "Priya Raghunathan",
    role: "Operations Director",
    company: "The Nail Atelier",
    initials: "PR",
  },
  {
    id: "t4",
    quote:
      "Our no-show rate went from nineteen percent to eleven. Nobody changed how they work — the follow-up just actually happens now.",
    author: "Tomás Ferreira",
    role: "Managing Partner",
    company: "Verve Laser & Body",
    initials: "TF",
  },
  {
    id: "t5",
    quote:
      "Two of my therapists were about to leave over answering the phone between clients. Both are still here, and both now do the work they trained for.",
    author: "Helen Kowalski",
    role: "Clinic Director",
    company: "Halo Brow & Lash",
    initials: "HK",
  },
]

/** Headline proof points shown above the testimonial rail. */
export const trustStats = [
  { value: "600+", label: "studios running Aurelius" },
  { value: "4.9/5", label: "average owner rating" },
  { value: "97%", label: "renew after year one" },
  { value: "1.4M", label: "client messages handled" },
] as const

export const logos = [
  "Maison Skin",
  "Lumière",
  "The Nail Atelier",
  "Verve",
  "Halo",
  "Séance Beauty",
]
