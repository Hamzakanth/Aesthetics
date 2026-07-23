import type { FaqItem } from "@/types"

export const faqs: FaqItem[] = [
  {
    id: "scribe",
    question: "Is this an AI scribe?",
    answer:
      "No. Scribes automate documentation inside the exam room. Aurelius automates everything outside it — the phones, the schedule, intake, prior authorisations and the revenue cycle. Most of our customers already run a scribe and keep it; the two do not overlap.",
  },
  {
    id: "ehr",
    question: "Does it work with our EHR?",
    answer:
      "We integrate with Epic, Athenahealth, eClinicalWorks, NextGen, Elation, DrChrono, Kareo and about twenty more. Setup starts read-only, so Aurelius can prove its judgement against your real schedule before it is allowed to write anything.",
  },
  {
    id: "patients",
    question: "Will patients know they are talking to AI?",
    answer:
      "Yes, and we require it. Aurelius identifies itself at the start of every call. Anything clinical, distressed or outside its scope transfers to a person immediately, with the transcript already in front of them.",
  },
  {
    id: "hipaa",
    question: "How do you handle PHI?",
    answer:
      "We sign a BAA with every customer. PHI is encrypted in transit and at rest with per-tenant keys, never used to train shared models, and retained on a schedule you set. We are SOC 2 Type II certified and HIPAA compliant.",
  },
  {
    id: "wrong",
    question: "What happens when it gets something wrong?",
    answer:
      "Every action carries a confidence score and a threshold you control. Below the threshold, Aurelius does not act — it routes to your queue with its reasoning attached. Every decision it does make is logged and reversible.",
  },
  {
    id: "staff",
    question: "Do we have to lay off front-desk staff?",
    answer:
      "None of our customers have. The common pattern is that the same team stops drowning: they move from answering phones to supervising the queue and handling the calls that genuinely need a person, and open roles get closed rather than filled.",
  },
  {
    id: "live",
    question: "How long until it is live?",
    answer:
      "Phones and scheduling typically go live in under two weeks. Prior authorisation and billing workflows take four to six, because we build and test against your specific payer mix before turning them on.",
  },
]
