import type { Metadata, Viewport } from "next"
import { Cormorant_Garamond, Inter } from "next/font/google"

import "./globals.css"

import { siteConfig } from "@/config/site"
import { buildMetadata } from "@/lib/seo"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/layout/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

// `display: swap` + preload keeps text visible during webfont load (no FOIT).
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

// The display serif. Loaded at display weights only — Cormorant is never used
// below ~20px, so the text weights would be dead bytes.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  applicationName: siteConfig.name,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.company.legalName, url: siteConfig.url }],
  creator: siteConfig.company.legalName,
  formatDetection: { telephone: false },
  ...buildMetadata(),
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Do NOT set maximumScale/userScalable — pinch-zoom is an accessibility right.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f7f4" },
    { media: "(prefers-color-scheme: dark)", color: "#14110e" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(inter.variable, cormorant.variable)}
    >
      <body className="min-h-dvh antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={200}>
            {/* First tab stop on every page. */}
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-primary-foreground"
            >
              Skip to main content
            </a>

            {/* Chrome is owned by the route group — see (marketing)/layout. */}
            {children}

            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
