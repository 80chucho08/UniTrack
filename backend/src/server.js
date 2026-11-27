// env debe cargarse antes que nada: valida la configuración y aborta si falta algo.
const config = require("./config/env");
const app = require("./app");
const bd = require("./config/db");

app.listen(config.port, () => {
  console.log(`Servidor corriendo en el puerto ${config.port} (${config.nodeEnv})`);
});

bd.testConnection();
