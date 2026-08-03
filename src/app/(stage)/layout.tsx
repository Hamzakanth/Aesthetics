/**
 * Full-bleed stage routes: no site header, no site footer.
 *
 * These are the two screens that are not browsing — signing in and booking a
 * walkthrough. Both are a single decision on a lit dark stage, and a nav bar
 * across the top of one is a rack of exits from the only thing the page is for.
 * The way back to the site lives in each page's own header instead.
 */
export default function StageLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main id="main" className="min-h-dvh">
      {children}
    </main>
  )
}
