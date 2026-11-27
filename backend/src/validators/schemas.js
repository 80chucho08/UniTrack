// Esquemas de validación por recurso. Describen qué forma DEBE tener cada body;
// lo que no aparece aquí se descarta (z.object elimina campos desconocidos).
const { z, id, requiredText, nullableText, numberInRange, nullableDate } = require("./common");

const email = z
    .string({ error: "El correo es obligatorio" })
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: "El correo no es válido" }));

// ---------- Auth ----------
const register = z.object({
    name: requiredText("El nombre", 100),
    email,
    // bcrypt solo usa los primeros 72 bytes: más largo daría una falsa sensación de seguridad
    password: z
        .string({ error: "La contraseña es obligatoria" })
        .min(8, { error: "La contraseña debe tener al menos 8 caracteres" })
        .max(72, { error: "La contraseña no puede tener más de 72 caracteres" }),
});

// En login no se aplica la política de contraseña (cuentas antiguas podrían no cumplirla)
const login = z.object({
    email,
    password: z.string({ error: "La contraseña es obligatoria" }).min(1, { error: "La contraseña es obligatoria" }),
});

// ---------- Semestres ----------
const createSemester = z.object({
    name: requiredText("El nombre del semestre", 100),
    period: requiredText("El periodo", 50),
});

// ---------- Materias ----------
const credits = z
    .union([z.literal(""), z.null(), numberInRange("El número de créditos", 0, 50)])
    .transform((value) => (value === "" ? null : value))
    .refine((value) => value === null || Number.isInteger(value), { error: "Los créditos deben ser un número entero" });

const teacherEmail = z
    .union([z.literal(""), z.null(), z.string().trim().pipe(z.email({ error: "El correo del profesor no es válido" }))])
    .transform((value) => (value === "" ? null : value));

const subjectFields = {
    name: requiredText("El nombre de la materia", 100),
    teacher_name: nullableText("El nombre del profesor", 100).optional(),
    teacher_email: teacherEmail.optional(),
    credits: credits.optional(),
    color: nullableText("El color", 30).optional(),
    evaluation_criteria: nullableText("Los criterios de evaluación", 5000).optional(),
};

const createSubject = z.object(subjectFields);
// Edición parcial: todo opcional, pero lo que venga debe ser válido
const updateSubject = z.object(subjectFields).partial();

const headerImage = z.object({
    header_image: z.string({ error: "La imagen debe ser texto" }).nullable(),
});

// ---------- Notas ----------
const noteFields = {
    title: requiredText("El título de la nota", 200),
    content: z.string({ error: "El contenido debe ser texto" }).max(50000, { error: "La nota es demasiado larga" }).nullable().optional(),
};
const createNote = z.object(noteFields);
const updateNote = z.object(noteFields).partial();

// ---------- Tareas ----------
const todoFields = {
    title: requiredText("El título de la tarea", 200),
    description: nullableText("La descripción", 2000).optional(),
    due_date: nullableDate.optional(),
};
const createTodo = z.object({
    ...todoFields,
    // Solo se usa en POST /todos; en /subjects/:subjectId/todos manda la URL
    subject_id: z
        .union([z.literal(""), z.null(), id("id de materia")])
        .transform((value) => (value === "" ? null : value))
        .optional(),
});
const updateTodo = z
    .object({
        ...todoFields,
        status: z.enum(["pending", "completed"], { error: "Estado inválido (pending o completed)" }),
    })
    .partial();

// ---------- Calificaciones ----------
const gradeFields = {
    name: requiredText("El nombre de la evaluación", 100),
    value: numberInRange("La calificación", 0, 100),
    weight: numberInRange("El porcentaje", 0, 100),
    date: nullableDate.optional(),
};
const createGrade = z.object(gradeFields);
const updateGrade = z.object(gradeFields).partial();

// ---------- Horario ----------
const time = (label) => z.string({ error: `${label} es obligatoria` }).regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, { error: `${label} debe tener formato HH:MM` });

const createScheduleEntry = z
    .object({
        subject_id: id("id de materia"),
        day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], { error: "Día inválido (Monday a Saturday)" }),
        start_time: time("La hora de inicio"),
        end_time: time("La hora de fin").nullable().optional(),
        classroom: nullableText("El salón", 100).optional(),
    })
    .refine((entry) => !entry.end_time || entry.end_time > entry.start_time, {
        error: "La hora de fin debe ser posterior a la de inicio",
        path: ["end_time"],
    });

module.exports = {
    register,
    login,
    createSemester,
    createSubject,
    updateSubject,
    headerImage,
    createNote,
    updateNote,
    createTodo,
    updateTodo,
    createGrade,
    updateGrade,
    createScheduleEntry,
};
