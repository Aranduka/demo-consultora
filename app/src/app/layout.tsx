import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import ThemeRegistry from "@/components/ui/ThemeRegistry";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], display: "swap", variable: "--font-jakarta" });

export const metadata: Metadata = { title: "Consultora Contable", robots: { index: false, follow: false } };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={jakarta.variable}>
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
