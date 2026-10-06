import { Chip } from "@mui/material";

export default function ActivoChip({ activo }: { activo: boolean }) {
  return <Chip size="small" label={activo ? "Activo" : "Inactivo"} sx={activo ? { bgcolor: "#DCFCE7", color: "#166534" } : { bgcolor: "#E2E8F0", color: "#475569" }} />;
}
