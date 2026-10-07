# Arquitectura

## Tecnologías y ejecución

- `frontend/`: React 19, TypeScript, Vite, React Router, Tailwind CSS; componentes de iconos con `lucide-react`. El arrastre del horario usa eventos HTML nativos.
- `backend/`: Node.js, Express 5 (CommonJS), `mysql2/promise`, `bcrypt`, `jsonwebtoken`, `dotenv` y `cors`.
- No hay orquestación de raíz. El backend escucha en `PORT` o `3000`, carga dotenv y prueba MySQL al iniciar. Vite no configura proxy; el cliente usa `http://localhost:3000` y CORS permite `http://localhost:5173`.
- Scripts y dependencias exactas: `frontend/package.json` y `backend/package.json`.

## Frontend

`src/main.tsx` monta `AuthProvider` y `App`. `App.tsx` define `/login`, `/register`, una redirección de `/` a `/dashboard` y rutas protegidas por `PrivateRoute`. `DashboardLayout` compone `Sidebar`, `AppHeader`, el `Outlet` de la página y `AppFooter`.

Páginas: `Dashboard` lista/crea semestres; `SemesterDashboard` lista materias y abre `CreateSubjectModal`; `Schedule` reúne semestres, materias y asignaciones mediante `ScheduleSelect`, `SchedulePanel` y `ScheduleGrid`; `Todo` es solo un placeholder. `SubjectCard` enlaza a `/subject/:id`, ruta que no está definida en `App.tsx`.

Los servicios en `src/services/` encapsulan solicitudes para semestres, materias y horario. Login y registro hacen `fetch` directamente en sus páginas. `AuthContext` mantiene usuario y JWT en estado y `localStorage`; el middleware de ruta protege la navegación de cliente.

## Backend y flujo

`src/server.js` carga variables de entorno, inicia Express (`src/app.js`) y prueba la base de datos. `app.js` instala CORS y JSON, monta rutas bajo `/api` y expone `/` como prueba. Las rutas llaman controladores; estos validan/transforman la solicitud y delegan SQL a modelos. `config/db.js` exporta el pool compartido.

La autenticación de API usa JWT Bearer: `auth.controller.js` registra/autentica usuarios y `auth.middleware.js` verifica el token, dejando `{ id, email }` en `req.user`. Consulta [`api.md`](api.md) para el contrato observado.

## Límites e inconsistencias visibles

- Registro devuelve solo `{ message }`, pero `Register.tsx` espera `{ token, user }` e intenta iniciar sesión con ellos.
- `getProfile` retorna el objeto completo de `users`; el modelo consulta `SELECT *`, que incluye `password_hash` según los campos que consume autenticación.
- `Schedule` carga asignaciones de todo el usuario; el endpoint de grid no filtra por semestre. El mapeo frontend descarta hora final y aula.
- `Todo` no implementa funcionalidad y `SubjectCard` apunta a una ruta ausente.
- El modelo `note.model.js` está vacío; no hay controladores/rutas de notas en el código observado.

