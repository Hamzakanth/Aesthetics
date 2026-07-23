import type { Metric } from "@/types"

export const metrics: Metric[] = [
  {
    id: "messages",
    value: 94,
    suffix: "%",
    label: "Calls and DMs handled",
    description: "Bookings, prices, aftercare and the same four questions.",
  },
  {
    id: "noshow",
    value: 41,
    suffix: "%",
    label: "Fewer no-shows",
    description: "Median drop once deposits and reminders run themselves.",
  },
  {
    id: "recovered",
    prefix: "$",
    value: 14.2,
    decimals: 1,
    suffix: "k",
    label: "Recovered per location",
    description: "Monthly, from filled gaps, deposits taken and rebooking.",
  },
  {
    id: "hours",
    value: 27,
    suffix: " hrs",
    label: "Front-desk hours returned",
    description: "Per location per month, given back to clients in the room.",
  },
]

/** Powers the front-of-house workload chart. */
export const coverageSeries = [
  { month: "Jan", automated: 180, manual: 1240 },
  { month: "Feb", automated: 420, manual: 1090 },
  { month: "Mar", automated: 760, manual: 880 },
  { month: "Apr", automated: 1120, manual: 640 },
  { month: "May", automated: 1480, manual: 430 },
  { month: "Jun", automated: 1810, manual: 290 },
  { month: "Jul", automated: 2140, manual: 210 },
  { month: "Aug", automated: 2420, manual: 160 },
]
