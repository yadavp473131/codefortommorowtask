const authController = require("../Controllers/auth-controller");
const express = require("express");
const router = express.Router();

router.post("/register", authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/forget', authController.forgetPassword);
router.post('/reset/:token', authController.resetPassword);

module.exports = router;