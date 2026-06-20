"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { updateInvoiceDetails } from "@/lib/firestore/invoices";
import { type Invoice, type InvoiceStatus } from "@/lib/mock-data";

function toDateInputValue(value: string | undefined) {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
}

export function EditInvoiceSheet({ invoice }: { invoice: Invoice }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<InvoiceStatus>(invoice.status);
  const [dueDate, setDueDate] = useState(toDateInputValue(invoice.dueDate));
  const [reminderDate, setReminderDate] = useState(toDateInputValue(invoice.reminderDate));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await updateInvoiceDetails(invoice.id, {
        status,
        ...(dueDate ? { dueDate } : {}),
        ...(reminderDate ? { reminderDate } : {}),
      });
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update invoice. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          setStatus(invoice.status);
          setDueDate(toDateInputValue(invoice.dueDate));
          setReminderDate(toDateInputValue(invoice.reminderDate));
          setError(null);
        }
      }}
    >
      <SheetTrigger
        render={<Button variant="ghost" size="icon-sm" aria-label="Edit invoice" />}
      >
        <Pencil className="size-3.5" />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit invoice</SheetTitle>
          <SheetDescription>
            Update status, due date, or set a follow-up reminder for {invoice.firm}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-invoice-status">Status</Label>
            <NativeSelect
              id="edit-invoice-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </NativeSelect>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-invoice-due">Due date</Label>
            <Input
              id="edit-invoice-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-invoice-reminder">Reminder date</Label>
            <Input
              id="edit-invoice-reminder"
              type="date"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Optional — a date to come back and follow up on this invoice.
            </p>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <SheetFooter>
          <Button onClick={handleSave} disabled={saving} className="gap-1.5">
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
