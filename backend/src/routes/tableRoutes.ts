import { Router } from "express";
import {
  getTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
} from "../controller/tableController";
import { validate } from "../middleware/validate";
import { createTableSchema, updateTableSchema } from "../validators/tableSchema";

const router = Router();

router.get("/", getTables);
router.get("/:id", getTableById);
router.post("/", validate(createTableSchema), createTable);
router.put("/:id", validate(updateTableSchema), updateTable);
router.delete("/:id", deleteTable);

export default router;
