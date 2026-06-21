"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/layout/page-header";
import { FormField } from "@/components/forms/form-field";
import { FormFooter } from "@/components/forms/form-footer";
import { useInventoryItems } from "@/lib/firestore/inventory";
import { createPurchaseOrder } from "@/lib/firestore/purchase-orders";
import { formatINR } from "@/lib/format";

type LineItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  inventoryItemId: string;
  unit?: string;
};

const CUSTOM_ITEM = "__custom__";

let nextId = 1;
function createLineItem(): LineItem {
  return { id: `line-${nextId++}`, description: "", quantity: 1, rate: 0, inventoryItemId: CUSTOM_ITEM };
}

export default function NewPurchaseOrderPage() {
  const router = useRouter();
  const { items: inventoryItems, loading: inventoryLoading } = useInventoryItems();

  const [supplier, setSupplier] = useState("");
  const [supplierContact, setSupplierContact] = useState("");
  const [supplierPhone, setSupplierPhone] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([createLineItem()]);
  const [taxRate, setTaxRate] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = useMemo(
    () => lineItems.reduce((sum, item) => sum + item.quantity * item.rate, 0),
    [lineItems]
  );
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  function updateLine(id: string, patch: Partial<LineItem>) {
    setLineItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function selectInventoryItem(id: string, inventoryItemId: string) {
    if (inventoryItemId === CUSTOM_ITEM) {
      updateLine(id, { inventoryItemId });
      return;
    }
    const item = inventoryItems.find((i) => i.id === inventoryItemId);
    if (!item) return;
    updateLine(id, { inventoryItemId, description: item.name, rate: item.unitCost, unit: item.unit });
  }

  function addLine() {
    setLineItems((prev) => [...prev, createLineItem()]);
  }

  function removeLine(id: string) {
    setLineItems((prev) => (prev.length > 1 ? prev.filter((item) => item.id !== id) : prev));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supplier.trim()) {
      setError("Enter a supplier name.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await createPurchaseOrder({
        supplier,
        ...(supplierContact ? { supplierContact } : {}),
        ...(supplierPhone ? { supplierPhone } : {}),
        status: "ordered",
        ...(orderDate ? { orderDate } : {}),
        ...(expectedDate ? { expectedDate } : {}),
        lineItems: lineItems.map(({ description, quantity, rate, inventoryItemId, unit }) => ({
          description,
          quantity,
          rate,
          ...(inventoryItemId !== CUSTOM_ITEM ? { inventoryItemId } : {}),
          ...(unit ? { unit } : {}),
        })),
        subtotal,
        taxRate,
        tax,
        amount: total,
        ...(notes ? { notes } : {}),
      });
      router.push("/purchase-orders");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create purchase order. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        backHref="/purchase-orders"
        title="New Purchase Order"
        description="Record stock or materials you're buying from a supplier"
      />

      <Card>
        <CardContent className="space-y-6 pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Supplier" htmlFor="po-supplier" required>
                <Input
                  id="po-supplier"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="e.g. Madeira India"
                  required
                />
              </FormField>
              <FormField label="Supplier Contact" htmlFor="po-supplier-contact">
                <Input
                  id="po-supplier-contact"
                  value={supplierContact}
                  onChange={(e) => setSupplierContact(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                />
              </FormField>
              <FormField label="Supplier Phone" htmlFor="po-supplier-phone">
                <Input
                  id="po-supplier-phone"
                  type="tel"
                  value={supplierPhone}
                  onChange={(e) => setSupplierPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </FormField>
              <FormField label="Order Date" htmlFor="po-order-date">
                <Input id="po-order-date" type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} />
              </FormField>
              <FormField label="Expected Delivery" htmlFor="po-expected-date">
                <Input
                  id="po-expected-date"
                  type="date"
                  value={expectedDate}
                  onChange={(e) => setExpectedDate(e.target.value)}
                />
              </FormField>
            </div>

            <div className="space-y-2">
              <Label>Line Items</Label>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                      <th className="w-44 px-3 py-2 font-medium">Inventory Item</th>
                      <th className="px-3 py-2 font-medium">Description</th>
                      <th className="w-24 px-3 py-2 text-right font-medium">Qty</th>
                      <th className="w-32 px-3 py-2 text-right font-medium">Rate (₹)</th>
                      <th className="w-32 px-3 py-2 text-right font-medium">Amount</th>
                      <th className="w-10 px-3 py-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item) => (
                      <tr key={item.id} className="border-b last:border-0">
                        <td className="px-3 py-2">
                          <NativeSelect
                            value={item.inventoryItemId}
                            onChange={(e) => selectInventoryItem(item.id, e.target.value)}
                            disabled={inventoryLoading}
                          >
                            <option value={CUSTOM_ITEM}>Custom item</option>
                            {inventoryItems.map((inv) => (
                              <option key={inv.id} value={inv.id}>
                                {inv.name}
                              </option>
                            ))}
                          </NativeSelect>
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            value={item.description}
                            onChange={(e) => updateLine(item.id, { description: e.target.value })}
                            placeholder="e.g. Gold Metallic Thread"
                            required
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) => updateLine(item.id, { quantity: Number(e.target.value) })}
                            className="text-right"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            type="number"
                            min={0}
                            step="0.01"
                            value={item.rate}
                            onChange={(e) => updateLine(item.id, { rate: Number(e.target.value) })}
                            className="text-right"
                          />
                        </td>
                        <td className="px-3 py-2 text-right font-medium">
                          {formatINR(item.quantity * item.rate)}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => removeLine(item.id)}
                            disabled={lineItems.length === 1}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addLine} className="gap-1.5">
                <Plus className="size-3.5" />
                Add Line Item
              </Button>
              <p className="text-xs text-muted-foreground">
                Items linked to an existing inventory item will automatically add to that item&rsquo;s stock once
                this order is marked &ldquo;Received&rdquo;.
              </p>
            </div>

            <FormField label="Notes" htmlFor="po-notes">
              <Textarea
                id="po-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Delivery instructions, payment terms, or other notes"
              />
            </FormField>

            <Separator />

            <div className="ml-auto flex w-full max-w-xs flex-col gap-2 text-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  Tax
                  <Input
                    type="number"
                    min={0}
                    step="0.1"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="h-6 w-14 px-1.5 text-right"
                  />
                  %
                </span>
                <span>{formatINR(tax)}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-2 text-base font-semibold">
                <span>Total</span>
                <span>{formatINR(total)}</span>
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <FormFooter cancelHref="/purchase-orders" saving={saving} saveLabel="Create Purchase Order" />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
