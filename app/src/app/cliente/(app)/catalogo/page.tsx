"use client";
import { useEffect, useState } from "react";
import { Box, Card, CardContent, Chip, Skeleton, Stack, Typography } from "@mui/material";
import { api } from "@/lib/http";
import { formatMonto } from "@/lib/format";

export default function Catalogo() {
  const [cats, setCats] = useState<any[] | null>(null);
  const [sel, setSel] = useState<number | "todas">("todas");
  useEffect(() => {
    api<any[]>("/api/cliente/catalogo").then(setCats);
  }, []);
  const conServicios = cats?.filter((c) => c.servicios.length) ?? [];
  const visibles = conServicios.filter((c) => sel === "todas" || c.id === sel);

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h5" component="h1">Servicios y precios</Typography>
        <Typography color="text.secondary">Precios referenciales en guaraníes.</Typography>
      </Box>
      <Stack direction="row" gap={1} sx={{ overflowX: "auto", mx: -2, px: 2, pb: 0.5, "&::-webkit-scrollbar": { display: "none" } }}>
        <Chip label="Todos" clickable color={sel === "todas" ? "primary" : "default"} onClick={() => setSel("todas")} sx={{ height: 36 }} />
        {conServicios.map((c) => <Chip key={c.id} label={c.nombre} clickable color={sel === c.id ? "primary" : "default"} onClick={() => setSel(c.id)} sx={{ height: 36 }} />)}
      </Stack>
      {cats === null && [0, 1, 2].map((i) => <Skeleton key={i} variant="rounded" height={96} />)}
      {visibles.map((c) => (
        <Stack key={c.id} spacing={1.25}>
          <Typography variant="subtitle1" color="primary" fontWeight={700}>{c.nombre}</Typography>
          {c.servicios.map((s: any) => (
            <Card key={s.id}>
              <CardContent sx={{ "&:last-child": { pb: 2 } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
                  <Typography fontWeight={700}>{s.nombre}</Typography>
                  <Box textAlign="right" flexShrink={0}>
                    <Typography color="primary" fontWeight={800}>{formatMonto(s.precio, s.moneda)}</Typography>
                    {s.periodicidad && <Typography variant="caption" color="text.secondary">{s.periodicidad}</Typography>}
                  </Box>
                </Stack>
                {s.descripcion && <Typography variant="body2" color="text.secondary" mt={0.5}>{s.descripcion}</Typography>}
              </CardContent>
            </Card>
          ))}
        </Stack>
      ))}
    </Stack>
  );
}
