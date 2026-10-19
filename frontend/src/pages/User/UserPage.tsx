import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ListFilter, Plus, RotateCw } from "lucide-react";
import UserTable from "./components/UserTable";
import type { User, UserFormData } from "./types";
import UserDrawer from "./components/UserDrawer";
import { useCrud } from "@/hooks/useCrud";


function UserPage() {
  // resusable crud manager
  const {
    items: users,
    isLoading,
    isSaving,
    refetch: fetchUsers,
    isDrawerOpen,
    setIsDrawerOpen,
    editingItem: editingUser,
    openCreate: handleOpenAddUser,
    openEdit,
    handleSave: handleSaveUser,
    handleDelete,
  } = useCrud<User, UserFormData>({
    endpoint: "/api/users",
    entityName: "User",
  });

  // search state
  const [search, setSearch] = useState("");

  // filter the users
  const filteredUsers = users
    .filter((u) => {
      const name = (u.name || "").toLowerCase().trim();
      const email = (u.email || "").toLowerCase().trim();
      return name !== "super admin" && email !== "admin@gmail.com";
    })
    .filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

  // return the user page
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="animate-smooth-fade" style={{ animationDelay: "0ms" }}>
        <h2 className="text-xl font-semibold tracking-tight">User management</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Manage your team members and their account permissions here.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between animate-smooth-fade" style={{ animationDelay: "80ms" }}>
        {/* Left: heading + count */}
        <div>
          <h3 className="text-base font-semibold">
            All users{" "}
            <span className="ml-1 text-muted-foreground">
              {isLoading ? "..." : filteredUsers.length}
            </span>
          </h3>
        </div>

        {/* Right: search + filters + refresh + add */}
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg pl-9"
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            className="rounded-lg shrink-0"
            onClick={fetchUsers}
            disabled={isLoading}
            title="Refresh users"
          >
            <RotateCw className={`h-4 w-4 ${isLoading ? "animate-spin text-muted-foreground" : ""}`} />
          </Button>

          <Button variant="outline" className="rounded-lg">
            <ListFilter className="mr-2 h-4 w-4" />
            Filters
          </Button>

          <Button className="bg-black text-white hover:bg-black/90" onClick={handleOpenAddUser}>
            <Plus className="mr-2 h-4 w-4" />
            Add user
          </Button>
        </div>
      </div>

      <div className="animate-smooth-fade" style={{ animationDelay: "160ms" }}>
        <UserTable
          users={filteredUsers}
          onEdit={openEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>

      {/* Slide-over User Drawer */}
      <UserDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        editingUser={editingUser}
        onSubmit={handleSaveUser}
        isLoading={isSaving}
      />
    </div>
  )
}

export default UserPage
