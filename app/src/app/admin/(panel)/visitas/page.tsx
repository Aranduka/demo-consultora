"use client";
import { useCallback, useEffect, useState } from "react";
import { Alert, Box, Button, Card, MenuItem, Select, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import StatusChip from "@/components/ui/StatusChip";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { api } from "@/lib/http";
import { ESTADOS, formatFecha } from "@/lib/format";

export default function Visitas() {
  const [rows, setRows] = useState<any[] | null>(null);
  const [encargados, setEncargados] = useState<any[]>([]);
  const [fecha, setFecha] = useState("");
  const [estado, setEstado] = useState("");
  const [error, setError] = useState("");
  const [cancelar, setCancelar] = useState<number | null>(null);

  const load = useCallback(() => {
    const q = new URLSearchParams();
    if (fecha) q.set("fecha", fecha);
    if (estado) q.set("estado", estado);
    api<any[]>("/api/admin/visitas?" + q).then(setRows).catch((e) => setError(e.message));
  }, [fecha, estado]);
  useEffect(load, [load]);
  useEffect(() => {
    api<any[]>("/api/admin/encargados").then((e) => setEncargados(e.filter((x) => x.activo)));
  }, []);

  async function patch(id: number, body: object) {
    setError("");
    try {
      await api("/api/admin/visitas/" + id, { method: "PATCH", body });
      load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <Box>
      <PageHeader title="Visitas de retiro" subtitle="Confirme, asigne encargado y marque como completadas." />
      <Card>
        <Stack direction="row" gap={2} p={2} flexWrap="wrap" sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
          <TextField type="date" label="Fecha" value={fecha} onChange={(e) => setFecha(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} sx={{ maxWidth: 200 }} />
          <TextField select label="Estado" value={estado} onChange={(e) => setEstado(e.target.value)} sx={{ maxWidth: 200 }}>
            <MenuItem value="">Todos</MenuItem>
            {Object.entries(ESTADOS).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
          </TextField>
          {(fecha || estado) && <Button color="inherit" onClick={() => { setFecha(""); setEstado(""); }}>Limpiar filtros</Button>}
        </Stack>
        {error && <Alert severity="error" sx={{ m: 2 }} onClose={() => setError("")}>{error}</Alert>}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>{["Fecha", "Franja", "Cliente", "Dirección", "Encargado", "Estado", "Acciones"].map((h) => <TableCell key={h}>{h}</TableCell>)}</TableRow>
            </TableHead>
            <TableBody>
              {rows === null && [0, 1, 2].map((i) => <TableRow key={i}><TableCell colSpan={7}><Skeleton height={28} /></TableCell></TableRow>)}
              {rows?.map((v) => {
                const cerrada = v.estado === "COMPLETADA" || v.estado === "CANCELADA";
                return (
                  <TableRow key={v.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{formatFecha(v.fecha)}</TableCell>
                    <TableCell>{v.franja.etiqueta}</TableCell>
                    <TableCell>{v.cliente.nombre}<Typography variant="body2" color="text.secondary">{v.cliente.telefono}</Typography></TableCell>
                    <TableCell sx={{ maxWidth: 240 }}>{v.direccion}</TableCell>
                    <TableCell>
                      <Select size="small" displayEmpty disabled={cerrada} value={v.encargadoId ?? ""} onChange={(e) => patch(v.id, { encargadoId: e.target.value === "" ? null : e.target.value })} sx={{ minWidth: 160, minHeight: 40 }} inputProps={{ "aria-label": "Encargado" }}>
                        <MenuItem value="">Sin asignar</MenuItem>
                        {encargados.map((e) => <MenuItem key={e.id} value={e.id}>{e.nombre}</MenuItem>)}
                      </Select>
                    </TableCell>
                    <TableCell><StatusChip estado={v.estado} /></TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {v.estado === "PENDIENTE" && <Button size="small" variant="contained" onClick={() => patch(v.id, { estado: "CONFIRMADA" })}>Confirmar</Button>}
                      {v.estado === "CONFIRMADA" && <Button size="small" variant="contained" color="success" onClick={() => patch(v.id, { estado: "COMPLETADA" })}>Completar</Button>}
                      {!cerrada && <Button size="small" color="error" sx={{ ml: 0.5 }} onClick={() => setCancelar(v.id)}>Cancelar</Button>}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {rows?.length === 0 && <EmptyState icon={<EventBusyIcon />} title="No hay visitas" text="No se encontraron visitas con los filtros actuales." />}
      </Card>
      <ConfirmDialog open={cancelar !== null} danger title="¿Cancelar esta visita?" text="El cliente verá la visita como cancelada." confirmLabel="Cancelar visita" onClose={() => setCancelar(null)} onConfirm={() => cancelar && patch(cancelar, { estado: "CANCELADA" })} />
    </Box>
  );
}
