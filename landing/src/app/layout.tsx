import type { Metadata } from "next";
import localFont from "next/font/local";
import ThemeRegistry from "@/components/ThemeRegistry";
import { SITE } from "@/lib/site";

// Fuente autoalojada (OFL): el build en CI no depende de Google Fonts
const jakarta = localFont({
  src: "./fonts/PlusJakartaSans-latin.woff2", // variable 400-800, subconjunto latin (cubre español)
  weight: "400 800",
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url.replace(/\/?$/, "/")),
  title: { default: `${SITE.nombre} | Contabilidad, impuestos y asesoría`, template: `%s | ${SITE.nombre}` },
  description: SITE.descripcion,
  keywords: ["consultora contable", "contabilidad", "impuestos", "IVA", "balance", "asesoría tributaria", "RUC"],
  openGraph: { type: "website", locale: "es_PY", siteName: SITE.nombre, title: SITE.nombre, description: SITE.descripcion, images: ["icons/icon-512.png"] },
  alternates: { canonical: "./" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={jakarta.variable}>
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
