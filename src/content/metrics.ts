import type { Metric } from "@/types"

export const metrics: Metric[] = [
  {
    id: "calls",
    value: 92,
    suffix: "%",
    label: "Calls resolved without staff",
    description: "Booking, rescheduling, refills and routine questions.",
  },
  {
    id: "noshow",
    value: 38,
    suffix: "%",
    label: "Fewer no-shows",
    description: "Median reduction after three months of automated recall.",
  },
  {
    id: "auth",
    value: 2.1,
    decimals: 1,
    suffix: " days",
    label: "Prior auth turnaround",
    description: "Down from a nine-day average across our customer base.",
  },
  {
    id: "hours",
    value: 31,
    suffix: " hrs",
    label: "Admin hours returned",
    description: "Per provider per month, given back to patient-facing work.",
  },
]

/** Powers the front-office workload chart. */
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
