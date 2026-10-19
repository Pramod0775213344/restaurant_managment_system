import { Router } from "express";
import categoryRoutes from "./categoryRoutes";
import menuItemRoutes from "./menuItemRoutes";
import { getFullMenu } from "../controller/menuController";

const router = Router();

// GET /api/menu (Full menu with categories and items)
router.get("/", getFullMenu);

// Nested routes: /api/menu/categories and /api/menu/items
router.use("/categories", categoryRoutes);
router.use("/items", menuItemRoutes);

export default router;
