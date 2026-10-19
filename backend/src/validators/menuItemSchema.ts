import { z } from "zod";

export const createMenuItemSchema = z.object({
  categoryId: z.number().int().positive("Category is required"),
  name: z.string().min(2, "Item name must be at least 2 characters").max(150),
  description: z.string().optional().nullable(),
  price: z.coerce.number().positive("Price must be greater than zero"),
  imageUrl: z.string().optional().nullable(),
  isAvailable: z.boolean().optional().default(true),
  isActive: z.boolean().optional().default(true),
  preparationTime: z.coerce.number().int().nonnegative().optional().nullable(),
});

export const updateMenuItemSchema = createMenuItemSchema.partial();
