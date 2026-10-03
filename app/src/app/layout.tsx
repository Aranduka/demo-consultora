import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import ThemeRegistry from "@/components/ui/ThemeRegistry";

const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400", "500", "700"], display: "swap" });

export const metadata: Metadata = { title: "Consultora Contable", robots: { index: false, follow: false } };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={roboto.className}>
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
