const express = require("express");
const router = express.Router();
const healthController = require("../controllers/health.controller");

// Se monta en /api/health ANTES del rate limit (ver app.js): un monitor que consulta
// cada pocos segundos nunca debe recibir 429. Son públicas y no devuelven datos sensibles.

// ¿está vivo el proceso? (Docker HEALTHCHECK / reinicio)
router.get("/live", healthController.live);

// ¿puede atender? incluye la BD (monitor de disponibilidad, Uptime Kuma)
router.get("/", healthController.ready);

module.exports = router;
