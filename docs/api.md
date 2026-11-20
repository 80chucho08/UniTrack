# API observada

Base de montaje en `backend/src/app.js`. Las rutas protegidas requieren `Authorization: Bearer <JWT>`; el token se firma con `JWT_SECRET`, contiene `id` y `email` y expira en un día. El API acepta JSON. CORS permite `http://localhost:5173`.

Los campos descritos reflejan las lecturas/escrituras del código, no validaciones de esquema. Salvo donde se indica, los errores internos responden con `500` y `{ message }`; algunos endpoints también incluyen `error`.

| Método y ruta | Auth | Entrada / respuesta exitosa |
|---|---|---|
| `GET /` | No | `{ message }` de prueba. |
| `POST /api/auth/register` | No | Body `{ name, email, password }`; `201 { message }`. Errores: campos faltantes `400`, correo existente `409`. |
| `POST /api/auth/login` | No | Body `{ email, password }`; `200 { token, user: { id, name, email } }`. Campos faltantes `400`; credenciales `401`. |
| `GET /api/users/me` | Sí | `200` objeto de usuario consultado por ID; `404` si no existe. El modelo hace `SELECT *`. |
| `GET /api/semesters` | Sí | `200` arreglo con `id`, `name`. |
| `POST /api/semesters` | Sí | Body `{ name, period }`; `201 { message, semesterId }`. |
| `GET /api/semesters/:semesterId/subjects` | Sí | `200` arreglo de materias con `id`, `user_id`, `semester_id`, `name`, `teacher_name`, `color`. |
| `POST /api/semesters/:semesterId/subjects` | Sí | Body requiere `name`; admite `teacher_name`, `teacher_email`, `credits`, `color`, `evaluation_criteria`. `201 { message, subjectId }`. |
| `GET /api/subjects` | Sí | `200` todas las materias del usuario (`id`, `name`, `color`, `semester_id`, `semester_name`), del semestre más reciente al más antiguo. |
| `GET /api/todos` | Sí | `200` todas las tareas del usuario, con o sin materia, con los mismos campos que las de materia. |
| `POST /api/todos` | Sí | Body `{ title, subject_id?, description?, due_date? }`; sin `subject_id` la tarea queda sin materia. `201` con la tarea; `404` si la materia no es del usuario. |
| `GET /api/subjects/:subjectId` | Sí | `200` materia completa (incluye `header_image`) más `semester_name` y `semester_period`; `404` si no es del usuario. |
| `PUT /api/subjects/:subjectId` | Sí | Actualización parcial de `name`, `teacher_name`, `teacher_email`, `credits` (entero ≥ 0 o vacío), `color`, `evaluation_criteria`. `""` se guarda como `null`. `200` con la materia actualizada; `400` si queda sin nombre. |
| `DELETE /api/subjects/:subjectId` | Sí | Borra la materia y sus tareas en una transacción; notas, calificaciones y horario caen en cascada. `200 { message }` o `404`. |
| `PUT /api/subjects/:subjectId/header-image` | Sí | Body `{ header_image }`: data URL `data:image/...`, URL `http(s)` o `null` para quitarla. `200 { message, header_image }`; `400` formato inválido; `413` si supera ~4 MB. |
| `GET /api/subjects/:subjectId/notes` | Sí | `200` notas (`id`, `subject_id`, `title`, `content`, `created_at`, `updated_at`) ordenadas por última edición. |
| `POST /api/subjects/:subjectId/notes` | Sí | Body `{ title, content? }`; `201` con la nota creada. |
| `PUT /api/notes/:noteId` / `DELETE /api/notes/:noteId` | Sí | Edición parcial (`200` nota) / borrado (`200 { message }`); `404` si no es del usuario. |
| `GET /api/subjects/:subjectId/todos` | Sí | `200` tareas (`id`, `subject_id`, `title`, `description`, `due_date` `YYYY-MM-DD`, `status` `pending`/`completed`, `created_at`, más `subject_name`, `subject_color`, `semester_id`, `semester_name`, que son `null` si la tarea no tiene materia). |
| `POST /api/subjects/:subjectId/todos` | Sí | Body `{ title, description?, due_date? }`; `201` con la tarea creada. |
| `PUT /api/todos/:todoId` / `DELETE /api/todos/:todoId` | Sí | Edición parcial, p. ej. `{ status: "completed" }` (`200` tarea) / borrado. |
| `GET /api/subjects/:subjectId/grades` | Sí | `200` calificaciones (`id`, `subject_id`, `name`, `value` 0–100, `weight` % 0–100, `date`, `created_at`) con números ya convertidos. |
| `POST /api/subjects/:subjectId/grades` | Sí | Body `{ name, value, weight, date? }`; `201` con la calificación; `400` fuera de rango. |
| `PUT /api/grades/:gradeId` / `DELETE /api/grades/:gradeId` | Sí | Edición parcial / borrado. |
| `GET /api/schedule/subject/:subjectId` | Sí | `200` clases de la materia (`schedule_id`, `day`, `start_time`/`end_time` `HH:mm`, `classroom`) ordenadas por día y hora. |
| `GET /api/schedule/subjects/:semesterId` | Sí | `200` arreglo de materias con ID, propietario, semestre, nombre y color. |
| `GET /api/schedule/grid` | Sí | `200` asignaciones del usuario: `schedule_id`, día, horas, aula y datos de materia. |
| `POST /api/schedule/grid` | Sí | Body requiere `subject_id`, `day`, `start_time`; también lee `end_time`, `classroom`. `201 { message, insertedId }`. |
| `DELETE /api/schedule/grid/:id` | Sí | Borra por ID y usuario; `200 { message }` o `404` si no se afectó fila. |

## Consumo frontend y advertencias de contrato

`semesterService.ts`, `subjectService.ts` y `scheduleService.ts` apuntan a `http://localhost:3000`. Los servicios nuevos (`noteService.ts`, `todoService.ts`, `gradeService.ts` y las funciones de detalle de `subjectService.ts`) usan `apiRequest` de `services/http.ts`, que lanza el `message` de error que devuelve la API. Los routers de materias, notas, tareas y calificaciones se montan en `/api`; el body JSON admite hasta 5 MB por la imagen de encabezado. Login y registro tienen URL codificada en sus páginas. Las llamadas autenticadas agregan el Bearer token.

El registro del backend no devuelve el `token` ni el `user` que `Register.tsx` espera. Además, `/api/users/me` expone directamente el resultado de `SELECT *` del modelo, que incluye el hash de contraseña según el acceso de autenticación. El endpoint del grid devuelve todas las asignaciones del usuario, sin filtro de semestre.

