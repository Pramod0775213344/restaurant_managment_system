import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import MenuItemForm from "./MenuItemForm";
import type { MenuItem, MenuItemFormData, MenuCategory } from "../types";

export interface MenuItemDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: MenuItem | null;
  categories: MenuCategory[];
  onSubmit: (data: MenuItemFormData) => Promise<boolean>;
  isLoading?: boolean;
}

export function MenuItemDrawer({
  open,
  onOpenChange,
  editingItem,
  categories,
  onSubmit,
  isLoading = false,
}: MenuItemDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{editingItem ? "Edit Menu Item" : "Add Menu Item"}</DrawerTitle>
          <DrawerDescription>
            {editingItem
              ? "Update the details for this menu item."
              : "Add a new delicious item to your restaurant menu."}
          </DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto p-4">
          <MenuItemForm
            key={editingItem?.id ?? "new-item"}
            initialData={editingItem}
            categories={categories}
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

export default MenuItemDrawer;
