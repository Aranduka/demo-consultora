import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      // El panel admin nunca se cachea (no es PWA)
      { source: "/admin/:path*", headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }] },
      { source: "/api/:path*", headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }] },
      { source: "/sw.js", headers: [{ key: "Cache-Control", value: "no-cache" }, { key: "Service-Worker-Allowed", value: "/cliente/" }] },
    ];
  },
};

export default nextConfig;
