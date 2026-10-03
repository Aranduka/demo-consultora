"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { api } from "@/lib/http";

type Data = { visitasHoy: number; pendientes: number; clientes: number; servicios: number };

export default function Dashboard() {
  const [d, setD] = useState<Data | null>(null);
  useEffect(() => {
    api<Data>("/api/admin/dashboard").then(setD);
  }, []);
  const cards = [
    { label: "Visitas de hoy", value: d?.visitasHoy, href: "/admin/ruta" },
    { label: "Pendientes por confirmar", value: d?.pendientes, href: "/admin/visitas" },
    { label: "Clientes activos", value: d?.clientes, href: "/admin/clientes" },
    { label: "Servicios en catálogo", value: d?.servicios, href: "/admin/servicios" },
  ];
  return (
    <Box>
      <Typography variant="h5" fontWeight={500} mb={2}>Resumen</Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 2 }}>
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent>
              <Typography color="text.secondary">{c.label}</Typography>
              <Typography variant="h3" color="primary" fontWeight={500}>{c.value ?? "–"}</Typography>
              <Button component={Link} href={c.href} size="small">Ver</Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
