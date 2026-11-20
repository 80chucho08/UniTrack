const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const gradeController = require("../controllers/grade.controller");

// Este router se monta en /api (ver app.js)

// calificaciones de una materia
router.get("/subjects/:subjectId/grades", authMiddleware, gradeController.getGrades);
router.post("/subjects/:subjectId/grades", authMiddleware, gradeController.createGrade);

// editar y borrar una calificación
router.put("/grades/:gradeId", authMiddleware, gradeController.updateGrade);
router.delete("/grades/:gradeId", authMiddleware, gradeController.deleteGrade);

module.exports = router;
