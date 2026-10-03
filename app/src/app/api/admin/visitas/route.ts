import { NextRequest } from "next/server";
import { EstadoVisita, Prisma } from "@prisma/client";
import { guard, handle, ok, toDate } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { visitaInclude } from "@/lib/visitas";

export const GET = (req: NextRequest) =>
  handle(async () => {
    await guard("ADMIN");
    const p = req.nextUrl.searchParams;
    const where: Prisma.VisitaWhereInput = {};
    if (p.get("fecha")) where.fecha = toDate(p.get("fecha")!);
    if (p.get("estado")) where.estado = p.get("estado") as EstadoVisita;
    const rows = await prisma.visita.findMany({
      where,
      include: visitaInclude,
      orderBy: [{ fecha: "desc" }, { franja: { horaInicio: "asc" } }],
      take: 200,
    });
    return ok(rows);
  });
