import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { guard, handle, ok } from "@/lib/api";
import { aplanarCliente, claveTemporal, clienteInclude } from "@/lib/clientes";
import { prisma } from "@/lib/prisma";
import { clienteSchema } from "@/lib/schemas";

export const GET = () =>
  handle(async () => {
    await guard("ADMIN");
    const rows = await prisma.cliente.findMany({ include: clienteInclude, orderBy: { nombre: "asc" } });
    return ok(rows.map(aplanarCliente));
  });

// Alta de cliente: crea Usuario (CLIENTE) + Cliente en una transacción con clave temporal
export const POST = (req: NextRequest) =>
  handle(async () => {
    await guard("ADMIN");
    const { email, activo, ...datos } = clienteSchema.parse(await req.json());
    const clave = claveTemporal();
    const cliente = await prisma.cliente.create({
      data: {
        ...datos,
        usuario: {
          create: { email, rol: "CLIENTE", passwordHash: await bcrypt.hash(clave, 10), debeCambiarClave: true, activo: activo ?? true },
        },
      },
      include: clienteInclude,
    });
    return ok({ ...aplanarCliente(cliente), claveTemporal: clave }, 201);
  });
