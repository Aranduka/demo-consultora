import type { NextConfig } from "next";

// Sitio de marketing: sin backend, se exporta como HTML estático (GitHub Pages).
// NEXT_PUBLIC_BASE_PATH solo se define al publicar en usuario.github.io/<repo>; en local queda vacío.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
};
export default nextConfig;
