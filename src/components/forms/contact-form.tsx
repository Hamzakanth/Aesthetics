"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2, ChevronDown, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { submitContact } from "@/app/actions/contact"
import {
  contactSchema,
  TEAM_SIZES,
  type ContactValues,
} from "@/lib/validations/contact"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const MESSAGE_MAX = 1000

/** Label + control + error, wired so the error is announced, not just shown. */
function Field({
  id,
  label,
  error,
  hint,
  optional,
  children,
}: {
  id: string
  label: string
  error?: string
  hint?: string
  optional?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="justify-between">
        <span>{label}</span>
        {optional ? (
          <span className="text-xs font-normal text-muted-foreground">
            Optional
          </span>
        ) : null}
      </Label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="flex items-start gap-1.5 text-sm text-destructive"
        >
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

/** Replaces the form once submitted. A toast alone is too easy to miss. */
function SuccessPanel({ onReset }: { onReset: () => void }) {
  return (
    <div
      role="status"
      className="flex flex-col items-center gap-4 py-10 text-center"
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-accent-subtle">
        <CheckCircle2 aria-hidden className="size-7 text-accent" />
      </span>
      <div>
        <h3 className="text-lg font-semibold">Request received</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Someone who has actually deployed Aurelius will reply within one
          business day — usually with a couple of questions about your payer mix
          before we meet.
        </p>
      </div>

      {/* Sets expectations for the gap between now and the call, which is
          where most "did that send?" emails come from. */}
      <ol className="mx-auto mt-2 flex max-w-sm flex-col gap-3 rounded-xl border border-border bg-muted/30 p-5 text-left">
        {[
          "We read it and check which payers you work with.",
          "You get a reply with two or three times to choose from.",
          "Thirty minutes, on your own numbers.",
        ].map((step, i) => (
          <li key={step} className="flex items-start gap-3">
            <span
              aria-hidden
              className="mt-px flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-[0.6875rem] font-semibold text-accent"
            >
              {i + 1}
            </span>
            <span className="text-sm leading-relaxed text-muted-foreground">
              {step}
            </span>
          </li>
        ))}
      </ol>

      <Button variant="outline" onClick={onReset} className="mt-2">
        Send another request
      </Button>
    </div>
  )
}

export function ContactForm() {
  const [isPending, startTransition] = React.useTransition()
  const [isDone, setIsDone] = React.useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    // Validate on blur, then live once a field has already errored — the
    // pattern that avoids yelling at someone mid-keystroke.
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      company: "",
      teamSize: "6-20",
      message: "",
    },
  })

  const messageLength = watch("message")?.length ?? 0

  const onSubmit = (values: ContactValues) => {
    startTransition(async () => {
      const result = await submitContact(values)

      if (!result.ok) {
        for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
          setError(field as keyof ContactValues, { type: "server", message })
        }
        toast.error(result.message)
        return
      }

      toast.success("Request received", { description: result.message })
      reset()
      setIsDone(true)
    })
  }

  if (isDone) return <SuccessPanel onReset={() => setIsDone(false)} />

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Full name" error={errors.name?.message}>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Dana Whitfield"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")}
          />
        </Field>

        <Field id="email" label="Work email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="dana@cedarparkfm.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="company"
          label="Clinic or group"
          error={errors.company?.message}
        >
          <Input
            id="company"
            autoComplete="organization"
            placeholder="Cedar Park Family Medicine"
            aria-invalid={!!errors.company}
            aria-describedby={errors.company ? "company-error" : undefined}
            {...register("company")}
          />
        </Field>

        <Field id="teamSize" label="Providers" error={errors.teamSize?.message}>
          {/* Native select for mobile ergonomics; the chevron is drawn on top
              because appearance-none removes the platform one. */}
          <div className="relative">
            <select
              id="teamSize"
              aria-invalid={!!errors.teamSize}
              aria-describedby={errors.teamSize ? "teamSize-error" : undefined}
              className={cn(
                "h-11 w-full cursor-pointer appearance-none rounded-lg border border-input bg-card pr-10 pl-3.5 text-base md:text-sm",
                "shadow-xs transition-[border-color,box-shadow] duration-[--duration-fast]",
                "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:outline-none",
                "aria-invalid:border-destructive"
              )}
              {...register("teamSize")}
            >
              {TEAM_SIZES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
          </div>
        </Field>
      </div>

      <Field
        id="message"
        label="What are you trying to solve?"
        error={errors.message?.message}
      >
        {/* The example placeholder does the work the hint text used to — it
            shows the shape of a useful answer without adding a line to read. */}
        <Textarea
          id="message"
          rows={4}
          maxLength={MESSAGE_MAX}
          placeholder="We run Athena across two locations, take about 200 calls a day, and prior auth is eating a full-time role…"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          {...register("message")}
        />
        {/* Counter only appears once it is plausibly relevant. */}
        {messageLength > MESSAGE_MAX * 0.7 ? (
          <p className="text-right text-xs text-muted-foreground tabular-nums">
            {messageLength} / {MESSAGE_MAX}
          </p>
        ) : null}
      </Field>

      <div className="mt-2 flex flex-col gap-3">
        <Button
          type="submit"
          size="lg"
          variant="accent"
          disabled={isPending}
          className="w-full"
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" />
              Sending…
            </>
          ) : (
            "Request a demo"
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Used only to contact you about Aurelius. No newsletter, no reselling.
        </p>
      </div>

      <p aria-live="polite" className="sr-only">
        {isPending ? "Submitting your request" : ""}
      </p>
    </form>
  )
}
