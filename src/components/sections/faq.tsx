import Link from "next/link"

import { faqs } from "@/content/faq"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Container } from "@/components/primitives/container"
import { Section } from "@/components/primitives/section"
import { SectionHeading } from "@/components/primitives/section-heading"

export function Faq() {
  return (
    <Section id="faq" aria-labelledby="faq-heading">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              headingId="faq-heading"
              eyebrow="FAQ"
              title="Questions we get on the first call"
            />
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Still unresolved?{" "}
              <Link
                href="/contact"
                className="font-medium text-foreground underline decoration-accent underline-offset-4 transition-colors hover:text-accent"
              >
                Talk to someone who has deployed this
              </Link>{" "}
              — not a sales development rep.
            </p>
          </div>

          <div className="lg:col-span-7">
            <Accordion type="single" collapsible defaultValue={faqs[0]?.id}>
              {faqs.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Container>
    </Section>
  )
}
