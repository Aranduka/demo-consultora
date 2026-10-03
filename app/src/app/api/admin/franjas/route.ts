import { crud } from "@/lib/crud";
import { franjaSchema } from "@/lib/schemas";

const h = crud("franjaHoraria", franjaSchema, { orderBy: { horaInicio: "asc" } });
export const GET = h.list;
export const POST = h.create;
