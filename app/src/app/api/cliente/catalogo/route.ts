import { guard, handle, ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export const GET = () =>
  handle(async () => {
    await guard("CLIENTE");
    return ok(
      await prisma.categoriaServicio.findMany({
        orderBy: { orden: "asc" },
        include: { servicios: { where: { activo: true }, orderBy: { nombre: "asc" } } },
      }),
    );
  });
