import { useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { getUserColumns } from "./columns";
import type { UserTableProps } from "../types";

export default function UserTable({users,onEdit,onDelete,pageSize = 10,isLoading = false,}: UserTableProps) {
  const columns = useMemo(
    () => getUserColumns({ onEdit, onDelete }),
    [onEdit, onDelete]
  );

  return (
    <DataTable
      columns={columns}
      data={users}
      pageSize={pageSize}
      isLoading={isLoading}
      getRowId={(row) => String(row.id)}
    />
  );
}