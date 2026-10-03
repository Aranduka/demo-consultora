import { NextRequest } from "next/server";
import { guard, handle, HttpError, ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";

// El cliente cancela su propia visita (solo si está pendiente o confirmada)
export const DELETE = (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) =>
  handle(async () => {
    const s = await guard("CLIENTE");
    const id = Number((await params).id);
    const c = await prisma.cliente.findUniqueOrThrow({ where: { usuarioId: s.uid } });
    const v = await prisma.visita.findFirst({ where: { id, clienteId: c.id } }); // aislamiento entre clientes
    if (!v) throw new HttpError(404, "Visita no encontrada");
    if (v.estado === "COMPLETADA" || v.estado === "CANCELADA") throw new HttpError(409, "No se puede cancelar");
    return ok(await prisma.visita.update({ where: { id }, data: { estado: "CANCELADA" }, include: { franja: true } }));
  });
