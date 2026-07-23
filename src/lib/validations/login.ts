import { z } from "zod"

/**
 * Sign-in is deliberately more permissive than the contact form: no work-email
 * rule, no password composition rules. Rejecting a password at sign-in for
 * failing a policy it was never created under only locks out real users — the
 * only thing that matters here is that the field is not empty.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Enter the email address you use for work.")
    .email("That does not look like a valid email address."),

  password: z.string().min(1, "Enter your password."),

  remember: z.boolean().default(false),
})

export type LoginValues = z.infer<typeof loginSchema>
