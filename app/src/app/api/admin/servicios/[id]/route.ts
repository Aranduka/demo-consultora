import { crud } from "@/lib/crud";
import { servicioSchema } from "@/lib/schemas";

const h = crud("servicio", servicioSchema, { orderBy: { nombre: "asc" }, include: { categoria: true } });
export const PUT = h.update;
export const DELETE = h.remove;
