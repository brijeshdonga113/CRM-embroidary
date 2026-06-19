"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { PageHeader } from "@/components/layout/page-header";
import { FormField } from "@/components/forms/form-field";
import { FormFooter } from "@/components/forms/form-footer";
import { useFakeSubmit } from "@/hooks/use-fake-submit";

export default function NewInventoryItemPage() {
  const { saving, submit } = useFakeSubmit("/inventory");

  return (
    <div className="space-y-6">
      <PageHeader
        backHref="/inventory"
        title="Add Inventory Item"
        description="Add a new material, accessory, or design to the catalog"
      />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={submit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Item Name" htmlFor="item-name" required className="sm:col-span-2">
                <Input id="item-name" placeholder="e.g. Gold Metallic Thread" required />
              </FormField>

              <FormField label="SKU" htmlFor="item-sku" required>
                <Input id="item-sku" placeholder="e.g. TH-GLD-40" required />
              </FormField>

              <FormField label="Category" htmlFor="item-category" required>
                <NativeSelect id="item-category" defaultValue="Thread" required>
                  <option value="Thread">Thread</option>
                  <option value="Fabric">Fabric</option>
                  <option value="Backing">Backing</option>
                  <option value="Accessory">Accessory</option>
                  <option value="Design">Design</option>
                </NativeSelect>
              </FormField>

              <FormField label="Unit" htmlFor="item-unit" required>
                <Input id="item-unit" placeholder="e.g. spools, meters, rolls" required />
              </FormField>

              <FormField label="Supplier" htmlFor="item-supplier">
                <Input id="item-supplier" placeholder="e.g. Madeira India" />
              </FormField>

              <FormField label="Quantity in Stock" htmlFor="item-quantity" required>
                <Input id="item-quantity" type="number" min={0} placeholder="0" required />
              </FormField>

              <FormField label="Reorder Level" htmlFor="item-reorder">
                <Input id="item-reorder" type="number" min={0} placeholder="0" />
              </FormField>

              <FormField label="Unit Cost (₹)" htmlFor="item-cost" className="sm:col-span-2">
                <Input id="item-cost" type="number" min={0} step="0.01" placeholder="0.00" />
              </FormField>
            </div>

            <FormFooter cancelHref="/inventory" saving={saving} saveLabel="Add Item" />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
