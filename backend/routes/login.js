const express = require("express");
const { loginUser, forgotPasswordHandler, verifyOTPHandler, resetPasswordHandler } = require("../controllers/loginController");
const router = express.Router();

// Remove the '/login' part to make the endpoint match your expectation
router.post("/", loginUser); // Now it will respond to POST /api/login
router.post("/forgetPassword", forgotPasswordHandler);
router.post("/verifyOTP", verifyOTPHandler);
router.post("/resetPassword", resetPasswordHandler);

module.exports = router;
