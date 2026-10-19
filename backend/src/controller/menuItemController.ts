import { Request, Response } from "express";
import { supabase } from "../lib/supabase";

export const formatItem = (i: any) => ({
  id: i.id,
  categoryId: i.category_id,
  categoryName: i.menu_categories?.name ?? null,
  name: i.name,
  description: i.description ?? null,
  price: parseFloat(i.price),
  imageUrl: i.image_url ?? null,
  isAvailable: i.is_available,
  isActive: i.is_active,
  preparationTime: i.preparation_time ?? null,
  createdAt: i.created_at,
  updatedAt: i.updated_at,
});

/* GET /api/menu-items or /api/menu/items (optional ?categoryId=) */
export const getMenuItems = async (req: Request, res: Response) => {
  try {
    let query = supabase
      .from("menu_items")
      .select("*, menu_categories(name)")
      .order("id", { ascending: true });

    if (req.query.categoryId) {
      const categoryId = parseInt(req.query.categoryId as string, 10);
      if (!isNaN(categoryId)) {
        query = query.eq("category_id", categoryId);
      }
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json((data || []).map(formatItem));
  } catch (err: any) {
    console.error("getMenuItems error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* GET /api/menu-items/:id */
export const getMenuItemById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const { data, error } = await supabase
      .from("menu_items")
      .select("*, menu_categories(name)")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ message: "Menu item not found" });
      }
      throw error;
    }

    res.json(formatItem(data));
  } catch (err: any) {
    console.error("getMenuItemById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* POST /api/menu-items */
export const createMenuItem = async (req: Request, res: Response) => {
  try {
    const { categoryId, name, description, price, imageUrl, isAvailable, isActive, preparationTime } =
      req.body;

    if (!categoryId || !name || price === undefined) {
      return res.status(400).json({ message: "categoryId, name, and price are required" });
    }

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("menu_items")
      .insert({
        category_id: categoryId,
        name: name.trim(),
        description: description ?? null,
        price: parseFloat(price),
        image_url: imageUrl ?? null,
        is_available: isAvailable ?? true,
        is_active: isActive ?? true,
        preparation_time: preparationTime ?? null,
        created_at: now,
        updated_at: now,
      })
      .select("*, menu_categories(name)")
      .single();

    if (error) throw error;
    res.status(201).json(formatItem(data));
  } catch (err: any) {
    console.error("createMenuItem error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* PUT /api/menu-items/:id */
export const updateMenuItem = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const { categoryId, name, description, price, imageUrl, isAvailable, isActive, preparationTime } =
      req.body;

    const patch: Record<string, any> = { updated_at: new Date().toISOString() };
    if (categoryId !== undefined) patch.category_id = categoryId;
    if (name !== undefined) patch.name = name.trim();
    if (description !== undefined) patch.description = description;
    if (price !== undefined) patch.price = parseFloat(price);
    if (imageUrl !== undefined) patch.image_url = imageUrl;
    if (isAvailable !== undefined) patch.is_available = Boolean(isAvailable);
    if (isActive !== undefined) patch.is_active = Boolean(isActive);
    if (preparationTime !== undefined) patch.preparation_time = preparationTime;

    const { data, error } = await supabase
      .from("menu_items")
      .update(patch)
      .eq("id", id)
      .select("*, menu_categories(name)")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ message: "Menu item not found" });
      }
      throw error;
    }
    res.json(formatItem(data));
  } catch (err: any) {
    console.error("updateMenuItem error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* DELETE /api/menu-items/:id */
export const deleteMenuItem = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) throw error;
    res.status(204).send();
  } catch (err: any) {
    console.error("deleteMenuItem error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
