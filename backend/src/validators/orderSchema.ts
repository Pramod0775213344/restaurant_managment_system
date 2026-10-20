import { z } from "zod";

export const orderItemInputSchema = z.object({
  menuItemId: z.coerce.number().int().positive("Menu item ID is required"),
  quantity: z.coerce.number().int().positive("Quantity must be at least 1").default(1),
  notes: z.string().optional().nullable(),
});

export const createOrderSchema = z.object({
  orderNumber: z.string().optional(),
  orderType: z.enum(["DINE_IN", "TAKEAWAY", "DELIVERY"]),
  tableId: z.coerce.number().int().positive("Invalid table ID").optional().nullable(),
  orderStatus: z
    .enum(["PENDING", "CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"])
    .optional()
    .default("PENDING"),
  paymentStatus: z
    .enum(["UNPAID", "PARTIAL", "PAID", "REFUNDED"])
    .optional()
    .default("UNPAID"),
  items: z.array(orderItemInputSchema).min(1, "Order must contain at least one item"),
  discountAmount: z.coerce.number().nonnegative().optional().default(0),
  taxAmount: z.coerce.number().nonnegative().optional().default(0),
  subtotal: z.coerce.number().nonnegative().optional(),
  totalAmount: z.coerce.number().nonnegative().optional(),
});

export const updateOrderStatusSchema = z.object({
  orderStatus: z.enum(["PENDING", "CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"]),
});

export const updatePaymentStatusSchema = z.object({
  paymentStatus: z.enum(["UNPAID", "PARTIAL", "PAID", "REFUNDED"]),
});

export const updateOrderSchema = createOrderSchema.partial();

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type OrderItemInput = z.infer<typeof orderItemInputSchema>;
