"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/layout/page-header";
import { FormField } from "@/components/forms/form-field";
import { FormFooter } from "@/components/forms/form-footer";
import { useFakeSubmit } from "@/hooks/use-fake-submit";
import { type ClientType } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const types: ClientType[] = ["Firm", "Individual"];

export default function NewClientPage() {
  const { saving, submit } = useFakeSubmit("/clients");
  const [type, setType] = useState<ClientType>("Firm");

  return (
    <div className="space-y-6">
      <PageHeader
        backHref="/clients"
        title="Add Client"
        description="Add a new firm or individual client"
      />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-1.5">
              <Label>Client Type</Label>
              <div className="flex gap-2">
                {types.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                      type === t
                        ? "border-foreground bg-foreground text-background"
                        : "border-input text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label={type === "Firm" ? "Firm Name" : "Full Name"}
                htmlFor="client-name"
                required
                className="sm:col-span-2"
              >
                <Input id="client-name" placeholder={type === "Firm" ? "e.g. Aarav Textiles Pvt Ltd" : "e.g. Nikhil Verma"} required />
              </FormField>

              {type === "Firm" && (
                <FormField label="Contact Person" htmlFor="client-contact" className="sm:col-span-2">
                  <Input id="client-contact" placeholder="e.g. Aarav Shah" />
                </FormField>
              )}

              <FormField label="Email" htmlFor="client-email" required>
                <Input id="client-email" type="email" placeholder="name@company.com" required />
              </FormField>

              <FormField label="Phone" htmlFor="client-phone" required>
                <Input id="client-phone" type="tel" placeholder="+91 98765 43210" required />
              </FormField>

              <FormField label="Billing Address" htmlFor="client-address" className="sm:col-span-2">
                <Textarea id="client-address" rows={3} placeholder="Street, city, state, PIN code" />
              </FormField>
            </div>

            <FormFooter cancelHref="/clients" saving={saving} saveLabel="Add Client" />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
