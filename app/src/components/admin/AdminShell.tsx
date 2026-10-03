"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppBar, Box, Drawer, GlobalStyles, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import BadgeIcon from "@mui/icons-material/Badge";
import ScheduleIcon from "@mui/icons-material/Schedule";
import EventIcon from "@mui/icons-material/Event";
import RouteIcon from "@mui/icons-material/Route";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
import LogoutButton from "@/components/ui/LogoutButton";

const W = 240;
const items = [
  { href: "/admin", label: "Inicio", icon: <DashboardIcon /> },
  { href: "/admin/ruta", label: "Hoja de ruta", icon: <RouteIcon /> },
  { href: "/admin/visitas", label: "Visitas", icon: <EventIcon /> },
  { href: "/admin/clientes", label: "Clientes", icon: <PeopleIcon /> },
  { href: "/admin/servicios", label: "Servicios y precios", icon: <LocalOfferIcon /> },
  { href: "/admin/encargados", label: "Encargados", icon: <BadgeIcon /> },
  { href: "/admin/franjas", label: "Franjas horarias", icon: <ScheduleIcon /> },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const theme = useTheme();
  const esMovil = useMediaQuery(theme.breakpoints.down("md"));

  // El panel admin es solo para ordenador (no PWA)
  if (esMovil)
    return (
      <Box sx={{ minHeight: "100dvh", display: "grid", placeItems: "center", p: 3, textAlign: "center" }}>
        <Box>
          <DesktopWindowsIcon color="primary" sx={{ fontSize: 64 }} />
          <Typography variant="h6" mt={1}>Usar desde un ordenador</Typography>
          <Typography color="text.secondary">El panel de administración está disponible únicamente en pantallas de escritorio.</Typography>
        </Box>
      </Box>
    );

  return (
    <Box sx={{ display: "flex" }}>
      <GlobalStyles styles={{ "@media print": { ".no-print": { display: "none !important" }, main: { margin: "0 !important", padding: "0 !important" } } }} />
      <AppBar position="fixed" className="no-print" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Consultora Contable · Administración</Typography>
          <LogoutButton to="/admin/login" variant="text" />
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" className="no-print" sx={{ width: W, "& .MuiDrawer-paper": { width: W, boxSizing: "border-box" } }}>
        <Toolbar />
        <List>
          {items.map((i) => (
            <ListItemButton key={i.href} component={Link} href={i.href} selected={i.href === "/admin" ? path === "/admin" : path.startsWith(i.href)}>
              <ListItemIcon>{i.icon}</ListItemIcon>
              <ListItemText primary={i.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, minWidth: 0 }}>
        <Toolbar className="no-print" />
        {children}
      </Box>
    </Box>
  );
}
