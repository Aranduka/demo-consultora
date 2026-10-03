import { NextRequest } from "next/server";
import { guard, handle, HttpError, hoy, ok, toDate } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { visitaCrearSchema } from "@/lib/schemas";

const clienteDe = (uid: number) => prisma.cliente.findUniqueOrThrow({ where: { usuarioId: uid } });

export const GET = () =>
  handle(async () => {
    const s = await guard("CLIENTE");
    const c = await clienteDe(s.uid);
    return ok(
      await prisma.visita.findMany({
        where: { clienteId: c.id },
        include: { franja: true },
        orderBy: [{ fecha: "desc" }, { franja: { horaInicio: "asc" } }],
      }),
    );
  });

export const POST = (req: NextRequest) =>
  handle(async () => {
    const s = await guard("CLIENTE");
    const c = await clienteDe(s.uid);
    const d = visitaCrearSchema.parse(await req.json());
    if (d.fecha <= hoy()) throw new HttpError(422, "Elija una fecha futura", { fecha: "Debe ser futura" });
    const fecha = toDate(d.fecha);
    if (fecha.getUTCDay() === 0) throw new HttpError(422, "No se atiende los domingos", { fecha: "Domingo" });

    const visita = await prisma.$transaction(async (tx) => {
      const franja = await tx.franjaHoraria.findFirst({ where: { id: d.franjaId, activa: true } });
      if (!franja) throw new HttpError(422, "Franja no válida");
      const duplicada = await tx.visita.findFirst({
        where: { clienteId: c.id, fecha, franjaId: franja.id, estado: { not: "CANCELADA" } },
      });
      if (duplicada) throw new HttpError(409, "Ya tiene una visita agendada en esa fecha y franja");
      const usados = await tx.visita.count({ where: { fecha, franjaId: franja.id, estado: { not: "CANCELADA" } } });
      if (usados >= franja.cupo) throw new HttpError(409, "La franja ya no tiene cupo disponible");
      return tx.visita.create({
        data: { clienteId: c.id, fecha, franjaId: franja.id, direccion: d.direccion, observaciones: d.observaciones },
        include: { franja: true },
      });
    });
    return ok(visita, 201);
  });
