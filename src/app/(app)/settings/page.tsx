"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/layout/page-header";
import { FormField } from "@/components/forms/form-field";
import { useUserProfile, updateUserProfile, type NotificationPrefs } from "@/lib/firestore/user-profile";
import { cn } from "@/lib/utils";

type SaveState = "idle" | "saving" | "saved" | "error";

function useSectionSave(onSubmit: () => Promise<void>) {
  const [state, setState] = useState<SaveState>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("saving");
    try {
      await onSubmit();
      setState("saved");
      setTimeout(() => setState("idle"), 1800);
    } catch {
      setState("error");
    }
  }

  return { state, handleSubmit };
}

function SaveButton({ state }: { state: SaveState }) {
  return (
    <Button type="submit" disabled={state === "saving"} className="gap-1.5">
      {state === "saved" ? (
        <>
          <Check className="size-4" />
          Saved
        </>
      ) : state === "saving" ? (
        "Saving…"
      ) : state === "error" ? (
        "Couldn't save — retry"
      ) : (
        "Save changes"
      )}
    </Button>
  );
}

const notificationOptions: { id: keyof NotificationPrefs; label: string; description: string }[] = [
  { id: "paymentReminders", label: "Payment reminders", description: "Notify when invoices become overdue" },
  { id: "lowStock", label: "Low stock alerts", description: "Notify when inventory falls below reorder level" },
  { id: "orderUpdates", label: "Order updates", description: "Notify on production status changes" },
];

export default function SettingsPage() {
  const { profile, loading } = useUserProfile();
  const hydrated = useRef(false);

  const [bizName, setBizName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [bizEmail, setBizEmail] = useState("");
  const [bizPhone, setBizPhone] = useState("");
  const [bizAddress, setBizAddress] = useState("");

  const [invoicePrefix, setInvoicePrefix] = useState("INV-");
  const [dueTermsDays, setDueTermsDays] = useState(15);
  const [taxRate, setTaxRate] = useState(18);

  const [notifications, setNotifications] = useState<NotificationPrefs>({
    paymentReminders: true,
    lowStock: true,
    orderUpdates: false,
  });

  useEffect(() => {
    if (loading || hydrated.current) return;
    hydrated.current = true;
    if (!profile) return;
    setBizName(profile.businessName ?? "");
    setTaxId(profile.taxId ?? "");
    setBizEmail(profile.email ?? "");
    setBizPhone(profile.phone ?? "");
    setBizAddress(profile.address ?? "");
    setInvoicePrefix(profile.invoicePrefix ?? "INV-");
    setDueTermsDays(profile.dueTermsDays ?? 15);
    setTaxRate(profile.taxRate ?? 18);
    if (profile.notifications) setNotifications(profile.notifications);
  }, [loading, profile]);

  const businessProfile = useSectionSave(() =>
    updateUserProfile({ businessName: bizName, taxId, email: bizEmail, phone: bizPhone, address: bizAddress })
  );
  const invoicePrefs = useSectionSave(() => updateUserProfile({ invoicePrefix, dueTermsDays, taxRate }));
  const notificationPrefs = useSectionSave(() => updateUserProfile({ notifications }));

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Workspace, billing, and notification preferences" />

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Business Profile</CardTitle>
          <CardDescription>Shown on invoices and client communication</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={businessProfile.handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Business Name" htmlFor="biz-name" required>
                <Input id="biz-name" value={bizName} onChange={(e) => setBizName(e.target.value)} required />
              </FormField>
              <FormField label="GST / Tax ID" htmlFor="biz-tax">
                <Input id="biz-tax" value={taxId} onChange={(e) => setTaxId(e.target.value)} />
              </FormField>
              <FormField label="Email" htmlFor="biz-email" required>
                <Input
                  id="biz-email"
                  type="email"
                  value={bizEmail}
                  onChange={(e) => setBizEmail(e.target.value)}
                  required
                />
              </FormField>
              <FormField label="Phone" htmlFor="biz-phone">
                <Input id="biz-phone" type="tel" value={bizPhone} onChange={(e) => setBizPhone(e.target.value)} />
              </FormField>
              <FormField label="Address" htmlFor="biz-address" className="sm:col-span-2">
                <Textarea id="biz-address" rows={2} value={bizAddress} onChange={(e) => setBizAddress(e.target.value)} />
              </FormField>
            </div>
            <div className="flex justify-end border-t pt-4">
              <SaveButton state={businessProfile.state} />
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
                <Input id="inv-prefix" value={invoicePrefix} onChange={(e) => setInvoicePrefix(e.target.value)} />
              </FormField>
              <FormField label="Default Due Terms" htmlFor="inv-terms">
                <NativeSelect
                  id="inv-terms"
                  value={String(dueTermsDays)}
                  onChange={(e) => setDueTermsDays(Number(e.target.value))}
                >
                  <option value="0">Due on receipt</option>
                  <option value="7">Net 7 days</option>
                  <option value="15">Net 15 days</option>
                  <option value="30">Net 30 days</option>
                </NativeSelect>
              </FormField>
              <FormField label="Tax Rate (%)" htmlFor="inv-tax">
                <Input
                  id="inv-tax"
                  type="number"
                  min={0}
                  step="0.1"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                />
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
          <form onSubmit={notificationPrefs.handleSubmit} className="space-y-5">
            <div className="space-y-3">
              {notificationOptions.map((option) => {
                const enabled = notifications[option.id];
                return (
                  <div key={option.id} className="flex items-center justify-between rounded-lg border p-3">
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
                        setNotifications((prev) => ({ ...prev, [option.id]: !prev[option.id] }))
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
              <SaveButton state={notificationPrefs.state} />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
