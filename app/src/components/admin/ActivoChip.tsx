import { Chip } from "@mui/material";

export default function ActivoChip({ activo }: { activo: boolean }) {
  return <Chip size="small" label={activo ? "Activo" : "Inactivo"} color={activo ? "success" : "default"} variant={activo ? "filled" : "outlined"} />;
}
