import { useState, type FormEvent, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UnsplashImagePicker from "./UnsplashImagePicker";
import type { MenuItem, MenuItemFormData, MenuCategory } from "../types";

export interface MenuItemFormProps {
  initialData?: MenuItem | null;
  categories: MenuCategory[];
  onSubmit: (data: MenuItemFormData) => Promise<boolean>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function MenuItemForm({
  initialData,
  categories,
  onSubmit,
  onCancel,
  isLoading = false,
}: MenuItemFormProps) {
  const [form, setForm] = useState<MenuItemFormData>(() => ({
    categoryId: initialData?.categoryId ?? (categories[0]?.id ?? 0),
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    price: initialData?.price ?? 0,
    imageUrl: initialData?.imageUrl ?? "",
    isAvailable: initialData?.isAvailable ?? true,
    isActive: initialData?.isActive ?? true,
    preparationTime: initialData?.preparationTime ?? undefined,
  }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const resolvedCategoryId = form.categoryId || (categories.length > 0 ? categories[0].id : 0);
    await onSubmit({ ...form, categoryId: resolvedCategoryId });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Category */}
      <div className="space-y-1.5">
        <Label>Category *</Label>
        <Select
          value={form.categoryId ? String(form.categoryId) : (categories[0]?.id ? String(categories[0].id) : "")}
          onValueChange={(val: string) =>
            setForm((f) => ({ ...f, categoryId: parseInt(val, 10) || 0 }))
          }
        >
          <SelectTrigger id="item-category">
            <SelectValue placeholder="Select category">
              {categories.find((c) => c.id === (form.categoryId || categories[0]?.id))?.name}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="item-name">Item Name *</Label>
        <Input
          id="item-name"
          value={form.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setForm((f) => ({ ...f, name: e.target.value }))
          }
          placeholder="e.g. Chicken Lollipop"
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="item-desc">Description</Label>
        <Textarea
          id="item-desc"
          value={form.description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          placeholder="Short description…"
          rows={3}
        />
      </div>

      {/* Price + Prep time row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="item-price">Price (Rs.) *</Label>
          <Input
            id="item-price"
            type="number"
            min={0}
            step="0.01"
            value={form.price || ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))
            }
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="item-prep">Prep Time (min)</Label>
          <Input
            id="item-prep"
            type="number"
            min={0}
            value={form.preparationTime ?? ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setForm((f) => ({
                ...f,
                preparationTime: e.target.value ? parseInt(e.target.value) : undefined,
              }))
            }
            placeholder="e.g. 15"
          />
        </div>
      </div>

      {/* Image Selection with Unsplash */}
      <div className="space-y-2 pt-1">
        <Label htmlFor="item-image">Item Photo</Label>
        <UnsplashImagePicker
          initialQuery={form.name}
          currentImageUrl={form.imageUrl}
          onSelectImage={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
        />
        <Input
          id="item-image"
          value={form.imageUrl ?? ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setForm((f) => ({ ...f, imageUrl: e.target.value }))
          }
          placeholder="Or paste custom image URL..."
          className="text-xs h-8 text-muted-foreground"
        />
      </div>

      {/* Switches */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="space-y-0.5">
            <Label htmlFor="item-avail" className="cursor-pointer text-sm font-medium">
              Available for Ordering
            </Label>
            <p className="text-xs text-muted-foreground">Kitchen can take orders for this item</p>
          </div>
          <Switch
            id="item-avail"
            checked={form.isAvailable}
            onCheckedChange={(checked: boolean) =>
              setForm((f) => ({ ...f, isAvailable: Boolean(checked) }))
            }
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="space-y-0.5">
            <Label htmlFor="item-active" className="cursor-pointer text-sm font-medium">
              Active Item
            </Label>
            <p className="text-xs text-muted-foreground">Display this item on the menu</p>
          </div>
          <Switch
            id="item-active"
            checked={form.isActive}
            onCheckedChange={(checked: boolean) =>
              setForm((f) => ({ ...f, isActive: Boolean(checked) }))
            }
          />
        </div>
      </div>

      <div className="flex gap-2 pt-3">
        <Button type="button" className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" className="w-full bg-gray-800 text-white px-5 font-medium shadow-xs hover:bg-gray-700"
          disabled={isLoading}>
          {isLoading ? "Saving…" : initialData ? "Update Item" : "Add Item"}
        </Button>
      </div>
    </form>
  );
}
