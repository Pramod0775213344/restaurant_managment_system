import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import type { RestaurantTable, RestaurantTableFormData } from "../types";
import RestaurantTableForm from "./RestaurnatTableForm";

export interface RestaurantTableDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRestaurantTable: RestaurantTable | null;
  onSubmit: (data: RestaurantTableFormData) => Promise<boolean>;
  isLoading?: boolean;
}

export function RestaurantTableDrawer({
  open,
  onOpenChange,
  editingRestaurantTable,
  onSubmit,
  isLoading = false,
}: RestaurantTableDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{editingRestaurantTable ? "Edit Table" : "Add Table"}</DrawerTitle>
          <DrawerDescription>
            {editingRestaurantTable
              ? "Update restaurant table details."
              : "Create a new restaurant table for your restaurant."}
          </DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto p-4">
          <RestaurantTableForm
            key={editingRestaurantTable?.id ?? "new-table"}
            initialData={editingRestaurantTable}
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

export default RestaurantTableDrawer;