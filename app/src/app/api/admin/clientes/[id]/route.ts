import { NextRequest } from "next/server";
import { guard, handle, ok } from "@/lib/api";
import { aplanarCliente, clienteInclude } from "@/lib/clientes";
import { prisma } from "@/lib/prisma";
import { clienteSchema } from "@/lib/schemas";

type Ctx = { params: Promise<{ id: string }> };

export const PUT = (req: NextRequest, { params }: Ctx) =>
  handle(async () => {
    await guard("ADMIN");
    const id = Number((await params).id);
    const { email, activo, ...datos } = clienteSchema.parse(await req.json());
    const cliente = await prisma.cliente.update({
      where: { id },
      data: { ...datos, usuario: { update: { email, ...(activo === undefined ? {} : { activo }) } } },
      include: clienteInclude,
    });
    return ok(aplanarCliente(cliente));
  });

export const DELETE = (_req: NextRequest, { params }: Ctx) =>
  handle(async () => {
    await guard("ADMIN");
    const id = Number((await params).id);
    const c = await prisma.cliente.findUniqueOrThrow({ where: { id } });
    await prisma.cliente.delete({ where: { id } }); // falla (409) si tiene visitas
    await prisma.usuario.delete({ where: { id: c.usuarioId } });
    return ok({ id });
  });
