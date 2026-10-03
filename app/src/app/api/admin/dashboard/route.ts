import { guard, handle, hoy, ok, toDate } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export const GET = () =>
  handle(async () => {
    await guard("ADMIN");
    const fecha = toDate(hoy());
    const [visitasHoy, pendientes, clientes, servicios] = await Promise.all([
      prisma.visita.count({ where: { fecha, estado: { in: ["PENDIENTE", "CONFIRMADA"] } } }),
      prisma.visita.count({ where: { estado: "PENDIENTE" } }),
      prisma.usuario.count({ where: { rol: "CLIENTE", activo: true } }),
      prisma.servicio.count({ where: { activo: true } }),
    ]);
    return ok({ visitasHoy, pendientes, clientes, servicios });
  });
