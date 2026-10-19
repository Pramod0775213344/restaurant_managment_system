import { Router } from "express";
import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controller/menuItemController";
import { validate } from "../middleware/validate";
import { createMenuItemSchema, updateMenuItemSchema } from "../validators/menuItemSchema";

const router = Router();

router.get("/", getMenuItems);
router.get("/:id", getMenuItemById);
router.post("/", validate(createMenuItemSchema), createMenuItem);
router.put("/:id", validate(updateMenuItemSchema), updateMenuItem);
router.delete("/:id", deleteMenuItem);

export default router;
