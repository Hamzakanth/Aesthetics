import { z } from "zod"

const FREE_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
]

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(80, "That name is longer than we can store."),

  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("That does not look like a valid email address.")
    .refine(
      (value) => !FREE_EMAIL_DOMAINS.includes(value.split("@")[1] ?? ""),
      "Please use your work email so we can route you to the right team."
    ),

  company: z
    .string()
    .trim()
    .min(2, "Please enter your studio or group name.")
    .max(100),

  teamSize: z.enum(["1", "2-5", "6-15", "15+"], {
    errorMap: () => ({ message: "Select the closest range." }),
  }),

  message: z
    .string()
    .trim()
    .min(20, "A sentence or two about your setup helps us prepare.")
    .max(1000, "Please keep this under 1,000 characters."),
})

export type ContactValues = z.infer<typeof contactSchema>

export const TEAM_SIZES = [
  { value: "1", label: "1 location" },
  { value: "2-5", label: "2–5 locations" },
  { value: "6-15", label: "6–15 locations" },
  { value: "15+", label: "15+ locations" },
] as const
