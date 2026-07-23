import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },

  experimental: {
    // Tree-shake barrel imports from these packages so a single icon
    // does not pull the whole library into the client bundle.
    optimizePackageImports: ["lucide-react", "framer-motion", "recharts"],
  },

  async redirects() {
    return [
      // The demo request and the contact form are the same conversion, so
      // they share one page. /demo exists because that is what people type
      // and what the CTAs say.
      { source: "/demo", destination: "/contact", permanent: true },
      { source: "/book-a-demo", destination: "/contact", permanent: true },
    ]
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ]
  },
}

export default nextConfig
