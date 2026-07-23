"use server"

import { contactSchema, type ContactValues } from "@/lib/validations/contact"

export interface ActionResult {
  ok: boolean
  message: string
  /** Field-level errors, keyed by form field, for re-display by the client. */
  fieldErrors?: Partial<Record<keyof ContactValues, string>>
}

/**
 * Server-side validation is authoritative — the client schema is a UX
 * affordance and can be bypassed. Both sides share one schema so they
 * cannot drift.
 */
export async function submitContact(values: unknown): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(values)

  if (!parsed.success) {
    const fieldErrors: ActionResult["fieldErrors"] = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ContactValues | undefined
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message
    }
    return {
      ok: false,
      message: "Please correct the highlighted fields.",
      fieldErrors,
    }
  }

  // Integration point: forward to your CRM, queue, or transactional email
  // provider here. Left unimplemented on purpose — wiring it to a specific
  // vendor is a product decision, not a scaffold one.
  //
  //   await crm.leads.create(parsed.data)

  return {
    ok: true,
    message: "Thanks — someone from the studio team will reply within one business day.",
  }
}
