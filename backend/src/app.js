const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const semesterRoutes = require("./routes/semester.routes");
const subjectRoutes = require("./routes/subject.routes");
const scheduleRoutes = require("./routes/schedule.routes");
const noteRoutes = require("./routes/note.routes");
const todoRoutes = require("./routes/todo.routes");
const gradeRoutes = require("./routes/grade.routes");
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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

module.exports = app;
