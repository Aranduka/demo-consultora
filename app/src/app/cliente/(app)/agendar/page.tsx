"use client";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Box, Button, Card, LinearProgress, Skeleton, Stack, TextField, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { api } from "@/lib/http";
import { diaCorto, diaLargo, diaNum, hoyAsu, mesCorto } from "@/lib/format";

// Próximos 21 días hábiles (sin domingos), a partir de mañana
function diasDisponibles() {
  const base = new Date(`${hoyAsu()}T12:00:00Z`);
  const out: string[] = [];
  for (let i = 1; out.length < 21; i++) {
    const d = new Date(base.getTime() + i * 86400000);
    if (d.getUTCDay() !== 0) out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

function Paso({ n, titulo, children }: { n: number; titulo: string; children: React.ReactNode }) {
  return (
    <Box>
      <Stack direction="row" spacing={1.25} alignItems="center" mb={1.25}>
        <Box sx={{ width: 28, height: 28, borderRadius: "50%", bgcolor: "primary.main", color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: ".85rem" }}>{n}</Box>
        <Typography variant="subtitle1">{titulo}</Typography>
      </Stack>
      {children}
    </Box>
  );
}

export default function Agendar() {
  const router = useRouter();
  const dias = useMemo(diasDisponibles, []);
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

  const franja = franjas?.find((f) => f.id === franjaId);

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
    <Stack spacing={3} component="form" onSubmit={onSubmit}>
      <Box>
        <Typography variant="h5" component="h1">Agendar retiro</Typography>
        <Typography color="text.secondary">Un encargado pasará a retirar sus documentos.</Typography>
      </Box>

      <Paso n={1} titulo="Elija el día">
        <Stack direction="row" gap={1} role="radiogroup" aria-label="Día" sx={{ overflowX: "auto", mx: -2, px: 2, pb: 1, scrollSnapType: "x proximity", "&::-webkit-scrollbar": { display: "none" } }}>
          {dias.map((d) => {
            const sel = d === fecha;
            return (
              <Box key={d} component="button" type="button" role="radio" aria-checked={sel} onClick={() => setFecha(d)}
                sx={{ flex: "0 0 auto", scrollSnapAlign: "start", width: 64, height: 84, borderRadius: "12px", cursor: "pointer", font: "inherit", border: "1.5px solid", borderColor: sel ? "primary.main" : "divider", bgcolor: sel ? "primary.main" : "#fff", color: sel ? "#fff" : "text.primary", transition: "all .15s", display: "grid", placeItems: "center", py: 1, "&:focus-visible": { outline: "3px solid #0D47A155", outlineOffset: 2 } }}>
                <Box lineHeight={1.15}>
                  <Typography variant="caption" fontWeight={700} textTransform="uppercase" sx={{ opacity: sel ? 0.9 : 0.65 }}>{diaCorto(d)}</Typography>
                  <Typography fontSize="1.5rem" fontWeight={800} lineHeight={1.1}>{diaNum(d)}</Typography>
                  <Typography variant="caption" textTransform="uppercase" sx={{ opacity: sel ? 0.9 : 0.65 }}>{mesCorto(d)}</Typography>
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Paso>

      {fecha && (
        <Paso n={2} titulo="Elija la franja horaria">
          <Stack spacing={1.25} role="radiogroup" aria-label="Franja horaria">
            {franjas === null && !error && [0, 1, 2].map((i) => <Skeleton key={i} variant="rounded" height={68} />)}
            {franjas?.map((f) => {
              const sel = franjaId === f.id;
              const sin = f.disponibles === 0;
              return (
                <Card key={f.id} component="button" type="button" role="radio" aria-checked={sel} disabled={sin} onClick={() => setFranjaId(f.id)}
                  sx={{ textAlign: "left", font: "inherit", cursor: sin ? "not-allowed" : "pointer", p: 2, display: "flex", alignItems: "center", gap: 1.5, borderWidth: 1.5, borderColor: sel ? "primary.main" : "divider", bgcolor: sin ? "#F1F5F9" : sel ? "#E8F0FE" : "#fff", opacity: sin ? 0.65 : 1, "&:focus-visible": { outline: "3px solid #0D47A155", outlineOffset: 2 } }}>
                  {sel ? <CheckCircleIcon color="primary" /> : <RadioButtonUncheckedIcon color="disabled" />}
                  <Box flex={1}>
                    <Typography fontWeight={700}>{f.etiqueta}</Typography>
                    <Typography variant="body2" color={sin ? "error" : "text.secondary"}>{sin ? "Sin cupo" : `${f.disponibles} lugar${f.disponibles > 1 ? "es" : ""} disponible${f.disponibles > 1 ? "s" : ""}`}</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={100 - (f.disponibles / f.cupo) * 100} sx={{ width: 48, height: 6, borderRadius: "12px" }} aria-hidden />
                </Card>
              );
            })}
          </Stack>
        </Paso>
      )}

      {franjaId && (
        <Paso n={3} titulo="Datos del retiro">
          <Stack spacing={2}>
            <TextField label="Dirección de retiro" value={direccion} required onChange={(e) => setDireccion(e.target.value)} autoComplete="street-address" />
            <TextField label="¿Qué documentos retiramos? (opcional)" value={observaciones} multiline minRows={2} onChange={(e) => setObservaciones(e.target.value)} placeholder="Ej. Facturas y extractos del mes" />
          </Stack>
        </Paso>
      )}

      {error && <Alert severity="error" role="alert">{error}</Alert>}

      <Box sx={{ position: "sticky", bottom: "calc(80px + env(safe-area-inset-bottom))", pt: 1, pb: 1, mx: -2, px: 2, bgcolor: "#F4F7FB", boxShadow: "0 -12px 16px -4px #F4F7FB" }}>
        {franja && (
          <Typography variant="body2" textAlign="center" mb={1} color="text.secondary">
            {diaLargo(fecha)} · {franja.etiqueta}
          </Typography>
        )}
        <Button type="submit" variant="contained" size="large" fullWidth disabled={saving || !franjaId || !direccion} sx={{ boxShadow: "0 8px 20px rgba(13,71,161,.3)" }}>
          {saving ? "Enviando…" : "Confirmar solicitud"}
        </Button>
      </Box>
    </Stack>
  );
}
