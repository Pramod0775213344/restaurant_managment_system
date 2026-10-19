import { useState, type FormEvent, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { RestaurantTable, RestaurantTableFormData } from "../types";

interface RestaurantTableFormProps {
  initialData?: RestaurantTable | null;
  onSubmit: (data: RestaurantTableFormData) => Promise<boolean>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function RestaurantTableForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: RestaurantTableFormProps) {
  const [form, setForm] = useState<RestaurantTableFormData>({
    tableNo: initialData?.tableNo ?? "",
    capacity: initialData?.capacity ?? 2,
    isAvailable: initialData?.isAvailable ?? true,
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Table Number */}
      <div className="space-y-1.5">
        <Label htmlFor="table-no">Table Number *</Label>
        <Input
          id="table-no"
          value={form.tableNo}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setForm((f) => ({ ...f, tableNo: e.target.value }))
          }
          placeholder="e.g. T-01"
          required
        />
      </div>

      {/* Capacity */}
      <div className="space-y-1.5">
        <Label htmlFor="table-capacity">Seating Capacity *</Label>
        <Input
          id="table-capacity"
          type="number"
          min={1}
          value={form.capacity}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setForm((f) => ({ ...f, capacity: parseInt(e.target.value, 10) || 1 }))
          }
          required
        />
      </div>

      {/* Availability Toggle */}
      <div className="flex items-center justify-between rounded-lg border p-3">
        <div className="space-y-0.5">
          <Label htmlFor="table-available" className="cursor-pointer text-sm font-medium">
            Available
          </Label>
          <p className="text-xs text-muted-foreground">
            Is this table available for seating?
          </p>
        </div>
        <Switch
          id="table-available"
          checked={form.isAvailable}
          onCheckedChange={(checked: boolean) =>
            setForm((f) => ({ ...f, isAvailable: Boolean(checked) }))
          }
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3">
        <Button
          type="button"
          className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="w-full bg-gray-800 text-white px-5 font-medium shadow-xs hover:bg-gray-700"
          disabled={isLoading}
        >
          {isLoading ? "Saving…" : initialData ? "Update Table" : "Create Table"}
        </Button>
      </div>
    </form>
  );
}
