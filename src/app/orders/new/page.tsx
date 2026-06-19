"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { PageHeader } from "@/components/layout/page-header";
import { FormField } from "@/components/forms/form-field";
import { FormFooter } from "@/components/forms/form-footer";
import { useFakeSubmit } from "@/hooks/use-fake-submit";
import { clients } from "@/lib/mock-data";

export default function NewOrderPage() {
  const { saving, submit } = useFakeSubmit("/orders");

  return (
    <div className="space-y-6">
      <PageHeader backHref="/orders" title="New Order" description="Create a new embroidery production order" />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={submit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Client" htmlFor="order-client" required className="sm:col-span-2">
                <NativeSelect id="order-client" defaultValue={clients[0]?.name} required>
                  {clients.map((client) => (
                    <option key={client.id} value={client.name}>
                      {client.name}
                    </option>
                  ))}
                </NativeSelect>
              </FormField>

              <FormField label="Design" htmlFor="order-design" required className="sm:col-span-2">
                <Input id="order-design" placeholder="e.g. Team Crest – Left Chest" required />
              </FormField>

              <FormField label="Quantity" htmlFor="order-quantity" required>
                <Input id="order-quantity" type="number" min={1} placeholder="0" required />
              </FormField>

              <FormField label="Expected Delivery (ETA)" htmlFor="order-eta" required>
                <Input id="order-eta" type="date" required />
              </FormField>

              <FormField label="Status" htmlFor="order-status">
                <NativeSelect id="order-status" defaultValue="queued">
                  <option value="queued">Queued</option>
                  <option value="in-production">In production</option>
                  <option value="delayed">Delayed</option>
                  <option value="completed">Completed</option>
                </NativeSelect>
              </FormField>

              <FormField label="Notes" htmlFor="order-notes" className="sm:col-span-2">
                <Textarea id="order-notes" rows={3} placeholder="Placement, thread colors, special instructions…" />
              </FormField>
            </div>

            <FormFooter cancelHref="/orders" saving={saving} saveLabel="Create Order" />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
