"use client"

import * as React from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldAlert,
  TriangleAlert,
} from "lucide-react"

import { signIn } from "@/app/actions/login"
import { loginSchema, type LoginValues } from "@/lib/validations/login"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

/** Brand marks are inlined: two small paths beat two network requests. */
function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-[1.15rem]">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.4 5.4 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.7 0 3.99 2.47 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  )
}

function MicrosoftMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-[1.15rem]">
      <path fill="#F25022" d="M1 1h10v10H1z" />
      <path fill="#7FBA00" d="M13 1h10v10H13z" />
      <path fill="#00A4EF" d="M1 13h10v10H1z" />
      <path fill="#FFB900" d="M13 13h10v10H13z" />
    </svg>
  )
}

/**
 * Federated buttons lift on hover rather than just changing fill. The card
 * they sit on is a physical object in this composition, so its controls have
 * to behave like they are attached to it — a flat colour swap on a lit surface
 * is the one place the illusion would break.
 */
const LIFT =
  "hover:-translate-y-px hover:shadow-md active:translate-y-0 motion-reduce:hover:translate-y-0"

/**
 * The focus treatment is a gold hairline that draws itself along the bottom of
 * the field, plus the icon warming to the accent. It reads as the field being
 * *selected* rather than outlined, and it survives the tilt — a ring drawn on
 * a turning surface turns with it and stays legible, where a glow would smear.
 */
function FieldUnderline() {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-3 bottom-0 h-px origin-center scale-x-0",
        "bg-gradient-to-r from-transparent via-accent to-transparent",
        "transition-transform duration-[--duration-base] ease-[--ease-out]",
        "group-focus-within:scale-x-100"
      )}
    />
  )
}

export function LoginForm() {
  const [isPending, startTransition] = React.useTransition()
  const [showPassword, setShowPassword] = React.useState(false)
  const [capsLock, setCapsLock] = React.useState(false)
  const [formError, setFormError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    watch,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    // Defaults to off. Front-desk machines are shared by the whole rota and
    // sit in a reception with clients in it — a persistent session is the
    // wrong default for the majority of the people signing in here.
    defaultValues: { email: "", password: "", remember: false },
  })

  const remember = watch("remember")

  const onSubmit = (values: LoginValues) => {
    setFormError(null)

    startTransition(async () => {
      const result = await signIn(values)

      if (!result.ok) {
        for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
          setError(field as keyof LoginValues, { type: "server", message })
        }
        // Rejections are shown in place, not as a toast: a failed sign-in is
        // the whole content of the card, and a toast can be dismissed before
        // it is read.
        if (!result.fieldErrors) {
          setFormError(result.message)
          setFocus("password")
        }
        return
      }

      // The action redirects on success, so there is nothing to do here.
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Federated first: most studios are already in Google Workspace or
          Microsoft 365. Google takes the wide slot because it is the majority
          path — the others stay reachable without competing for the eye. */}
      <div className="flex gap-2.5">
        <Button
          variant="outline"
          size="lg"
          type="button"
          className={cn("flex-1 bg-secondary/40 font-medium", LIFT)}
        >
          <GoogleMark />
          Sign in with Google
        </Button>

        <Button
          variant="outline"
          size="icon"
          type="button"
          aria-label="Sign in with Microsoft"
          className={cn("size-12 bg-secondary/40", LIFT)}
        >
          <MicrosoftMark />
        </Button>

        <Button
          variant="outline"
          size="icon"
          type="button"
          aria-label="Sign in with SAML single sign-on"
          className={cn("size-12 bg-secondary/40", LIFT)}
          asChild
        >
          <Link href="/login/sso">
            <KeyRound aria-hidden />
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
        <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-muted-foreground uppercase">
          or
        </span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-5"
      >
        {formError ? (
          <p
            role="alert"
            className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 px-3.5 py-3 text-sm text-destructive"
          >
            <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
            {formError}
          </p>
        ) : null}

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Work email</Label>

          <div className="group relative">
            <Mail
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground transition-colors duration-[--duration-fast] group-focus-within:text-accent"
            />
            <Input
              id="email"
              type="email"
              autoComplete="username"
              autoFocus
              placeholder="dana@maisonskin.com"
              className="h-12 bg-secondary/30 pl-10"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
            <FieldUnderline />
          </div>

          {errors.email ? (
            <p id="email-error" role="alert" className="text-sm text-destructive">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          {/* Recovery sits on the label row rather than under the field. It
              belongs to the password, and pairing them there buys back a whole
              line on a card that must not scroll. */}
          <div className="flex items-baseline justify-between gap-4">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="rounded-sm text-xs font-medium text-accent underline-offset-4 transition-colors duration-[--duration-fast] hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              Forgot password
            </Link>
          </div>

          <div className="group relative">
            <Lock
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground transition-colors duration-[--duration-fast] group-focus-within:text-accent"
            />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••••••"
              className="h-12 bg-secondary/30 pr-12 pl-10"
              aria-invalid={!!errors.password}
              aria-describedby={cn(
                errors.password && "password-error",
                capsLock && "password-caps"
              )}
              // Caps Lock silently eats more sign-ins than any other single
              // cause. Reading the modifier is free; guessing is not.
              onKeyUp={(e) => setCapsLock(e.getModifierState("CapsLock"))}
              onKeyDown={(e) => setCapsLock(e.getModifierState("CapsLock"))}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-pressed={showPassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-lg text-muted-foreground transition-colors duration-[--duration-fast] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {showPassword ? (
                <EyeOff aria-hidden className="size-4" />
              ) : (
                <Eye aria-hidden className="size-4" />
              )}
            </button>
            <FieldUnderline />
          </div>

          {errors.password ? (
            <p
              id="password-error"
              role="alert"
              className="text-sm text-destructive"
            >
              {errors.password.message}
            </p>
          ) : capsLock ? (
            <p id="password-caps" className="text-sm text-warning">
              Caps Lock is on.
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="remember"
            className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-muted-foreground transition-colors duration-[--duration-fast] select-none hover:text-foreground"
          >
            <input
              id="remember"
              type="checkbox"
              aria-describedby={remember ? "remember-hint" : undefined}
              className="size-4 rounded-sm border-input accent-[var(--accent)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              {...register("remember")}
            />
            Keep me signed in
          </label>

          {/* Warn at the moment of the choice, not in a policy document. */}
          {remember ? (
            <p
              id="remember-hint"
              className="flex items-start gap-2 text-xs text-muted-foreground"
            >
              <ShieldAlert aria-hidden className="mt-px size-3.5 shrink-0" />
              Only on a device that is yours — not the shared front-desk
              computer.
            </p>
          ) : null}
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isPending}
          className="group relative w-full overflow-hidden"
        >
          {/* Specular bar crossing the face of the control, once every seven
              seconds. It is the only thing on the card that moves on its own,
              which is precisely why it is on the one control that matters —
              and why it stops the moment the button is doing real work. */}
          {!isPending ? (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-1/4 animate-[sheen-x_7s_var(--ease-in-out)_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent motion-reduce:hidden"
            />
          ) : null}

          <span className="relative z-10 inline-flex items-center gap-2">
            {isPending ? (
              <>
                <Loader2 aria-hidden className="animate-spin" />
                Signing in
              </>
            ) : (
              <>
                Sign in
                <ArrowRight
                  aria-hidden
                  className="transition-transform duration-[--duration-base] ease-[--ease-out] group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
                />
              </>
            )}
          </span>
        </Button>
      </form>
    </div>
  )
}
