"use client";
import { useEffect, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Chip, Divider, Stack, TextField, Typography } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import PlaceIcon from "@mui/icons-material/Place";
import PhoneIcon from "@mui/icons-material/Phone";
import { api } from "@/lib/http";
import { diaLargo, ESTADOS } from "@/lib/format";

const hoy = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Asuncion" }).format(new Date());

export default function Ruta() {
  const [fecha, setFecha] = useState(hoy());
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
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h5" fontWeight={500}>Hoja de ruta</Typography>
          <Typography color="text.secondary" textTransform="capitalize">{diaLargo(fecha)} · {visitas?.length ?? 0} visita(s)</Typography>
        </Box>
        <Stack direction="row" gap={1} className="no-print">
          <TextField type="date" size="small" value={fecha} onChange={(e) => setFecha(e.target.value)} sx={{ width: 180 }} />
          <Button variant="contained" startIcon={<PrintIcon />} onClick={() => window.print()}>Imprimir</Button>
        </Stack>
      </Stack>
      {error && <Alert severity="error">{error}</Alert>}
      {visitas?.length === 0 && <Alert severity="info">No hay visitas para esta fecha.</Alert>}
      {[...grupos].map(([nombre, items]) => (
        <Box key={nombre} mb={3} sx={{ breakInside: "avoid" }}>
          <Typography variant="h6" color="primary" mb={1}>{nombre}</Typography>
          <Stack gap={1.5}>
            {items.map((v) => (
              <Card key={v.id} variant="outlined">
                <CardContent sx={{ display: "grid", gridTemplateColumns: "140px 1fr auto", gap: 2, alignItems: "center", "&:last-child": { pb: 2 } }}>
                  <Typography variant="subtitle1" fontWeight={600}>{v.franja.etiqueta}</Typography>
                  <Box>
                    <Typography fontWeight={500}>{v.cliente.nombre}</Typography>
                    <Stack direction="row" gap={0.5} alignItems="center" color="text.secondary"><PlaceIcon fontSize="small" />{v.direccion}</Stack>
                    <Stack direction="row" gap={0.5} alignItems="center" color="text.secondary"><PhoneIcon fontSize="small" />{v.cliente.telefono}</Stack>
                    {v.observaciones && <><Divider sx={{ my: 0.5 }} /><Typography variant="body2">Documentos: {v.observaciones}</Typography></>}
                  </Box>
                  <Chip size="small" label={ESTADOS[v.estado as keyof typeof ESTADOS].label} color={ESTADOS[v.estado as keyof typeof ESTADOS].color} />
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>
      ))}
    </Box>
  );
}
