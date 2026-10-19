import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  Clock,
  UtensilsCrossed,
  Tag,
  Calendar,
  ToggleLeft,
  ToggleRight,
  Pencil,
  Trash2,
  ChefHat,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { MenuItem, MenuCategory } from "../types";

export interface MenuItemDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MenuItem | null;
  categories?: MenuCategory[];
  onEdit?: (item: MenuItem) => void;
  onDelete?: (item: MenuItem) => void;
}

export function MenuItemDetailDrawer({
  open,
  onOpenChange,
  item,
  categories,
  onEdit,
  onDelete,
}: MenuItemDetailDrawerProps) {
  const [imgError, setImgError] = useState(false);
  const [activeItem, setActiveItem] = useState<MenuItem | null>(item);

  // Keep activeItem cached so the drawer content doesn't vanish mid-exit-animation
  useEffect(() => {
    if (item) {
      setActiveItem(item);
      setImgError(false);
    }
  }, [item]);

  const displayItem = item || activeItem;

  const formattedPrice = displayItem
    ? `Rs. ${displayItem.price.toLocaleString("en-LK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : "";

  const formattedDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const categoryName =
    categories?.find((c) => c.id === displayItem?.categoryId)?.name ||
    displayItem?.categoryName ||
    "Uncategorized";

  return (
    <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
      <DrawerContent className="max-w-md w-full flex flex-col h-full bg-background shadow-2xl">
        {displayItem ? (
          <>
            <DrawerHeader className="pb-4 px-6 pt-6">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                  <ChefHat className="h-3.5 w-3.5" />
                  Menu Item Details
                </span>
                <div className="flex items-center gap-2">
                  {displayItem.isAvailable ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" /> In Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 px-2.5 py-0.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
                      <AlertCircle className="h-3 w-3" /> Unavailable
                    </span>
                  )}
                </div>
              </div>
              <DrawerTitle className="text-xl font-bold tracking-tight mt-2 text-foreground">
                {displayItem.name}
              </DrawerTitle>
              <DrawerDescription className="text-xs text-muted-foreground mt-0.5">
                Category: {categoryName}
              </DrawerDescription>
            </DrawerHeader>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Main Visual Image Banner */}
              <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-muted border border-border/50 shadow-sm">
                {displayItem.imageUrl && !imgError ? (
                  <img
                    src={displayItem.imageUrl}
                    alt={displayItem.name}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-muted via-muted/70 to-muted/40 text-muted-foreground">
                    <UtensilsCrossed className="h-12 w-12 stroke-[1.5] text-muted-foreground/40 mb-2" />
                    <span className="text-xs font-medium text-muted-foreground/60">No image available</span>
                  </div>
                )}

                {/* Price Tag Overlay */}
                <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border/60 shadow-md">
                  <span className="text-xs font-medium text-muted-foreground block -mb-0.5">Price</span>
                  <span className="text-lg font-extrabold text-foreground tracking-tight">
                    {formattedPrice}
                  </span>
                </div>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Category */}
                <div className="p-3.5 rounded-xl bg-card border border-border/60 shadow-xs flex flex-col gap-1">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Tag className="h-3.5 w-3.5 text-primary" />
                    Category
                  </span>
                  <span className="text-sm font-semibold truncate text-foreground">
                    {categoryName}
                  </span>
                </div>

                {/* Preparation Time */}
                <div className="p-3.5 rounded-xl bg-card border border-border/60 shadow-xs flex flex-col gap-1">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 text-amber-500" />
                    Prep Time
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {displayItem.preparationTime ? `${displayItem.preparationTime} minutes` : "Not specified"}
                  </span>
                </div>

                {/* Availability */}
                <div className="p-3.5 rounded-xl bg-card border border-border/60 shadow-xs flex flex-col gap-1">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    {displayItem.isAvailable ? (
                      <ToggleRight className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="h-3.5 w-3.5 text-rose-500" />
                    )}
                    Order Status
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {displayItem.isAvailable ? "Available to order" : "Disabled"}
                  </span>
                </div>

                {/* Visibility / Active state */}
                <div className="p-3.5 rounded-xl bg-card border border-border/60 shadow-xs flex flex-col gap-1">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    {displayItem.isActive ? (
                      <Eye className="h-3.5 w-3.5 text-blue-500" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    Menu Visibility
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {displayItem.isActive ? "Visible on menu" : "Hidden from menu"}
                  </span>
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Description & Ingredients
                </h4>
                <div className="p-4 rounded-xl bg-muted/40 border border-border/50 text-sm leading-relaxed text-foreground">
                  {displayItem.description ? (
                    <p className="whitespace-pre-line">{displayItem.description}</p>
                  ) : (
                    <p className="text-muted-foreground italic text-xs">
                      No description provided for this dish.
                    </p>
                  )}
                </div>
              </div>

              {/* Timestamps */}
              {(displayItem.createdAt || displayItem.updatedAt) && (
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-3">
                  {displayItem.createdAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Added {formattedDate(displayItem.createdAt)}
                    </span>
                  )}
                  {displayItem.updatedAt && (
                    <span>Updated {formattedDate(displayItem.updatedAt)}</span>
                  )}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 px-6 bg-card flex items-center justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-lg h-9 px-3.5 text-xs font-medium"
              >
                Close
              </Button>

              <div className="flex items-center gap-2">
                {onDelete && (
                  <Button
                    variant="outline"
                    className="rounded-lg h-9 px-3.5 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 dark:border-rose-900"
                    onClick={() => {
                      onOpenChange(false);
                      onDelete(displayItem);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Delete
                  </Button>
                )}

                {onEdit && (
                  <Button
                    className="rounded-lg h-9 px-3.5 text-xs font-medium bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                    onClick={() => {
                      onOpenChange(false);
                      onEdit(displayItem);
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5 mr-1.5" />
                    Edit Item
                  </Button>
                )}
              </div>
            </div>
          </>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
}

export default MenuItemDetailDrawer;
