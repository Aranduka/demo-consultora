"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { api } from "@/lib/http";

export default function CambiarClaveForm({ obligatorio = false, destino = "/cliente" }: { obligatorio?: boolean; destino?: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [ok, setOk] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setError("");
    setFields({});
    setOk(false);
    if (f.get("nueva") !== f.get("repetir")) return setFields({ repetir: "Las contraseñas no coinciden" });
    try {
      await api("/api/auth/cambiar-clave", { body: { actual: f.get("actual"), nueva: f.get("nueva") } });
      setOk(true);
      form.reset();
      if (obligatorio) {
        router.replace(destino);
        router.refresh();
      }
    } catch (err) {
      setError((err as Error).message);
      setFields((err as { fields?: Record<string, string> }).fields ?? {});
    }
  }

  return (
    <Box sx={obligatorio ? { minHeight: "100dvh", display: "grid", placeItems: "center", p: 2, background: "linear-gradient(180deg,#0B1B3A 0,#0D47A1 220px,#F4F7FB 220px)" } : {}}>
      <Card sx={{ maxWidth: 440, mx: "auto", width: "100%" }}>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2.5} component="form" onSubmit={onSubmit}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ width: 44, height: 44, borderRadius: 3, bgcolor: "#E8F0FE", color: "primary.main", display: "grid", placeItems: "center" }}><LockIcon /></Box>
              <Typography variant="h6" component="h1">{obligatorio ? "Cree su nueva contraseña" : "Cambiar contraseña"}</Typography>
            </Stack>
            {obligatorio && <Alert severity="info">Por seguridad, reemplace la contraseña temporal para continuar.</Alert>}
            {error && <Alert severity="error" role="alert">{error}</Alert>}
            {ok && !obligatorio && <Alert severity="success">Contraseña actualizada correctamente.</Alert>}
            <TextField name="actual" type="password" label="Contraseña actual" required autoComplete="current-password" error={!!fields.actual} />
            <TextField name="nueva" type="password" label="Nueva contraseña" required autoComplete="new-password" helperText="Mínimo 8 caracteres" error={!!fields.nueva} />
            <TextField name="repetir" type="password" label="Repetir contraseña" required autoComplete="new-password" error={!!fields.repetir} helperText={fields.repetir} />
            <Button type="submit" variant="contained" size="large">Guardar contraseña</Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
