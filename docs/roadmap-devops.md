# Roadmap: despliegue profesional de UniTrack

Objetivo: llevar UniTrack a un entorno de despliegue profesional, seguro, automatizado y fácil de mantener, aprendiendo cada pieza en el camino. Cada fase se apoya en la anterior y deja algo funcionando.

Marca `[x]` al terminar cada punto y anota en **Bitácora** lo aprendido o decidido.

## Fase 0 — Endurecer el código

- [x] **Variables de entorno**: configuración centralizada y validada en `backend/src/config/env.js`; `.env.example` en backend y frontend; `VITE_API_URL` en el frontend.
- [x] **CORS** configurable por entorno (`CORS_ORIGIN`).
- [x] **Validación de datos** con `zod` (middleware `validate` en las rutas).
- [ ] **Contraseñas**: costo de `bcrypt`, ~~política mínima~~ (hecho: 8–72 caracteres), nunca devolver `password_hash` (quitar `SELECT *`), y login con mensaje genérico (hoy responde "Email no existe", lo que permite averiguar qué correos están registrados).
- [x] **Headers de seguridad** con `helmet`.
- [x] **Rate limiting** con `express-rate-limit` (estricto en `/api/auth/*`). Pendiente para Fase 1+: contadores en Redis si hay más de una instancia.
- [x] **Manejo de errores** centralizado (sin stack traces en producción).
- [x] **Logs estructurados** con `pino` y id por request.
- [x] **Healthcheck** `GET /api/health` que revise la BD (y `GET /api/health/live` sin BD).

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
- [ ] Auditoría de autorización: cada endpoint valida el dueño (`user_id`). Ya corregido: `POST /api/schedule/grid` aceptaba materias de otros usuarios.

## Fase 7 — Monitoreo, logs y errores

- [ ] Sentry en frontend y backend.
- [ ] Uptime Kuma vigilando `/api/health`.
- [ ] (Opcional) Grafana + Loki para logs y métricas.

## Bitácora

- **2026-11-26** — Se crea el roadmap. Arranca la Fase 0 con variables de entorno y CORS.
- **2026-11-26** — Hecho: `config/env.js` centraliza y valida la configuración (si falta un secret, el backend no arranca); CORS lee `CORS_ORIGIN`; el frontend usa `VITE_API_URL`; `.env.example` en ambos paquetes y `.env*` ignorados en git. Verificado: un origen no permitido no recibe `Access-Control-Allow-Origin`.
- **2026-11-26** — Hecho: validación con zod. Middleware `validate` + esquemas en `validators/`; los controladores ya no validan a mano. Contraseña de 8–72 caracteres (72 es el límite real de bcrypt). Registro muestra el error del servidor. De paso: el horario aceptaba materias ajenas (autorización) y `dotenv` dependía de la carpeta actual. Verificado con 28 peticiones contra el backend local.
- **2026-11-27** — Hecho: `helmet` y rate limiting (API 500/15 min; login 10 fallidos/15 min; registro 10/hora) con `TRUST_PROXY` configurable. Login y Registro muestran el mensaje del servidor (incluido el 429). Quitado un `console.log` que imprimía el token en la consola del navegador. Verificado: headers presentes, `X-Powered-By` ausente y el intento 11 de login responde 429 con CORS.
- **2026-11-27** — Hecho: manejo de errores centralizado. `error.middleware.js` (404 JSON, JSON malformado 400, 413, `ER_DUP_ENTRY` 409, 500 genérico) y se quitaron los 30 `try/catch` de los controladores, aprovechando que Express 5 reenvía los errores async. Antes, un JSON malformado recibía la página HTML por defecto de Express (con stack trace fuera de producción), y el horario devolvía `error.message` de MySQL al cliente. `server.js` termina el proceso ante errores fatales. Verificado con la BD caída en modo desarrollo y producción, y con la regresión de validación (28/28).
- **2026-11-27** — Hecho: logs estructurados con pino + pino-http. Una línea JSON por petición (id, userId, status, tiempo) y nivel según el resultado; los 500 incluyen el stack en el log y `requestId` en la respuesta. Header `X-Request-Id` (reutiliza el del proxy si es válido). Sin bodies ni tokens en los logs (verificado: la contraseña enviada no aparece). `LOG_LEVEL` configurable. En Fase 7 estos JSON son los que leerá Loki.
- **2026-11-27** — Hecho: healthchecks `live` (sin BD) y `ready` (`SELECT 1` con timeout de 2 s → 503), fuera del rate limit y sin ensuciar los logs. Verificado con la BD arriba, inexistente y sin responder (503 a los 2 s), 520 consultas seguidas sin 429 y regresión 28/28. De la Fase 0 solo queda el punto de **Contraseñas**.
