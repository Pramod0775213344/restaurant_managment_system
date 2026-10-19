import { Router } from "express";
import {
  login,
  registerAdmin,
  getMe,
  changePassword,
  logout,
} from "../controller/authController";
import { authMiddleware } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate";
import { loginSchema, changePasswordSchema, registerAdminSchema } from "../validators/userSchema";

const router = Router();

// Public routes
router.post("/login", validate(loginSchema), login);
router.post("/register-admin", validate(registerAdminSchema), registerAdmin);
router.post("/logout", logout);

// Protected routes
router.get("/me", authMiddleware, getMe);
router.post("/change-password", authMiddleware, validate(changePasswordSchema), changePassword);

export default router;
