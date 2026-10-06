import { ReactNode } from "react";
import { Box, Stack, Typography } from "@mui/material";

export default function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <Stack direction="row" alignItems="flex-end" justifyContent="space-between" flexWrap="wrap" gap={2} mb={3}>
      <Box>
        <Typography variant="h4" component="h1">{title}</Typography>
        {subtitle && <Typography color="text.secondary" mt={0.5}>{subtitle}</Typography>}
      </Box>
      {actions && <Stack direction="row" gap={1} flexWrap="wrap" className="no-print">{actions}</Stack>}
    </Stack>
  );
}
