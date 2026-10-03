# Consultora Contable (DEMO)

Panel admin de escritorio + PWA de clientes para agendar la recogida de documentos + landing pública. Todo en Docker.

| Carpeta    | Descripción                                                          | URL local               |
|------------|----------------------------------------------------------------------|-------------------------|
| `app/`     | Next.js: PWA clientes (`/cliente`), panel admin (`/admin`) y API      | http://localhost:13000  |
| `db/`      | MySQL 8.4 (datos en volumen Docker `db_data`)                         | localhost:13001         |
| `landing/` | Next.js sin backend, solo SEO: catálogo y botón a la PWA              | http://localhost:13002  |

## Puesta en marcha
```bash
cp .env.example .env
docker compose up -d --build   # migra y siembra datos automáticamente
```

## Credenciales demo (solo desarrollo)
| Rol     | Portal                                   | Usuario                 | Clave        |
|---------|------------------------------------------|-------------------------|--------------|
| Admin   | http://localhost:13000/admin/login       | admin@consultora.demo   | Admin123!    |
| Cliente | http://localhost:13000/cliente/login     | cliente@consultora.demo | Cliente123!  |

Los clientes nuevos los crea el admin (Clientes → Nuevo): se muestra una contraseña temporal que el cliente debe cambiar en su primer ingreso.

## Comandos útiles
```bash
docker compose exec app npx prisma migrate dev --name <nombre>   # nueva migración
docker compose exec app npx prisma db seed                       # re-sembrar
docker compose exec app npm run lint && docker compose exec app npm run build
```

## Notas
- Admin **no es PWA**: sin manifest ni service worker, `Cache-Control: no-store` y aviso "Usar desde un ordenador" en móvil. El manifest (`public/cliente.webmanifest`) y `public/sw.js` solo aplican al scope `/cliente/`.
- El catálogo de la landing es una copia estática (`landing/src/data/servicios.json`, igual a `app/prisma/servicios.json`). Si cambia el catálogo semilla, actualice ambos.
- En producción cambie `AUTH_SECRET`, las claves de MySQL y `NEXT_PUBLIC_*`, y sirva por HTTPS (requisito del service worker fuera de localhost).
