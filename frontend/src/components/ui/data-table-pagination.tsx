import type { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronFirst,
  ChevronLast,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "cn";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSizeOptions?: number[];
  className?: string;
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [5, 8, 10, 20, 50],
  className,
}: DataTablePaginationProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = Math.max(1, table.getPageCount());
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const totalRows = table.getFilteredRowModel().rows.length;

  // Generate numbered pages array with ellipsis
  const getPageNumbers = (): (number | "…")[] => {
    if (pageCount <= 7) {
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    }
    const current = pageIndex + 1;
    const pages: (number | "…")[] = [1];
    if (current > 3) pages.push("…");
    for (
      let i = Math.max(2, current - 1);
      i <= Math.min(pageCount - 1, current + 1);
      i++
    ) {
      pages.push(i);
    }
    if (current < pageCount - 2) pages.push("…");
    pages.push(pageCount);
    return pages;
  };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 bg-white px-4 py-3",
        className
      )}
    >
      {/* Selected count info */}
      <div className="text-xs text-muted-foreground order-2 sm:order-1">
        {selectedCount > 0 ? (
          <span>
            <strong className="font-medium text-foreground">{selectedCount}</strong> of{" "}
            <strong className="font-medium text-foreground">{totalRows}</strong> row(s) selected
          </span>
        ) : (
          <span>
            Total <strong className="font-medium text-foreground">{totalRows}</strong> row(s)
          </span>
        )}
      </div>

      {/* Pagination controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 order-1 sm:order-2">
        {/* Page size selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Rows per page</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="h-8 rounded-md border border-gray-200 bg-transparent px-2 text-xs font-medium text-gray-700 outline-none hover:border-gray-300 focus:border-gray-900 transition-colors"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Page status */}
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          Page {pageIndex + 1} of {pageCount}
        </span>

        {/* Navigation buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            className="size-7"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            title="First page"
          >
            <ChevronFirst className="size-3.5 text-gray-600" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            className="size-7"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            title="Previous page"
          >
            <ChevronLeft className="size-3.5 text-gray-600" />
          </Button>

          {/* Quick page numbers */}
          {getPageNumbers().map((p, idx) =>
            p === "…" ? (
              <span key={`ellipsis-${idx}`} className="px-1 text-xs text-gray-400 select-none">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => table.setPageIndex(p - 1)}
                className={cn(
                  "flex size-7 items-center justify-center rounded-md text-xs font-medium transition-colors",
                  pageIndex + 1 === p
                    ? "bg-gray-900 text-white shadow-xs"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                {p}
              </button>
            )
          )}

          <Button
            variant="outline"
            size="icon-sm"
            className="size-7"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            title="Next page"
          >
            <ChevronRight className="size-3.5 text-gray-600" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            className="size-7"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
            title="Last page"
          >
            <ChevronLast className="size-3.5 text-gray-600" />
          </Button>
        </div>
      </div>
    </div>
  );
}
