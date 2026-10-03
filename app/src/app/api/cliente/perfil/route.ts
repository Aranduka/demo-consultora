import { guard, handle, ok } from "@/lib/api";
import { aplanarCliente, clienteInclude } from "@/lib/clientes";
import { prisma } from "@/lib/prisma";

export const GET = () =>
  handle(async () => {
    const s = await guard("CLIENTE");
    const c = await prisma.cliente.findUniqueOrThrow({ where: { usuarioId: s.uid }, include: clienteInclude });
    return ok(aplanarCliente(c));
  });
