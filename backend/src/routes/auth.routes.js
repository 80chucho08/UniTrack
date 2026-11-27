const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const schemas = require("../validators/schemas");

router.post("/register", validate({ body: schemas.register }), authController.register);
router.post("/login", validate({ body: schemas.login }), authController.login);

module.exports = router;
