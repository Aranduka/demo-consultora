"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import CambiarClaveForm from "@/components/ui/CambiarClaveForm";
import LogoutButton from "@/components/ui/LogoutButton";
import { api } from "@/lib/http";

export default function Perfil() {
  const [p, setP] = useState<any>(null);
  useEffect(() => {
    api("/api/cliente/perfil").then(setP);
  }, []);
  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={500}>Mi perfil</Typography>
      {p && (
        <Card variant="outlined">
          <CardContent>
            <Typography fontWeight={500}>{p.nombre}</Typography>
            <Typography color="text.secondary">{p.documento} · {p.telefono}</Typography>
            <Typography color="text.secondary">{p.email}</Typography>
            <Typography variant="body2" mt={1}>{p.direccion}</Typography>
          </CardContent>
        </Card>
      )}
      <CambiarClaveForm />
      <LogoutButton to="/cliente/login" />
    </Stack>
  );
}
