import express from "express";
import authController from "../controllers/authController";

const router = express.Router();

// Regiter User
router.post("/register", authController.registerUser);

// User Login Api
router.post("/login", authController.Userlogin);

// Send Otp Api
router.post("/sendotp", authController.sendOTP);

// Verify User Otp
router.post("/verifyotp", authController.verifyOtp);


export default router;
