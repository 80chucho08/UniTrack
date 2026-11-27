const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const { loginLimiter, registerLimiter } = require("../middlewares/rateLimit.middleware");
const schemas = require("../validators/schemas");

router.post("/register", registerLimiter, validate({ body: schemas.register }), authController.register);
router.post("/login", loginLimiter, validate({ body: schemas.login }), authController.login);

module.exports = router;
