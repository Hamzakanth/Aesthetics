/**
 * No header, no footer, no way back into the funnel by accident. An auth
 * screen has exactly one job, and every extra link is a way to fail it.
 */
export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main id="main" className="min-h-dvh">
      {children}
    </main>
  )
}
