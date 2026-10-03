"use client";
import { useEffect, useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import CrudPage from "@/components/admin/CrudPage";
import ActivoChip from "@/components/admin/ActivoChip";
import { api } from "@/lib/http";
import { formatMonto } from "@/lib/format";

function Servicios() {
  const [cats, setCats] = useState<{ id: number; nombre: string }[] | null>(null);
  useEffect(() => {
    api("/api/admin/categorias").then(setCats);
  }, []);
  if (!cats) return null;
  return (
    <CrudPage
      title="Servicios y precios"
      singular="servicio"
      endpoint="/api/admin/servicios"
      defaults={{ activo: true, moneda: "PYG" }}
      columns={[
        { label: "Categoría", render: (r) => r.categoria?.nombre },
        { label: "Servicio", render: (r) => r.nombre },
        { label: "Precio", render: (r) => formatMonto(r.precio, r.moneda) },
        { label: "Periodicidad", render: (r) => r.periodicidad ?? "—" },
        { label: "Estado", render: (r) => <ActivoChip activo={r.activo} /> },
      ]}
      fields={[
        { name: "categoriaId", label: "Categoría", type: "select", required: true, options: cats.map((c) => ({ value: c.id, label: c.nombre })) },
        { name: "nombre", label: "Nombre", required: true },
        { name: "descripcion", label: "Descripción", type: "multiline" },
        { name: "precio", label: "Precio", type: "number", required: true, half: true },
        { name: "moneda", label: "Moneda", half: true },
        { name: "periodicidad", label: "Periodicidad", help: "mensual, anual, por trámite…" },
        { name: "activo", label: "Visible en catálogo", type: "switch" },
      ]}
    />
  );
}

function Categorias() {
  return (
    <CrudPage
      title="Categorías"
      singular="categoría"
      endpoint="/api/admin/categorias"
      defaults={{ orden: 0 }}
      columns={[
        { label: "Nombre", render: (r) => r.nombre },
        { label: "Orden", render: (r) => r.orden },
      ]}
      fields={[
        { name: "nombre", label: "Nombre", required: true },
        { name: "orden", label: "Orden", type: "number" },
      ]}
    />
  );
}

export default function ServiciosPage() {
  const [tab, setTab] = useState(0);
  return (
    <Box>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Servicios" />
        <Tab label="Categorías" />
      </Tabs>
      {tab === 0 ? <Servicios /> : <Categorias />}
    </Box>
  );
}
