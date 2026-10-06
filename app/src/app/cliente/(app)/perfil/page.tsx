"use client";
import { useEffect, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Card, Skeleton, Stack, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import CambiarClaveForm from "@/components/ui/CambiarClaveForm";
import LogoutButton from "@/components/ui/LogoutButton";
import { api } from "@/lib/http";

const Fila = ({ icon, v }: { icon: React.ReactNode; v: string }) => (
  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ color: "text.secondary" }}>{icon}<Typography color="text.primary">{v}</Typography></Stack>
);

export default function Perfil() {
  const [p, setP] = useState<any>(null);
  useEffect(() => {
    api("/api/cliente/perfil").then(setP);
  }, []);
  return (
    <Stack spacing={2}>
      <Typography variant="h5" component="h1">Mi perfil</Typography>
      <Card sx={{ p: 2.5 }}>
        {!p ? <Skeleton variant="rounded" height={140} /> : (
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ width: 56, height: 56, bgcolor: "primary.main", fontWeight: 800 }}>{p.nombre[0]}</Avatar>
              <Box><Typography variant="h6">{p.nombre}</Typography><Typography color="text.secondary">Cliente</Typography></Box>
            </Stack>
            <Stack spacing={1.25}>
              <Fila icon={<BadgeOutlinedIcon fontSize="small" />} v={p.documento} />
              <Fila icon={<PhoneOutlinedIcon fontSize="small" />} v={p.telefono} />
              <Fila icon={<EmailOutlinedIcon fontSize="small" />} v={p.email} />
              <Fila icon={<PlaceOutlinedIcon fontSize="small" />} v={p.direccion} />
            </Stack>
          </Stack>
        )}
      </Card>
      <Accordion disableGutters elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: "16px !important", "&:before": { display: "none" } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: 56 }}><Typography fontWeight={700}>Cambiar contraseña</Typography></AccordionSummary>
        <AccordionDetails><CambiarClaveForm /></AccordionDetails>
      </Accordion>
      <LogoutButton to="/cliente/login" />
    </Stack>
  );
}
