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
import { useClients } from "@/lib/firestore/clients";
import { createOrder } from "@/lib/firestore/orders";
import { formatDateDisplay } from "@/lib/format";
import { type Order } from "@/lib/mock-data";

export default function NewOrderPage() {
  const router = useRouter();
  const { clients, loading: clientsLoading } = useClients();

  const [clientId, setClientId] = useState("");
  const [design, setDesign] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [eta, setEta] = useState("");
  const [status, setStatus] = useState<Order["status"]>("queued");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedClientId = clientId || clients[0]?.id || "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const client = clients.find((c) => c.id === selectedClientId);
    if (!client) {
      setError("Select a client before creating the order.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await createOrder({
        client: client.name,
        design,
        quantity: Number(quantity) || 0,
        status,
        eta: formatDateDisplay(eta),
        ...(notes ? { notes } : {}),
      });
      router.push("/orders");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create order. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader backHref="/orders" title="New Order" description="Create a new embroidery production order" />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Client" htmlFor="order-client" required className="sm:col-span-2">
                <NativeSelect
                  id="order-client"
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

              <FormField label="Design" htmlFor="order-design" required className="sm:col-span-2">
                <Input
                  id="order-design"
                  value={design}
                  onChange={(e) => setDesign(e.target.value)}
                  placeholder="e.g. Team Crest – Left Chest"
                  required
                />
              </FormField>

              <FormField label="Quantity" htmlFor="order-quantity" required>
                <Input
                  id="order-quantity"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Expected Delivery (ETA)" htmlFor="order-eta" required>
                <Input id="order-eta" type="date" value={eta} onChange={(e) => setEta(e.target.value)} required />
              </FormField>

              <FormField label="Status" htmlFor="order-status">
                <NativeSelect id="order-status" value={status} onChange={(e) => setStatus(e.target.value as Order["status"])}>
                  <option value="queued">Queued</option>
                  <option value="in-production">In production</option>
                  <option value="delayed">Delayed</option>
                  <option value="completed">Completed</option>
                </NativeSelect>
              </FormField>

              <FormField label="Notes" htmlFor="order-notes" className="sm:col-span-2">
                <Textarea
                  id="order-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Placement, thread colors, special instructions…"
                />
              </FormField>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <FormFooter cancelHref="/orders" saving={saving} saveLabel="Create Order" />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
