import type { FaqItem } from "@/types"

export const faqs: FaqItem[] = [
  {
    id: "chatbot",
    question: "Is this just a chatbot on my website?",
    answer:
      "No. A website chatbot waits for someone to find it. Aurelius works the channels your clients actually use — the phone, Instagram and Facebook DMs, WhatsApp and text — and it books, moves and takes deposits inside your existing diary rather than handing over a transcript.",
  },
  {
    id: "booking-system",
    question: "Does it work with our booking system?",
    answer:
      "We integrate with Fresha, Phorest, Zenoti, Mindbody, Treatwell, Booksy, Vagaro, Timely, Square Appointments and about a dozen more. Setup starts read-only, so you can watch Aurelius's judgement against your real diary before it is allowed to book anything.",
  },
  {
    id: "clients",
    question: "Will clients know they are talking to AI?",
    answer:
      "Yes, and we require it. Aurelius introduces itself at the start of a conversation. Anything medical, distressed or outside its scope — a reaction, a complaint, a question about someone's results — goes straight to a person with the thread already in front of them.",
  },
  {
    id: "voice",
    question: "Will it sound like our studio?",
    answer:
      "It is written from your own words: your price list, your aftercare, your policies and a sample of how your team already replies. You approve the tone before it goes live, and you can change it in an afternoon.",
  },
  {
    id: "data",
    question: "How do you handle client data?",
    answer:
      "Client records, consultation answers and photos are encrypted in transit and at rest with per-studio keys, never used to train shared models, and retained on a schedule you set. We are GDPR compliant, sign a data processing agreement with every customer, and payments run on PCI DSS-compliant infrastructure.",
  },
  {
    id: "wrong",
    question: "What happens when it gets something wrong?",
    answer:
      "Every reply carries a confidence score and a threshold you control. Below the threshold, Aurelius does not answer — it routes the conversation to your inbox with its reasoning attached. Every booking, move and charge it does make is logged and reversible.",
  },
  {
    id: "staff",
    question: "Do we have to let front-desk staff go?",
    answer:
      "None of our customers have. The usual pattern is that the same team stops drowning: they move from typing the same four answers to greeting clients, selling homecare and running the room — and the vacancy they were about to advertise quietly closes.",
  },
  {
    id: "live",
    question: "How long until it is live?",
    answer:
      "The front desk and diary typically go live in under a week. Deposits, courses and rebooking take two to three, because we set them against your own policies and treatment intervals before turning them on.",
  },
]
