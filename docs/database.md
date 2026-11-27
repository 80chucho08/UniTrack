# Base de datos

## Conexión

`backend/src/config/db.js` crea un pool de `mysql2/promise` leyendo `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` y `DB_PORT`; usa `waitForConnections`, límite de 10 conexiones y cola sin límite. `server.js` ejecuta una consulta `SELECT 1 + 1 AS RESULT` al arrancar.

El `.env` local está excluido por `.gitignore`; no documentar aquí sus valores. El archivo observado contiene nombres para `PORT`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` y `JWT_SECRET`. El código también usa `DB_PORT`, pero no aparece en esos nombres observados. Los valores efectivos dependen del entorno.

## Migraciones

No hay DDL base ni semillas en el repositorio. Los cambios de esquema nuevos van en `backend/database/migrations/` como SQL numerado, a aplicar a mano en orden:

- `001_add_subject_header_image.sql`: agrega `subjects.header_image MEDIUMTEXT NULL` (portada del dashboard de la materia).

## Tablas

Las columnas se infieren del código y se contrastaron con una base local. `notes`, `todos` y `grades` tienen FK a `users` y `subjects` (`ON DELETE CASCADE`, salvo `todos.subject_id`, que es `ON DELETE SET NULL`; por eso al borrar una materia la API borra sus tareas explícitamente).

| Tabla | Columnas referenciadas | Uso en código |
|---|---|---|
| `users` | `id`, `name`, `email`, `password_hash`, `created_at`, `updated_at` | Crear usuario y buscar por correo o ID. |
| `semesters` | `id`, `user_id`, `name`, `period`, `created_at` | Crear y listar semestres del usuario. |
| `subjects` | `id`, `user_id`, `semester_id`, `name`, `teacher_name`, `teacher_email`, `credits`, `color`, `evaluation_criteria`, `header_image`, `created_at` | CRUD de materias e imagen de encabezado; asociarlas al horario. |
| `schedule` | `id`, `user_id`, `subject_id`, `day` (enum `Monday`–`Saturday`), `start_time`, `end_time`, `classroom` | Crear/listar/eliminar asignaciones de horario; listar clases por materia. |
| `notes` | `id`, `user_id`, `subject_id`, `title`, `content` (longtext), `created_at`, `updated_at` | Notas de una materia. |
| `todos` | `id`, `user_id`, `subject_id` (nullable), `title`, `description`, `due_date`, `status` (`pending`/`completed`), `created_at` | Tareas de una materia. |
| `grades` | `id`, `user_id`, `subject_id`, `name`, `value` decimal(5,2), `weight` decimal(5,2), `date`, `created_at` | Calificaciones ponderadas de una materia. |

No es posible confirmar relaciones físicas ni restricciones a partir del código. Las consultas relacionan `subjects.semester_id` con `semesters.id` y `schedule.subject_id` con `subjects.id`.

## Modelos

- `user.model.js`: inserta usuario con timestamps `NOW()`; las búsquedas por email/ID devuelven solo columnas públicas (`id`, `name`, `email`, `created_at`). `getCredentialsByEmail` es la única que lee `password_hash` (solo para el login) y `updatePasswordHash` re-hashea al costo actual de bcrypt (12).
- `semester.model.js`: lista ID/nombre por usuario; inserta nombre, periodo y timestamp.
- `subject.model.js`: lista materias por usuario y semestre; detalle con datos del semestre; crea, actualiza, cambia `header_image` y borra (transacción que primero borra sus `todos`). `subjectBelongsToUser` es la comprobación de propiedad que usan notas, tareas y calificaciones.
- `schedule.model.js`: lista materias de un semestre, inserta asignación, borra por ID y usuario, lista las asignaciones del usuario unidas a materia o las clases de una materia.
- `note.model.js`, `todo.model.js`, `grade.model.js`: CRUD filtrado por `user_id`. Las fechas salen como `YYYY-MM-DD` (`DATE_FORMAT`) y los decimales de `grades` como número (`CAST ... AS DOUBLE`) para evitar desfases de zona horaria y strings.

