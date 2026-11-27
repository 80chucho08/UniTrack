const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { apiLimiter } = require("./middlewares/rateLimit.middleware");
const { notFound, errorHandler } = require("./middlewares/error.middleware");
const requestLogger = require("./middlewares/requestLogger.middleware");
const config = require("./config/env");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const semesterRoutes = require("./routes/semester.routes");
const subjectRoutes = require("./routes/subject.routes");
const scheduleRoutes = require("./routes/schedule.routes");
const noteRoutes = require("./routes/note.routes");
const todoRoutes = require("./routes/todo.routes");
const gradeRoutes = require("./routes/grade.routes");
const app = express();

app.set("trust proxy", config.trustProxy);

// Primero: así se registra TODA petición, incluso las que luego rechaza el rate limit
app.use(requestLogger);

// Headers de seguridad (quita X-Powered-By, añade Content-Security-Policy,
// Strict-Transport-Security, X-Content-Type-Options, etc.)
app.use(helmet());

// Solo los orígenes listados en CORS_ORIGIN pueden llamar a la API desde un navegador.
app.use(cors({
  origin: config.corsOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Request-Id', 'Retry-After'] // headers que el frontend puede leer
}));

// Antes de leer el body: una petición rechazada no gasta tiempo en parsear 5 MB
app.use("/api", apiLimiter);

// Middleware para leer JSON (límite ampliado para la imagen de encabezado de materias)
app.use(express.json({ limit: "5mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/semesters", semesterRoutes);
app.use("/api", subjectRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api", noteRoutes);
app.use("/api", todoRoutes);
app.use("/api", gradeRoutes);
// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "UniTrack API funcionando " });
});

// Siempre al final: primero lo que no coincidió con ninguna ruta, luego los errores
app.use(notFound);
app.use(errorHandler);

module.exports = app;
