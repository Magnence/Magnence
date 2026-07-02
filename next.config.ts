import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Image optimization for faster loading
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "magnence.com" },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Compress responses
  compress: true,
  // Power by header off (small perf gain + security)
  poweredByHeader: false,
  allowedDevOrigins: [
    "*.space-z.ai",
    "*.chatglm.cn",
    "*.z.ai",
    "localhost",
    "127.0.0.1",
    "*.magnence.com",
    "magnence.com",
  ],
  // Domain configuration for production
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Cache static assets aggressively (1 year)
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Cache public assets
        source: "/(.*)\\.(svg|png|jpg|jpeg|gif|webp|avif|ico|woff|woff2|ttf|eot)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, immutable" },
        ],
      },
    ];
  },
  // Multi-domain rewrite rules for subdomain-based routing
  async rewrites() {
    return [
      // admin.magnence.com → /app (Magnence OS for admins)
      {
        source: "/",
        has: [{ type: "host", value: "admin.magnence.com" }],
        destination: "/app",
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "admin.magnence.com" }],
        destination: "/app",
      },
      // hr.magnence.com → /app (HR panel)
      {
        source: "/",
        has: [{ type: "host", value: "hr.magnence.com" }],
        destination: "/app",
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "hr.magnence.com" }],
        destination: "/app",
      },
      // sales.magnence.com → /app (Sales panel)
      {
        source: "/",
        has: [{ type: "host", value: "sales.magnence.com" }],
        destination: "/app",
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "sales.magnence.com" }],
        destination: "/app",
      },
      // marketing.magnence.com → /app (Marketing panel)
      {
        source: "/",
        has: [{ type: "host", value: "marketing.magnence.com" }],
        destination: "/app",
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "marketing.magnence.com" }],
        destination: "/app",
      },
      // app.magnence.com → /app (General OS access)
      {
        source: "/",
        has: [{ type: "host", value: "app.magnence.com" }],
        destination: "/app",
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "app.magnence.com" }],
        destination: "/app",
      },
      // blog.magnence.com → /blog
      {
        source: "/",
        has: [{ type: "host", value: "blog.magnence.com" }],
        destination: "/blog",
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "blog.magnence.com" }],
        destination: "/blog/:path*",
      },
    ];
  },
};

export default nextConfig;
