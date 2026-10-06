"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, Box, Chip, Drawer, GlobalStyles, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import DashboardIcon from "@mui/icons-material/SpaceDashboardOutlined";
import PeopleIcon from "@mui/icons-material/PeopleAltOutlined";
import LocalOfferIcon from "@mui/icons-material/LocalOfferOutlined";
import BadgeIcon from "@mui/icons-material/BadgeOutlined";
import ScheduleIcon from "@mui/icons-material/ScheduleOutlined";
import EventIcon from "@mui/icons-material/EventNoteOutlined";
import RouteIcon from "@mui/icons-material/AltRouteOutlined";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
import Brand from "@/components/ui/Brand";
import LogoutButton from "@/components/ui/LogoutButton";
import { diaLargo, hoyAsu } from "@/lib/format";

const W = 288;
const grupos = [
  { titulo: "Operación", items: [
    { href: "/admin", label: "Inicio", icon: <DashboardIcon /> },
    { href: "/admin/ruta", label: "Hoja de ruta", icon: <RouteIcon /> },
    { href: "/admin/visitas", label: "Visitas", icon: <EventIcon /> },
  ] },
  { titulo: "Gestión", items: [
    { href: "/admin/clientes", label: "Clientes", icon: <PeopleIcon /> },
    { href: "/admin/servicios", label: "Servicios y precios", icon: <LocalOfferIcon /> },
    { href: "/admin/encargados", label: "Encargados", icon: <BadgeIcon /> },
    { href: "/admin/franjas", label: "Franjas horarias", icon: <ScheduleIcon /> },
  ] },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const theme = useTheme();
  const esMovil = useMediaQuery(theme.breakpoints.down("md"));

  // El panel admin es solo para ordenador (no PWA)
  if (esMovil)
    return (
      <Box sx={{ minHeight: "100dvh", display: "grid", placeItems: "center", p: 3, textAlign: "center" }}>
        <Stack alignItems="center" spacing={1.5} maxWidth={360}>
          <Box sx={{ width: 80, height: 80, borderRadius: "50%", bgcolor: "#E8F0FE", color: "primary.main", display: "grid", placeItems: "center" }}><DesktopWindowsIcon sx={{ fontSize: 40 }} /></Box>
          <Typography variant="h5">Usar desde un ordenador</Typography>
          <Typography color="text.secondary">El panel de administración está disponible únicamente en pantallas de escritorio.</Typography>
        </Stack>
      </Box>
    );

  return (
    <Box sx={{ display: "flex", minHeight: "100dvh" }}>
      <GlobalStyles styles={{ "@media print": { ".no-print": { display: "none !important" }, main: { margin: "0 !important", padding: "0 !important" } } }} />
      <Drawer variant="permanent" className="no-print" sx={{ width: W, flexShrink: 0, "& .MuiDrawer-paper": { width: W, boxSizing: "border-box", bgcolor: "#0B1B3A", color: "#fff", border: 0, p: 2 } }}>
        <Box sx={{ px: 1, py: 1.5, mb: 1 }}><Brand light /></Box>
        {grupos.map((g) => (
          <List key={g.titulo} dense disablePadding subheader={<ListSubheader disableSticky sx={{ bgcolor: "transparent", color: "#8FA3C8", fontWeight: 700, fontSize: ".7rem", letterSpacing: ".08em", textTransform: "uppercase", lineHeight: "32px", mt: 1.5 }}>{g.titulo}</ListSubheader>}>
            {g.items.map((i) => {
              const activo = i.href === "/admin" ? path === "/admin" : path.startsWith(i.href);
              return (
                <ListItemButton key={i.href} component={Link} href={i.href} selected={activo} sx={{
                  borderRadius: "10px", mb: 0.5, minHeight: 44, color: "#C5D1EA",
                  "& .MuiListItemIcon-root": { color: "inherit", minWidth: 40 },
                  "&:hover": { bgcolor: "rgba(255,255,255,.07)" },
                  "&.Mui-selected": { bgcolor: "rgba(255,255,255,.14)", color: "#fff", boxShadow: "inset 3px 0 0 #60A5FA" },
                  "&.Mui-selected:hover": { bgcolor: "rgba(255,255,255,.18)" },
                }}>
                  <ListItemIcon>{i.icon}</ListItemIcon>
                  <ListItemText primary={i.label} slotProps={{ primary: { fontWeight: activo ? 700 : 500 } }} />
                </ListItemButton>
              );
            })}
          </List>
        ))}
      </Drawer>

      <Box sx={{ flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <Box component="header" className="no-print" sx={{ position: "sticky", top: 0, zIndex: 10, bgcolor: "rgba(255,255,255,.85)", backdropFilter: "blur(8px)", borderBottom: "1px solid", borderColor: "divider", px: 4, height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography color="text.secondary">{diaLargo(hoyAsu())}</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip avatar={<Avatar sx={{ bgcolor: "primary.main !important", color: "#fff !important" }}>A</Avatar>} label="Administrador" variant="outlined" />
            <LogoutButton to="/admin/login" variant="text" />
          </Stack>
        </Box>
        <Box component="main" sx={{ p: 4, maxWidth: 1400, width: "100%", mx: "auto" }}>{children}</Box>
      </Box>
    </Box>
  );
}
