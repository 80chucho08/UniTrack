# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Las reglas generales del proyecto están en `AGENTS.md` (se importa abajo); la documentación detallada vive en `docs/`. Este archivo solo añade lo que no está ahí.

@AGENTS.md

## Comandos

Cada paquete se ejecuta desde su carpeta (`backend/` o `frontend/`); el `package-lock.json` de la raíz está vacío y no hay scripts de raíz.

- Backend: `npm run dev` (nodemon) / `npm start`. Requiere MySQL accesible y `backend/.env` (`PORT`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, `JWT_SECRET`).
- Frontend: `npm run dev` (Vite en `:5173`), `npm run build` (`tsc -b && vite build`), `npm run lint`.
- No hay framework de pruebas en ninguno de los dos paquetes. Para verificar un cambio, usa `npm run build` y `npm run lint` en `frontend/` y prueba los endpoints contra el backend en marcha.

`npm run build` y `npm run lint` del frontend pasan limpios; mantenlos así. El lint usa las reglas del compilador de `eslint-plugin-react-hooks` 7 (p. ej. prohíbe `setState` síncrono dentro de `useEffect`) y `react-refresh/only-export-components`, por eso el contexto (`context/AuthContext.tsx`) y su proveedor (`context/AuthProvider.tsx`) están en archivos separados.

## Arquitectura en pocas líneas

- **Backend** (Express 5, CommonJS): `routes/` → `controllers/` → `models/`. Los controladores sacan el usuario de `req.user` (puesto por `middlewares/auth.middleware.js` a partir del JWT Bearer), reciben `req.body`/`req.params` ya validados y limpios por zod (`validate({ params, body })` en la ruta, esquemas en `validators/schemas.js`; endpoint nuevo → esquema nuevo) y llaman a modelos que ejecutan SQL crudo con el pool de `config/db.js`. Todas las consultas filtran por `user_id`: mantén ese aislamiento por usuario en cualquier endpoint nuevo.
- **Montaje de rutas en `app.js`**: `subject.routes.js` se monta en `/api` (no en `/api/subjects`), por eso sus rutas son `/api/semesters/:semesterId/subjects`. Al añadir rutas, revisa el prefijo con que se monta cada router.
- **Configuración**: solo `backend/src/config/env.js` lee `process.env`; el resto importa ese objeto. Variable nueva → añádela ahí y en `backend/.env.example`. Roadmap de despliegue y su avance en `docs/roadmap-devops.md`.
- **Seguridad HTTP**: `helmet` y rate limiting (`middlewares/rateLimit.middleware.js`; login y registro con límites propios en `auth.routes.js`). `TRUST_PROXY` debe valer 1 detrás de Caddy/Nginx o el límite agrupa a todos los usuarios en la IP del proxy.
- **CORS** toma los orígenes de `CORS_ORIGIN` con métodos `GET, POST, PUT, DELETE`; un método nuevo (p. ej. `PATCH`) requiere actualizarlo.
- **Frontend** (React 19 + TS + Vite + Tailwind 4): el token JWT vive en `AuthContext` (y `localStorage`); las páginas lo obtienen del contexto y lo pasan explícitamente a las funciones de `src/services/*.ts`, que construyen sus URLs con `API_BASE_URL` de `services/http.ts` (`VITE_API_URL`). Login y Registro llaman a `fetch` directamente.
- **Horario**: `pages/Schedule.tsx` orquesta `components/schedule/*`; el arrastre usa eventos HTML nativos aunque `@dnd-kit/core` está en dependencias sin usarse.
- **Dashboard de materia** (`pages/SubjectDashboard.tsx` + `components/subject/*`): la página carga todo y pasa listas y setters a cada sección, que llama a su servicio. Los servicios nuevos usan `apiRequest` de `services/http.ts`; úsalo para servicios futuros. La página global `pages/Todo.tsx` y el dashboard de materia comparten `components/todo/TodoItem.tsx`; `todos.subject_id` admite `NULL` (tareas sin materia).
- **Diseño (tema "Tinta")**: los tokens viven en `frontend/src/index.css` (`@theme` de Tailwind 4). Usa `bg-canvas`, `bg-surface`, `text-ink`/`text-ink-muted`/`text-ink-subtle`, `border-line` y la escala `brand-50…900`, no colores fijos como `indigo-*`/`gray-*`. El color de marca se cambia solo con `--brand-hue`/`--brand-chroma`; `bg-highlight` (resaltador) se reserva para un único acento. Fuente: Figtree (Google Fonts en `index.html`). Para relieve suave existen las utilidades `neu-raised`, `neu-raised-sm`, `neu-inset` y `neu-input` (solo sobre fondo `bg-canvas`; en modales usa sombra normal) y las clases de botón `btnPrimary`/`btnSoft`/`btnGhost`/`btnDanger` en `src/utils/ui.ts`. Todas las páginas del panel ya usan el tema (Inicio, materias del semestre, dashboard de materia, Horario —cuya tabla conserva su formato original— y To-Do List); Login y Registro todavía no. `components/DashboardHeader.tsx` quedó sin uso.
- **Esquema**: no hay DDL base. Los cambios van como SQL numerado en `backend/database/migrations/` y se documentan en `docs/database.md`. Las tablas `notes`, `todos` y `grades` ya existían en la base.
- **Usuarios y contraseñas**: nunca `SELECT *` sobre `users`; solo `getCredentialsByEmail` lee `password_hash`. bcrypt con costo 12 (`SALT_ROUNDS` en `auth.controller.js`); los hashes de menor costo se re-hashean al iniciar sesión. El login responde el mismo mensaje y en el mismo tiempo exista o no el correo.
- Las inconsistencias conocidas (p. ej. grid sin filtro por semestre) están listadas en `docs/architecture.md` y `docs/api.md`.

## Convenciones observadas

- Código, comentarios y mensajes de error al usuario están en español.
- Respuestas de error del backend: `res.status(N).json({ message })` para errores esperados (404, 409…). Para registrar algo usa `req.log` (dentro de una petición, lleva su id) o `logger` de `config/logger.js`, nunca `console.*`. Los inesperados no se atrapan en el controlador (sin `try/catch`): llegan al `errorHandler` de `middlewares/error.middleware.js`, que los registra y responde 500 sin filtrar detalles en producción.
- Si cambias un contrato de API, actualiza también `docs/api.md` (y `docs/database.md` si tocas SQL).
