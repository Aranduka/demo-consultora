import { Box, Stack, Typography } from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";

export default function Brand({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.25} sx={{ whiteSpace: "nowrap" }}>
      <Box sx={{ width: compact ? 32 : 40, height: compact ? 32 : 40, borderRadius: 2.5, display: "grid", placeItems: "center", color: "#fff", background: "linear-gradient(140deg,#1976D2,#0D47A1)", boxShadow: "0 4px 12px rgba(13,71,161,.35)" }}>
        <CalculateIcon fontSize={compact ? "small" : "medium"} />
      </Box>
      <Typography component="span" noWrap fontWeight={800} letterSpacing="-0.02em" fontSize={compact ? "1rem" : "1.15rem"} color={light ? "#fff" : "text.primary"}>
        Consultora<Box component="span" sx={{ color: light ? "#93C5FD" : "primary.main" }}> Contable</Box>
      </Typography>
    </Stack>
  );
}
