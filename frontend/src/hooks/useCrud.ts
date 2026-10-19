import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export interface UseCrudOptions<T, TFormData = any> {
  endpoint: string; // e.g. "/api/users" or "/api/categories"
  entityName?: string; // e.g. "User", "Category"
  idKey?: keyof T; // defaults to "id"
  getName?: (item: T | TFormData) => string; // returns display name for toasts, defaults to item.name || item.title
  autoFetch?: boolean; // defaults to true
  transformResponse?: (data: any) => T[]; // optional transformer if data is wrapped
}

export function useCrud<T extends Record<string, any>, TFormData = any>({
  endpoint,
  entityName = "Item",
  idKey = "id" as keyof T,
  getName = (item: any) => item?.name || item?.title || "",
  autoFetch = true,
  transformResponse,
}: UseCrudOptions<T, TFormData>) {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal / Drawer state management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);

  // Fetch all items
  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api(endpoint);
      if (res.ok) {
        const data = await res.json();
        const parsed = transformResponse
          ? transformResponse(data)
          : Array.isArray(data)
            ? data
            : data?.data || [];
        setItems(parsed);
      } else {
        const body = await res.json().catch(() => ({}));
        const msg = body.message || `Failed to load ${entityName.toLowerCase()}s.`;
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      console.error(`Failed to load ${entityName}:`, err);
      const msg = "Cannot connect to server. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, entityName, transformResponse]);

  useEffect(() => {
    if (autoFetch) {
      fetchItems();
    }
  }, [autoFetch, fetchItems]);

  // Modal / Drawer controls
  const openCreate = useCallback(() => {
    setEditingItem(null);
    setIsModalOpen(true);
  }, []);

  const openEdit = useCallback((item: T) => {
    setEditingItem(item);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingItem(null);
  }, []);

  // Save (Create or Update)
  const handleSave = useCallback(
    async (formData: TFormData): Promise<boolean> => {
      const isEdit = Boolean(editingItem);
      const targetId = isEdit ? editingItem![idKey] : undefined;
      const targetEndpoint = isEdit ? `${endpoint}/${targetId}` : endpoint;
      const method = isEdit ? "PUT" : "POST";

      setIsSaving(true);
      try {
        const res = await api(targetEndpoint, {
          method,
          body: JSON.stringify(formData),
        });

        const body = await res.json().catch(() => ({}));

        if (!res.ok) {
          toast.error(body.message || `Failed to save ${entityName.toLowerCase()}.`);
          return false;
        }

        const savedItem: T = body;
        const displayName = getName(savedItem) || getName(formData);

        setItems((prev) =>
          isEdit
            ? prev.map((item) => (item[idKey] === targetId ? savedItem : item))
            : [savedItem, ...prev]
        );

        toast.success(
          displayName
            ? `${entityName} "${displayName}" ${isEdit ? "updated" : "added"} successfully.`
            : `${entityName} ${isEdit ? "updated" : "added"} successfully.`
        );

        setIsModalOpen(false);
        setEditingItem(null);
        return true;
      } catch (err) {
        console.error(`Failed to save ${entityName}:`, err);
        toast.error("Cannot reach the server. Please try again.");
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [editingItem, endpoint, entityName, idKey, getName]
  );

  // Delete
  const handleDelete = useCallback(
    async (itemOrId: T | string | number): Promise<boolean> => {
      const id =
        typeof itemOrId === "object" && itemOrId !== null
          ? itemOrId[idKey]
          : itemOrId;
      const targetItem =
        typeof itemOrId === "object" && itemOrId !== null
          ? itemOrId
          : items.find((i) => i[idKey] === id);

      setIsDeleting(true);
      try {
        const res = await api(`${endpoint}/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          toast.error(body.message || `Failed to delete ${entityName.toLowerCase()}.`);
          return false;
        }

        const displayName = targetItem ? getName(targetItem) : "";
        setItems((prev) => prev.filter((item) => item[idKey] !== id));

        toast.success(
          displayName
            ? `${displayName} deleted.`
            : `${entityName} deleted successfully.`
        );
        return true;
      } catch (err) {
        console.error(`Failed to delete ${entityName}:`, err);
        toast.error("Cannot reach the server. Please try again.");
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [endpoint, entityName, idKey, items, getName]
  );

  return {
    // Data list state
    items,
    setItems,
    isLoading,
    isSaving,
    isDeleting,
    error,
    refetch: fetchItems,

    // Modal / Drawer state and helpers
    isModalOpen,
    setIsModalOpen,
    isDrawerOpen: isModalOpen,
    setIsDrawerOpen: setIsModalOpen,
    editingItem,
    setEditingItem,
    openCreate,
    openEdit,
    closeModal,

    // CRUD Handlers
    handleSave,
    handleDelete,
  };
}
