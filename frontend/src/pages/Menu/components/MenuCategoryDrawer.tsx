import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import MenuCategoryForm from "./MenuCategoryForm";
import type { MenuCategory, MenuCategoryFormData } from "../types";

export interface MenuCategoryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory: MenuCategory | null;
  onSubmit: (data: MenuCategoryFormData) => Promise<boolean>;
  isLoading?: boolean;
}

export function MenuCategoryDrawer({
  open,
  onOpenChange,
  editingCategory,
  onSubmit,
  isLoading = false,
}: MenuCategoryDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{editingCategory ? "Edit Category" : "Add Category"}</DrawerTitle>
          <DrawerDescription>
            {editingCategory
              ? "Update menu category details."
              : "Create a new menu category for your restaurant."}
          </DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto p-4">
          <MenuCategoryForm
            key={editingCategory?.id ?? "new-category"}
            initialData={editingCategory}
            onSubmit={async (data) => {
              const ok = await onSubmit(data);
              if (ok) onOpenChange(false);
              return ok;
            }}
            onCancel={() => onOpenChange(false)}
            isLoading={isLoading}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default MenuCategoryDrawer;
