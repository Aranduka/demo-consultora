import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ZodError } from "zod";
import { COOKIE, Rol, Session, verifySession } from "./session";

export class HttpError extends Error {
  constructor(public status: number, message: string, public fields?: Record<string, string>) {
    super(message);
  }
}

export const ok = (data: unknown, status = 200) => NextResponse.json({ data }, { status });

/** Autorización en servidor: exige sesión válida con el rol indicado. */
export async function guard(rol: Rol): Promise<Session> {
  const s = await verifySession((await cookies()).get(COOKIE)?.value);
  if (!s) throw new HttpError(401, "No autenticado");
  if (s.rol !== rol) throw new HttpError(403, "Sin permiso");
  return s;
}

export async function handle(fn: () => Promise<Response>): Promise<Response> {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof HttpError)
      return NextResponse.json({ error: { message: e.message, fields: e.fields } }, { status: e.status });
    if (e instanceof ZodError) {
      const fields: Record<string, string> = {};
      e.issues.forEach((i) => (fields[i.path.join(".")] = i.message));
      return NextResponse.json({ error: { message: "Datos inválidos", fields } }, { status: 422 });
    }
    const code = (e as { code?: string }).code;
    if (code === "P2002") return NextResponse.json({ error: { message: "Ya existe un registro con esos datos" } }, { status: 409 });
    if (code === "P2003") return NextResponse.json({ error: { message: "No se puede eliminar: tiene registros relacionados" } }, { status: 409 });
    if (code === "P2025") return NextResponse.json({ error: { message: "Registro no encontrado" } }, { status: 404 });
    console.error(e);
    return NextResponse.json({ error: { message: "Error interno" } }, { status: 500 });
  }
}

export const toDate = (f: string) => new Date(`${f}T00:00:00.000Z`);
export const dateStr = (d: Date) => d.toISOString().slice(0, 10);
export const hoy = () => new Intl.DateTimeFormat("en-CA", { timeZone: process.env.TZ || "America/Asuncion" }).format(new Date());
