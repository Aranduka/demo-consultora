// Solo depende de jose: seguro para usar en middleware (Edge)
import { SignJWT, jwtVerify } from "jose";

export const COOKIE = "session";
export type Rol = "ADMIN" | "CLIENTE";
export type Session = { uid: number; rol: Rol; cc: boolean }; // cc = debe cambiar clave

const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret-change-me");

export async function signSession(s: Session) {
  return new SignJWT({ rol: s.rol, cc: s.cc })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(s.uid))
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret());
}

export async function verifySession(token?: string): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return { uid: Number(payload.sub), rol: payload.rol as Rol, cc: Boolean(payload.cc) };
  } catch {
    return null;
  }
}
