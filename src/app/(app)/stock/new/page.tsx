"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { PageHeader } from "@/components/layout/page-header";
import { FormField } from "@/components/forms/form-field";
import { FormFooter } from "@/components/forms/form-footer";
import { useInventoryItems } from "@/lib/firestore/inventory";
import { createStockMovement } from "@/lib/firestore/stock";
import { formatDateDisplay } from "@/lib/format";
import { type StockMovementType } from "@/lib/mock-data";

export default function NewStockEntryPage() {
  const router = useRouter();
  const { items, loading: itemsLoading } = useInventoryItems();

  const [itemId, setItemId] = useState("");
  const [type, setType] = useState<StockMovementType>("in");
  const [quantity, setQuantity] = useState("0");
  const [reference, setReference] = useState("");
  const [performedBy, setPerformedBy] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedItemId = itemId || items[0]?.id || "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const item = items.find((i) => i.id === selectedItemId);
    if (!item) {
      setError("Select an item before recording this entry.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await createStockMovement(
        {
          itemName: item.name,
          type,
          quantity: Number(quantity) || 0,
          unit: item.unit,
          date: formatDateDisplay(new Date().toISOString().slice(0, 10)),
          reference,
          performedBy,
          ...(notes ? { notes } : {}),
        },
        item.id
      );
      router.push("/stock");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not record entry. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        backHref="/stock"
        title="New Stock Entry"
        description="Record a stock in, stock out, or manual adjustment"
      />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Item" htmlFor="stock-item" required className="sm:col-span-2">
                <NativeSelect
                  id="stock-item"
                  value={selectedItemId}
                  onChange={(e) => setItemId(e.target.value)}
                  disabled={itemsLoading || items.length === 0}
                  required
                >
                  {items.length === 0 && <option value="">No inventory items yet</option>}
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.sku})
                    </option>
                  ))}
                </NativeSelect>
              </FormField>

              <FormField label="Movement Type" htmlFor="stock-type" required>
                <NativeSelect
                  id="stock-type"
                  value={type}
                  onChange={(e) => setType(e.target.value as StockMovementType)}
                  required
                >
                  <option value="in">Stock In</option>
                  <option value="out">Stock Out</option>
                  <option value="adjustment">Adjustment</option>
                </NativeSelect>
              </FormField>

              <FormField label="Quantity" htmlFor="stock-quantity" required>
                <Input
                  id="stock-quantity"
                  type="number"
                  min={0}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Reference" htmlFor="stock-reference">
                <Input
                  id="stock-reference"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. PO-1182 or ORD-3301"
                />
              </FormField>

              <FormField label="Performed By" htmlFor="stock-performer">
                <Input
                  id="stock-performer"
                  value={performedBy}
                  onChange={(e) => setPerformedBy(e.target.value)}
                  placeholder="e.g. Riya Sharma"
                />
              </FormField>

              <FormField label="Notes" htmlFor="stock-notes" className="sm:col-span-2">
                <Textarea
                  id="stock-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional notes about this stock movement"
                />
              </FormField>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <FormFooter cancelHref="/stock" saving={saving} saveLabel="Record Entry" />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
