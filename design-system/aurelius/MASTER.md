# Aurelius — Design System (MASTER)

**Global source of truth.** Page-level overrides live in `design-system/aurelius/pages/<page>.md`
and win over anything here. Absent an override, these rules apply.

Design philosophy: **Apple × Stripe × Nabla**.

| Reference | What we take | What we do *not* take |
|-----------|--------------|------------------------|
| Apple | Pure-white ground, system blue, generous whitespace, restraint | Giant product photography, full-bleed video |
| Stripe | Animated gradient mesh behind the hero and closing CTA | WebGL, scroll-jacking, the multi-hue rainbow |
| Nabla | Trust register — soft geometry, calm density, dark quiet close | Illustration-led warmth, pastel tinting |

Substrate remains **Swiss Modernism 2.0** — strict grid, mathematical spacing, single accent,
no decoration that does not carry information. The gradient field sits *behind* that grid;
it never replaces it.

---

## 1. Dials

| Dial | Value | Meaning |
|------|-------|---------|
| Variance | 4/10 | Balanced/modern. Centred compositions, one asymmetric bento cell. |
| Motion | 6/10 | Standard scroll reveal + stagger. No pinning, no scroll-jacking. |
| Density | 4/10 | Standard 8px base unit, 16–64px section rhythm. |

## 2. Deviations from the generated recommendation

Recorded so they are not silently reverted:

| Dimension | Generator said | Shipped | Why |
|-----------|----------------|---------|-----|
| Style | SaaS Mobile (High-Tech Boutique) | Swiss Modernism 2.0 | The query matched a mobile-app style; this is a desktop-first marketing site. |
| Display font | Calistoga | Inter Tight | Calistoga reads warm-editorial. Enterprise governance needs precision, not warmth. |
| Palette | Stone + gold | **White + Apple blue** | Superseded by direction: white/blue, Apple register. Warm stone neutrals fought the blue, so the whole neutral ramp moved to cool slate. |

## 3. Colour

Three token layers. **Never write a raw hex in a component** — always go through a semantic token.
Defined in `src/app/globals.css`.

| Role | Light | Dark | Token |
|------|-------|------|-------|
| Background | `#FFFFFF` | `#070D14` | `--background` |
| Foreground | `#0A121B` | `#F7F9FC` | `--foreground` |
| Card | `#FFFFFF` | `#0E161F` | `--card` |
| Primary / Accent | `#0071E3` | `#4DA3FF` | `--primary`, `--accent` |
| Muted fg | `#4E5A6B` | `#9AA7B8` | `--muted-foreground` |
| Border | `#E3E8EF` | `#1E2937` | `--border` |
| Ink panel | `#0A121B` | `#0E161F` | `--ink` |

Four rules that are easy to break by accident:

1. **The ground is pure white, not off-white.** Elevation comes from hairlines and cool shadow.
   A grey page is the single fastest way to lose the Apple register.
2. **Neutrals are cool (slate), never warm (stone).** A warm grey next to `#0071E3` vibrates.
3. **`--primary` and `--accent` are the same blue on purpose.** In this register the filled
   button *is* the brand. Do not split them to add a second brand colour.
4. **The accent shifts between modes on purpose.** `blue-600` clears 4.5:1 on white but fails
   on the dark ground; dark lifts it to `blue-400`. Do not "unify" these to one value.

Shadows are blue-tinted (`--shadow-*`), and filled buttons use `--shadow-blue` so they read as
emitting the brand colour rather than sitting on grey dirt.

Accent budget: **one accent element per viewport**. It marks the primary action, the active state,
or the single number worth reading — never all three at once. The gradient mesh does not count
against this budget; it is ground, not figure.

## 3b. Gradient mesh

`<GradientMesh tone="light" | "ink" />` — `src/components/motion/gradient-mesh.tsx`.
Used in exactly two places: behind the hero, and behind the closing CTA. Adding a third
instance makes it wallpaper instead of a signature.

- Three blurred blobs on 22s / 28s / 34s cycles so the composite never visibly loops.
- Only `transform` and `opacity` animate → fully GPU-composited, zero main-thread cost.
- Blob fills are tokenised (`--mesh-a/b/c`) and theme-aware; `[data-mesh-tone="ink"]`
  overrides them for the dark panel, which is dark in *both* themes.
- Under `prefers-reduced-motion` the blobs **stop but remain visible**. The colour field is
  design; only the movement is optional.
- Always `aria-hidden`. It never carries meaning.

## 4. Typography

| Role | Family | Usage |
|------|--------|-------|
| Display | Inter Tight | `h1`–`h4`, metric numerals. Tracking `-0.028em`. |
| UI / body | Inter | Everything else. Base 16px, line-height 1.5+. |
| Mono | JetBrains Mono | Eyebrows, policy identifiers, status labels only. |

Mono is a **system-label signal**, not decoration. If a mono string is a sentence, it is misused.

Display sizes are fluid `clamp()` (`text-display-sm|md|lg`) — headlines never need a breakpoint.

## 5. Spacing & layout

- 8px base unit. Scale: 8 · 16 · 24 · 32 · 48 · 64 · 96 · 128.
- One horizontal measure, owned by `<Container>` (`narrow` 768 / `default` 1152 / `wide` 1280).
  Sections never set their own `max-width`.
- Vertical rhythm owned by `<Section spacing>`. Sections never set their own `py`.
- Breakpoints: 375 / 768 / 1024 / 1440. Mobile-first, no horizontal scroll at any width.

## 6. Motion

- Duration 150–320ms. **Exit is always faster than enter.**
- Easing `cubic-bezier(0.16, 1, 0.3, 1)` (`--ease-out`).
- Animate `opacity` and `transform` only. Never `width`, `height`, or `top`.
- Reveal distance 16px, stagger 60ms.
- `prefers-reduced-motion` degrades to a **fade**, not to nothing — content popping in
  abruptly is worse than the animation was.

## 7. Components

- All interactive controls ≥ 44×44px on coarse pointers; ≥ 8px apart.
- `cursor-pointer` on everything clickable.
- Focus rings are replaced, never removed.
- Radius scale from `--radius: 0.875rem`. Buttons `lg`, cards `xl`, hero surfaces `2xl`.
  Softened from 0.625rem for the trust register — calmer, still not playful.
- Shadows are tight, low-opacity and **cool-tinted**. A soft grey blob reads as cheap.
- Icons: Lucide, 1.5px stroke, sized in `rem`. **No emoji as icons, ever.**

## 8. Non-negotiables

- Body text contrast ≥ 4.5:1 in **both** themes.
- Never set `maximum-scale` or `user-scalable=no`.
- Every form field has a visible label; errors sit next to the field and carry `role="alert"`.
- Decorative DOM gets `aria-hidden`; charts carry a text `<figcaption>` alternative.
- Colour is never the sole carrier of meaning — pair it with a label, icon, or shape.
- Reserve space for async content (fixed chart height, skeletons) so CLS stays < 0.1.
