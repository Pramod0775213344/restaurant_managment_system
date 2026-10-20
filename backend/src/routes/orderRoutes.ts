import { Router } from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
} from "../controller/orderController";
import { authenticateToken } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate";
import {
  createOrderSchema,
  updateOrderStatusSchema,
  updatePaymentStatusSchema,
} from "../validators/orderSchema";

const router = Router();

// All order routes require authentication
router.use(authenticateToken);

router.get("/", getOrders);
router.get("/:id", getOrderById);
router.post("/", validate(createOrderSchema), createOrder);
router.patch("/:id/status", validate(updateOrderStatusSchema), updateOrderStatus);
router.patch("/:id/payment", validate(updatePaymentStatusSchema), updatePaymentStatus);

export default router;
