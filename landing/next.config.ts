import type { NextConfig } from "next";

// Sitio de marketing: sin backend, solo páginas estáticas para SEO
const nextConfig: NextConfig = { poweredByHeader: false };
export default nextConfig;
