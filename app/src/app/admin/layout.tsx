import type { Metadata } from "next";

// Sin manifest ni service worker: el panel admin no es instalable ni se cachea
export const metadata: Metadata = { title: "Administración · Consultora Contable" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
