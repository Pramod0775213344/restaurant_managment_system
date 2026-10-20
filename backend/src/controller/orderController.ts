import { Request, Response } from "express";
import { orderService } from "../services/orderService";
import { OrderStatus, PaymentStatus } from "../types/order";

/* POST /api/orders */
export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const order = await orderService.createOrder(req.body, userId);
    return res.status(201).json(order);
  } catch (err: any) {
    console.error("createOrder error:", err);
    return res.status(400).json({ message: err.message || "Failed to create order" });
  }
};

/* GET /api/orders */
export const getOrders = async (req: Request, res: Response) => {
  try {
    const { status, paymentStatus, tableId, search } = req.query;

    const orders = await orderService.getOrders({
      status: status as OrderStatus,
      paymentStatus: paymentStatus as PaymentStatus,
      tableId: tableId ? parseInt(String(tableId), 10) : undefined,
      search: search ? String(search) : undefined,
    });

    return res.json(orders);
  } catch (err: any) {
    console.error("getOrders error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* GET /api/orders/:id */
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const order = await orderService.getOrderById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.json(order);
  } catch (err: any) {
    console.error("getOrderById error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* PATCH /api/orders/:id/status */
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const { orderStatus } = req.body;
    const updated = await orderService.updateOrderStatus(id, orderStatus);

    return res.json(updated);
  } catch (err: any) {
    console.error("updateOrderStatus error:", err);
    return res.status(400).json({ message: err.message || "Failed to update order status" });
  }
};

/* PATCH /api/orders/:id/payment */
export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const { paymentStatus } = req.body;
    const updated = await orderService.updatePaymentStatus(id, paymentStatus);

    return res.json(updated);
  } catch (err: any) {
    console.error("updatePaymentStatus error:", err);
    return res.status(400).json({ message: err.message || "Failed to update payment status" });
  }
};
