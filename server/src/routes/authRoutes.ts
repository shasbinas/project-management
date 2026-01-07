import { Router } from "express";
import { register, login, logout, getUserMe } from "../controllers/authController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", verifyToken, getUserMe);

export default router;
