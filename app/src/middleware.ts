import { NextRequest, NextResponse } from "next/server";
import { COOKIE, verifySession } from "@/lib/session";

// Autorización por rol en el borde. Cada route handler vuelve a verificar (defensa en profundidad).
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const s = await verifySession(req.cookies.get(COOKIE)?.value);
  const go = (to: string) => NextResponse.redirect(new URL(to, req.url));
  const deny = (status: number) => NextResponse.json({ error: { message: status === 401 ? "No autenticado" : "Sin permiso" } }, { status });

  if (pathname.startsWith("/api/admin")) return !s ? deny(401) : s.rol !== "ADMIN" ? deny(403) : NextResponse.next();
  if (pathname.startsWith("/api/cliente")) return !s ? deny(401) : s.rol !== "CLIENTE" ? deny(403) : NextResponse.next();

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return s?.rol === "ADMIN" ? go("/admin") : NextResponse.next();
    return s?.rol === "ADMIN" ? NextResponse.next() : go("/admin/login");
  }

  if (pathname.startsWith("/cliente")) {
    if (pathname === "/cliente/login") return s?.rol === "CLIENTE" ? go("/cliente") : NextResponse.next();
    if (s?.rol !== "CLIENTE") return go("/cliente/login");
    if (s.cc && pathname !== "/cliente/cambiar-clave") return go("/cliente/cambiar-clave");
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/cliente/:path*", "/api/admin/:path*", "/api/cliente/:path*"] };
