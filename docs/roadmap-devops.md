# Roadmap: despliegue profesional de UniTrack

Objetivo: llevar UniTrack a un entorno de despliegue profesional, seguro, automatizado y fácil de mantener, aprendiendo cada pieza en el camino. Cada fase se apoya en la anterior y deja algo funcionando.

Marca `[x]` al terminar cada punto y anota en **Bitácora** lo aprendido o decidido.

## Fase 0 — Endurecer el código

- [x] **Variables de entorno**: configuración centralizada y validada en `backend/src/config/env.js`; `.env.example` en backend y frontend; `VITE_API_URL` en el frontend.
- [x] **CORS** configurable por entorno (`CORS_ORIGIN`).
- [ ] **Validación de datos** con `zod` en los controladores.
- [ ] **Contraseñas**: costo de `bcrypt`, política mínima, nunca devolver `password_hash` (quitar `SELECT *`), y login con mensaje genérico (hoy responde "Email no existe", lo que permite averiguar qué correos están registrados).
- [ ] **Headers de seguridad** con `helmet`.
- [ ] **Rate limiting** con `express-rate-limit` (estricto en `/api/auth/*`).
- [ ] **Manejo de errores** centralizado (sin stack traces en producción).
- [ ] **Logs estructurados** con `pino` y id por request.
- [ ] **Healthcheck** `GET /api/health` que revise la BD.

## Fase 1 — Docker en local

- [ ] `Dockerfile` multi-stage del backend (alpine, usuario no-root, solo deps de producción).
- [ ] `Dockerfile` del frontend (build de Vite servido por nginx).
- [ ] `docker-compose.yml` con backend, frontend y MySQL con volumen persistente.
- [ ] Runner de migraciones (hoy se aplican a mano).
- [ ] Docker Security: `.dockerignore`, sin secrets en la imagen, versiones fijas, MySQL sin puerto público, `read_only` donde aplique.

## Fase 2 — CI con GitHub Actions

- [ ] Pipeline en cada push/PR: lint, build, pruebas, `docker build`.
- [ ] Pruebas del backend (Vitest + Supertest contra MySQL de servicio).
- [ ] Seguridad: `npm audit`, Trivy sobre imágenes, Dependabot.
- [ ] Protección de rama `main` (no se mergea si la CI falla).

## Fase 3 — Servidor real (VPS)

- [ ] VPS y dominio (o subdominio gratuito).
- [ ] SSH solo con llaves, sin login de root.
- [ ] Firewall `ufw` (22, 80, 443) + `fail2ban`.
- [ ] HTTPS con Caddy como reverse proxy (Let's Encrypt automático).

## Fase 4 — CD (despliegue automático)

- [ ] Imágenes publicadas en GHCR, etiquetadas por SHA del commit.
- [ ] Despliegue por SSH (`docker compose pull && up -d`) + migraciones.
- [ ] Secrets en GitHub Environments y `.env` del servidor con permisos `600`.
- [ ] Entornos staging y producción (producción con aprobación manual).
- [ ] Procedimiento de rollback documentado.

## Fase 5 — Base de datos y persistencia

- [ ] Backups automáticos (`mysqldump` + cron) a almacenamiento externo.
- [ ] Restauración probada.
- [ ] Usuario de MySQL con permisos mínimos para la app.

## Fase 6 — Autenticación y autorización

- [ ] Login con Google (ID token verificado en backend → JWT propio).
- [ ] JWT en cookie `httpOnly` + `Secure` + `SameSite`, con refresh tokens.
- [ ] Auditoría de autorización: cada endpoint valida el dueño (`user_id`).

## Fase 7 — Monitoreo, logs y errores

- [ ] Sentry en frontend y backend.
- [ ] Uptime Kuma vigilando `/api/health`.
- [ ] (Opcional) Grafana + Loki para logs y métricas.

## Bitácora

- **2026-11-26** — Se crea el roadmap. Arranca la Fase 0 con variables de entorno y CORS.
- **2026-11-26** — Hecho: `config/env.js` centraliza y valida la configuración (si falta un secret, el backend no arranca); CORS lee `CORS_ORIGIN`; el frontend usa `VITE_API_URL`; `.env.example` en ambos paquetes y `.env*` ignorados en git. Verificado: un origen no permitido no recibe `Access-Control-Allow-Origin`.
