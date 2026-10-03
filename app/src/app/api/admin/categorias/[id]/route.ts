import { crud } from "@/lib/crud";
import { categoriaSchema } from "@/lib/schemas";

const h = crud("categoriaServicio", categoriaSchema, { orderBy: { orden: "asc" } });
export const PUT = h.update;
export const DELETE = h.remove;
