const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const subjectController = require("../controllers/subject.controller");
const { route } = require("./semester.routes");

// obtener subjects de un usuario
router.get("/semesters/:semesterId/subjects", authMiddleware, subjectController.getSubjects);

// crear un nuevo semestre
router.post("/semesters/:semesterId/subjects", authMiddleware, subjectController.createSubject);

module.exports = router;