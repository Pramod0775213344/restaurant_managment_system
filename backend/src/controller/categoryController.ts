import { Request, Response } from "express";
import { supabase } from "../lib/supabase";

export const formatCategory = (c: any) => ({
  id: c.id,
  name: c.name,
  description: c.description ?? null,
  imageUrl: c.image_url ?? null,
  isActive: c.is_active,
  sortOrder: c.sort_order,
  createdAt: c.created_at,
  updatedAt: c.updated_at,
  itemCount: c.menu_items ? c.menu_items.length : 0,
});

/* GET /api/categories */
export const getCategories = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("menu_categories")
      .select("*, menu_items(id)")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    res.json((data || []).map(formatCategory));
  } catch (err: any) {
    console.error("getCategories error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* POST /api/categories */
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, imageUrl, isActive, sortOrder } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("menu_categories")
      .insert({
        name: name.trim(),
        description: description ?? null,
        image_url: imageUrl ?? null,
        is_active: isActive ?? true,
        sort_order: sortOrder ?? 0,
        created_at: now,
        updated_at: now,
      })
      .select("*, menu_items(id)")
      .single();

    if (error) {
      if (error.code === "23505")
        return res.status(409).json({ message: "Category name already exists" });
      throw error;
    }
    res.status(201).json(formatCategory(data));
  } catch (err: any) {
    console.error("createCategory error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* PUT /api/categories/:id */
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const { name, description, imageUrl, isActive, sortOrder } = req.body;
    const patch: Record<string, any> = { updated_at: new Date().toISOString() };
    if (name !== undefined) patch.name = name.trim();
    if (description !== undefined) patch.description = description;
    if (imageUrl !== undefined) patch.image_url = imageUrl;
    if (isActive !== undefined) patch.is_active = Boolean(isActive);
    if (sortOrder !== undefined) patch.sort_order = sortOrder;

    const { data, error } = await supabase
      .from("menu_categories")
      .update(patch)
      .eq("id", id)
      .select("*, menu_items(id)")
      .single();

    if (error) {
      if (error.code === "PGRST116")
        return res.status(404).json({ message: "Category not found" });
      if (error.code === "23505")
        return res.status(409).json({ message: "Category name already exists" });
      throw error;
    }
    res.json(formatCategory(data));
  } catch (err: any) {
    console.error("updateCategory error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* DELETE /api/categories/:id */
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    // check if any items belong to this category
    const { count } = await supabase
      .from("menu_items")
      .select("id", { count: "exact", head: true })
      .eq("category_id", id);

    if (count && count > 0)
      return res.status(409).json({
        message: `Cannot delete: ${count} menu item(s) still belong to this category.`,
      });

    const { error } = await supabase.from("menu_categories").delete().eq("id", id);
    if (error) throw error;
    res.status(204).send();
  } catch (err: any) {
    console.error("deleteCategory error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
