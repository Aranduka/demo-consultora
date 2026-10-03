# Prompt para el agente de Claude — Inicialización e implementación

Copia todo lo siguiente como primer mensaje en una sesión nueva de Claude Code abierta en la raíz del repo.

---

Actúa como desarrollador full stack senior experto en Next.js, PWA y Docker.

## Contexto
Lee primero `CLAUDE.md`, `docs/PLAN.md` y `app/prisma/schema.prisma`: son la especificación vigente. Si algo contradice tu criterio, pregunta antes de desviarte. Es una DEMO: prioriza que funcione de punta a punta y sea genérico.

## Objetivo
Implementar el proyecto siguiendo `docs/PLAN.md` fase por fase:
- `app/` (puerto 13000): panel **admin** de escritorio (NO PWA) + **PWA de clientes** para agendar visitas de recogida de documentos + API.
- `landing/` (puerto 13002): Next.js sin backend con catálogo de servicios y precios y CTA al login de la PWA.
- MySQL en Docker (puerto 13001). Todo se ejecuta con Docker; no instales dependencias en el host.

## Instrucciones de trabajo
1. Resume en 5 líneas lo que entendiste y propón el orden de trabajo. Espera mi OK solo si encuentras ambigüedades reales.
2. Ejecuta Fase 1 y verifica con `docker compose up -d --build` que los 3 servicios arrancan, que la migración y el seed corren y que `localhost:13000` y `localhost:13002` responden.
3. Continúa con las fases 2–6. Al terminar cada fase: ejecuta lint/build en Docker, prueba el flujo afectado y haz un commit convencional.
4. Para la UI usa Material Design (MUI) con el tema azul/blanco de `CLAUDE.md`. Verifica visualmente las vistas clave (móvil para PWA, escritorio para admin) con el navegador integrado.
5. Verifica explícitamente las reglas críticas: admin no instalable ni cacheado, aislamiento de datos entre clientes, autorización de rol en servidor, validación de cupo y duplicados en agenda.

## Restricciones
- No agregues funcionalidades fuera del plan (pagos, notificaciones, facturación, multiempresa).
- No añadas dependencias sin justificarlas. No subas `.env`.
- Mantén todo en español y el código simple y legible.

## Entregable final
Informe breve con: qué se implementó, cómo levantar y probar (comandos y credenciales demo), decisiones/supuestos tomados y pendientes conocidos.
