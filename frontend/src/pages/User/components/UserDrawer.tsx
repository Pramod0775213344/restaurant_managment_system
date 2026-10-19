import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import UserForm from "./UserForm";
import type { UserDrawerProps } from "../types";

export type { UserDrawerProps };

const UserDrawer = ({ open, onOpenChange, editingUser, onSubmit, isLoading = false }: UserDrawerProps) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{editingUser ? "Edit User" : "Add User"}</DrawerTitle>
          <DrawerDescription>
            {editingUser
              ? "Update the details for this user."
              : "Fill in the details below to add a new user."}
          </DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto p-4">
          <UserForm
            initialData={editingUser}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
            isLoading={isLoading}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default UserDrawer;
