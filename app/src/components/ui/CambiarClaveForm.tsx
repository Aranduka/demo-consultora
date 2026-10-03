"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { api } from "@/lib/http";

export default function CambiarClaveForm({ obligatorio = false, destino = "/cliente" }: { obligatorio?: boolean; destino?: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [ok, setOk] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setError("");
    setFields({});
    if (f.get("nueva") !== f.get("repetir")) return setFields({ repetir: "No coincide" });
    try {
      await api("/api/auth/cambiar-clave", { body: { actual: f.get("actual"), nueva: f.get("nueva") } });
      setOk(true);
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
    <Box sx={obligatorio ? { minHeight: "100dvh", display: "grid", placeItems: "center", p: 2 } : {}}>
      <Card sx={{ maxWidth: 420, mx: "auto" }}>
        <CardContent>
          <Stack spacing={2} component="form" onSubmit={onSubmit}>
            <Typography variant="h6">{obligatorio ? "Defina su nueva contraseña" : "Cambiar contraseña"}</Typography>
            {obligatorio && <Alert severity="info">Por seguridad debe reemplazar la contraseña temporal para continuar.</Alert>}
            {error && <Alert severity="error">{error}</Alert>}
            {ok && !obligatorio && <Alert severity="success">Contraseña actualizada</Alert>}
            <TextField name="actual" type="password" label="Contraseña actual" required error={!!fields.actual} />
            <TextField name="nueva" type="password" label="Nueva contraseña" required helperText="Mínimo 8 caracteres" error={!!fields.nueva} />
            <TextField name="repetir" type="password" label="Repetir contraseña" required error={!!fields.repetir} helperText={fields.repetir} />
            <Button type="submit" variant="contained">Guardar</Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
