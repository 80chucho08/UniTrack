const express = require("express");
const authRoutes = require("./routes/auth.routes");

const app = express();

// Middleware para leer JSON
app.use(express.json());

app.use("/api/auth", authRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "UniTrack API funcionando " });
});

module.exports = app;
