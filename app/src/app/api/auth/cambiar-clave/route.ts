import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { handle, HttpError, ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { cambiarClaveSchema } from "@/lib/schemas";
import { COOKIE, signSession, verifySession } from "@/lib/session";

export const POST = (req: NextRequest) =>
  handle(async () => {
    const s = await verifySession((await cookies()).get(COOKIE)?.value);
    if (!s) throw new HttpError(401, "No autenticado");
    const { actual, nueva } = cambiarClaveSchema.parse(await req.json());
    const u = await prisma.usuario.findUniqueOrThrow({ where: { id: s.uid } });
    if (!actual || !(await bcrypt.compare(actual, u.passwordHash)))
      throw new HttpError(422, "La contraseña actual es incorrecta", { actual: "Incorrecta" });
    await prisma.usuario.update({
      where: { id: u.id },
      data: { passwordHash: await bcrypt.hash(nueva, 10), debeCambiarClave: false },
    });
    (await cookies()).set(COOKIE, await signSession({ uid: u.id, rol: u.rol, cc: false }), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return ok({ ok: true });
  });
