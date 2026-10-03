import { NextRequest } from "next/server";
import { guard, handle, HttpError, ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { visitaAdminSchema } from "@/lib/schemas";
import { visitaInclude } from "@/lib/visitas";

export const PATCH = (req: NextRequest, { params }: { params: Promise<{ id: string }> }) =>
  handle(async () => {
    await guard("ADMIN");
    const id = Number((await params).id);
    const d = visitaAdminSchema.parse(await req.json());
    const actual = await prisma.visita.findUniqueOrThrow({ where: { id } });
    if (actual.estado === "COMPLETADA" || actual.estado === "CANCELADA")
      throw new HttpError(409, "La visita ya está cerrada");
    const encargadoId = d.encargadoId === undefined ? actual.encargadoId : d.encargadoId;
    if (d.estado === "CONFIRMADA" && !encargadoId) throw new HttpError(422, "Asigne un encargado para confirmar");
    if (d.estado === "COMPLETADA" && actual.estado !== "CONFIRMADA") throw new HttpError(422, "Primero confirme la visita");
    const row = await prisma.visita.update({
      where: { id },
      data: { ...(d.estado ? { estado: d.estado } : {}), encargadoId },
      include: visitaInclude,
    });
    return ok(row);
  });
