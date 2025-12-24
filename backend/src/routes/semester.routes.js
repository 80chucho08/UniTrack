const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const semesterController = require("../controllers/semester.controller");

// obtener todos los semester de un usuario
router.get("/", authMiddleware, semesterController.getSemesters);

// crear un nuevo semestre
router.post("/", authMiddleware, semesterController.createSemester);

module.exports = router;