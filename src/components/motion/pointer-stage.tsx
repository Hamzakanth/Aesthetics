"use client"

import * as React from "react"
import {
  motion,
  motionValue,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion"

import { cn } from "@/lib/utils"

/**
 * A single shared pointer, published once and read by every object on the
 * stage.
 *
 * The alternative — each card listening for its own `pointermove` and reading
 * its own `getBoundingClientRect()` — gives every object a slightly different
 * idea of where the light is, which is exactly what makes most tilt effects
 * read as a pile of independent gimmicks instead of one scene. One listener,
 * one set of values, one light.
 *
 * Positions are normalised against the viewport rather than against each
 * element, so a hand moving across the screen moves the whole scene together
 * and the parallax between near and far layers stays coherent.
 */

interface Pointer {
  /** Offset from viewport centre, -1 … 1. Spring-smoothed. Drives rotation. */
  x: MotionValue<number>
  y: MotionValue<number>
  /** Absolute viewport position, 0 … 1. Spring-smoothed. Places the light. */
  lightX: MotionValue<number>
  lightY: MotionValue<number>
  /**
   * False on touch pointers and under reduced motion. The values still exist
   * and still resolve — they simply never leave centre, so every consumer can
   * bind its transforms unconditionally and there is no branch to get wrong.
   */
  live: boolean
}

/**
 * Module-scope constants, not hook state: these are never written to, so one
 * frozen set can back every render outside a stage without any hook-order
 * cost at the call site.
 */
const REST: Pointer = {
  x: motionValue(0),
  y: motionValue(0),
  lightX: motionValue(0.5),
  lightY: motionValue(0.5),
  live: false,
}

const PointerContext = React.createContext<Pointer>(REST)

export function usePointer() {
  return React.useContext(PointerContext)
}

/**
 * Soft and slightly heavy on purpose. A stiff spring makes the card feel like
 * it is glued to the cursor; this one lags a beat behind, which is what reads
 * as mass. Overshoot is kept low — a wobbling sign-in card is a toy.
 */
const SPRING = { stiffness: 70, damping: 20, mass: 0.9 } as const

export function PointerStage({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const shouldReduceMotion = useReducedMotion()
  // Starts false so the server render and the first client render agree; the
  // capability check runs after mount. Nothing in the DOM depends on it, only
  // whether the listener is attached, so there is no flash either way.
  const [finePointer, setFinePointer] = React.useState(false)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rawLightX = useMotionValue(0.5)
  const rawLightY = useMotionValue(0.5)

  const x = useSpring(rawX, SPRING)
  const y = useSpring(rawY, SPRING)
  const lightX = useSpring(rawLightX, SPRING)
  const lightY = useSpring(rawLightY, SPRING)

  React.useEffect(() => {
    const query = window.matchMedia("(pointer: fine)")
    const sync = () => setFinePointer(query.matches)
    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  const live = finePointer && !shouldReduceMotion

  React.useEffect(() => {
    if (!live) {
      // Glide home rather than snapping: this also runs when someone turns
      // reduced motion on mid-session, and a hard reset there is the one jump
      // the setting exists to prevent.
      rawX.set(0)
      rawY.set(0)
      rawLightX.set(0.5)
      rawLightY.set(0.5)
      return
    }

    // Viewport-relative, so no layout is read on the pointer path — no
    // `getBoundingClientRect`, no forced reflow, nothing to invalidate on
    // scroll or resize.
    const onMove = (event: PointerEvent) => {
      const nx = event.clientX / window.innerWidth
      const ny = event.clientY / window.innerHeight
      rawLightX.set(nx)
      rawLightY.set(ny)
      rawX.set(nx * 2 - 1)
      rawY.set(ny * 2 - 1)
    }

    // Recentre when the cursor leaves the window entirely, so the scene does
    // not sit frozen mid-lean while nobody is there.
    const onLeave = () => {
      rawX.set(0)
      rawY.set(0)
      rawLightX.set(0.5)
      rawLightY.set(0.5)
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    document.addEventListener("pointerleave", onLeave)
    return () => {
      window.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerleave", onLeave)
    }
  }, [live, rawX, rawY, rawLightX, rawLightY])

  const value = React.useMemo<Pointer>(
    () => ({ x, y, lightX, lightY, live }),
    [x, y, lightX, lightY, live]
  )

  return (
    <PointerContext.Provider value={value}>
      <div className={cn(className)} {...props}>
        {children}
      </div>
    </PointerContext.Provider>
  )
}

interface TiltProps extends Omit<React.ComponentProps<typeof motion.div>, "style"> {
  /** Peak rotation, in degrees, reached at the far edge of the viewport. */
  strength?: number
  /**
   * Camera distance in px. Lower is more dramatic — and more likely to look
   * cheap. 1400–1800 is the range where an object reads as solid rather than
   * as a fisheye.
   */
  perspective?: number
  /** Constant push toward (+) or away from (−) the viewer, in px. */
  lift?: number
  /** Lean away from the pointer instead of toward it. */
  invert?: boolean
  style?: React.CSSProperties
}

/**
 * An object on the stage: it turns to face the pointer.
 *
 * The perspective lives in the element's own `transform` rather than on an
 * ancestor's `perspective` property. That matters in a real layout — a CSS
 * `perspective` only reaches direct children, so any wrapper a flexbox or a
 * grid inserts silently flattens everything below it. A `perspective()`
 * function is self-contained and cannot be broken by markup above it.
 *
 * `preserve-3d` is set here so children can stand off the face on their own Z
 * planes and get genuine parallax as the object turns. That is the difference
 * between a card that tilts and a card that has depth. It also means this
 * element must never take `overflow: hidden` — clipping forces a flat
 * rendering context and collapses every child back onto the surface.
 */
function Tilt({
  strength = 7,
  perspective = 1600,
  lift = 0,
  invert = false,
  className,
  style,
  children,
  ...props
}: TiltProps) {
  const { x, y } = usePointer()
  const amount = invert ? -strength : strength

  // Positive rotateY swings the object's normal toward +x, so it points at a
  // cursor on the right. rotateX is negated because CSS y grows downward.
  const rotateY = useTransform(x, (value) => value * amount)
  const rotateX = useTransform(y, (value) => -value * amount)

  const transform = useMotionTemplate`perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${lift}px)`

  return (
    <motion.div
      className={cn(className)}
      style={{ transform, transformStyle: "preserve-3d", ...style }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

interface ParallaxProps extends Omit<React.ComponentProps<typeof motion.div>, "style"> {
  /** Travel in px at the viewport edge. Negative pushes the layer back. */
  depth?: number
  style?: React.CSSProperties
}

/**
 * A layer that slides with the pointer. Negative depth for anything behind
 * the subject, positive for anything in front — that inversion is the entire
 * cue the eye uses to sort a flat image into planes.
 */
function Parallax({
  depth = 20,
  className,
  style,
  children,
  ...props
}: ParallaxProps) {
  const { x, y } = usePointer()
  const translateX = useTransform(x, (value) => value * depth)
  const translateY = useTransform(y, (value) => value * depth)

  return (
    <motion.div
      className={cn(className)}
      style={{ x: translateX, y: translateY, ...style }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export { Tilt, Parallax }
