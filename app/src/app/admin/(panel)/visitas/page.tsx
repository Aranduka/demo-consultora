"use client";
import { useCallback, useEffect, useState } from "react";
import { Alert, Box, Button, Chip, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { api } from "@/lib/http";
import { ESTADOS, formatFecha } from "@/lib/format";

export default function Visitas() {
  const [rows, setRows] = useState<any[] | null>(null);
  const [encargados, setEncargados] = useState<any[]>([]);
  const [fecha, setFecha] = useState("");
  const [estado, setEstado] = useState("");
  const [error, setError] = useState("");

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
      <Typography variant="h5" fontWeight={500} mb={2}>Visitas de recogida</Typography>
      <Stack direction="row" gap={2} mb={2}>
        <TextField type="date" label="Fecha" value={fecha} onChange={(e) => setFecha(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} sx={{ maxWidth: 200 }} />
        <TextField select label="Estado" value={estado} onChange={(e) => setEstado(e.target.value)} sx={{ maxWidth: 200 }}>
          <MenuItem value="">Todos</MenuItem>
          {Object.entries(ESTADOS).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
        </TextField>
        {(fecha || estado) && <Button onClick={() => { setFecha(""); setEstado(""); }}>Limpiar</Button>}
      </Stack>
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ "& th": { fontWeight: 600, bgcolor: "#E8EEF8" } }}>
              {["Fecha", "Franja", "Cliente", "Dirección", "Encargado", "Estado", "Acciones"].map((h) => <TableCell key={h}>{h}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.length === 0 && <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4, color: "text.secondary" }}>No hay visitas con esos filtros</TableCell></TableRow>}
            {rows?.map((v) => {
              const cerrada = v.estado === "COMPLETADA" || v.estado === "CANCELADA";
              return (
                <TableRow key={v.id} hover>
                  <TableCell>{formatFecha(v.fecha)}</TableCell>
                  <TableCell>{v.franja.etiqueta}</TableCell>
                  <TableCell>{v.cliente.nombre}<br /><Typography variant="caption" color="text.secondary">{v.cliente.telefono}</Typography></TableCell>
                  <TableCell>{v.direccion}</TableCell>
                  <TableCell>
                    <Select size="small" displayEmpty disabled={cerrada} value={v.encargadoId ?? ""} onChange={(e) => patch(v.id, { encargadoId: e.target.value === "" ? null : e.target.value })} sx={{ minWidth: 150 }}>
                      <MenuItem value="">Sin asignar</MenuItem>
                      {encargados.map((e) => <MenuItem key={e.id} value={e.id}>{e.nombre}</MenuItem>)}
                    </Select>
                  </TableCell>
                  <TableCell><Chip size="small" label={ESTADOS[v.estado as keyof typeof ESTADOS].label} color={ESTADOS[v.estado as keyof typeof ESTADOS].color} /></TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {v.estado === "PENDIENTE" && <Button size="small" onClick={() => patch(v.id, { estado: "CONFIRMADA" })}>Confirmar</Button>}
                    {v.estado === "CONFIRMADA" && <Button size="small" color="success" onClick={() => patch(v.id, { estado: "COMPLETADA" })}>Completar</Button>}
                    {!cerrada && <Button size="small" color="error" onClick={() => confirm("¿Cancelar esta visita?") && patch(v.id, { estado: "CANCELADA" })}>Cancelar</Button>}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
