"use client";
import CrudPage from "@/components/admin/CrudPage";
import ActivoChip from "@/components/admin/ActivoChip";

export default function Encargados() {
  return (
    <CrudPage
      title="Encargados de retiro"
      subtitle="Personas que retiran los documentos."
      singular="encargado"
      endpoint="/api/admin/encargados"
      defaults={{ activo: true }}
      columns={[
        { label: "Nombre", render: (r) => r.nombre },
        { label: "Teléfono", render: (r) => r.telefono ?? "—" },
        { label: "Estado", render: (r) => <ActivoChip activo={r.activo} /> },
      ]}
      fields={[
        { name: "nombre", label: "Nombre", required: true },
        { name: "telefono", label: "Teléfono" },
        { name: "activo", label: "Activo", type: "switch" },
      ]}
    />
  );
}
