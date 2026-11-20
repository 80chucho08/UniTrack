const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const subjectController = require("../controllers/subject.controller");

// Este router se monta en /api (ver app.js)

// obtener subjects de un usuario
router.get("/semesters/:semesterId/subjects", authMiddleware, subjectController.getSubjects);

// crear una nueva materia
router.post("/semesters/:semesterId/subjects", authMiddleware, subjectController.createSubject);

// todas las materias del usuario (con nombre de semestre)
router.get("/subjects", authMiddleware, subjectController.getAllSubjects);

// detalle, edición y borrado de una materia
router.get("/subjects/:subjectId", authMiddleware, subjectController.getSubjectById);
router.put("/subjects/:subjectId", authMiddleware, subjectController.updateSubject);
router.delete("/subjects/:subjectId", authMiddleware, subjectController.deleteSubject);

// imagen de encabezado del dashboard de la materia
router.put("/subjects/:subjectId/header-image", authMiddleware, subjectController.updateHeaderImage);

module.exports = router;
