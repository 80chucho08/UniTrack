// Logger de la app (pino). Reemplaza a console.log/console.error.
//
// ¿Por qué no console.log? Porque en producción los logs los lee una máquina
// (Docker, Loki, Grafana...). pino escribe UNA LÍNEA JSON por evento, con nivel,
// hora y campos, que se pueden filtrar: "todos los errores del usuario 7 de ayer".
// En desarrollo se ven legibles y con colores gracias a pino-pretty.
const pino = require("pino");
const config = require("./env");

const logger = pino({
    level: config.logLevel,
    // Nunca deben llegar a un log: tokens, cookies ni contraseñas
    redact: {
        paths: [
            "req.headers.authorization",
            "req.headers.cookie",
            'res.headers["set-cookie"]',
            "password",
            "*.password",
            "passwordHash",
            "*.password_hash",
        ],
        censor: "[OCULTO]",
    },
    // pino-pretty es devDependency: en producción no está instalado ni hace falta.
    // En desarrollo se ocultan req/res porque el mensaje ya dice método, ruta, status y tiempo.
    transport: config.isProduction
        ? undefined
        : { target: "pino-pretty", options: { colorize: true, translateTime: "SYS:HH:MM:ss", ignore: "pid,hostname,req,res,responseTime" } },
});

module.exports = logger;
