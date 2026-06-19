"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/layout/page-header";
import { FormField } from "@/components/forms/form-field";
import { cn } from "@/lib/utils";

function useSectionSave() {
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("saving");
    setTimeout(() => {
      setState("saved");
      setTimeout(() => setState("idle"), 1800);
    }, 500);
  }

  return { state, handleSubmit };
}

function SaveButton({ state }: { state: "idle" | "saving" | "saved" }) {
  return (
    <Button type="submit" disabled={state === "saving"} className="gap-1.5">
      {state === "saved" ? (
        <>
          <Check className="size-4" />
          Saved
        </>
      ) : state === "saving" ? (
        "Saving…"
      ) : (
        "Save changes"
      )}
    </Button>
  );
}

const notificationOptions = [
  { id: "payment-reminders", label: "Payment reminders", description: "Notify when invoices become overdue" },
  { id: "low-stock", label: "Low stock alerts", description: "Notify when inventory falls below reorder level" },
  { id: "order-updates", label: "Order updates", description: "Notify on production status changes" },
];

export default function SettingsPage() {
  const profile = useSectionSave();
  const invoicePrefs = useSectionSave();
  const notifications = useSectionSave();
  const [enabledNotifications, setEnabledNotifications] = useState<Set<string>>(
    new Set(["payment-reminders", "low-stock"])
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Workspace, billing, and notification preferences" />

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Business Profile</CardTitle>
          <CardDescription>Shown on invoices and client communication</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={profile.handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Business Name" htmlFor="biz-name" required>
                <Input id="biz-name" defaultValue="Stitchworks Embroidery" required />
              </FormField>
              <FormField label="GST / Tax ID" htmlFor="biz-tax">
                <Input id="biz-tax" defaultValue="27ABCDE1234F1Z5" />
              </FormField>
              <FormField label="Email" htmlFor="biz-email" required>
                <Input id="biz-email" type="email" defaultValue="billing@stitchworks.in" required />
              </FormField>
              <FormField label="Phone" htmlFor="biz-phone">
                <Input id="biz-phone" type="tel" defaultValue="+91 98200 11223" />
              </FormField>
              <FormField label="Address" htmlFor="biz-address" className="sm:col-span-2">
                <Textarea id="biz-address" rows={2} defaultValue="MIDC, Andheri East, Mumbai, Maharashtra 400093" />
              </FormField>
            </div>
            <div className="flex justify-end border-t pt-4">
              <SaveButton state={profile.state} />
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Invoice Preferences</CardTitle>
          <CardDescription>Defaults applied to new invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={invoicePrefs.handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormField label="Invoice Prefix" htmlFor="inv-prefix">
                <Input id="inv-prefix" defaultValue="INV-" />
              </FormField>
              <FormField label="Default Due Terms" htmlFor="inv-terms">
                <NativeSelect id="inv-terms" defaultValue="15">
                  <option value="0">Due on receipt</option>
                  <option value="7">Net 7 days</option>
                  <option value="15">Net 15 days</option>
                  <option value="30">Net 30 days</option>
                </NativeSelect>
              </FormField>
              <FormField label="Tax Rate (%)" htmlFor="inv-tax">
                <Input id="inv-tax" type="number" min={0} step="0.1" defaultValue="18" />
              </FormField>
            </div>
            <div className="flex justify-end border-t pt-4">
              <SaveButton state={invoicePrefs.state} />
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Notifications</CardTitle>
          <CardDescription>Choose what triggers an alert</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={notifications.handleSubmit} className="space-y-5">
            <div className="space-y-3">
              {notificationOptions.map((option) => {
                const enabled = enabledNotifications.has(option.id);
                return (
                  <div
                    key={option.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <Label htmlFor={option.id} className="flex-col items-start gap-0.5">
                      <span>{option.label}</span>
                      <span className="text-xs font-normal text-muted-foreground">{option.description}</span>
                    </Label>
                    <button
                      id={option.id}
                      type="button"
                      role="switch"
                      aria-checked={enabled}
                      onClick={() =>
                        setEnabledNotifications((prev) => {
                          const next = new Set(prev);
                          if (next.has(option.id)) next.delete(option.id);
                          else next.add(option.id);
                          return next;
                        })
                      }
                      className={cn(
                        "relative h-5 w-9 shrink-0 rounded-full transition-colors",
                        enabled ? "bg-foreground" : "bg-input"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 size-4 rounded-full bg-background transition-transform",
                          enabled ? "translate-x-[18px]" : "translate-x-0.5"
                        )}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end border-t pt-4">
              <SaveButton state={notifications.state} />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
