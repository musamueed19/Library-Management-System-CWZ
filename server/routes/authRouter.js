// importing 'express'.
import express from "express"
import { register } from "../controllers/authController.js";

// create 'Router' instance
const router = express.Router();

router.post("/register", register);


export default router;