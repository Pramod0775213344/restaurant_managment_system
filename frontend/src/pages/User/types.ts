export type Access =
  | "Admin"
  | "Manager"
  | "Cashier"
  | "Kitchen Staff"
  | "Inventory Staff";

export type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  access: Access[];
  role?: string;
  is_active?: boolean;
  lastActive: string; // formatted date, e.g. "2024-03-04"
  dateAdded: string;
  createdAt?: string;
  updatedAt?: string;
};

export type UserFormData = {
  name: string;
  email: string;
  avatar?: string;
  access: Access[];
  password?: string;
  role?: string;
  is_active?: boolean;
};

export type UserTableProps = {
  users: User[];
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  pageSize?: number;
  isLoading?: boolean;
};

export type UserFormProps = {
  initialData?: User | null;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
};

export type UserDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser?: User | null;
  onSubmit: (data: UserFormData) => void;
  isLoading?: boolean;
};

export type AccessBadgeConfig = {
  badge: string;
  dot: string;
  label: string;
};