"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { PageHeader } from "@/components/layout/page-header";
import { FormField } from "@/components/forms/form-field";
import { FormFooter } from "@/components/forms/form-footer";
import { createInventoryItem } from "@/lib/firestore/inventory";
import { uploadDesignFile } from "@/lib/storage";
import { type InventoryCategory } from "@/lib/mock-data";

export default function NewInventoryItemPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState<InventoryCategory>("Thread");
  const [unit, setUnit] = useState("");
  const [supplier, setSupplier] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [reorderLevel, setReorderLevel] = useState("0");
  const [unitCost, setUnitCost] = useState("0");
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const designFileUrl = designFile ? await uploadDesignFile(designFile) : undefined;
      await createInventoryItem(
        {
          name,
          sku,
          category,
          unit,
          supplier,
          quantity: Number(quantity) || 0,
          reorderLevel: Number(reorderLevel) || 0,
          unitCost: Number(unitCost) || 0,
        },
        designFileUrl
      );
      router.push("/inventory");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add item. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        backHref="/inventory"
        title="Add Inventory Item"
        description="Add a new material, accessory, or design to the catalog"
      />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Item Name" htmlFor="item-name" required className="sm:col-span-2">
                <Input
                  id="item-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Gold Metallic Thread"
                  required
                />
              </FormField>

              <FormField label="SKU" htmlFor="item-sku" required>
                <Input id="item-sku" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="e.g. TH-GLD-40" required />
              </FormField>

              <FormField label="Category" htmlFor="item-category" required>
                <NativeSelect
                  id="item-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as InventoryCategory)}
                  required
                >
                  <option value="Thread">Thread</option>
                  <option value="Fabric">Fabric</option>
                  <option value="Backing">Backing</option>
                  <option value="Accessory">Accessory</option>
                  <option value="Design">Design</option>
                </NativeSelect>
              </FormField>

              <FormField label="Unit" htmlFor="item-unit" required>
                <Input
                  id="item-unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="e.g. spools, meters, rolls"
                  required
                />
              </FormField>

              <FormField label="Supplier" htmlFor="item-supplier">
                <Input id="item-supplier" value={supplier} onChange={(e) => setSupplier(e.target.value)} placeholder="e.g. Madeira India" />
              </FormField>

              <FormField label="Quantity in Stock" htmlFor="item-quantity" required>
                <Input
                  id="item-quantity"
                  type="number"
                  min={0}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Reorder Level" htmlFor="item-reorder">
                <Input id="item-reorder" type="number" min={0} value={reorderLevel} onChange={(e) => setReorderLevel(e.target.value)} />
              </FormField>

              <FormField label="Unit Cost (₹)" htmlFor="item-cost" className="sm:col-span-2">
                <Input id="item-cost" type="number" min={0} step="0.01" value={unitCost} onChange={(e) => setUnitCost(e.target.value)} />
              </FormField>

              {category === "Design" && (
                <FormField label="Design File" htmlFor="item-design-file" className="sm:col-span-2">
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="item-design-file"
                      className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed px-3 py-1.5 text-sm text-muted-foreground hover:border-foreground hover:text-foreground"
                    >
                      <Upload className="size-3.5" />
                      {designFile ? designFile.name : "Upload design file"}
                    </label>
                    <input
                      id="item-design-file"
                      type="file"
                      accept=".dst,.pes,.exp,.jef,.png,.jpg,.jpeg,.pdf"
                      className="hidden"
                      onChange={(e) => setDesignFile(e.target.files?.[0] ?? null)}
                    />
                  </div>
                </FormField>
              )}
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <FormFooter cancelHref="/inventory" saving={saving} saveLabel="Add Item" />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
