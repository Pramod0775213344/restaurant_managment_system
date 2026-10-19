import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, RotateCw, Search, Utensils } from "lucide-react";
import { useCrud } from "@/hooks/useCrud";
import type { RestaurantTable, RestaurantTableFormData } from "./types";
import RestaurantTableDrawer from "./components/RestaurnatTableDrawer";
import RestaurantTableCard from "./components/RestaurantTableCard";
import RestaurantTableSkeleton from "./components/RestaurantTableSkeleton";

type StatusFilter = "all" | "available" | "reserved";

export default function RestaurantTablePage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

    const {
        items: tables,
        isLoading,
        refetch,
        isDrawerOpen,
        setIsDrawerOpen,
        editingItem: editingTable,
        openCreate,
        openEdit,
        handleSave,
        handleDelete,
        isSaving,
    } = useCrud<RestaurantTable, RestaurantTableFormData>({
        endpoint: "/api/tables",
        entityName: "Table",
        getName: (t) => t.tableNo,
    });

    // Counts for filter tabs
    const counts = useMemo(() => {
        const total = tables.length;
        const available = tables.filter((t) => t.isAvailable).length;
        const reserved = tables.filter((t) => !t.isAvailable).length;
        return { total, available, reserved };
    }, [tables]);

    // Filter tables by search term & availability status
    const filteredTables = useMemo(() => {
        let result = tables;
        if (statusFilter === "available") {
            result = result.filter((t) => t.isAvailable);
        } else if (statusFilter === "reserved") {
            result = result.filter((t) => !t.isAvailable);
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter((t) => t.tableNo.toLowerCase().includes(q));
        }
        return result;
    }, [tables, statusFilter, search]);

    return (
        <div className="space-y-6">
            {/* Title */}
            <div className="animate-smooth-fade" style={{ animationDelay: "0ms" }}>
                <h2 className="text-xl font-semibold tracking-tight">Table Management</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                    Manage and monitor your restaurant dining tables.
                </p>
            </div>

            {/* Filter Tabs (All / Available / Reserved) */}
            <div className="flex gap-2 overflow-x-auto pb-1 animate-smooth-fade scrollbar-none" style={{ animationDelay: "40ms" }}>
                <button
                    onClick={() => setStatusFilter("all")}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                        statusFilter === "all"
                            ? "bg-black text-white shadow-xs font-semibold"
                            : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    }`}
                >
                    All
                    <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none ${
                            statusFilter === "all"
                                ? "bg-white/20 text-white"
                                : "bg-background text-foreground"
                        }`}
                    >
                        {counts.total}
                    </span>
                </button>

                <button
                    onClick={() => setStatusFilter("available")}
                    className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                        statusFilter === "available"
                            ? "bg-emerald-600 text-white shadow-xs font-semibold"
                            : "bg-muted text-muted-foreground hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                >
                    <span className={`h-2 w-2 rounded-full ${statusFilter === "available" ? "bg-white" : "bg-emerald-500"}`} />
                    Available
                    <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none ${
                            statusFilter === "available"
                                ? "bg-white/20 text-white"
                                : "bg-background text-foreground"
                        }`}
                    >
                        {counts.available}
                    </span>
                </button>

                <button
                    onClick={() => setStatusFilter("reserved")}
                    className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                        statusFilter === "reserved"
                            ? "bg-rose-600 text-white shadow-xs font-semibold"
                            : "bg-muted text-muted-foreground hover:bg-rose-50 hover:text-rose-700"
                    }`}
                >
                    <span className={`h-2 w-2 rounded-full ${statusFilter === "reserved" ? "bg-white" : "bg-rose-500"}`} />
                    Reserved
                    <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none ${
                            statusFilter === "reserved"
                                ? "bg-white/20 text-white"
                                : "bg-background text-foreground"
                        }`}
                    >
                        {counts.reserved}
                    </span>
                </button>
            </div>

            {/* Toolbar */}
            <div
                className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between animate-smooth-fade"
                style={{ animationDelay: "60ms" }}
            >
                {/* Left: count indicator */}
                <p className="text-sm text-muted-foreground">
                    {filteredTables.length} {filteredTables.length === 1 ? "table" : "tables"} found
                </p>

                {/* Right: search + refresh + actions */}
                <div className="flex items-center gap-2 flex-wrap justify-end">
                    <div className="relative w-full sm:w-56">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search Table"
                            className="rounded-lg pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-lg shrink-0"
                        title="Refresh tables"
                        onClick={() => refetch()}
                        disabled={isLoading}
                    >
                        <RotateCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    </Button>

                    <Button
                        className="rounded-lg bg-black text-white hover:bg-black/90 shadow-xs"
                        onClick={openCreate}
                    >
                        <Plus className="mr-1.5 h-4 w-4" />
                        Add Table
                    </Button>
                </div>
            </div>

            {/* Cards Grid */}
            {isLoading ? (
                <RestaurantTableSkeleton count={12} />
            ) : filteredTables.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-16 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-600 mb-3">
                        <Utensils className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">No tables found</h3>
                    <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                        {search || statusFilter !== "all"
                            ? "No tables match the selected filters. Try changing or clearing your filter."
                            : "Get started by adding your first restaurant dining table."}
                    </p>
                    {statusFilter !== "all" ? (
                        <Button
                            variant="outline"
                            className="mt-4 rounded-lg"
                            onClick={() => {
                                setStatusFilter("all");
                                setSearch("");
                            }}
                        >
                            Reset Filter
                        </Button>
                    ) : !search ? (
                        <Button
                            className="mt-4 rounded-lg bg-black text-white hover:bg-black/90"
                            onClick={openCreate}
                        >
                            <Plus className="mr-1.5 h-4 w-4" />
                            Add First Table
                        </Button>
                    ) : null}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {filteredTables.map((table) => (
                        <RestaurantTableCard
                            key={table.id}
                            table={table}
                            onEdit={openEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {/* Drawer */}
            <RestaurantTableDrawer
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                editingRestaurantTable={editingTable}
                onSubmit={handleSave}
                isLoading={isSaving}
            />
        </div>
    );
}