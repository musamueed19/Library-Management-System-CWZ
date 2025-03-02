// importing 'express'.
import express from "express"
import { register, verifyOTP } from "../controllers/authController.js";

// create 'Router' instance
const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);


export default router;