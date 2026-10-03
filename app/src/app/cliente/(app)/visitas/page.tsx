"use client";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Alert, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { api } from "@/lib/http";
import { diaLargo, ESTADOS } from "@/lib/format";

function Lista() {
  const ok = useSearchParams().get("ok");
  const [rows, setRows] = useState<any[] | null>(null);
  const [error, setError] = useState("");
  const load = useCallback(() => {
    api<any[]>("/api/cliente/visitas").then(setRows);
  }, []);
  useEffect(load, [load]);

  async function cancelar(id: number) {
    if (!confirm("¿Cancelar esta visita?")) return;
    try {
      await api("/api/cliente/visitas/" + id, { method: "DELETE" });
      load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={500}>Mis visitas</Typography>
      {ok && <Alert severity="success">¡Solicitud enviada! Le confirmaremos la visita a la brevedad.</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      {rows?.length === 0 && <Alert severity="info">Todavía no agendó ninguna visita.</Alert>}
      {rows?.map((v) => {
        const e = ESTADOS[v.estado as keyof typeof ESTADOS];
        return (
          <Card key={v.id} variant="outlined">
            <CardContent sx={{ "&:last-child": { pb: 2 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <div>
                  <Typography fontWeight={500} textTransform="capitalize">{diaLargo(v.fecha)}</Typography>
                  <Typography color="text.secondary">{v.franja.etiqueta}</Typography>
                  <Typography variant="body2">{v.direccion}</Typography>
                </div>
                <Chip size="small" label={e.label} color={e.color} />
              </Stack>
              {["PENDIENTE", "CONFIRMADA"].includes(v.estado) && (
                <Button size="small" color="error" sx={{ mt: 1 }} onClick={() => cancelar(v.id)}>Cancelar visita</Button>
              )}
            </CardContent>
          </Card>
        );
      })}
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
