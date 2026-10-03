"use client";
import { useState } from "react";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Typography } from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import CrudPage from "@/components/admin/CrudPage";
import ActivoChip from "@/components/admin/ActivoChip";
import { api } from "@/lib/http";

export default function Clientes() {
  const [clave, setClave] = useState<{ email: string; clave: string } | null>(null);

  return (
    <>
      <CrudPage
        title="Clientes"
        singular="cliente"
        endpoint="/api/admin/clientes"
        defaults={{ activo: true }}
        columns={[
          { label: "Nombre", render: (r) => r.nombre },
          { label: "Documento", render: (r) => r.documento },
          { label: "Email (usuario)", render: (r) => r.email },
          { label: "Teléfono", render: (r) => r.telefono },
          { label: "Estado", render: (r) => <ActivoChip activo={r.activo} /> },
        ]}
        fields={[
          { name: "nombre", label: "Nombre / Razón social", required: true },
          { name: "documento", label: "RUC / CI", required: true, half: true },
          { name: "telefono", label: "Teléfono", required: true, half: true },
          { name: "email", label: "Email (será su usuario)", type: "email", required: true },
          { name: "direccion", label: "Dirección de retiro", required: true },
          { name: "ciudad", label: "Ciudad" },
          { name: "notas", label: "Notas internas", type: "multiline" },
          { name: "activo", label: "Acceso habilitado", type: "switch" },
        ]}
        onSaved={(d, mode) => mode === "create" && setClave({ email: d.email, clave: d.claveTemporal })}
        actions={(r) => (
          <Tooltip title="Restablecer contraseña">
            <IconButton
              size="small"
              onClick={async () => {
                if (!confirm(`¿Generar una nueva contraseña temporal para ${r.nombre}?`)) return;
                const d = await api("/api/admin/clientes/" + r.id + "/reset-clave", { method: "POST" });
                setClave({ email: r.email, clave: d.claveTemporal });
              }}
            >
              <LockResetIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      />
      <Dialog open={!!clave} onClose={() => setClave(null)}>
        <DialogTitle>Contraseña temporal</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>Entregue estos datos al cliente. No se volverán a mostrar; deberá cambiarla en su primer ingreso.</Alert>
          <Typography>Usuario: <b>{clave?.email}</b></Typography>
          <Typography>Contraseña: <b style={{ fontFamily: "monospace", fontSize: 18 }}>{clave?.clave}</b></Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigator.clipboard?.writeText(`${clave?.email} / ${clave?.clave}`)}>Copiar</Button>
          <Button variant="contained" onClick={() => setClave(null)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
