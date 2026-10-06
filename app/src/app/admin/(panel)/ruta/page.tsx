"use client";
import { useEffect, useState } from "react";
import { Alert, Avatar, Box, Button, Card, Chip, Skeleton, Stack, TextField, Typography } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import StatusChip from "@/components/ui/StatusChip";
import { api } from "@/lib/http";
import { diaLargo, hoyAsu } from "@/lib/format";

export default function Ruta() {
  const [fecha, setFecha] = useState(hoyAsu());
  const [visitas, setVisitas] = useState<any[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setVisitas(null);
    api<{ visitas: any[] }>("/api/admin/ruta?fecha=" + fecha).then((d) => setVisitas(d.visitas)).catch((e) => setError(e.message));
  }, [fecha]);

  const grupos = new Map<string, any[]>();
  visitas?.forEach((v) => {
    const k = v.encargado?.nombre ?? "Sin encargado asignado";
    grupos.set(k, [...(grupos.get(k) ?? []), v]);
  });

  return (
    <Box>
      <PageHeader
        title="Hoja de ruta"
        subtitle={<span>{diaLargo(fecha)} · {visitas?.length ?? 0} visita(s)</span>}
        actions={<>
          <TextField type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} sx={{ width: 180 }} slotProps={{ htmlInput: { "aria-label": "Fecha" } }} />
          <Button variant="contained" startIcon={<PrintIcon />} onClick={() => window.print()}>Imprimir</Button>
        </>}
      />
      {error && <Alert severity="error">{error}</Alert>}
      {visitas === null && <Skeleton variant="rounded" height={120} />}
      {visitas?.length === 0 && <Card><EmptyState icon={<EventAvailableIcon />} title="Sin recogidas para esta fecha" text="Elija otra fecha o espere nuevas solicitudes de los clientes." /></Card>}
      {[...grupos].map(([nombre, items]) => (
        <Box key={nombre} mb={4} sx={{ breakInside: "avoid" }}>
          <Stack direction="row" alignItems="center" spacing={1.5} mb={1.5}>
            <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36, fontSize: 15 }}>{nombre[0]}</Avatar>
            <Typography variant="h6">{nombre}</Typography>
            <Chip size="small" label={`${items.length} parada${items.length > 1 ? "s" : ""}`} />
          </Stack>
          <Stack gap={1.5}>
            {items.map((v, i) => (
              <Card key={v.id} sx={{ display: "grid", gridTemplateColumns: "56px 150px 1fr auto", alignItems: "center", gap: 2, p: 2 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: "#E8F0FE", color: "primary.main", display: "grid", placeItems: "center", fontWeight: 800 }}>{i + 1}</Box>
                <Typography fontWeight={700} color="primary">{v.franja.etiqueta}</Typography>
                <Box>
                  <Typography fontWeight={700}>{v.cliente.nombre}</Typography>
                  <Stack direction="row" gap={0.75} alignItems="center" color="text.secondary"><PlaceOutlinedIcon fontSize="small" />{v.direccion}</Stack>
                  <Stack direction="row" gap={0.75} alignItems="center" color="text.secondary"><PhoneOutlinedIcon fontSize="small" />{v.cliente.telefono}</Stack>
                  {v.observaciones && <Stack direction="row" gap={0.75} alignItems="center" mt={0.5}><DescriptionOutlinedIcon fontSize="small" color="action" /><Typography variant="body2">{v.observaciones}</Typography></Stack>}
                </Box>
                <StatusChip estado={v.estado} />
              </Card>
            ))}
          </Stack>
        </Box>
      ))}
    </Box>
  );
}
