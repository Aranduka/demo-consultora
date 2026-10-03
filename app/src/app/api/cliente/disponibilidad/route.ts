import { NextRequest } from "next/server";
import { guard, handle, HttpError, hoy, ok, toDate } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { fechaSchema } from "@/lib/schemas";

export const GET = (req: NextRequest) =>
  handle(async () => {
    await guard("CLIENTE");
    const f = fechaSchema.parse(req.nextUrl.searchParams.get("fecha"));
    if (f <= hoy()) throw new HttpError(422, "Elija una fecha futura");
    if (toDate(f).getUTCDay() === 0) throw new HttpError(422, "No se atiende los domingos");
    const [franjas, usados] = await Promise.all([
      prisma.franjaHoraria.findMany({ where: { activa: true }, orderBy: { horaInicio: "asc" } }),
      prisma.visita.groupBy({ by: ["franjaId"], where: { fecha: toDate(f), estado: { not: "CANCELADA" } }, _count: true }),
    ]);
    const mapa = new Map(usados.map((u) => [u.franjaId, u._count]));
    return ok(franjas.map((x) => ({ ...x, disponibles: Math.max(0, x.cupo - (mapa.get(x.id) ?? 0)) })));
  });
