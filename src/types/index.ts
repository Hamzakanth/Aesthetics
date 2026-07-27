import type { LucideIcon } from "lucide-react"

export interface NavItem {
  title: string
  href: string
  external?: boolean
  disabled?: boolean
  description?: string
}

export interface NavSection {
  title: string
  items: NavItem[]
}

export interface Feature {
  id: string
  eyebrow: string
  title: string
  description: string
  icon: LucideIcon
  /** Short, concrete outcome. One number beats a paragraph of benefit copy. */
  impact: string
}

/**
 * A single line inside the interactive phone screen that demonstrates a
 * feature. One small vocabulary of line kinds covers every feature, so the
 * screen reads as one app doing six jobs rather than six unrelated mockups:
 *  - `in`     incoming client message (with an optional channel/name label)
 *  - `out`    Aurelius's reply
 *  - `typing` the three-dot "…is typing" bubble
 *  - `status` a result row (booked, held, filed) with an icon and tone
 *  - `chip`   a small centered pill (a card number, a product, a count)
 *  - `stars`  a review-request rating row
 */
export type ScreenLineKind = "in" | "out" | "typing" | "status" | "chip" | "stars"

export type ScreenLineTone = "done" | "accent" | "pending"

export interface ScreenLine {
  kind: ScreenLineKind
  text?: string
  /** Sender label above an incoming bubble, e.g. "@ellierose". */
  via?: string
  /** Colour treatment for a `status` row. */
  tone?: ScreenLineTone
  /** Leading glyph for a `status` row. */
  icon?: LucideIcon
  /** Number of filled stars for a `stars` row. */
  count?: number
}

export interface FeatureScreen {
  /** Title shown in the phone's app bar, e.g. "Instagram · Direct". */
  app: string
  appIcon: LucideIcon
  lines: ScreenLine[]
}

/**
 * Row states in the mock product panel. `on`/`off` render as a switch, the
 * rest as a status glyph — one indicator vocabulary across all three steps.
 */
export type PanelRowState = "done" | "pending" | "attention" | "on" | "off"

export interface PanelRow {
  title: string
  detail: string
  /** Right-hand label: scope, threshold or sync state. */
  meta: string
  state: PanelRowState
}

export interface ProductPanel {
  /** Rendered in the browser chrome's URL pill. */
  path: string
  /** Index into `panelNav` that is highlighted for this step. */
  navIndex: number
  heading: string
  stat: string
  statIcon: LucideIcon
  rows: PanelRow[]
  footnote: string
}

export interface HowItWorksStep {
  id: string
  step: string
  title: string
  description: string
  panel: ProductPanel
}

export interface Metric {
  id: string
  value: number
  suffix?: string
  prefix?: string
  decimals?: number
  label: string
  description: string
}

export interface Testimonial {
  id: string
  quote: string
  author: string
  role: string
  company: string
  initials: string
}

export interface PricingTier {
  id: string
  name: string
  description: string
  /** `null` renders as "Custom" — enterprise tiers have no list price. */
  monthlyPrice: number | null
  annualPrice: number | null
  features: string[]
  cta: string
  href: string
  popular?: boolean
}

/**
 * A single row of the plan comparison table. `values` is keyed by
 * `PricingTier["id"]`: `true`/`false` render as an included/excluded mark,
 * a string renders verbatim (limits, tiers of support, and so on).
 */
export interface PricingComparisonRow {
  label: string
  /** Optional clarification shown under the label. */
  hint?: string
  values: Record<string, boolean | string>
}

export interface PricingComparisonGroup {
  id: string
  title: string
  rows: PricingComparisonRow[]
}

export interface FaqItem {
  id: string
  question: string
  answer: string
}
