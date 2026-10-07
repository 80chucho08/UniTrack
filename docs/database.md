# Base de datos

## Conexión

`backend/src/config/db.js` crea un pool de `mysql2/promise` leyendo `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` y `DB_PORT`; usa `waitForConnections`, límite de 10 conexiones y cola sin límite. `server.js` ejecuta una consulta `SELECT 1 + 1 AS RESULT` al arrancar.

El `.env` local está excluido por `.gitignore`; no documentar aquí sus valores. El archivo observado contiene nombres para `PORT`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` y `JWT_SECRET`. El código también usa `DB_PORT`, pero no aparece en esos nombres observados. Los valores efectivos dependen del entorno.

## Tablas inferidas del SQL

No hay esquema DDL, migraciones ni semillas en el repositorio. Los siguientes nombres y columnas se infieren de consultas e inserciones; tipos, nulabilidad, defaults, índices y constraints son desconocidos.

| Tabla | Columnas referenciadas | Uso en código |
|---|---|---|
| `users` | `id`, `name`, `email`, `password_hash`, `created_at`, `updated_at` | Crear usuario y buscar por correo o ID. |
| `semesters` | `id`, `user_id`, `name`, `period`, `created_at` | Crear y listar semestres del usuario. |
| `subjects` | `id`, `user_id`, `semester_id`, `name`, `teacher_name`, `teacher_email`, `credits`, `color`, `evaluation_criteria` | Crear/listar materias; asociarlas al horario. |
| `schedule` | `id`, `user_id`, `subject_id`, `day`, `start_time`, `end_time`, `classroom` | Crear/listar/eliminar asignaciones de horario. |

No es posible confirmar relaciones físicas ni restricciones a partir del código. Las consultas relacionan `subjects.semester_id` con `semesters.id` y `schedule.subject_id` con `subjects.id`.

## Modelos

- `user.model.js`: inserta usuario con timestamps `NOW()`; búsqueda por email/ID devuelve la primera fila (`SELECT *`).
- `semester.model.js`: lista ID/nombre por usuario; inserta nombre, periodo y timestamp.
- `subject.model.js`: lista materia filtrada por usuario y semestre; inserta docente, créditos, color y criterios como campos opcionales con `null` por defecto.
- `schedule.model.js`: lista materias de un semestre, inserta asignación, borra por ID y usuario, o lista las asignaciones del usuario unidas a materia.
- `note.model.js` existe vacío y no hay uso asociado en rutas/controladores.

