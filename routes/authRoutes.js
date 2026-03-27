import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import { aiCheck } from "../middleware/aiAuth.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// ✅ IA ici
router.post("/login", aiCheck, login);
router.post("/logout", logout);

export default router;