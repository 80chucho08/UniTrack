// Configuración central de la app. Es el ÚNICO lugar que lee process.env:
// el resto del código importa este objeto. Si falta una variable obligatoria,
// la app no arranca (falla rápido en vez de fallar a medias en producción).
const path = require("path");

// Carga backend/.env sin importar desde qué carpeta se ejecute node.
// (En Docker/producción las variables llegan del entorno y este archivo puede no existir.)
require("dotenv").config({ path: path.resolve(__dirname, "../../.env"), quiet: true });

const required = ["DB_HOST", "DB_USER", "DB_NAME", "JWT_SECRET"];
const missing = required.filter((name) => !process.env[name]);

if (missing.length > 0) {
    console.error(`Faltan variables de entorno obligatorias: ${missing.join(", ")}`);
    console.error("Copia backend/.env.example a backend/.env y complétalo.");
    process.exit(1);
}

const nodeEnv = process.env.NODE_ENV || "development";

if (nodeEnv === "production" && process.env.JWT_SECRET.length < 32) {
    console.error("JWT_SECRET debe tener al menos 32 caracteres en producción.");
    process.exit(1);
}

const config = {
    nodeEnv,
    isProduction: nodeEnv === "production",
    port: Number(process.env.PORT) || 3000,
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD || "",
        name: process.env.DB_NAME,
        port: Number(process.env.DB_PORT) || 3306,
    },
    jwtSecret: process.env.JWT_SECRET,
    // Cuántos proxies hay delante de la app (Caddy/Nginx = 1). Con 0, req.ip es la IP
    // que conecta directamente; detrás de un proxy sería la del proxy y el rate limit
    // bloquearía a TODOS los usuarios a la vez. No lo subas si no hay proxy: un cliente
    // podría falsear su IP con el header X-Forwarded-For.
    trustProxy: Number(process.env.TRUST_PROXY) || 0,
    // Lista separada por comas, p. ej. "https://unitrack.com,https://staging.unitrack.com"
    corsOrigins: (process.env.CORS_ORIGIN || "http://localhost:5173")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
};

module.exports = config;
