import ClienteShell from "@/components/cliente/ClienteShell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <ClienteShell>{children}</ClienteShell>;
}
