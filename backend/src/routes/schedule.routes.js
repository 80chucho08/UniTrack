const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const scheduleController = require("../controllers/schedule.controller");

router.get("/subjects/:semesterId", authMiddleware, scheduleController.getSubjectsBySemester);
router.get("/grid", authMiddleware, scheduleController.getSchedule);
router.post("/grid", authMiddleware, scheduleController.saveScheduleSubject);
router.delete("/grid/:id", authMiddleware, scheduleController.deleteScheduleSubject);

module.exports = router;