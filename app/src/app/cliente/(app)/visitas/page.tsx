"use client";
import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Alert, Box, Button, Card, Skeleton, Stack, Tab, Tabs, Typography } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import FechaBloque from "@/components/cliente/FechaBloque";
import StatusChip from "@/components/ui/StatusChip";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { api } from "@/lib/http";
import { diaLargo, hoyAsu } from "@/lib/format";

function Lista() {
  const ok = useSearchParams().get("ok");
  const [rows, setRows] = useState<any[] | null>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState(0);
  const [cancelar, setCancelar] = useState<number | null>(null);
  const load = useCallback(() => {
    api<any[]>("/api/cliente/visitas").then(setRows);
  }, []);
  useEffect(load, [load]);

  async function doCancelar(id: number) {
    try {
      await api("/api/cliente/visitas/" + id, { method: "DELETE" });
      load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  const hoy = hoyAsu();
  const activa = (v: any) => ["PENDIENTE", "CONFIRMADA"].includes(v.estado) && v.fecha.slice(0, 10) >= hoy;
  const lista = rows?.filter((v) => (tab === 0 ? activa(v) : !activa(v)));

  return (
    <Stack spacing={2}>
      <Typography variant="h5" component="h1">Mis visitas</Typography>
      {ok && <Alert severity="success" icon={<EventAvailableIcon />}>¡Solicitud enviada! Le confirmaremos la visita a la brevedad.</Alert>}
      {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth" sx={{ bgcolor: "#E8EEF6", borderRadius: 3, p: 0.5, minHeight: 44, "& .MuiTabs-indicator": { display: "none" }, "& .MuiTab-root": { borderRadius: 2.5, minHeight: 40 }, "& .Mui-selected": { bgcolor: "#fff", boxShadow: "0 1px 4px rgba(15,23,42,.12)" } }}>
        <Tab label="Próximas" />
        <Tab label="Historial" />
      </Tabs>
      {rows === null && [0, 1].map((i) => <Skeleton key={i} variant="rounded" height={104} />)}
      {lista?.length === 0 && (
        <EmptyState icon={<EventAvailableIcon />} title={tab === 0 ? "No tiene visitas próximas" : "Sin historial todavía"} text={tab === 0 ? "Agende la recogida de sus documentos en unos pasos." : "Aquí verá sus visitas completadas y canceladas."}
          action={tab === 0 ? <Button component={Link} href="/cliente/agendar" variant="contained">Agendar ahora</Button> : undefined} />
      )}
      {lista?.map((v) => (
        <Card key={v.id} sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <FechaBloque iso={v.fecha} />
            <Box flex={1} minWidth={0}>
              <Typography fontWeight={700}>{diaLargo(v.fecha)}</Typography>
              <Box my={0.5}><StatusChip estado={v.estado} /></Box>
              <Typography color="text.secondary">{v.franja.etiqueta}</Typography>
              <Typography variant="body2" color="text.secondary" noWrap>{v.direccion}</Typography>
            </Box>
          </Stack>
          {["PENDIENTE", "CONFIRMADA"].includes(v.estado) && (
            <Button size="small" color="error" sx={{ mt: 1, ml: -1 }} onClick={() => setCancelar(v.id)}>Cancelar visita</Button>
          )}
        </Card>
      ))}
      <ConfirmDialog open={cancelar !== null} danger title="¿Cancelar esta visita?" text="Podrá agendar otra cuando quiera." confirmLabel="Sí, cancelar" onClose={() => setCancelar(null)} onConfirm={() => cancelar && doCancelar(cancelar)} />
    </Stack>
  );
}

export default function Visitas() {
  return (
    <Suspense>
      <Lista />
    </Suspense>
  );
}
