"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import { api } from "@/lib/http";
import { formatMonto } from "@/lib/format";

export default function Catalogo() {
  const [cats, setCats] = useState<any[] | null>(null);
  useEffect(() => {
    api<any[]>("/api/cliente/catalogo").then(setCats);
  }, []);
  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={500}>Servicios y precios</Typography>
      {cats === null && <Typography color="text.secondary">Cargando…</Typography>}
      {cats?.filter((c) => c.servicios.length).map((c) => (
        <Stack key={c.id} spacing={1}>
          <Typography variant="subtitle1" color="primary" fontWeight={600}>{c.nombre}</Typography>
          {c.servicios.map((s: any) => (
            <Card key={s.id} variant="outlined">
              <CardContent sx={{ "&:last-child": { pb: 2 } }}>
                <Stack direction="row" justifyContent="space-between" gap={2}>
                  <Typography fontWeight={500}>{s.nombre}</Typography>
                  <Typography color="primary" fontWeight={600} whiteSpace="nowrap">{formatMonto(s.precio, s.moneda)}</Typography>
                </Stack>
                {s.descripcion && <Typography variant="body2" color="text.secondary">{s.descripcion}</Typography>}
                {s.periodicidad && <Typography variant="caption" color="text.secondary">{s.periodicidad}</Typography>}
              </CardContent>
            </Card>
          ))}
        </Stack>
      ))}
    </Stack>
  );
}
