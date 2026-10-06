import { Box, Typography } from "@mui/material";
import { diaNum, mesCorto } from "@/lib/format";

export default function FechaBloque({ iso, inverso = false }: { iso: string; inverso?: boolean }) {
  return (
    <Box sx={{ width: 56, height: 64, borderRadius: "12px", display: "grid", placeItems: "center", flexShrink: 0, bgcolor: inverso ? "rgba(255,255,255,.16)" : "#E8F0FE", color: inverso ? "#fff" : "primary.main" }}>
      <Box textAlign="center" lineHeight={1}>
        <Typography fontWeight={800} fontSize="1.5rem" lineHeight={1}>{diaNum(iso)}</Typography>
        <Typography fontWeight={700} fontSize=".7rem" textTransform="uppercase" letterSpacing=".06em">{mesCorto(iso)}</Typography>
      </Box>
    </Box>
  );
}
