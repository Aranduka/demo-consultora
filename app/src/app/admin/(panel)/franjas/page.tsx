"use client";
import CrudPage from "@/components/admin/CrudPage";
import ActivoChip from "@/components/admin/ActivoChip";

export default function Franjas() {
  return (
    <CrudPage
      title="Franjas horarias"
      singular="franja"
      endpoint="/api/admin/franjas"
      defaults={{ activa: true, cupo: 5 }}
      columns={[
        { label: "Etiqueta", render: (r) => r.etiqueta },
        { label: "Inicio", render: (r) => r.horaInicio },
        { label: "Fin", render: (r) => r.horaFin },
        { label: "Cupo por día", render: (r) => r.cupo },
        { label: "Estado", render: (r) => <ActivoChip activo={r.activa} /> },
      ]}
      fields={[
        { name: "etiqueta", label: "Etiqueta", required: true, help: "Ej. 09:00 - 11:00" },
        { name: "horaInicio", label: "Hora inicio (HH:MM)", required: true, half: true },
        { name: "horaFin", label: "Hora fin (HH:MM)", required: true, half: true },
        { name: "cupo", label: "Cupo de visitas por día", type: "number", required: true },
        { name: "activa", label: "Activa", type: "switch" },
      ]}
    />
  );
}
