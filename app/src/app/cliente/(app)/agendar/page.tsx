"use client";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { api } from "@/lib/http";

const manana = () => {
  const d = new Date(Date.now() + 86400000);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Asuncion" }).format(d);
};

export default function Agendar() {
  const router = useRouter();
  const [fecha, setFecha] = useState("");
  const [franjas, setFranjas] = useState<any[] | null>(null);
  const [franjaId, setFranjaId] = useState<number | null>(null);
  const [direccion, setDireccion] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api("/api/cliente/perfil").then((p) => setDireccion(p.direccion));
  }, []);

  useEffect(() => {
    setFranjaId(null);
    setFranjas(null);
    setError("");
    if (!fecha) return;
    api<any[]>("/api/cliente/disponibilidad?fecha=" + fecha).then(setFranjas).catch((e) => setError(e.message));
  }, [fecha]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!franjaId) return setError("Seleccione una franja horaria");
    setSaving(true);
    setError("");
    try {
      await api("/api/cliente/visitas", { body: { fecha, franjaId, direccion, observaciones } });
      router.push("/cliente/visitas?ok=1");
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <Stack spacing={2} component="form" onSubmit={onSubmit}>
      <Typography variant="h5" fontWeight={500}>Agendar recogida</Typography>
      <Typography color="text.secondary">Elija el día y la franja en que un encargado pasará a retirar sus documentos.</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField type="date" label="Fecha" value={fecha} required onChange={(e) => setFecha(e.target.value)} slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: manana() } }} />
      {franjas && (
        <>
          <Typography variant="subtitle2">Franja horaria</Typography>
          <ToggleButtonGroup exclusive orientation="vertical" fullWidth value={franjaId} onChange={(_, v) => v && setFranjaId(v)} color="primary">
            {franjas.map((f) => (
              <ToggleButton key={f.id} value={f.id} disabled={f.disponibles === 0} sx={{ justifyContent: "space-between", py: 1.5 }}>
                <span>{f.etiqueta}</span>
                <Typography variant="caption">{f.disponibles === 0 ? "Sin cupo" : `${f.disponibles} disponible(s)`}</Typography>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </>
      )}
      <TextField label="Dirección de retiro" value={direccion} required onChange={(e) => setDireccion(e.target.value)} />
      <TextField label="¿Qué documentos se retirarán? (opcional)" value={observaciones} multiline minRows={2} onChange={(e) => setObservaciones(e.target.value)} />
      <Button type="submit" variant="contained" size="large" disabled={saving || !franjaId}>Confirmar solicitud</Button>
    </Stack>
  );
}
