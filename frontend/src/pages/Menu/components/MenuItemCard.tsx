import { useState } from "react";
import { UtensilsCrossed, Clock, ToggleLeft, ToggleRight, Pencil, Trash2 } from "lucide-react";
import type { MenuItem } from "../types";

export interface MenuItemCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
  onClick?: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, onEdit, onDelete, onClick }: MenuItemCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={() => onClick?.(item)}
      className="group relative flex flex-col overflow-hidden rounded-xl bg-card shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer select-none"
    >
      {/* Image Container */}
      <div className="relative h-44 w-full overflow-hidden bg-muted">
        {item.imageUrl && !imgError ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <UtensilsCrossed className="h-10 w-10 text-muted-foreground/40" />
          </div>
        )}

        {/* Availability Badge */}
        <div className="absolute right-2 top-2">
          {item.isAvailable ? (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
              <ToggleRight className="h-3 w-3" /> Available
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-rose-500/90 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
              <ToggleLeft className="h-3 w-3" /> Unavailable
            </span>
          )}
        </div>

        {/* Action Buttons (Show on hover) */}
        <div className="absolute inset-0 flex items-end justify-end gap-1.5 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            className="rounded-lg bg-white/90 p-1.5 text-foreground shadow hover:bg-white transition-colors"
            title="Edit Item"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item);
            }}
            className="rounded-lg bg-rose-500/90 p-1.5 text-white shadow hover:bg-rose-500 transition-colors"
            title="Delete Item"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="truncate font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
              {item.name}
            </p>
            {item.categoryName && (
              <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{item.categoryName}</p>
            )}
          </div>
          <p className="shrink-0 text-base font-bold text-foreground">
            Rs.{item.price.toLocaleString("en-LK", { minimumFractionDigits: 2 })}
          </p>
        </div>

        {item.description && (
          <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
            {item.description}
          </p>
        )}

        {item.preparationTime && (
          <div className="mt-auto flex items-center gap-1 text-[11px] text-muted-foreground pt-1">
            <Clock className="h-3 w-3" />
            <span>{item.preparationTime} min prep</span>
          </div>
        )}
      </div>
    </div>
  );
}
