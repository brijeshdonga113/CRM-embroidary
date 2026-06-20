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
import { useClients } from "@/lib/firestore/clients";
import { useInventoryItems } from "@/lib/firestore/inventory";
import { createInvoice } from "@/lib/firestore/invoices";
import { formatINR, formatDateDisplay } from "@/lib/format";

type LineItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  inventoryItemId: string;
};

const CUSTOM_ITEM = "__custom__";

let nextId = 1;
function createLineItem(): LineItem {
  return { id: `line-${nextId++}`, description: "", quantity: 1, rate: 0, inventoryItemId: CUSTOM_ITEM };
}

export default function NewInvoicePage() {
  const router = useRouter();
  const { clients, loading: clientsLoading } = useClients();
  const { items: inventoryItems, loading: inventoryLoading } = useInventoryItems();

  const [clientId, setClientId] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([createLineItem()]);
  const [taxRate, setTaxRate] = useState(18);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedClientId = clientId || clients[0]?.id || "";

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
    updateLine(id, {
      inventoryItemId,
      description: item.name,
      rate: item.unitCost,
    });
  }

  function addLine() {
    setLineItems((prev) => [...prev, createLineItem()]);
  }

  function removeLine(id: string) {
    setLineItems((prev) => (prev.length > 1 ? prev.filter((item) => item.id !== id) : prev));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const client = clients.find((c) => c.id === selectedClientId);
    if (!client) {
      setError("Select a client before creating the invoice.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await createInvoice({
        firm: client.name,
        contact: client.contactPerson || client.name,
        amount: total,
        status: "pending",
        dueDate: formatDateDisplay(dueDate),
        initials: client.initials,
        clientId: client.id,
        clientPhone: client.phone,
        invoiceDate: formatDateDisplay(invoiceDate),
        lineItems: lineItems.map(({ description, quantity, rate, inventoryItemId }) => ({
          description,
          quantity,
          rate,
          ...(inventoryItemId !== CUSTOM_ITEM ? { inventoryItemId } : {}),
        })),
        subtotal,
        taxRate,
        tax,
        ...(notes ? { notes } : {}),
      });
      router.push("/billing");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create invoice. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader backHref="/billing" title="New Invoice" description="Bill a firm or individual client" />

      <Card>
        <CardContent className="space-y-6 pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormField label="Client" htmlFor="invoice-client" required>
                <NativeSelect
                  id="invoice-client"
                  value={selectedClientId}
                  onChange={(e) => setClientId(e.target.value)}
                  disabled={clientsLoading || clients.length === 0}
                  required
                >
                  {clients.length === 0 && <option value="">No clients yet</option>}
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </NativeSelect>
              </FormField>
              <FormField label="Invoice Date" htmlFor="invoice-date" required>
                <Input
                  id="invoice-date"
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  required
                />
              </FormField>
              <FormField label="Due Date" htmlFor="invoice-due" required>
                <Input
                  id="invoice-due"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
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
                            placeholder="e.g. Logo embroidery – left chest"
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
            </div>

            <FormField label="Notes" htmlFor="invoice-notes">
              <Textarea
                id="invoice-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Payment terms, bank details, or other notes"
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

            <FormFooter cancelHref="/billing" saving={saving} saveLabel="Create Invoice" />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
