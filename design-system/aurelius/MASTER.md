# Aurelius — Design System (MASTER)

**Global source of truth.** Page-level overrides live in `design-system/aurelius/pages/<page>.md`
and win over anything here. Absent an override, these rules apply.

Design philosophy: **Apple Store × Chanel × Stripe** — quiet luxury.

| Reference | What we take | What we do *not* take |
|-----------|--------------|------------------------|
| Apple Store | Generous whitespace, restraint, one product per eyeline | Giant product photography, full-bleed video |
| Chanel | Nude ground, charcoal type, scarce gold, editorial serif display | Fashion-shoot imagery, all-caps everything, black slabs |
| Stripe | Animated gradient mesh behind the hero and closing CTA | WebGL, scroll-jacking, the multi-hue rainbow |

Substrate remains **Swiss Modernism 2.0** — strict grid, mathematical spacing, single accent,
no decoration that does not carry information. Luxury here is *subtraction*: the serif and the
gold do the signalling, and everything else gets quieter to let them. The gradient field sits
*behind* the grid; it never replaces it.

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
| Display font | Calistoga | Cormorant Garamond | Calistoga is a warm slab. The brief is couture, which wants high stroke contrast and real serifs. |
| Palette | White + Apple blue | **Soft nude + gold** | Superseded by direction: this sells to aesthetic and beauty studios. Cool slate neutrals read clinical — exactly the register the product is *not* in — so the whole ramp moved to warm stone. |
| Primary button | The accent | Charcoal | A page of gold buttons reads costume. Gold marks emphasis; charcoal carries action. |

## 3. Colour

Three token layers. **Never write a raw hex in a component** — always go through a semantic token.
Defined in `src/app/globals.css`.

Source palette: Ivory `#F9F7F4` · Warm White `#FFFFFF` · Beige `#E8D9CF` · Sand `#D8C4B6` ·
Charcoal `#333333` · Gold `#C9A96A`.

| Role | Light | Dark | Token |
|------|-------|------|-------|
| Background | `#F9F7F4` (ivory) | `#14110E` | `--background` |
| Foreground | `#2A241F` | `#F5F0EA` | `--foreground` |
| Card | `#FFFFFF` (warm white) | `#1D1915` | `--card` |
| Primary | `#2A241F` (charcoal) | `#D9BE87` (gold-400) | `--primary` |
| Accent | `#8A6A2F` (gold-700) | `#D9BE87` (gold-400) | `--accent` |
| Muted fg | `#6B5D52` | `#B6A99B` | `--muted-foreground` |
| Border | `#E8D9CF` (beige) | `#2F2820` | `--border` |
| Ink panel | `#191512` (espresso) | `#1D1915` | `--ink` |

Five rules that are easy to break by accident:

1. **The ground is ivory, the cards are warm white.** That half-step is the whole nude palette.
   Flattening both to `#FFFFFF` empties the page; darkening the ground makes it look unpainted.
2. **Neutrals are warm (stone), never cool (slate).** A cool grey next to `#C9A96A` turns the
   gold green and the page grubby.
3. **`--primary` is charcoal, `--accent` is gold — they are deliberately different.** The filled
   button is near-black; gold marks emphasis. Do not "unify" them.
4. **Brand gold `#C9A96A` is for fills, marks and decoration — never for text.** It sits at
   ~2:1 on ivory. Gold *text* uses `--accent` (`gold-700`), which clears 4.5:1.
5. **The accent shifts between modes on purpose.** `gold-700` clears 4.5:1 on ivory but goes
   muddy on espresso; dark lifts it to `gold-400`.

Shadows are warm-tinted (`--shadow-*`), and filled buttons use `--shadow-lift` so they rest on
the page rather than being cut out of it.

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
| Display | Cormorant Garamond | `h1`, `h2`, `.font-display` — metric numerals, pull figures. Tracking `-0.012em`. |
| UI / body | Inter | Everything else, including `h3`/`h4`. Base 16px, line-height 1.5+. |
| Label (`font-mono`) | Inter, letterspaced | Eyebrows, status chips, small caps only. |

**The serif has a floor of ~20px.** Cormorant is high-contrast; below that its hairlines drop out
and it reads as a rendering fault, which is why `h3`/`h4` stay on the sans. Never apply
`font-display` to body copy or a control label.

`font-mono` in this codebase means *system label*, not monospace — the role maps to Inter and
earns its distinction from tracking and case. A true monospace reads engineering, not couture.
If a label string is a sentence, it is misused.

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
- Radius scale from `--radius: 0.75rem`. Buttons `lg`, cards `xl`, hero surfaces `2xl`.
  Tightened from 0.875rem — over-rounding reads as an app, a little square reads as a boutique.
- Shadows are tight, low-opacity and **warm-tinted**. A soft grey blob reads as cheap.
- Icons: Lucide, 1.5px stroke, sized in `rem`. **No emoji as icons, ever.**

## 8. Non-negotiables

- Body text contrast ≥ 4.5:1 in **both** themes.
- Never set `maximum-scale` or `user-scalable=no`.
- Every form field has a visible label; errors sit next to the field and carry `role="alert"`.
- Decorative DOM gets `aria-hidden`; charts carry a text `<figcaption>` alternative.
- Colour is never the sole carrier of meaning — pair it with a label, icon, or shape.
- Reserve space for async content (fixed chart height, skeletons) so CLS stays < 0.1.
