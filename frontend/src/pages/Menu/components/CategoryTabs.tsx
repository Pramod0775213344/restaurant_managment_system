import type { MenuCategory } from "../types";

export interface CategoryTabsProps {
  categories: MenuCategory[];
  totalItemCount: number;
  categoryCountMap: Record<number, number>;
  activeCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
}

export default function CategoryTabs({
  categories,
  totalItemCount,
  categoryCountMap,
  activeCategoryId,
  onSelectCategory,
}: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 animate-smooth-fade scrollbar-none">
      {/* All Items Tab */}
      <button
        onClick={() => onSelectCategory(null)}
        className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all whitespace-nowrap cursor-pointer
          ${activeCategoryId === null
            ? "bg-foreground text-background shadow-xs font-semibold"
            : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          }`}
      >
        All
        <span
          className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none
            ${activeCategoryId === null
              ? "bg-background/20 text-background"
              : "bg-background text-foreground"
            }`}
        >
          {totalItemCount}
        </span>
      </button>

      {/* Individual Category Tabs */}
      {categories.map((cat) => {
        const count = categoryCountMap[cat.id] ?? 0;
        const isActive = activeCategoryId === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(isActive ? null : cat.id)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all whitespace-nowrap cursor-pointer
              ${isActive
                ? "bg-foreground text-background shadow-xs font-semibold"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
          >
            {cat.name}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none
                ${isActive
                  ? "bg-background/20 text-background"
                  : "bg-background text-foreground"
                }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
