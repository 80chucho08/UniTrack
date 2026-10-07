# UniTrack

## Contexto para trabajar

- Aplicación académica con frontend en `frontend/` y API en `backend/`; sus detalles están en [`docs/architecture.md`](docs/architecture.md), [`docs/api.md`](docs/api.md) y [`docs/database.md`](docs/database.md).
- Mantén los cambios dentro del área solicitada. No asumas que el README de `frontend/` describe el producto: es la plantilla original de Vite.
- Frontend y backend tienen `package.json` independientes. Ejecuta comandos desde la carpeta correspondiente; no hay scripts de raíz ni configuración de pruebas encontrada.
- El frontend usa URLs locales codificadas (`localhost:3000`, origen Vite `localhost:5173`). El backend carga variables de `backend/.env`; no leas ni registres valores secretos.
- No supongas que el esquema SQL está completo: el repositorio no incluye migraciones ni DDL. Consulta `docs/database.md` para los límites conocidos.
- Al cambiar contratos, revisa tanto rutas/controladores del backend como llamadas en `frontend/src/services/` y páginas que usan `fetch` directamente.

## Comandos definidos

- Backend: `npm run dev`, `npm start` (desde `backend/`).
- Frontend: `npm run dev`, `npm run build`, `npm run lint`, `npm run preview` (desde `frontend/`).

