"use client";
import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { Box, Button, Card, CardActionArea, CardContent, Skeleton, Stack, Typography } from "@mui/material";
import TodayIcon from "@mui/icons-material/TodayOutlined";
import PendingActionsIcon from "@mui/icons-material/PendingActionsOutlined";
import PeopleIcon from "@mui/icons-material/PeopleAltOutlined";
import LocalOfferIcon from "@mui/icons-material/LocalOfferOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAddAlt1";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import StatusChip from "@/components/ui/StatusChip";
import { api } from "@/lib/http";
import { hoyAsu } from "@/lib/format";

type Data = { visitasHoy: number; pendientes: number; clientes: number; servicios: number };

function Stat({ label, value, icon, href, tone }: { label: string; value?: number; icon: ReactNode; href: string; tone: string }) {
  return (
    <Card>
      <CardActionArea component={Link} href={href} sx={{ p: 0.5 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography color="text.secondary" fontWeight={600}>{label}</Typography>
              {value === undefined ? <Skeleton width={56} height={52} /> : <Typography variant="h3" fontWeight={800} letterSpacing="-0.03em">{value}</Typography>}
            </Box>
            <Box sx={{ width: 48, height: 48, borderRadius: "12px", display: "grid", placeItems: "center", bgcolor: `${tone}18`, color: tone }}>{icon}</Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function Dashboard() {
  const [d, setD] = useState<Data | null>(null);
  const [hoy, setHoy] = useState<any[] | null>(null);
  useEffect(() => {
    api<Data>("/api/admin/dashboard").then(setD);
    api<{ visitas: any[] }>("/api/admin/ruta?fecha=" + hoyAsu()).then((r) => setHoy(r.visitas));
  }, []);

  return (
    <Box>
      <PageHeader
        title="Resumen"
        subtitle="Así está la operación de hoy."
        actions={<>
          <Button component={Link} href="/admin/clientes" variant="outlined" startIcon={<PersonAddIcon />}>Nuevo cliente</Button>
          <Button component={Link} href="/admin/ruta" variant="contained" startIcon={<EventAvailableIcon />}>Ver hoja de ruta</Button>
        </>}
      />
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 2.5, mb: 3 }}>
        <Stat label="Visitas de hoy" value={d?.visitasHoy} icon={<TodayIcon />} href="/admin/ruta" tone="#0D47A1" />
        <Stat label="Por confirmar" value={d?.pendientes} icon={<PendingActionsIcon />} href="/admin/visitas" tone="#B45309" />
        <Stat label="Clientes activos" value={d?.clientes} icon={<PeopleIcon />} href="/admin/clientes" tone="#15803D" />
        <Stat label="Servicios en catálogo" value={d?.servicios} icon={<LocalOfferIcon />} href="/admin/servicios" tone="#0369A1" />
      </Box>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" mb={1}>Retiros de hoy</Typography>
          {hoy === null && <Skeleton variant="rounded" height={64} />}
          {hoy?.length === 0 && <EmptyState icon={<EventAvailableIcon />} title="Sin retiros para hoy" text="Cuando haya visitas pendientes o confirmadas para hoy aparecerán aquí." />}
          <Stack divider={<Box sx={{ borderTop: "1px solid", borderColor: "divider" }} />}>
            {hoy?.map((v) => (
              <Stack key={v.id} direction="row" alignItems="center" spacing={2} sx={{ py: 1.5 }}>
                <Typography fontWeight={700} sx={{ width: 120, color: "primary.main" }}>{v.franja.etiqueta}</Typography>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography fontWeight={600} noWrap>{v.cliente.nombre}</Typography>
                  <Typography color="text.secondary" variant="body2" noWrap>{v.direccion}</Typography>
                </Box>
                <Typography color="text.secondary" variant="body2">{v.encargado?.nombre ?? "Sin encargado"}</Typography>
                <StatusChip estado={v.estado} />
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
