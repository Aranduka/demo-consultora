import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import ThemeRegistry from "@/components/ThemeRegistry";
import { SITE } from "@/lib/site";

const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400", "500", "700"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.nombre} | Contabilidad, impuestos y asesoría`, template: `%s | ${SITE.nombre}` },
  description: SITE.descripcion,
  keywords: ["consultora contable", "contabilidad", "impuestos", "IVA", "balance", "asesoría tributaria", "RUC"],
  openGraph: { type: "website", locale: "es_PY", siteName: SITE.nombre, title: SITE.nombre, description: SITE.descripcion, images: ["/icons/icon-512.png"] },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={roboto.className}>
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
