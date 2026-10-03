import { NextRequest } from "next/server";
import { fechaSchema } from "@/lib/schemas";
import { guard, handle, hoy, ok, toDate } from "@/lib/api";
import { prisma } from "@/lib/prisma";

// Hoja de ruta: visitas a realizar en la fecha (pendientes y confirmadas)
export const GET = (req: NextRequest) =>
  handle(async () => {
    await guard("ADMIN");
    const fecha = fechaSchema.parse(req.nextUrl.searchParams.get("fecha") || hoy());
    const rows = await prisma.visita.findMany({
      where: { fecha: toDate(fecha), estado: { in: ["PENDIENTE", "CONFIRMADA"] } },
      include: { cliente: true, franja: true, encargado: true },
      orderBy: [{ franja: { horaInicio: "asc" } }],
    });
    return ok({ fecha, visitas: rows });
  });
