import { Request, Response } from "express";
import { supabase } from "../lib/supabase";
import { formatCategory, getCategories, createCategory, updateCategory, deleteCategory } from "./categoryController";
import { formatItem, getMenuItems, getMenuItemById, createMenuItem, updateMenuItem, deleteMenuItem } from "./menuItemController";

export {
  formatCategory,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  formatItem,
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};

/* GET /api/menu (Full menu with categories & items) */
export const getFullMenu = async (_req: Request, res: Response) => {
  try {
    const { data: categories, error: catError } = await supabase
      .from("menu_categories")
      .select("*, menu_items(*)")
      .order("sort_order", { ascending: true });

    if (catError) throw catError;

    const formatted = (categories || []).map((cat: any) => ({
      ...formatCategory(cat),
      items: (cat.menu_items || []).map(formatItem),
    }));

    res.json(formatted);
  } catch (err: any) {
    console.error("getFullMenu error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
