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
    .min(2, "Please enter your clinic or group name.")
    .max(100),

  teamSize: z.enum(["1-5", "6-20", "21-75", "75+"], {
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
  { value: "1-5", label: "1–5 providers" },
  { value: "6-20", label: "6–20 providers" },
  { value: "21-75", label: "21–75 providers" },
  { value: "75+", label: "75+ providers" },
] as const
