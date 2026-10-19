// ─── Menu Category ──────────────────────────────────────────
export interface MenuCategory {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export type MenuCategoryFormData = {
  name: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
};

// ─── Menu Item ──────────────────────────────────────────────
export interface MenuItem {
  id: number;
  categoryId: number;
  categoryName: string | null;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  isActive: boolean;
  preparationTime: number | null;
  createdAt: string;
  updatedAt: string;
}

export type MenuItemFormData = {
  categoryId: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable?: boolean;
  isActive?: boolean;
  preparationTime?: number;
};
