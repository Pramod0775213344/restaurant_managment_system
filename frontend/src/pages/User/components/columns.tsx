import type { ColumnDef } from "@tanstack/react-table";
import { AtSign, CircleUserRound, Pencil, ShieldCheck, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { cn } from "cn";
import type { AccessBadgeConfig, User } from "../types";

const accessConfig: Record<string, AccessBadgeConfig> = {
  Admin: {
    badge: "bg-gray-100 text-gray-700",
    dot: "bg-emerald-500",
    label: "Admin",
  },
  Manager: {
    badge: "bg-purple-100 text-purple-700",
    dot: "bg-purple-500",
    label: "Manager",
  },
  Cashier: {
    badge: "bg-sky-100 text-sky-700",
    dot: "bg-sky-500",
    label: "Cashier",
  },
  "Kitchen Staff": {
    badge: "bg-orange-100 text-orange-700",
    dot: "bg-orange-500",
    label: "Kitchen Staff",
  },
  "Inventory Staff": {
    badge: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
    label: "Inventory Staff",
  },
};

const fallbackBadge = {
  badge: "bg-gray-100 text-gray-700",
  dot: "bg-gray-400",
};

const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

export function getUserColumns({onEdit,onDelete,}: {onEdit?: (user: User) => void;onDelete?: (user: User) => void;} = {}): ColumnDef<User>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={`Select ${row.original.name}`}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <div className="inline-flex items-center gap-1.5">
          <CircleUserRound className="size-3.5 text-gray-400" />
          <DataTableColumnHeader column={column} title="Full name" />
        </div>
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2.5">
            <Avatar className="size-8 rounded-full border border-gray-100 shrink-0">
              <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
              <AvatarFallback className="bg-gray-100 text-xs font-semibold text-gray-600">
                {initials(user.name)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
              {user.name}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <div className="inline-flex items-center gap-1.5">
          <AtSign className="size-3.5 text-gray-400" />
          <DataTableColumnHeader column={column} title="Email" />
        </div>
      ),
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">{row.getValue("email")}</span>
      ),
    },
    {
      accessorKey: "access",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => {
        const accessList = row.original.access || [];
        return (
          <div className="flex flex-wrap gap-1.5">
            {accessList.map((acc) => {
              const cfg = accessConfig[acc] ?? fallbackBadge;
              return (
                <span
                  key={acc}
                  className={cn(
                    "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold tracking-wide",
                    cfg.badge
                  )}
                >
                  {acc}
                </span>
              );
            })}
          </div>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      cell: () => {
        const isActive = true;
        return (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-medium",
              isActive ? "text-emerald-700" : "text-gray-400"
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                isActive ? "bg-emerald-500" : "bg-gray-300"
              )}
            />
            {isActive ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    {
      accessorKey: "dateAdded",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Joined date" />
      ),
      sortingFn: (rowA, rowB, columnId) => {
        const timeA = new Date(rowA.getValue(columnId) || 0).getTime() || 0;
        const timeB = new Date(rowB.getValue(columnId) || 0).getTime() || 0;
        return timeA - timeB;
      },
      cell: ({ row }) => (
        <span className="text-sm text-gray-500 whitespace-nowrap">
          {row.getValue("dateAdded")}
        </span>
      ),
    },
    {
      id: "twoFactorAuth",
      header: ({ column }) => (
        <div className="inline-flex items-center gap-1.5">
          <ShieldCheck className="size-3.5 text-gray-400" />
          <DataTableColumnHeader column={column} title="2F Auth" />
        </div>
      ),
      cell: () => (
        <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
          Enabled
        </span>
      ),
    },
    {
      id: "actions",
      header: () => (
        <div className="text-right text-xs font-medium uppercase tracking-wide text-gray-500">
          Actions
        </div>
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              onClick={() => onEdit?.(user)}
              className="h-7 px-2 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 gap-1"
            >
              <Pencil className="size-3" />
              Edit
            </Button>
            <Button
              variant="ghost"
              onClick={() => onDelete?.(user)}
              className="h-7 px-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 gap-1"
            >
              <Trash2 className="size-3" />
              Delete
            </Button>
          </div>
        );
      },
    },
  ];
}
