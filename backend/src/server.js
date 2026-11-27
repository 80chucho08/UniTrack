// env debe cargarse antes que nada: valida la configuración y aborta si falta algo.
const config = require("./config/env");
const app = require("./app");
const bd = require("./config/db");

app.listen(config.port, () => {
  console.log(`Servidor corriendo en el puerto ${config.port} (${config.nodeEnv})`);
});

bd.testConnection();

// Errores que escaparon de todo (p. ej. una promesa sin await que falla fuera de una
// petición). El proceso queda en un estado desconocido: se registra y se termina, y
// quien lo supervisa (nodemon ahora, Docker en la Fase 1) lo vuelve a levantar.
process.on("unhandledRejection", (reason) => {
  console.error("Promesa rechazada sin manejar:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("Excepción no capturada:", error);
  process.exit(1);
});
