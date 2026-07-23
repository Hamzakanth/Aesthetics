"use client"

import * as React from "react"
import { motion, useReducedMotion, type Variants } from "framer-motion"

import { cn } from "@/lib/utils"

/**
 * Scroll-reveal primitives. Two rules hold everywhere:
 *  1. Only opacity and transform are animated — never width/height/top.
 *  2. Reduced motion degrades to a plain fade, not to nothing. Removing the
 *     transition entirely makes content pop in harder than the animation did.
 */

const DISTANCE = 16

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
}

export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: DISTANCE },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
}

const reducedItem: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
}

interface RevealProps extends React.ComponentProps<"div"> {
  delay?: number
  /** Re-run the animation each time the element scrolls back into view. */
  repeat?: boolean
}

function Reveal({
  className,
  children,
  delay = 0,
  repeat = false,
  ...props
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: !repeat, margin: "-80px" }}
      variants={shouldReduceMotion ? reducedItem : fadeUpItem}
      transition={{ delay }}
      className={cn(className)}
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      {children}
    </motion.div>
  )
}

/** Parent for a list/grid. Children must be <RevealItem>. */
function RevealGroup({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={staggerContainer}
      className={cn(className)}
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      {children}
    </motion.div>
  )
}

function RevealItem({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      variants={shouldReduceMotion ? reducedItem : fadeUpItem}
      className={cn(className)}
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      {children}
    </motion.div>
  )
}

export { Reveal, RevealGroup, RevealItem }
