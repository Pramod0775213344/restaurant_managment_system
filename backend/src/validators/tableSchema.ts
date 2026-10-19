import { z } from "zod";

export const createTableSchema = z.object({
  tableNo: z.string().min(1, "Table number is required").max(50),
  capacity: z.coerce.number().int().positive("Capacity must be at least 1 person"),
  isAvailable: z.boolean().optional().default(true),
});

export const updateTableSchema = createTableSchema.partial();
