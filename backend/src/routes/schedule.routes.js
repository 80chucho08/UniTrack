const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const scheduleController = require("../controllers/schedule.controller");

router.get("/schedule/:semesterId/schedule", authMiddleware, scheduleController.getSubjectsBySemester);


module.exports = router;