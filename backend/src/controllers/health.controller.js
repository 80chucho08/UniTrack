const { pool } = require("../config/db");

// Healthchecks: endpoints que consultan máquinas (Docker, Caddy, Uptime Kuma), no personas.
//
// Hay dos preguntas distintas y por eso dos endpoints:
//  - live:  "¿el proceso está vivo y responde?"  Si falla, hay que REINICIARLO.
//  - ready: "¿puede atender peticiones de verdad?" (¿llega a la BD?). Si falla,
//           reiniciar la API no arregla una BD caída: lo correcto es dejar de
//           enviarle tráfico y avisar.

const DB_TIMEOUT_MS = 2000;

// Liveness: no toca la BD, solo prueba que Node atiende peticiones
const live = (req, res) => {
    res.status(200).json({ status: "ok" });
};

// Readiness: hace un SELECT 1 con tiempo límite. Sin timeout, si MySQL se cuelga
// el healthcheck también se colgaría y nadie se enteraría.
const ready = async (req, res) => {
    let timer;
    try {
        await Promise.race([
            pool.query("SELECT 1"),
            new Promise((_, reject) => {
                timer = setTimeout(() => reject(new Error(`La BD no respondió en ${DB_TIMEOUT_MS} ms`)), DB_TIMEOUT_MS);
            }),
        ]);
        res.status(200).json({ status: "ok", db: "ok", uptime: Math.round(process.uptime()) });
    } catch (error) {
        // El detalle va al log; la respuesta pública no dice por qué falló la BD
        req.log.error({ err: error }, "Healthcheck: la BD no está disponible");
        // 503 = "no disponible por ahora": es lo que esperan balanceadores y monitores
        res.status(503).json({ status: "error", db: "error" });
    } finally {
        clearTimeout(timer);
    }
};

module.exports = { live, ready };
