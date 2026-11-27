// Piezas reutilizables para los esquemas de validación.
const { z } = require("zod");

// Id numérico en la URL ("12" -> 12). Rechaza "abc", "-1", "1.5".
const id = (label = "id") =>
    z.coerce.number({ error: `El ${label} debe ser un número` })
        .int({ error: `El ${label} debe ser un número entero` })
        .positive({ error: `El ${label} debe ser positivo` });

// Params con un solo id, p. ej. idParams("subjectId", "id de materia")
const idParams = (name, label) => z.object({ [name]: id(label) });

// Texto obligatorio: recorta espacios y no acepta vacío
const requiredText = (label, max) =>
    z.string({ error: `${label} es obligatorio` })
        .trim()
        .min(1, { error: `${label} es obligatorio` })
        .max(max, { error: `${label} no puede tener más de ${max} caracteres` });

// Texto opcional: "" o "   " se guardan como null
const nullableText = (label, max) =>
    z.string({ error: `${label} debe ser texto` })
        .trim()
        .max(max, { error: `${label} no puede tener más de ${max} caracteres` })
        .transform((text) => (text === "" ? null : text))
        .nullable();

// Número que puede llegar como 85 o como "85" (formularios), dentro de un rango
const numberInRange = (label, min, max) =>
    z.union([z.number(), z.string().trim().min(1)], { error: `${label} es obligatorio` })
        .pipe(
            z.coerce.number({ error: `${label} debe ser un número` })
                .min(min, { error: `${label} debe estar entre ${min} y ${max}` })
                .max(max, { error: `${label} debe estar entre ${min} y ${max}` })
        );

// Fecha YYYY-MM-DD opcional: "" -> null
const nullableDate = z
    .union([z.literal(""), z.null(), z.iso.date({ error: "La fecha debe tener formato YYYY-MM-DD" })])
    .transform((value) => (value === "" ? null : value));

module.exports = { z, id, idParams, requiredText, nullableText, numberInRange, nullableDate };
