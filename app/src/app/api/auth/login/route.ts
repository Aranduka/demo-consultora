import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { handle, HttpError, ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/schemas";
import { COOKIE, signSession } from "@/lib/session";

export const POST = (req: NextRequest) =>
  handle(async () => {
    const { email, password, portal } = loginSchema.parse(await req.json());
    const u = await prisma.usuario.findUnique({ where: { email } });
    const valido = u && u.activo && (await bcrypt.compare(password, u.passwordHash));
    // mismo mensaje para credenciales inválidas o portal equivocado
    if (!u || !valido || u.rol !== (portal === "admin" ? "ADMIN" : "CLIENTE"))
      throw new HttpError(401, "Email o contraseña incorrectos");
    await prisma.usuario.update({ where: { id: u.id }, data: { ultimoAcceso: new Date() } });
    const token = await signSession({ uid: u.id, rol: u.rol, cc: u.debeCambiarClave });
    (await cookies()).set(COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return ok({ rol: u.rol, debeCambiarClave: u.debeCambiarClave });
  });
