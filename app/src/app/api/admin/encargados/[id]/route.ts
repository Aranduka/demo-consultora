import { crud } from "@/lib/crud";
import { encargadoSchema } from "@/lib/schemas";

const h = crud("encargado", encargadoSchema, { orderBy: { nombre: "asc" } });
export const PUT = h.update;
export const DELETE = h.remove;
