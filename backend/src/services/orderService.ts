import { prisma } from "../lib/prisma";
import { CreateOrderInput } from "../validators/orderSchema";
import { OrderStatus, PaymentStatus } from "../types/order";

export class OrderService {
  /**
   * Helper to generate unique order number (e.g. ORD-20261019-1234)
   */
  private generateOrderNumber(): string {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.floor(1000 + Math.random() * 9000);
    return `ORD-${today}-${random}`;
  }

  /**
   * Create a new Order with nested OrderItems and recalculate amounts securely
   */
  async createOrder(data: CreateOrderInput, userId: number) {
    return await (prisma as any).$transaction(async (tx: any) => {
      // 1. Verify table if DINE_IN or tableId provided
      if (data.tableId) {
        const table = await tx.restaurantTable.findUnique({
          where: { id: data.tableId },
        });
        if (!table) {
          throw new Error("Specified restaurant table was not found");
        }
      }

      // 2. Fetch menu items to snapshot name and price
      const menuItemIds = data.items.map((i) => i.menuItemId);
      const menuItems = await tx.menuItem.findMany({
        where: { id: { in: menuItemIds }, isActive: true },
      });

      if (menuItems.length !== menuItemIds.length) {
        throw new Error("One or more selected menu items are invalid or inactive");
      }

      const menuItemMap = new Map<number, any>(menuItems.map((item: any) => [item.id, item]));

      // 3. Build order items & calculate subtotal
      let subtotal = 0;
      const orderItemsData = data.items.map((item) => {
        const menuItem = menuItemMap.get(item.menuItemId)!;
        const unitPrice = Number(menuItem.price);
        const lineTotal = unitPrice * item.quantity;
        subtotal += lineTotal;

        return {
          menuItemId: item.menuItemId,
          itemNameSnapshot: menuItem.name,
          unitPrice,
          quantity: item.quantity,
          lineTotal,
          notes: item.notes || null,
        };
      });

      const discount = data.discountAmount ?? 0;
      const tax = data.taxAmount ?? 0;
      const totalAmount = Math.max(0, subtotal - discount + tax);

      const orderNumber = data.orderNumber || this.generateOrderNumber();

      // 4. Create the Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          orderType: data.orderType,
          tableId: data.tableId || null,
          createdBy: userId,
          orderStatus: data.orderStatus,
          paymentStatus: data.paymentStatus,
          subtotal,
          discountAmount: discount,
          taxAmount: tax,
          totalAmount,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: {
              menuItem: true,
            },
          },
          table: true,
          creator: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      // 5. If table assigned and Dine-in, mark table as occupied
      if (data.tableId && data.orderType === "DINE_IN") {
        await tx.restaurantTable.update({
          where: { id: data.tableId },
          data: { isAvailable: false },
        });
      }

      return newOrder;
    });
  }

  /**
   * Get all orders with optional filter criteria
   */
  async getOrders(filters: {
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    tableId?: number;
    search?: string;
  }) {
    const where: any = {};

    if (filters.status) {
      where.orderStatus = filters.status;
    }

    if (filters.paymentStatus) {
      where.paymentStatus = filters.paymentStatus;
    }

    if (filters.tableId) {
      where.tableId = filters.tableId;
    }

    if (filters.search) {
      where.OR = [
        { orderNumber: { contains: filters.search, mode: "insensitive" } },
        { table: { tableNo: { contains: filters.search, mode: "insensitive" } } },
      ];
    }

    return await (prisma as any).order.findMany({
      where,
      include: {
        items: {
          include: {
            menuItem: {
              select: { id: true, name: true, imageUrl: true },
            },
          },
        },
        table: true,
        creator: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Get order by ID
   */
  async getOrderById(id: number) {
    const order = await (prisma as any).order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        table: true,
        creator: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return order;
  }

  /**
   * Update order status
   */
  async updateOrderStatus(id: number, orderStatus: OrderStatus) {
    return await (prisma as any).$transaction(async (tx: any) => {
      const existing = await tx.order.findUnique({ where: { id } });
      if (!existing) {
        throw new Error("Order not found");
      }

      const updated = await tx.order.update({
        where: { id },
        data: { orderStatus },
        include: {
          items: true,
          table: true,
        },
      });

      // If order is completed or cancelled, release the table if no other active orders exist on it
      if (
        existing.tableId &&
        (orderStatus === "COMPLETED" || orderStatus === "CANCELLED")
      ) {
        const remainingActive = await tx.order.count({
          where: {
            tableId: existing.tableId,
            id: { not: id },
            orderStatus: { in: ["PENDING", "CONFIRMED", "PREPARING", "READY"] },
          },
        });

        if (remainingActive === 0) {
          await tx.restaurantTable.update({
            where: { id: existing.tableId },
            data: { isAvailable: true },
          });
        }
      }

      return updated;
    });
  }

  /**
   * Update payment status
   */
  async updatePaymentStatus(id: number, paymentStatus: PaymentStatus) {
    const existing = await (prisma as any).order.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("Order not found");
    }

    return await (prisma as any).order.update({
      where: { id },
      data: { paymentStatus },
    });
  }
}

export const orderService = new OrderService();
