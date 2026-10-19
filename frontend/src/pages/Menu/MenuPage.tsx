import { useState, useMemo } from "react";
import { Plus, RotateCw, Search, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCrud } from "@/hooks/useCrud";
import type { MenuCategory, MenuCategoryFormData, MenuItem, MenuItemFormData } from "./types";
import {
  MenuItemCard,
  CategoryTabs,
  MenuItemDrawer,
  MenuItemDetailDrawer,
  MenuCategoryDrawer,
  MenuItemSkeleton,
} from "./components";

export default function MenuPage() {
  const [search, setSearch] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  // Detail view state for selected menu item
  const [selectedDetailItem, setSelectedDetailItem] = useState<MenuItem | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  const handleViewDetails = (item: MenuItem) => {
    setSelectedDetailItem(item);
    setIsDetailDrawerOpen(true);
  };

  // Categories CRUD
  const {
    items: categories,
    refetch: refetchCategories,
    isDrawerOpen: isCatDrawerOpen,
    setIsDrawerOpen: setCatDrawerOpen,
    editingItem: editingCategory,
    openCreate: openCreateCategory,
    handleSave: handleSaveCategory,
    isSaving: isCatSaving,
  } = useCrud<MenuCategory, MenuCategoryFormData>({
    endpoint: "/api/menu/categories",
    entityName: "Category",
  });

  // Menu Items CRUD (Scoped to cards only)
  const {
    items: menuItems,
    isLoading: itemLoading,
    refetch: refetchItems,
    isDrawerOpen: isItemDrawerOpen,
    setIsDrawerOpen: setItemDrawerOpen,
    editingItem,
    openCreate: openCreateItem,
    openEdit: openEditItem,
    handleSave: handleSaveItem,
    handleDelete: handleDeleteItem,
    isSaving: isItemSaving,
  } = useCrud<MenuItem, MenuItemFormData>({
    endpoint: "/api/menu/items",
    entityName: "Menu Item",
  });

  // Save handler that refreshes ONLY the cards grid
  const handleSaveItemWithCardRefresh = async (formData: MenuItemFormData) => {
    const ok = await handleSaveItem(formData);
    if (ok) {
      await refetchItems();
    }
    return ok;
  };

  // Delete handler that refreshes ONLY the cards grid
  const handleDeleteItemWithCardRefresh = async (item: MenuItem) => {
    const ok = await handleDeleteItem(item);
    if (ok) {
      await refetchItems();
    }
    return ok;
  };

  // Category save handler
  const handleSaveCategoryWithRefresh = async (formData: MenuCategoryFormData) => {
    const ok = await handleSaveCategory(formData);
    if (ok) {
      await refetchCategories();
    }
    return ok;
  };

  // Filter items by category and search
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        activeCategoryId === null || item.categoryId === activeCategoryId;
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        (item.description ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (item.categoryName ?? "").toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, activeCategoryId, search]);

  // Category item counts
  const categoryCountMap = useMemo(() => {
    const map: Record<number, number> = {};
    menuItems.forEach((item) => {
      map[item.categoryId] = (map[item.categoryId] ?? 0) + 1;
    });
    return map;
  }, [menuItems]);

  const activeCategoryName = categories.find((c) => c.id === activeCategoryId)?.name;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="animate-smooth-fade" style={{ animationDelay: "0ms" }}>
        <h2 className="text-xl font-semibold tracking-tight">Menu Management</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Manage your restaurant menu categories and items.
        </p>
      </div>

      {/* Toolbar */}
      <div
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between animate-smooth-fade"
        style={{ animationDelay: "60ms" }}
      >
        {/* Left: count indicator */}
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{filteredItems.length}</span>{" "}
          item{filteredItems.length !== 1 ? "s" : ""}
          {activeCategoryName && (
            <>
              {" "}in{" "}
              <span className="font-medium text-foreground">{activeCategoryName}</span>
            </>
          )}
        </p>

        {/* Right: search + refresh + actions */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search items…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg pl-9"
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            className="rounded-lg shrink-0"
            onClick={() => refetchItems()}
            disabled={itemLoading}
            title="Refresh cards"
          >
            <RotateCw className={`h-4 w-4 ${itemLoading ? "animate-spin text-muted-foreground" : ""}`} />
          </Button>

          <Button variant="outline" className="rounded-lg" onClick={openCreateCategory}>
            <Plus className="mr-1.5 h-4 w-4" />
            Category
          </Button>

          <Button className="rounded-lg bg-black text-white hover:bg-black/90" onClick={openCreateItem}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Category filter tabs */}
      <CategoryTabs
        categories={categories}
        totalItemCount={menuItems.length}
        categoryCountMap={categoryCountMap}
        activeCategoryId={activeCategoryId}
        onSelectCategory={setActiveCategoryId}
      />

      {/* Items grid (Only cards refresh on save/delete/update) */}
      <div className="animate-smooth-fade" style={{ animationDelay: "160ms" }}>
        {itemLoading && menuItems.length === 0 ? (
          <MenuItemSkeleton count={10} />
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
            <UtensilsCrossed className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="font-medium text-muted-foreground">
              {search ? `No items found for "${search}"` : "No menu items yet"}
            </p>
            {!search && (
              <Button className="mt-4 rounded-lg" onClick={openCreateItem}>
                <Plus className="mr-2 h-4 w-4" /> Add your first item
              </Button>
            )}
          </div>
        ) : (
          <div
            className={`grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 transition-opacity duration-200 ${
              itemLoading ? "opacity-60 pointer-events-none" : "opacity-100"
            }`}
          >
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onClick={handleViewDetails}
                onEdit={openEditItem}
                onDelete={handleDeleteItemWithCardRefresh}
              />
            ))}
          </div>
        )}
      </div>

      {/* Slide-over Drawers */}
      <MenuCategoryDrawer
        open={isCatDrawerOpen}
        onOpenChange={setCatDrawerOpen}
        editingCategory={editingCategory}
        onSubmit={handleSaveCategoryWithRefresh}
        isLoading={isCatSaving}
      />

      {/* Edit / Create Item Drawer */}
      <MenuItemDrawer
        open={isItemDrawerOpen}
        onOpenChange={setItemDrawerOpen}
        editingItem={editingItem}
        categories={categories}
        onSubmit={handleSaveItemWithCardRefresh}
        isLoading={isItemSaving}
      />

      {/* Item Detail View Drawer (opened when clicking on item card) */}
      <MenuItemDetailDrawer
        open={isDetailDrawerOpen}
        onOpenChange={setIsDetailDrawerOpen}
        item={selectedDetailItem}
        categories={categories}
        onEdit={openEditItem}
        onDelete={handleDeleteItemWithCardRefresh}
      />
    </div>
  );
}
