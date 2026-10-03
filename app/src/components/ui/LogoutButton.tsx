"use client";
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { api } from "@/lib/http";

export default function LogoutButton({ to, variant = "outlined" }: { to: string; variant?: "text" | "outlined" }) {
  return (
    <Button
      variant={variant}
      color="inherit"
      startIcon={<LogoutIcon />}
      onClick={async () => {
        await api("/api/auth/logout", { method: "POST" });
        window.location.href = to;
      }}
    >
      Salir
    </Button>
  );
}
