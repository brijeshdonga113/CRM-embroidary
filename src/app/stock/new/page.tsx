"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { PageHeader } from "@/components/layout/page-header";
import { FormField } from "@/components/forms/form-field";
import { FormFooter } from "@/components/forms/form-footer";
import { useFakeSubmit } from "@/hooks/use-fake-submit";
import { inventoryItems } from "@/lib/mock-data";

export default function NewStockEntryPage() {
  const { saving, submit } = useFakeSubmit("/stock");

  return (
    <div className="space-y-6">
      <PageHeader
        backHref="/stock"
        title="New Stock Entry"
        description="Record a stock in, stock out, or manual adjustment"
      />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={submit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Item" htmlFor="stock-item" required className="sm:col-span-2">
                <NativeSelect id="stock-item" defaultValue={inventoryItems[0]?.name} required>
                  {inventoryItems.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name} ({item.sku})
                    </option>
                  ))}
                </NativeSelect>
              </FormField>

              <FormField label="Movement Type" htmlFor="stock-type" required>
                <NativeSelect id="stock-type" defaultValue="in" required>
                  <option value="in">Stock In</option>
                  <option value="out">Stock Out</option>
                  <option value="adjustment">Adjustment</option>
                </NativeSelect>
              </FormField>

              <FormField label="Quantity" htmlFor="stock-quantity" required>
                <Input id="stock-quantity" type="number" min={0} placeholder="0" required />
              </FormField>

              <FormField label="Reference" htmlFor="stock-reference">
                <Input id="stock-reference" placeholder="e.g. PO-1182 or ORD-3301" />
              </FormField>

              <FormField label="Performed By" htmlFor="stock-performer">
                <Input id="stock-performer" placeholder="e.g. Riya Sharma" />
              </FormField>

              <FormField label="Notes" htmlFor="stock-notes" className="sm:col-span-2">
                <Textarea id="stock-notes" rows={3} placeholder="Optional notes about this stock movement" />
              </FormField>
            </div>

            <FormFooter cancelHref="/stock" saving={saving} saveLabel="Record Entry" />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
