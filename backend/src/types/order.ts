export type OrderType = "DINE_IN" | "TAKEAWAY" | "DELIVERY";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus = "UNPAID" | "PARTIAL" | "PAID" | "REFUNDED";

export interface OrderItemPayload {
  menuItemId: number;
  quantity: number;
  notes?: string | null;
}
