import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import catalogo from "./servicios.json";

const prisma = new PrismaClient();

async function main() {
  const hash = (p: string) => bcrypt.hash(p, 10);

  await prisma.usuario.upsert({
    where: { email: "admin@consultora.demo" },
    update: {},
    create: { email: "admin@consultora.demo", passwordHash: await hash("Admin123!"), rol: "ADMIN", debeCambiarClave: false },
  });

  const cliente = await prisma.cliente.upsert({
    where: { documento: "1234567-8" },
    update: {},
    create: {
      nombre: "Cliente Demo S.A.",
      documento: "1234567-8",
      telefono: "0981 000 000",
      direccion: "Av. España 1234, Asunción",
      ciudad: "Asunción",
      usuario: { create: { email: "cliente@consultora.demo", passwordHash: await hash("Cliente123!"), rol: "CLIENTE", debeCambiarClave: false } },
    },
  });

  if ((await prisma.categoriaServicio.count()) === 0) {
    for (const c of catalogo) {
      await prisma.categoriaServicio.create({
        data: {
          nombre: c.categoria,
          orden: c.orden,
          servicios: { create: c.servicios.map((s) => ({ nombre: s.nombre, descripcion: s.descripcion, precio: s.precio, periodicidad: s.periodicidad })) },
        },
      });
    }
  }

  if ((await prisma.franjaHoraria.count()) === 0) {
    await prisma.franjaHoraria.createMany({
      data: [
        { etiqueta: "09:00 - 11:00", horaInicio: "09:00", horaFin: "11:00", cupo: 5 },
        { etiqueta: "11:00 - 13:00", horaInicio: "11:00", horaFin: "13:00", cupo: 5 },
        { etiqueta: "14:00 - 16:00", horaInicio: "14:00", horaFin: "16:00", cupo: 5 },
      ],
    });
  }

  if ((await prisma.encargado.count()) === 0) {
    await prisma.encargado.createMany({ data: [{ nombre: "Carlos Benítez", telefono: "0981 111 111" }, { nombre: "Laura Gómez", telefono: "0982 222 222" }] });
  }

  // Visita de ejemplo para mañana (o el próximo día hábil) para que la hoja de ruta tenga datos
  if ((await prisma.visita.count()) === 0) {
    const d = new Date(Date.now() + 86400000);
    if (d.getUTCDay() === 0) d.setUTCDate(d.getUTCDate() + 1);
    const franja = await prisma.franjaHoraria.findFirstOrThrow({ orderBy: { horaInicio: "asc" } });
    const encargado = await prisma.encargado.findFirstOrThrow();
    await prisma.visita.create({
      data: {
        clienteId: cliente.id,
        franjaId: franja.id,
        encargadoId: encargado.id,
        fecha: new Date(d.toISOString().slice(0, 10) + "T00:00:00.000Z"),
        direccion: cliente.direccion,
        observaciones: "Facturas y extractos del mes",
        estado: "CONFIRMADA",
      },
    });
  }
}

main().finally(() => prisma.$disconnect());
