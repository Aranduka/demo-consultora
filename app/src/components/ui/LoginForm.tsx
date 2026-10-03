"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
import { api } from "@/lib/http";

export default function LoginForm({ portal }: { portal: "admin" | "cliente" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setLoading(true);
    setError("");
    try {
      const r = await api<{ debeCambiarClave: boolean }>("/api/auth/login", {
        body: { email: f.get("email"), password: f.get("password"), portal },
      });
      router.replace(portal === "admin" ? "/admin" : r.debeCambiarClave ? "/cliente/cambiar-clave" : "/cliente");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <Box sx={{ minHeight: "100dvh", display: "grid", placeItems: "center", p: 2, bgcolor: "primary.main", backgroundImage: "linear-gradient(160deg,#0D47A1,#1976D2)" }}>
      <Card sx={{ width: "100%", maxWidth: 400 }}>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2} component="form" onSubmit={onSubmit}>
            <Stack alignItems="center" spacing={1}>
              <CalculateIcon color="primary" sx={{ fontSize: 48 }} />
              <Typography variant="h5" fontWeight={500}>Consultora Contable</Typography>
              <Typography color="text.secondary">{portal === "admin" ? "Panel de administración" : "Ingreso de clientes"}</Typography>
            </Stack>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField name="email" label="Email" type="email" required autoComplete="username" autoFocus />
            <TextField name="password" label="Contraseña" type="password" required autoComplete="current-password" />
            <Button type="submit" variant="contained" size="large" disabled={loading}>{loading ? "Ingresando…" : "Ingresar"}</Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
