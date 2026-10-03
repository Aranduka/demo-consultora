# Plan de implementación (DEMO)

## Fase 0 — Base (hecha parcialmente)
Repo, Docker (db/app/landing), esquema Prisma en `app/prisma/schema.prisma`.

## Fase 1 — Inicialización
1. `app/`: Next.js 15 TS, MUI + tema azul/blanco, Prisma, zod, jose, bcryptjs, dayjs.
2. `landing/`: Next.js 15 TS + MUI, export estático/SSG.
3. Dockerfile con `apk add openssl`; compose `app` ejecuta `prisma migrate deploy && prisma db seed && npm run dev`.
4. Migración inicial + seed (admin, cliente demo, 4 categorías/10 servicios, 3 franjas, 2 encargados).

## Fase 2 — Auth y seguridad
Login `/cliente/login` y `/admin/login`, JWT en cookie, `middleware.ts` por rol, cambio de clave obligatorio, logout.

## Fase 3 — Admin (escritorio)
- Dashboard (visitas de hoy, pendientes por confirmar)
- CRUD Clientes (alta crea usuario + clave temporal, reset de clave, activar/desactivar)
- CRUD Categorías/Servicios (precios)
- CRUD Encargados y Franjas (cupo)
- Visitas: listado/filtros, confirmar, asignar encargado, completar, cancelar
- **Hoja de ruta del día**: por fecha, agrupada por encargado, imprimible

## Fase 4 — PWA clientes (móvil)
Manifest + iconos + sw.js (solo `/cliente`), inicio, catálogo, agendar (fecha → franjas con cupo → dirección/observaciones), mis visitas (cancelar si PENDIENTE/CONFIRMADA), perfil/cambio de clave.

## Fase 5 — Landing
Hero, servicios y precios por categoría, cómo funciona, contacto, CTA a login PWA, metadatos SEO, sitemap/robots, JSON-LD.

## Fase 6 — Cierre
Pruebas manuales de la definición de terminado, README actualizado, commit.

## Supuestos (cambiar si no aplican)
Moneda PYG; franjas 09-11/11-13/14-16 con cupo 5; sin domingos; sin notificaciones push/email; sin facturación ni pagos.
