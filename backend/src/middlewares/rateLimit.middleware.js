const { rateLimit } = require("express-rate-limit");

// Rate limiting: cuántas peticiones puede hacer una misma IP en una ventana de tiempo.
// Protege contra fuerza bruta (adivinar contraseñas) y contra abuso que sature la API.
//
// Los contadores viven en memoria del proceso: si reinicias el servidor se ponen en 0,
// y con varias instancias cada una cuenta por separado (más adelante: Redis).

const FIFTEEN_MINUTES = 15 * 60 * 1000;

const tooMany = (message) => (req, res) => res.status(429).json({ message });

// Límite general para toda la API: holgado, solo frena abusos evidentes
const apiLimiter = rateLimit({
    windowMs: FIFTEEN_MINUTES,
    limit: 500,
    standardHeaders: "draft-8", // header RateLimit con lo que queda (estándar IETF)
    legacyHeaders: false, // sin los antiguos X-RateLimit-*
    handler: tooMany("Demasiadas peticiones. Espera unos minutos e inténtalo de nuevo."),
});

// Login: estricto y solo cuenta intentos FALLIDOS, así un usuario legítimo
// no se bloquea, pero un atacante solo prueba 10 contraseñas cada 15 minutos.
const loginLimiter = rateLimit({
    windowMs: FIFTEEN_MINUTES,
    limit: 10,
    skipSuccessfulRequests: true,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: tooMany("Demasiados intentos de inicio de sesión. Inténtalo de nuevo en 15 minutos."),
});

// Registro: evita que un script cree cuentas en masa desde una IP
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: tooMany("Demasiados registros desde esta red. Inténtalo de nuevo más tarde."),
});

module.exports = { apiLimiter, loginLimiter, registerLimiter };
