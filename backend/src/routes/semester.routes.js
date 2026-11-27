const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const semesterController = require("../controllers/semester.controller");
const validate = require("../middlewares/validate.middleware");
const schemas = require("../validators/schemas");

// obtener todos los semester de un usuario
router.get("/", authMiddleware, semesterController.getSemesters);

// crear un nuevo semestre
router.post("/", authMiddleware, validate({ body: schemas.createSemester }), semesterController.createSemester);

module.exports = router;