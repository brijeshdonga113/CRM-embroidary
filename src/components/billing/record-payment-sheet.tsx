"use client";

import { useState } from "react";
import { CircleDollarSign } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { recordInvoicePayment } from "@/lib/firestore/invoices";
import { formatINR } from "@/lib/format";
import { type Invoice } from "@/lib/mock-data";

export function RecordPaymentSheet({ invoice, balanceDue }: { invoice: Invoice; balanceDue: number }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(String(balanceDue > 0 ? balanceDue : ""));
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [method, setMethod] = useState("Bank transfer");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      setError("Enter a payment amount greater than zero.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await recordInvoicePayment(invoice, {
        amount: numericAmount,
        date,
        method,
        ...(note ? { note } : {}),
      });
      setOpen(false);
      setAmount("");
      setNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not record payment. Please try again.");
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
          setAmount(String(balanceDue > 0 ? balanceDue : ""));
          setDate(new Date().toISOString().slice(0, 10));
          setError(null);
        }
      }}
    >
      <SheetTrigger render={<Button size="sm" className="gap-1.5" />}>
        <CircleDollarSign className="size-3.5" />
        Record Payment
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Record payment</SheetTitle>
          <SheetDescription>
            Log a full or partial payment for {invoice.firm} — balance due {formatINR(balanceDue)}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4">
          <div className="space-y-1.5">
            <Label htmlFor="payment-amount">Amount (₹)</Label>
            <Input
              id="payment-amount"
              type="number"
              min={0}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="payment-date">Date</Label>
            <Input id="payment-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="payment-method">Method</Label>
            <NativeSelect id="payment-method" value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="Bank transfer">Bank transfer</option>
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
              <option value="Card">Card</option>
              <option value="Other">Other</option>
            </NativeSelect>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="payment-note">Note</Label>
            <Textarea
              id="payment-note"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional reference number or note"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <SheetFooter>
          <Button onClick={handleSave} disabled={saving} className="gap-1.5">
            {saving ? "Saving…" : "Save Payment"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
