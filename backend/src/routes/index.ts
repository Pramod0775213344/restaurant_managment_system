import { Router } from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import menuRoutes from "./menuRoutes";
import categoryRoutes from "./categoryRoutes";
import menuItemRoutes from "./menuItemRoutes";
import tableRoutes from "./tableRoutes";

const router = Router();

// Health check endpoint
router.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Resource routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/menu", menuRoutes);
router.use("/categories", categoryRoutes);
router.use("/menu-items", menuItemRoutes);
router.use("/tables", tableRoutes);

export default router;
