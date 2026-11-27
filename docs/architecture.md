# Arquitectura

## Tecnologías y ejecución

- `frontend/`: React 19, TypeScript, Vite, React Router, Tailwind CSS; componentes de iconos con `lucide-react`. El arrastre del horario usa eventos HTML nativos.
- `backend/`: Node.js, Express 5 (CommonJS), `mysql2/promise`, `bcrypt`, `jsonwebtoken`, `dotenv` y `cors`.
- No hay orquestación de raíz. El backend lee toda su configuración en `src/config/env.js` (único lugar que usa `process.env`; aborta si faltan `DB_HOST`, `DB_USER`, `DB_NAME` o `JWT_SECRET`), escucha en `PORT` o `3000` y prueba MySQL al iniciar. Vite no configura proxy; el cliente usa `VITE_API_URL` (por defecto `http://localhost:3000/api`) y CORS permite los orígenes de `CORS_ORIGIN` (por defecto `http://localhost:5173`). Las variables están documentadas en `backend/.env.example` y `frontend/.env.example`.
- Scripts y dependencias exactas: `frontend/package.json` y `backend/package.json`.

## Frontend

`src/main.tsx` monta `AuthProvider` y `App`. `App.tsx` define `/login`, `/register`, una redirección de `/` a `/dashboard` y rutas protegidas por `PrivateRoute`. `DashboardLayout` compone `Sidebar`, `AppHeader`, el `Outlet` de la página y `AppFooter`.

Páginas: `Dashboard` lista/crea semestres; `SemesterDashboard` lista materias y abre `CreateSubjectModal`; `Schedule` reúne semestres, materias y asignaciones mediante `ScheduleSelect`, `SchedulePanel` y `ScheduleGrid`; `SubjectDashboard` (`/dashboard/subject/:subjectId`, enlazada desde `SubjectCard`) carga en paralelo materia, notas, tareas, calificaciones y clases, guarda ese estado y lo pasa a los componentes de `components/subject/` (encabezado con portada, resumen, notas, tareas, calificaciones, información y modal de edición), que hacen sus propias llamadas a la API y actualizan las listas mediante los setters recibidos. La portada se reduce y comprime en el navegador (`utils/image.ts`) y se guarda como data URL. `Todo` (`/dashboard/todo`) muestra las tareas de todas las materias (y las que no tienen materia): las agrupa por fecha de entrega, las filtra por estado, materia y texto, y permite crearlas eligiendo materia. La fila de cada tarea es `components/todo/TodoItem.tsx`, compartida con el dashboard de materia.

Los servicios en `src/services/` encapsulan solicitudes para semestres, materias y horario. Login y registro hacen `fetch` directamente en sus páginas. `AuthContext` mantiene usuario y JWT en estado y `localStorage`; el middleware de ruta protege la navegación de cliente.

## Backend y flujo

`src/server.js` carga y valida la configuración (`config/env.js`), inicia Express (`src/app.js`) y prueba la base de datos. `app.js` instala `helmet`, CORS, el rate limit general de `/api` y JSON (en ese orden), monta rutas bajo `/api` y expone `/` como prueba. Las rutas validan `params`/`body` con zod (`middlewares/validate.middleware.js` + `validators/`) y llaman controladores, que reciben datos ya limpios y delegan SQL a modelos. Los controladores no usan `try/catch`: Express 5 pasa los errores de funciones async a `middlewares/error.middleware.js` (montado al final de `app.js` junto con el 404). `server.js` termina el proceso ante `unhandledRejection`/`uncaughtException`.

**Logs:** `config/logger.js` (pino) es el único logger; `env.js` usa `console.error` porque se carga antes. `middlewares/requestLogger.middleware.js` (pino-http, primer middleware de `app.js`) registra una línea por petición con id, método, URL, IP, status, tiempo y `userId`; nivel `info`/`warn`/`error` según 2xx/4xx/5xx. No se registran bodies ni headers, y `redact` oculta `authorization`, cookies y contraseñas. En producción escribe JSON a stdout; en desarrollo, `pino-pretty` (devDependency) lo muestra legible. Nivel con `LOG_LEVEL`. Las peticiones a `/api/health` no se registran salvo que fallen.

**Healthchecks:** `routes/health.routes.js` se monta en `/api/health` antes del rate limit. `/live` (proceso vivo, para reiniciar el contenedor) y `/` (readiness con la BD, para monitoreo). `config/db.js` exporta el pool compartido.

La autenticación de API usa JWT Bearer: `auth.controller.js` registra/autentica usuarios y `auth.middleware.js` verifica el token, dejando `{ id, email }` en `req.user`. Consulta [`api.md`](api.md) para el contrato observado.

## Límites e inconsistencias visibles

- Registro devuelve solo `{ message }`, pero `Register.tsx` espera `{ token, user }` e intenta iniciar sesión con ellos.
- `getProfile` retorna el objeto completo de `users`; el modelo consulta `SELECT *`, que incluye `password_hash` según los campos que consume autenticación.
- `Schedule` carga asignaciones de todo el usuario; el endpoint de grid no filtra por semestre. El mapeo frontend descarta hora final y aula.
- En móvil el sidebar es un cajón que se abre desde el header (`DashboardLayout` guarda su estado); algunas páginas internas, como el horario, aún no están adaptadas a pantallas angostas.

