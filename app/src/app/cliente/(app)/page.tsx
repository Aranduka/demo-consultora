"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { api } from "@/lib/http";
import { diaLargo, ESTADOS } from "@/lib/format";

export default function Inicio() {
  const [perfil, setPerfil] = useState<any>(null);
  const [visitas, setVisitas] = useState<any[] | null>(null);
  useEffect(() => {
    api("/api/cliente/perfil").then(setPerfil);
    api<any[]>("/api/cliente/visitas").then(setVisitas);
  }, []);
  const hoy = new Date().toISOString().slice(0, 10);
  const proxima = visitas?.filter((v) => ["PENDIENTE", "CONFIRMADA"].includes(v.estado) && v.fecha.slice(0, 10) >= hoy).sort((a, b) => a.fecha.localeCompare(b.fecha))[0];

  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={500}>Hola{perfil ? `, ${perfil.nombre}` : ""}</Typography>
      <Card sx={{ bgcolor: "primary.main", color: "#fff" }}>
        <CardContent>
          <Typography variant="overline">Próxima recogida</Typography>
          {proxima ? (
            <Box>
              <Typography variant="h6" textTransform="capitalize">{diaLargo(proxima.fecha)}</Typography>
              <Typography>{proxima.franja.etiqueta}</Typography>
              <Chip size="small" sx={{ mt: 1, bgcolor: "#fff" }} label={ESTADOS[proxima.estado as keyof typeof ESTADOS].label} />
            </Box>
          ) : (
            <Typography>{visitas ? "No tiene visitas agendadas." : "Cargando…"}</Typography>
          )}
        </CardContent>
      </Card>
      <Button component={Link} href="/cliente/agendar" variant="contained" size="large" startIcon={<EventAvailableIcon />} sx={{ py: 1.5 }}>
        Agendar recogida de documentos
      </Button>
      <Button component={Link} href="/cliente/catalogo" variant="outlined">Ver servicios y precios</Button>
    </Stack>
  );
}
