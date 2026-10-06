import { ReactNode } from "react";
import { Box, Stack, Typography } from "@mui/material";

export default function EmptyState({ icon, title, text, action }: { icon: ReactNode; title: string; text?: string; action?: ReactNode }) {
  return (
    <Stack alignItems="center" textAlign="center" spacing={1} sx={{ py: 6, px: 2 }}>
      <Box sx={{ width: 64, height: 64, borderRadius: "50%", display: "grid", placeItems: "center", bgcolor: "primary.50", background: "#E8F0FE", color: "primary.main", "& svg": { fontSize: 32 } }}>{icon}</Box>
      <Typography variant="subtitle1">{title}</Typography>
      {text && <Typography color="text.secondary" maxWidth={360}>{text}</Typography>}
      {action}
    </Stack>
  );
}
