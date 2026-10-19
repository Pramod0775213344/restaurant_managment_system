import { useState, type FormEvent, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { MenuCategory, MenuCategoryFormData } from "../types";

export interface MenuCategoryFormProps {
  initialData?: MenuCategory | null;
  onSubmit: (data: MenuCategoryFormData) => Promise<boolean>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function MenuCategoryForm({ initialData, onSubmit, onCancel, isLoading = false, }: MenuCategoryFormProps) {

  const [form, setForm] = useState<MenuCategoryFormData>(() => ({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    isActive: initialData?.isActive ?? true,
    sortOrder: initialData?.sortOrder ?? 0,
  }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="cat-name">Category Name *</Label>
        <Input
          id="cat-name"
          value={form.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setForm((f) => ({ ...f, name: e.target.value }))
          }
          placeholder="e.g. Starters"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cat-desc">Description</Label>
        <Textarea
          id="cat-desc"
          value={form.description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          placeholder="Short description…"
          rows={3}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cat-sort">Sort Order</Label>
        <Input
          id="cat-sort"
          type="number"
          min={0}
          value={form.sortOrder}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))
          }
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border p-3">
        <div className="space-y-0.5">
          <Label htmlFor="cat-active" className="cursor-pointer text-sm font-medium">
            Active Category
          </Label>
          <p className="text-xs text-muted-foreground">
            Show this category in the restaurant menu
          </p>
        </div>
        <Switch
          id="cat-active"
          checked={form.isActive}
          onCheckedChange={(checked: boolean) =>
            setForm((f) => ({ ...f, isActive: Boolean(checked) }))
          }
        />
      </div>

      <div className="flex gap-2 pt-3">

        <Button type="button" className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" className="w-full bg-gray-800 text-white px-5 font-medium shadow-xs hover:bg-gray-700"
          disabled={isLoading}>
          {isLoading ? "Saving…" : initialData ? "Update Category" : "Create Category"}
        </Button>
      </div>
    </form>
  );
}
