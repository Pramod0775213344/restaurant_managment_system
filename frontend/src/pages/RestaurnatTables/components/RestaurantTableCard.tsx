import { Edit2, Trash2 } from "lucide-react";
import type { RestaurantTable } from "../types";

interface RestaurantTableCardProps {
  table: RestaurantTable;
  onEdit: (table: RestaurantTable) => void;
  onDelete: (id: number) => void;
}

export default function RestaurantTableCard({
  table,
  onEdit,
  onDelete,
}: RestaurantTableCardProps) {
  // Calculate size label from capacity
  const sizeLabel =
    table.capacity <= 2 ? "Small" : table.capacity <= 5 ? "Medium" : "Large";

  // Order number display (e.g. #ORD-003 or custom orderNo)
  const orderNumber =
    table.orderNo ||
    table.currentOrderNo ||
    (!table.isAvailable ? `#ORD-${String(table.id).padStart(3, "0")}` : null);

  // Determine chair layout based on capacity
  const topChairs = Math.min(2, Math.ceil(table.capacity / 3));
  const bottomChairs = topChairs;
  const hasSideChairs = table.capacity >= 5;

  return (
    <div
      onClick={() => onEdit(table)}
      className="group relative flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-gray-200 cursor-pointer"
    >
      {/* Top Header: Table Graphic + Status Badge */}
      <div className="flex items-start justify-between">
        {/* Table & Chairs Illustration */}
        <div className="relative flex items-center justify-center p-2">
          <svg
            width="120"
            height="86"
            viewBox="0 0 120 86"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="select-none"
          >
            {/* Top Chairs */}
            {topChairs >= 1 && (
              <g>
                <rect x="36" y="6" width="18" height="9" rx="4.5" fill="#F6C5B8" />
                <rect x="38" y="10" width="14" height="2" rx="1" fill="#FFFFFF" fillOpacity="0.4" />
              </g>
            )}
            {topChairs >= 2 && (
              <g>
                <rect x="66" y="6" width="18" height="9" rx="4.5" fill="#F6C5B8" />
                <rect x="68" y="10" width="14" height="2" rx="1" fill="#FFFFFF" fillOpacity="0.4" />
              </g>
            )}

            {/* Bottom Chairs */}
            {bottomChairs >= 1 && (
              <g>
                <rect x="36" y="71" width="18" height="9" rx="4.5" fill="#F6C5B8" />
                <rect x="38" y="74" width="14" height="2" rx="1" fill="#FFFFFF" fillOpacity="0.4" />
              </g>
            )}
            {bottomChairs >= 2 && (
              <g>
                <rect x="66" y="71" width="18" height="9" rx="4.5" fill="#F6C5B8" />
                <rect x="68" y="74" width="14" height="2" rx="1" fill="#FFFFFF" fillOpacity="0.4" />
              </g>
            )}

            {/* Left Chair */}
            {hasSideChairs && (
              <g>
                <rect x="8" y="34" width="9" height="18" rx="4.5" fill="#F6C5B8" />
                <rect x="12" y="36" width="2" height="14" rx="1" fill="#FFFFFF" fillOpacity="0.4" />
              </g>
            )}

            {/* Right Chair */}
            {hasSideChairs && (
              <g>
                <rect x="103" y="34" width="9" height="18" rx="4.5" fill="#F6C5B8" />
                <rect x="106" y="36" width="2" height="14" rx="1" fill="#FFFFFF" fillOpacity="0.4" />
              </g>
            )}

            {/* Center Dining Table */}
            <rect
              x="22"
              y="19"
              width="76"
              height="48"
              rx="10"
              fill="#FDF2EE"
              stroke="#FCE3DB"
              strokeWidth="1.5"
            />

            {/* Table Number Label */}
            <text
              x="60"
              y="48"
              textAnchor="middle"
              fill="#1F2937"
              fontSize="14"
              fontWeight="700"
              letterSpacing="0.3"
            >
              {table.tableNo}
            </text>
          </svg>
        </div>

        {/* Status Badge + Quick Action buttons */}
        <div className="flex flex-col items-end gap-2">
          {table.isAvailable ? (
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600 border border-emerald-100">
              Available
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600 border border-rose-100">
              Reserved
            </span>
          )}

          {/* Action buttons (revealed on hover) */}
          <div
            className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => onEdit(table)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
              title="Edit Table"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(table.id)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Delete Table"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Footer Info */}
      <div className="mt-4 flex items-center justify-between pt-2">
        <div className="flex items-center gap-4 text-sm font-medium text-gray-800">
          <span>{sizeLabel}</span>
          <span>{table.capacity} Person</span>
        </div>
        {orderNumber ? (
          <div className="text-base font-semibold text-[#E04F26]">
            {orderNumber}
          </div>
        ) : (
          <div className="text-xs font-normal text-muted-foreground">
            No Order
          </div>
        )}
      </div>
    </div>
  );
}
