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
| `GET /api/semesters/:semesterId/subjects` | Sí | `200` arreglo de materias con `id`, `user_id`, `semester_id`, `name`, `color`. |
| `POST /api/semesters/:semesterId/subjects` | Sí | Body requiere `name`; admite `teacher_name`, `teacher_email`, `credits`, `color`, `evaluation_criteria`. `201 { message, subjectId }`. |
| `GET /api/schedule/subjects/:semesterId` | Sí | `200` arreglo de materias con ID, propietario, semestre, nombre y color. |
| `GET /api/schedule/grid` | Sí | `200` asignaciones del usuario: `schedule_id`, día, horas, aula y datos de materia. |
| `POST /api/schedule/grid` | Sí | Body requiere `subject_id`, `day`, `start_time`; también lee `end_time`, `classroom`. `201 { message, insertedId }`. |
| `DELETE /api/schedule/grid/:id` | Sí | Borra por ID y usuario; `200 { message }` o `404` si no se afectó fila. |

## Consumo frontend y advertencias de contrato

`semesterService.ts`, `subjectService.ts` y `scheduleService.ts` apuntan a `http://localhost:3000`. Login y registro tienen URL codificada en sus páginas. Las llamadas autenticadas agregan el Bearer token.

El registro del backend no devuelve el `token` ni el `user` que `Register.tsx` espera. Además, `/api/users/me` expone directamente el resultado de `SELECT *` del modelo, que incluye el hash de contraseña según el acceso de autenticación. El endpoint del grid devuelve todas las asignaciones del usuario, sin filtro de semestre.

