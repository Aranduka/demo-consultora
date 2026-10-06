"use client";
import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { Box, Button, Card, CardActionArea, Skeleton, Stack, Typography } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import FechaBloque from "@/components/cliente/FechaBloque";
import StatusChip from "@/components/ui/StatusChip";
import { api } from "@/lib/http";
import { diaLargo, hoyAsu } from "@/lib/format";

function Atajo({ href, icon, label, hint }: { href: string; icon: ReactNode; label: string; hint: string }) {
  return (
    <Card>
      <CardActionArea component={Link} href={href} sx={{ p: 2, minHeight: 108 }}>
        <Box sx={{ width: 40, height: 40, borderRadius: "10px", bgcolor: "#E8F0FE", color: "primary.main", display: "grid", placeItems: "center", mb: 1 }}>{icon}</Box>
        <Typography fontWeight={700}>{label}</Typography>
        <Typography variant="body2" color="text.secondary">{hint}</Typography>
      </CardActionArea>
    </Card>
  );
}

export default function Inicio() {
  const [perfil, setPerfil] = useState<any>(null);
  const [visitas, setVisitas] = useState<any[] | null>(null);
  useEffect(() => {
    api("/api/cliente/perfil").then(setPerfil);
    api<any[]>("/api/cliente/visitas").then(setVisitas);
  }, []);
  const hoy = hoyAsu();
  const proxima = visitas?.filter((v) => ["PENDIENTE", "CONFIRMADA"].includes(v.estado) && v.fecha.slice(0, 10) >= hoy).sort((a, b) => a.fecha.localeCompare(b.fecha))[0];

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography color="text.secondary">Hola 👋</Typography>
        {perfil ? <Typography variant="h5" component="h1">{perfil.nombre}</Typography> : <Skeleton width={200} height={36} />}
      </Box>

      <Box sx={{ p: 2.5, borderRadius: "20px", color: "#fff", background: "linear-gradient(145deg,#0D47A1,#1976D2)", boxShadow: "0 12px 28px rgba(13,71,161,.3)" }}>
        <Typography variant="overline" sx={{ opacity: 0.85, fontWeight: 700 }}>Próximo retiro</Typography>
        {visitas === null ? <Skeleton sx={{ bgcolor: "rgba(255,255,255,.25)" }} height={64} /> : proxima ? (
          <Stack direction="row" spacing={2} alignItems="center" mt={0.5}>
            <FechaBloque iso={proxima.fecha} inverso />
            <Box flex={1} minWidth={0}>
              <Typography fontWeight={700} noWrap>{diaLargo(proxima.fecha)}</Typography>
              <Typography sx={{ opacity: 0.9 }}>{proxima.franja.etiqueta}</Typography>
              <Box mt={0.75}><StatusChip estado={proxima.estado} /></Box>
            </Box>
          </Stack>
        ) : (
          <Box mt={0.5}>
            <Typography fontWeight={700} fontSize="1.1rem">Aún no tiene visitas agendadas</Typography>
            <Typography sx={{ opacity: 0.9 }}>Pedimos retirar sus documentos en el día y horario que prefiera.</Typography>
          </Box>
        )}
        <Button component={Link} href="/cliente/agendar" fullWidth size="large" startIcon={<EventAvailableIcon />} sx={{ mt: 2, bgcolor: "#fff", color: "primary.main", "&:hover": { bgcolor: "#E8F0FE" } }}>
          Agendar retiro
        </Button>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
        <Atajo href="/cliente/catalogo" icon={<LocalOfferOutlinedIcon />} label="Servicios" hint="Catálogo y precios" />
        <Atajo href="/cliente/visitas" icon={<ListAltOutlinedIcon />} label="Mis visitas" hint="Estado y historial" />
        <Atajo href="/cliente/perfil" icon={<PersonOutlineIcon />} label="Mi perfil" hint="Datos y contraseña" />
        <Card sx={{ bgcolor: "#F0F7FF" }}>
          <Box sx={{ p: 2 }}>
            <Typography fontWeight={700}>¿Cómo funciona?</Typography>
            <Typography variant="body2" color="text.secondary">1. Elige día y hora. 2. Confirmamos. 3. Retiramos.</Typography>
          </Box>
        </Card>
      </Box>
    </Stack>
  );
}
