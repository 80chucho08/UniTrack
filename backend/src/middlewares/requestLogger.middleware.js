const { randomUUID } = require("crypto");
const pinoHttp = require("pino-http");
const logger = require("../config/logger");

// Un id por petición. Si un proxy (Caddy) ya mandó X-Request-Id lo reutilizamos,
// así la misma petición se puede seguir en los logs del proxy y en los nuestros.
// Solo se acepta un valor corto y simple para que nadie inyecte basura en los logs.
const REQUEST_ID = /^[A-Za-z0-9-]{8,64}$/;

const requestLogger = pinoHttp({
    logger,
    genReqId: (req, res) => {
        const incoming = req.headers["x-request-id"];
        const id = typeof incoming === "string" && REQUEST_ID.test(incoming) ? incoming : randomUUID();
        res.setHeader("X-Request-Id", id); // el cliente lo ve y puede reportarlo
        return id;
    },
    // Los healthchecks llegan cada pocos segundos: registrarlos todos taparía lo importante.
    // Si fallan, el propio endpoint escribe un log de error.
    autoLogging: { ignore: (req) => req.url.startsWith("/api/health") },
    // Nivel según el resultado: 5xx es un fallo nuestro, 4xx del cliente
    customLogLevel: (req, res, err) => {
        if (err || res.statusCode >= 500) return "error";
        if (res.statusCode >= 400) return "warn";
        return "info";
    },
    customSuccessMessage: (req, res, responseTime) =>
        `${req.method} ${req.originalUrl} ${res.statusCode} ${Math.round(responseTime)}ms`,
    customErrorMessage: (req, res) => `${req.method} ${req.originalUrl} ${res.statusCode}`,
    // Qué guardar de cada petición: lo justo (sin body, que puede traer datos personales)
    serializers: {
        req: (req) => ({ id: req.id, method: req.method, url: req.url, ip: req.remoteAddress }),
        res: (res) => ({ statusCode: res.statusCode }),
    },
    // El id del usuario autenticado, si lo hay (lo pone authMiddleware)
    customProps: (req) => (req.user ? { userId: req.user.id } : {}),
});

module.exports = requestLogger;
