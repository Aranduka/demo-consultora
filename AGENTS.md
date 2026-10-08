# AGENTS.md — Consultora Contable (DEMO)

Guía para agentes de IA (Antigravity y otros). Es la contraparte de `CLAUDE.md`: las reglas de dominio y diseño son las mismas. **Si algo cambia en uno, actualizar el otro.**

Sistema para una consultora contable: el **admin** (escritorio) gestiona clientes, catálogo y visitas de retiro de documentos; los **clientes** usan una **PWA** para agendar esas visitas; una **landing** pública muestra servicios/precios y redirige al login de la PWA.
Es una DEMO: mantener todo **genérico, simple y en español**. No sobre-ingenierizar.

## Estructura (monorepo, todo en Docker)
| Carpeta | Qué es | Puerto host |
|---|---|---|
| `app/` | Next.js (App Router, TS): PWA clientes + panel admin + API | 13000 |
| `db/` | MySQL 8.4 en Docker | 13001 |
| `landing/` | Next.js exportado a estático, SIN backend, solo SEO. Se publica en GitHub Pages | 13002 |
Orquestación: `docker-compose.yml`. Nunca instalar ni ejecutar nada fuera de Docker salvo `git`.

## Stack
- Next.js 15 + React 19 + TypeScript estricto
- **Material Design**: MUI (`@mui/material`, `@mui/material-nextjs`, `@mui/icons-material`), tema en `app/src/lib/theme.ts` (replicado en `landing`)
- Prisma + MySQL (`app/prisma/schema.prisma` es la fuente de verdad del modelo)
- Auth propia: cookie httpOnly con JWT (`jose`), contraseñas con `bcryptjs`
- Validación: `zod`
- PWA manual: `app/public/cliente.webmanifest` + `app/public/sw.js` (sin librerías externas)

## Reglas de dominio (críticas)
1. **Roles**: `ADMIN` y `CLIENTE`. El encargado de retiro NO es usuario: es un registro (`Encargado`).
2. Los **clientes los da de alta el admin**: se crea `Usuario`(CLIENTE)+`Cliente` en una transacción con contraseña temporal; `debeCambiarClave=true` obliga a cambiarla en el primer ingreso. No hay auto-registro.
3. **El panel admin NO es PWA ni instalable**: rutas bajo `/admin`; el manifest y el service worker se enlazan/registran **solo** en `app/src/app/cliente/layout.tsx`; scope y `start_url` dentro de `/cliente`; `/admin/*` responde `Cache-Control: no-store`. En pantallas móviles `/admin` muestra "Usar desde un ordenador".
4. **La PWA solo sirve para agendar** (y ver/cancelar sus visitas, ver catálogo, cambiar clave). Un CLIENTE jamás accede a `/admin` ni a datos de otros clientes; un ADMIN no usa `/cliente`.
5. **Agenda**: el cliente elige fecha + `FranjaHoraria` (cupo por franja/día). Validar: fecha futura (no domingos), cupo disponible, sin duplicar visita activa en la misma fecha+franja. Estados: `PENDIENTE → CONFIRMADA → COMPLETADA` o `CANCELADA`.
6. **Hoja de ruta del día** (admin): visitas `PENDIENTE`/`CONFIRMADA` de una fecha, agrupadas por encargado y ordenadas por franja, con cliente, dirección y teléfono; imprimible.
7. Catálogo (`CategoriaServicio` → `Servicio`) lo administra el admin; clientes y landing solo lo leen. Moneda por defecto `PYG`, con separador de miles.
8. Autorización SIEMPRE en servidor (middleware + verificación de rol en cada route handler). Nunca confiar en el cliente.

## Diseño (Material Design, azul y blanco contable)
- Primary `#0D47A1`, secondary `#0369A1`, marino `#0B1B3A`, fondo `#F4F7FB`, texto `#0F172A`.
- Tipografía Plus Jakarta Sans, esquinas redondeadas **en px** (12–16; en MUI `borderRadius: 8` multiplica por 12, usar strings como `"16px"`), objetivos táctiles ≥44px, foco visible, `prefers-reduced-motion` respetado.
- PWA: mobile-first, bottom navigation. Admin: escritorio con Drawer lateral + tablas + diálogos. Landing: hero, catálogo por categorías con precios, FAQ, CTA "Ingresar" → `${NEXT_PUBLIC_APP_URL}/cliente/login`.
- Accesibilidad: contraste AA, labels en todos los campos, estados vacíos/carga/error.
- Guía de diseño disponible: skill `ui-ux-pro-max` en `.claude/skills/ui-ux-pro-max/SKILL.md` (ver `ORIGEN.md`). Sus scripts se ejecutan por Docker, no en el host.

## Convenciones
- Código y UI en español; identificadores de dominio en español (como el schema), técnicos en inglés.
- Server Components por defecto; `"use client"` solo si hace falta. Mutaciones vía route handlers `app/src/app/api/**` con validación zod.
- Respuestas API: `{ data }` o `{ error: { message, fields? } }` con códigos HTTP correctos.
- Prisma Client singleton en `app/src/lib/prisma.ts`. Nada de SQL crudo salvo necesidad.
- Sin dependencias nuevas sin justificar.
- Commits pequeños, **conventional commits**, sin líneas `Co-Authored-By` ni atribución de IA.
- Landing: datos del catálogo en `landing/src/data/servicios.json` (copia de `app/prisma/servicios.json`; sin llamadas a API). La fuente está autoalojada en `landing/src/app/fonts/` para que el build en CI no dependa de Google.

## Comandos (siempre vía Docker)
```bash
cp .env.example .env
docker compose up -d --build
docker compose exec app npx prisma migrate dev --name <nombre>
docker compose exec app npx prisma db seed
docker compose exec app npm run lint && docker compose exec app npm run build
```
Credenciales demo (solo desarrollo): ver la tabla "Credenciales demo" de `README.md`.

## Despliegue de la landing
GitHub Pages con `.github/workflows/landing.yml` (solo `landing/`, dispara con push a `main`). Variable de repositorio `APP_URL` = URL pública HTTPS del `app` (alimenta el botón "Ingresar").

## Trabajo con agentes
- Las skills del proyecto están indexadas en `.atl/skill-registry.md`; las instaladas para Antigravity viven en `.gemini/antigravity-cli/skills/`. Leer el `SKILL.md` correspondiente antes de actuar en esa tarea.
- La memoria persistente (Engram) usa el proyecto `demo-consultora`.
- Cambios de varios archivos: un solo escritor a la vez; no tocar el modo `/admin` para hacerlo instalable.

## Definición de terminado
Compila, lint sin errores, flujos probados manualmente: alta de cliente → login cliente → cambio de clave → agendar visita → admin ve la hoja de ruta del día; `/admin` inaccesible como PWA y para rol CLIENTE.
