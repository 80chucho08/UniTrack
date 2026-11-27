const { z } = require("zod");

// Mensajes por defecto de zod en español (los esquemas definen los suyos donde importa)
z.config(z.locales.es());

// Valida partes de la petición con esquemas de zod antes de llegar al controlador.
// Uso: router.post("/x/:id", validate({ params: idParams, body: createSchema }), controller)
//
// Si algo no cumple, responde 400 y el controlador ni se ejecuta. Si cumple,
// reemplaza req.body / req.params por los datos YA LIMPIOS (recortados,
// convertidos a número, campos desconocidos eliminados).
const validate = (schemas) => (req, res, next) => {
    const errors = [];

    for (const part of ["params", "body"]) {
        if (!schemas[part]) continue;

        const result = schemas[part].safeParse(req[part] ?? {});
        if (result.success) {
            req[part] = result.data;
        } else {
            for (const issue of result.error.issues) {
                errors.push({ field: issue.path.join(".") || part, message: issue.message });
            }
        }
    }

    if (errors.length > 0) {
        // message: el primer error (lo que muestra el frontend); errors: todos, por campo
        return res.status(400).json({ message: errors[0].message, errors });
    }

    next();
};

module.exports = validate;
