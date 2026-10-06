# CLAUDE.md — Consultora Contable (DEMO)

Sistema para una consultora contable: el **admin** (escritorio) gestiona clientes, catálogo y visitas de retiro de documentos; los **clientes** usan una **PWA** para agendar esas visitas; una **landing** pública muestra servicios/precios y redirige al login de la PWA.
Es una DEMO: mantener todo **genérico, simple y en español**. No sobre-ingenierizar.

## Estructura (monorepo, todo en Docker)
| Carpeta | Qué es | Puerto host |
|---|---|---|
| `app/` | Next.js (App Router, TS): PWA clientes + panel admin + API | 13000 |
| `db/` | MySQL 8.4 en Docker | 13001 |
| `landing/` | Next.js estático, SIN backend, solo SEO | 13002 |
Orquestación: `docker-compose.yml`. Nunca instalar ni ejecutar nada fuera de Docker salvo `git`.

## Stack
- Next.js 15 + React 19 + TypeScript estricto
- **Material Design**: MUI (`@mui/material`, `@mui/material-nextjs`, `@mui/icons-material`), tema personalizado
- Prisma + MySQL (`app/prisma/schema.prisma` es la fuente de verdad del modelo)
- Auth propia: cookie httpOnly con JWT (`jose`), contraseñas con `bcryptjs`
- Validación: `zod`. Fechas: `dayjs`
- PWA manual: `app/src/app/manifest.ts`/`public/sw.js` (sin librerías externas)

## Reglas de dominio (críticas)
1. **Roles**: `ADMIN` y `CLIENTE`. El encargado de retiro NO es usuario: es un registro (`Encargado`).
2. Los **clientes los da de alta el admin**: se crea `Usuario`(CLIENTE)+`Cliente` en una transacción con contraseña temporal; `debeCambiarClave=true` obliga a cambiarla en el primer ingreso. No hay auto-registro.
3. **El panel admin NO es PWA ni instalable**: rutas bajo `/admin`; el manifest y el service worker se enlazan/registran **solo** en el layout `(cliente)`; manifest con `scope` y `start_url` dentro de `/cliente`; `/admin/*` responde `Cache-Control: no-store` y no se cachea nunca. En pantallas móviles `/admin` muestra aviso "Usar desde un ordenador".
4. **La PWA solo sirve para agendar** (y ver/cancelar sus visitas, ver catálogo, cambiar clave). Un CLIENTE jamás accede a `/admin` ni a datos de otros clientes; un ADMIN no usa `/cliente`.
5. **Agenda**: el cliente elige fecha + `FranjaHoraria` (cupo por franja/día). Validar: fecha futura (no domingos), cupo disponible, un cliente no duplica visita activa en la misma fecha+franja. Estados: `PENDIENTE → CONFIRMADA → COMPLETADA` o `CANCELADA`.
6. **Hoja de ruta del día** (admin): listado de visitas `CONFIRMADA`/`PENDIENTE` de una fecha, agrupado por encargado y ordenado por franja, con cliente, dirección, teléfono; imprimible.
7. Catálogo (`CategoriaServicio` → `Servicio`) lo administra el admin; clientes y landing solo lo leen. Moneda por defecto `PYG`, mostrar con separador de miles.
8. Autorización SIEMPRE en servidor (middleware + verificación de rol en cada route handler/server action). Nunca confiar en el cliente.

## Diseño (Material Design, azul y blanco contable)
- Primary `#0D47A1` (dark `#002171`, light `#5472D3`), secondary `#1976D2`, fondo `#FFFFFF`/`#F5F8FC`, texto `#1A2433`, éxito `#2E7D32`, error `#C62828`.
- Tipografía Plus Jakarta Sans (vía `next/font`), esquinas redondeadas 12–16px, elevación sutil, objetivos táctiles ≥44px, foco visible y `prefers-reduced-motion` respetado. Guía de diseño: skill `ui-ux-pro-max` (`.claude/skills/ui-ux-pro-max/ORIGEN.md`). Un único tema compartido en `app/src/lib/theme.ts` y replicado en `landing`.
- PWA: mobile-first, bottom navigation, botones grandes. Admin: layout de escritorio con Drawer lateral + tablas (`DataGrid` o `Table`) + diálogos. Landing: hero, catálogo por categorías con precios, CTA "Ingresar" → `${NEXT_PUBLIC_APP_URL}/cliente/login`.
- Accesibilidad: contraste AA, labels en todos los campos, estados vacíos/carga/error.

## Convenciones
- Código y UI en español; identificadores de dominio en español (como el schema), técnicos en inglés.
- Server Components por defecto; `"use client"` solo si hace falta. Mutaciones vía route handlers `app/src/app/api/**` con validación zod.
- Respuestas API: `{ data }` o `{ error: { message, fields? } }` con códigos HTTP correctos.
- Prisma Client singleton en `app/src/lib/prisma.ts`. Nada de SQL crudo salvo necesidad.
- Sin dependencias nuevas sin justificar. Commits pequeños (conventional commits).
- Landing: datos del catálogo en `landing/src/data/servicios.ts` (copia de la semilla; sin llamadas a API).

## Comandos (siempre vía Docker)
```bash
cp .env.example .env
docker compose up -d --build
docker compose exec app npx prisma migrate dev --name <nombre>
docker compose exec app npx prisma db seed
docker compose exec app npm run lint && docker compose exec app npm run build
```
Credenciales demo (seed, solo desarrollo): `admin@consultora.demo` / `Admin123!`, `cliente@consultora.demo` / `Cliente123!`.

## Definición de terminado
Compila, lint sin errores, flujos probados manualmente: alta de cliente → login cliente → cambio de clave → agendar visita → admin ve hoja de ruta del día; `/admin` inaccesible como PWA y para rol CLIENTE.
