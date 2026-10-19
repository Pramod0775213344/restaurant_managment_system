import { Router } from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controller/categoryController";
import { validate } from "../middleware/validate";
import { createCategorySchema, updateCategorySchema } from "../validators/categorySchema";

const router = Router();

router.get("/", getCategories);
router.post("/", validate(createCategorySchema), createCategory);
router.put("/:id", validate(updateCategorySchema), updateCategory);
router.delete("/:id", deleteCategory);

export default router;
