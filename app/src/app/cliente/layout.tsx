import type { Metadata, Viewport } from "next";
import RegisterSW from "@/components/cliente/RegisterSW";

// El manifest y el service worker SOLO se enlazan aquí (PWA de clientes), nunca en /admin
export const metadata: Metadata = {
  title: "Consultora Contable",
  manifest: "/cliente.webmanifest",
  icons: { apple: "/icons/icon-192.png" },
  appleWebApp: { capable: true, title: "Consultora", statusBarStyle: "default" },
};
export const viewport: Viewport = { themeColor: "#0D47A1", width: "device-width", initialScale: 1 };

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RegisterSW />
      {children}
    </>
  );
}
