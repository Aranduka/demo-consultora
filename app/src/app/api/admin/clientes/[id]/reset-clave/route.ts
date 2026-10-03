import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { guard, handle, ok } from "@/lib/api";
import { claveTemporal } from "@/lib/clientes";
import { prisma } from "@/lib/prisma";

export const POST = (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) =>
  handle(async () => {
    await guard("ADMIN");
    const id = Number((await params).id);
    const c = await prisma.cliente.findUniqueOrThrow({ where: { id } });
    const clave = claveTemporal();
    await prisma.usuario.update({ where: { id: c.usuarioId }, data: { passwordHash: await bcrypt.hash(clave, 10), debeCambiarClave: true } });
    return ok({ claveTemporal: clave });
  });
