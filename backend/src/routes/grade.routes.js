const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const gradeController = require("../controllers/grade.controller");
const validate = require("../middlewares/validate.middleware");
const schemas = require("../validators/schemas");
const { idParams } = require("../validators/common");

const subjectParams = idParams("subjectId", "id de materia");
const gradeParams = idParams("gradeId", "id de calificación");

// Este router se monta en /api (ver app.js)

// calificaciones de una materia
router.get("/subjects/:subjectId/grades", authMiddleware, validate({ params: subjectParams }), gradeController.getGrades);
router.post("/subjects/:subjectId/grades", authMiddleware, validate({ params: subjectParams, body: schemas.createGrade }), gradeController.createGrade);

// editar y borrar una calificación
router.put("/grades/:gradeId", authMiddleware, validate({ params: gradeParams, body: schemas.updateGrade }), gradeController.updateGrade);
router.delete("/grades/:gradeId", authMiddleware, validate({ params: gradeParams }), gradeController.deleteGrade);

module.exports = router;
