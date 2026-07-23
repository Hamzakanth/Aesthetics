"use server"

import { loginSchema, type LoginValues } from "@/lib/validations/login"

export interface LoginResult {
  ok: boolean
  message: string
  /** Field-level errors, keyed by form field, for re-display by the client. */
  fieldErrors?: Partial<Record<keyof LoginValues, string>>
}

export async function signIn(values: unknown): Promise<LoginResult> {
  const parsed = loginSchema.safeParse(values)

  if (!parsed.success) {
    const fieldErrors: LoginResult["fieldErrors"] = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof LoginValues | undefined
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message
    }
    return { ok: false, message: "Check the highlighted fields.", fieldErrors }
  }

  // Integration point: hand `parsed.data` to your identity provider, then set
  // the session cookie and redirect. Left unimplemented on purpose — which
  // provider signs a studio in is a product decision, not a scaffold one.
  //
  //   const session = await auth.password.verify(parsed.data)
  //   if (!session) return INVALID
  //   await cookies().set(SESSION, session.token, { httpOnly: true, ... })
  //   redirect("/app")

  // One message for every failure, on purpose. Saying "no account with that
  // email" turns the form into an account-enumeration oracle, and confirming
  // which studio a named person works at is itself a disclosure.
  return {
    ok: false,
    message: "That email and password combination did not match an account.",
  }
}
