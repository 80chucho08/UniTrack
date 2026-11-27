const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const scheduleController = require("../controllers/schedule.controller");
const validate = require("../middlewares/validate.middleware");
const schemas = require("../validators/schemas");
const { idParams } = require("../validators/common");

router.get("/subjects/:semesterId", authMiddleware, validate({ params: idParams("semesterId", "id de semestre") }), scheduleController.getSubjectsBySemester);
router.get("/grid", authMiddleware, scheduleController.getSchedule);
router.get("/subject/:subjectId", authMiddleware, validate({ params: idParams("subjectId", "id de materia") }), scheduleController.getScheduleBySubject);
router.post("/grid", authMiddleware, validate({ body: schemas.createScheduleEntry }), scheduleController.saveScheduleSubject);
router.delete("/grid/:id", authMiddleware, validate({ params: idParams("id", "id del horario") }), scheduleController.deleteScheduleSubject);

module.exports = router;