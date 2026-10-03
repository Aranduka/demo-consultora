import { z } from "zod";

const fecha = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida");
const texto = z.string().trim().min(1, "Requerido");
const opcional = z.string().trim().nullish().transform((v) => v || null);

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email inválido"),
  password: z.string().min(1, "Requerido"),
  portal: z.enum(["admin", "cliente"]),
});
export const cambiarClaveSchema = z.object({
  actual: z.string().optional(),
  nueva: z.string().min(8, "Mínimo 8 caracteres"),
});
export const clienteSchema = z.object({
  nombre: texto,
  documento: texto,
  email: z.string().trim().toLowerCase().email("Email inválido"),
  telefono: texto,
  direccion: texto,
  ciudad: opcional,
  notas: opcional,
  activo: z.boolean().optional(),
});
export const categoriaSchema = z.object({ nombre: texto, orden: z.coerce.number().int().default(0) });
export const servicioSchema = z.object({
  categoriaId: z.coerce.number().int().positive("Seleccione una categoría"),
  nombre: texto,
  descripcion: opcional,
  precio: z.coerce.number().min(0, "Precio inválido"),
  moneda: z.string().trim().default("PYG"),
  periodicidad: opcional,
  activo: z.boolean().default(true),
});
export const encargadoSchema = z.object({ nombre: texto, telefono: opcional, activo: z.boolean().default(true) });
export const franjaSchema = z.object({
  etiqueta: texto,
  horaInicio: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM"),
  horaFin: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM"),
  cupo: z.coerce.number().int().min(1, "Mínimo 1"),
  activa: z.boolean().default(true),
});
export const visitaCrearSchema = z.object({
  fecha,
  franjaId: z.coerce.number().int().positive(),
  direccion: texto,
  observaciones: opcional,
});
export const visitaAdminSchema = z.object({
  estado: z.enum(["PENDIENTE", "CONFIRMADA", "COMPLETADA", "CANCELADA"]).optional(),
  encargadoId: z.coerce.number().int().positive().nullable().optional(),
});
export const fechaSchema = fecha;
