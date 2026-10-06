import { Chip } from "@mui/material";
import { ESTADOS, Estado } from "@/lib/format";

export default function StatusChip({ estado, size = "small" }: { estado: Estado; size?: "small" | "medium" }) {
  const e = ESTADOS[estado];
  return <Chip size={size} label={e.label} sx={{ bgcolor: e.bg, color: e.fg, borderRadius: 2 }} />;
}
