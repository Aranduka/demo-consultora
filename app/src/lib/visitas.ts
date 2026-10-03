import { Prisma } from "@prisma/client";

export const visitaInclude = { cliente: true, franja: true, encargado: true } satisfies Prisma.VisitaInclude;
