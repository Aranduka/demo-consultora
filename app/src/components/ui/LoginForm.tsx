"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Box, Button, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import BarChartIcon from "@mui/icons-material/BarChart";
import Brand from "@/components/ui/Brand";
import { api } from "@/lib/http";

const puntos = {
  cliente: [
    { icon: <EventAvailableIcon />, t: "Agende en segundos", d: "Elija día y franja; nosotros retiramos sus documentos." },
    { icon: <VerifiedUserIcon />, t: "Todo en orden", d: "Siga el estado de cada visita desde su celular." },
  ],
  admin: [
    { icon: <BarChartIcon />, t: "Control del día", d: "Hoja de ruta, visitas y clientes en un solo lugar." },
    { icon: <VerifiedUserIcon />, t: "Acceso seguro", d: "Panel exclusivo para el equipo de la consultora." },
  ],
};

export default function LoginForm({ portal }: { portal: "admin" | "cliente" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ver, setVer] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setLoading(true);
    setError("");
    try {
      const r = await api<{ debeCambiarClave: boolean }>("/api/auth/login", { body: { email: f.get("email"), password: f.get("password"), portal } });
      router.replace(portal === "admin" ? "/admin" : r.debeCambiarClave ? "/cliente/cambiar-clave" : "/cliente");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <Box sx={{ minHeight: "100dvh", display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" } }}>
      <Box sx={{ display: { xs: "none", md: "flex" }, flexDirection: "column", justifyContent: "space-between", p: 6, color: "#fff", background: "linear-gradient(155deg,#0B1B3A 0%,#0D47A1 70%,#1976D2 100%)" }}>
        <Brand light />
        <Box>
          <Typography variant="h3" fontWeight={800} letterSpacing="-0.03em" sx={{ maxWidth: 460 }}>
            {portal === "admin" ? "Gestione su consultora con claridad." : "Su contabilidad, sin complicaciones."}
          </Typography>
          <Stack spacing={2.5} mt={5}>
            {puntos[portal].map((p) => (
              <Stack key={p.t} direction="row" spacing={2} alignItems="center">
                <Box sx={{ width: 44, height: 44, borderRadius: "12px", bgcolor: "rgba(255,255,255,.14)", display: "grid", placeItems: "center" }}>{p.icon}</Box>
                <Box><Typography fontWeight={700}>{p.t}</Typography><Typography sx={{ opacity: 0.8 }}>{p.d}</Typography></Box>
              </Stack>
            ))}
          </Stack>
        </Box>
        <Typography variant="caption" sx={{ opacity: 0.6 }}>© Consultora Contable</Typography>
      </Box>

      <Box sx={{ display: "grid", placeItems: "center", p: 3, background: { xs: "linear-gradient(180deg,#0B1B3A 0,#0D47A1 220px,#F4F7FB 220px)", md: "#fff" } }}>
        <Box sx={{ width: "100%", maxWidth: 400 }}>
          <Box sx={{ display: { md: "none" }, mb: 4 }}><Brand light /></Box>
          <Box sx={{ bgcolor: "#fff", p: { xs: 3, md: 0 }, borderRadius: "16px", boxShadow: { xs: "0 12px 40px rgba(15,23,42,.18)", md: "none" } }}>
            <Stack spacing={2.5} component="form" onSubmit={onSubmit}>
              <Box>
                <Typography variant="h5" component="h1">{portal === "admin" ? "Panel de administración" : "Bienvenido"}</Typography>
                <Typography color="text.secondary">{portal === "admin" ? "Ingrese con su cuenta de administrador." : "Ingrese para agendar el retiro de sus documentos."}</Typography>
              </Box>
              {error && <Alert severity="error" role="alert">{error}</Alert>}
              <TextField name="email" label="Email" type="email" required autoComplete="username" autoFocus />
              <TextField
                name="password" label="Contraseña" type={ver ? "text" : "password"} required autoComplete="current-password"
                slotProps={{ input: { endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label={ver ? "Ocultar contraseña" : "Mostrar contraseña"} onClick={() => setVer(!ver)} edge="end">{ver ? <VisibilityOff /> : <Visibility />}</IconButton>
                  </InputAdornment>
                ) } }}
              />
              <Button type="submit" variant="contained" size="large" disabled={loading}>{loading ? "Ingresando…" : "Ingresar"}</Button>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
