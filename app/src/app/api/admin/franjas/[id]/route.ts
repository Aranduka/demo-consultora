import { crud } from "@/lib/crud";
import { franjaSchema } from "@/lib/schemas";

const h = crud("franjaHoraria", franjaSchema, { orderBy: { horaInicio: "asc" } });
export const PUT = h.update;
export const DELETE = h.remove;
