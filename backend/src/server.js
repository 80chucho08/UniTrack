// env debe cargarse antes que nada: valida la configuración y aborta si falta algo.
const config = require("./config/env");
const app = require("./app");
const bd = require("./config/db");
const logger = require("./config/logger");

app.listen(config.port, () => {
  logger.info({ port: config.port, env: config.nodeEnv }, "Servidor iniciado");
});

bd.testConnection();

// Errores que escaparon de todo (p. ej. una promesa sin await que falla fuera de una
// petición). El proceso queda en un estado desconocido: se registra y se termina, y
// quien lo supervisa (nodemon ahora, Docker en la Fase 1) lo vuelve a levantar.
process.on("unhandledRejection", (reason) => {
  logger.fatal({ err: reason }, "Promesa rechazada sin manejar");
  logger.flush(); // vaciar el buffer antes de salir para no perder este último log
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  logger.fatal({ err: error }, "Excepción no capturada");
  logger.flush();
  process.exit(1);
});
