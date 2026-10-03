"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppBar, BottomNavigation, BottomNavigationAction, Box, Paper, Toolbar, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PersonIcon from "@mui/icons-material/Person";

const tabs = [
  { href: "/cliente", label: "Inicio", icon: <HomeIcon /> },
  { href: "/cliente/catalogo", label: "Servicios", icon: <LocalOfferIcon /> },
  { href: "/cliente/agendar", label: "Agendar", icon: <EventAvailableIcon /> },
  { href: "/cliente/visitas", label: "Visitas", icon: <ListAltIcon /> },
  { href: "/cliente/perfil", label: "Perfil", icon: <PersonIcon /> },
];

export default function ClienteShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const current = tabs.find((t) => (t.href === "/cliente" ? path === "/cliente" : path.startsWith(t.href)))?.href ?? false;
  return (
    <Box sx={{ pb: 9, maxWidth: 640, mx: "auto" }}>
      <AppBar position="sticky">
        <Toolbar variant="dense"><Typography variant="h6">Consultora Contable</Typography></Toolbar>
      </AppBar>
      <Box sx={{ p: 2 }}>{children}</Box>
      <Paper elevation={8} sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 10, pb: "env(safe-area-inset-bottom)" }}>
        <BottomNavigation showLabels value={current} sx={{ maxWidth: 640, mx: "auto" }}>
          {tabs.map((t) => <BottomNavigationAction key={t.href} value={t.href} label={t.label} icon={t.icon} component={Link} href={t.href} sx={{ minWidth: 0 }} />)}
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
