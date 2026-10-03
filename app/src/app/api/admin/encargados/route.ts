import { crud } from "@/lib/crud";
import { encargadoSchema } from "@/lib/schemas";

const h = crud("encargado", encargadoSchema, { orderBy: { nombre: "asc" } });
export const GET = h.list;
export const POST = h.create;
