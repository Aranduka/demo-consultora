"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BottomNavigation, BottomNavigationAction, Box, Paper } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HomeIcon from "@mui/icons-material/Home";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PersonIcon from "@mui/icons-material/Person";
import Brand from "@/components/ui/Brand";

const tabs = [
  { href: "/cliente", label: "Inicio", icon: <HomeOutlinedIcon />, activo: <HomeIcon /> },
  { href: "/cliente/catalogo", label: "Servicios", icon: <LocalOfferOutlinedIcon />, activo: <LocalOfferIcon /> },
  { href: "/cliente/agendar", label: "Agendar", icon: null, activo: null },
  { href: "/cliente/visitas", label: "Visitas", icon: <ListAltOutlinedIcon />, activo: <ListAltIcon /> },
  { href: "/cliente/perfil", label: "Perfil", icon: <PersonOutlineIcon />, activo: <PersonIcon /> },
];

export default function ClienteShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const current = tabs.find((t) => (t.href === "/cliente" ? path === "/cliente" : path.startsWith(t.href)))?.href ?? false;
  return (
    <Box sx={{ minHeight: "100dvh", maxWidth: 560, mx: "auto", pb: "calc(88px + env(safe-area-inset-bottom))" }}>
      <Box component="header" sx={{ position: "sticky", top: 0, zIndex: 5, px: 2, height: 60, display: "flex", alignItems: "center", bgcolor: "rgba(244,247,251,.9)", backdropFilter: "blur(8px)" }}>
        <Brand compact />
      </Box>
      <Box component="main" sx={{ px: 2, pt: 1 }}>{children}</Box>
      <Paper elevation={0} component="nav" aria-label="Navegación principal" sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 10, borderRadius: "20px 20px 0 0", borderTop: "1px solid", borderColor: "divider", boxShadow: "0 -8px 24px rgba(15,23,42,.06)", pb: "env(safe-area-inset-bottom)" }}>
        <BottomNavigation showLabels value={current} sx={{ maxWidth: 560, mx: "auto", height: 68, bgcolor: "transparent" }}>
          {tabs.map((t) =>
            t.icon ? (
              <BottomNavigationAction key={t.href} value={t.href} label={t.label} icon={current === t.href ? t.activo : t.icon} component={Link} href={t.href}
                sx={{ minWidth: 0, color: "text.secondary", "&.Mui-selected": { color: "primary.main" }, "& .MuiBottomNavigationAction-label": { fontWeight: 600, fontSize: ".72rem" } }} />
            ) : (
              <BottomNavigationAction key={t.href} value={t.href} label={t.label} component={Link} href={t.href}
                icon={<Box sx={{ width: 52, height: 52, mt: -3.5, borderRadius: "50%", display: "grid", placeItems: "center", color: "#fff", background: "linear-gradient(140deg,#1976D2,#0D47A1)", boxShadow: "0 8px 20px rgba(13,71,161,.4)", border: "4px solid #fff" }}><EventAvailableIcon /></Box>}
                sx={{ minWidth: 0, color: "primary.main", "& .MuiBottomNavigationAction-label": { fontWeight: 700, fontSize: ".72rem" } }} />
            ),
          )}
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
