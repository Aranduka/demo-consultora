import { crud } from "@/lib/crud";
import { categoriaSchema } from "@/lib/schemas";

const h = crud("categoriaServicio", categoriaSchema, { orderBy: { orden: "asc" } });
export const GET = h.list;
export const POST = h.create;
