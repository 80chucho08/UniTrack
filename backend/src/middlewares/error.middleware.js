const config = require("../config/env");

// Manejo de errores centralizado.
//
// Express 5 envía aquí automáticamente cualquier error lanzado (o promesa rechazada)
// en un controlador async, así que los controladores ya no necesitan try/catch:
// si la BD falla, el error llega a este middleware y se responde de forma uniforme.
//
// Regla de oro: el detalle técnico (stack, SQL, mensaje interno) va al LOG del
// servidor, nunca al cliente en producción. Un stack trace le dice a un atacante
// qué librerías, rutas y consultas usas.

// Ruta inexistente: 404 en JSON (por defecto Express respondería HTML)
const notFound = (req, res) => {
    res.status(404).json({ message: "Ruta no encontrada" });
};

// Los middlewares de error se reconocen por tener 4 parámetros (aunque `next` no se use)
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    // Errores de cliente que ya traen su status (los crea el parser de JSON de Express)
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ message: "El cuerpo de la petición no es JSON válido" });
    }
    if (err.type === "entity.too.large") {
        return res.status(413).json({ message: "La petición es demasiado grande" });
    }

    // Choque con un índice UNIQUE de MySQL (p. ej. dos registros simultáneos del mismo correo)
    if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "El registro ya existe" });
    }

    // Cualquier otro error es un fallo nuestro: se registra completo y se responde genérico.
    // pino-http incluye res.err (con stack) en el log de esta petición, con su id.
    res.err = err;

    // requestId: el usuario puede reportarlo y lo buscas en los logs
    const body = { message: "Error interno del servidor", requestId: req.id };
    if (!config.isProduction) {
        body.detail = err.message; // solo en desarrollo, para depurar desde el frontend
    }
    res.status(500).json(body);
};

module.exports = { notFound, errorHandler };
