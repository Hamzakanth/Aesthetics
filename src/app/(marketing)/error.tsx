"use client"

import * as React from "react"
import { RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Container } from "@/components/primitives/container"
import { Section } from "@/components/primitives/section"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    // Replace with your telemetry sink. The digest correlates to the
    // server-side stack trace, which is never sent to the client.
    console.error(error)
  }, [error])

  return (
    <Section spacing="loose">
      <Container className="flex flex-col items-center text-center">
        <p className="font-mono text-sm tracking-[0.14em] text-destructive uppercase">
          Something went wrong
        </p>
        <h1 className="mt-5 text-display-md font-semibold">
          We hit an unexpected error
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
          The issue has been logged. Retrying often resolves it.
        </p>
        {error.digest ? (
          <p className="mt-4 font-mono text-xs text-muted-foreground">
            Reference: {error.digest}
          </p>
        ) : null}
        <Button size="lg" className="mt-9" onClick={reset}>
          <RotateCcw />
          Try again
        </Button>
      </Container>
    </Section>
  )
}
