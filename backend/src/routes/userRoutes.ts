import { Router } from "express";
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
} from "../controller/userController";
import { validate } from "../middleware/validate";
import { createUserSchema, updateUserSchema } from "../validators/userSchema";

const router = Router();

router.get("/", getUsers);
router.post("/", validate(createUserSchema), createUser);
router.put("/:id", validate(updateUserSchema), updateUser);
router.delete("/:id", deleteUser);

export default router;