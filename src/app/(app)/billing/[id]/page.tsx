"use client";

import Link from "next/link";
import { ArrowLeft, MessageCircle, Printer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EditInvoiceSheet } from "@/components/billing/edit-invoice-sheet";
import { RecordPaymentSheet } from "@/components/billing/record-payment-sheet";
import { useInvoice } from "@/lib/firestore/invoices";
import { formatINR, formatDateDisplay } from "@/lib/format";
import { buildWhatsAppLink, buildInvoiceMessage } from "@/lib/whatsapp";
import { invoiceStatusColors } from "@/lib/status-colors";
import { cn } from "@/lib/utils";

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const { invoice, loading } = useInvoice(params.id);

  if (loading) {
    return <p className="py-12 text-center text-sm text-muted-foreground">Loading invoice…</p>;
  }

  if (!invoice) {
    return (
      <div className="space-y-4">
        <Link href="/billing" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3.5" />
          Back to Billing
        </Link>
        <p className="py-12 text-center text-sm text-muted-foreground">Invoice not found.</p>
      </div>
    );
  }

  const whatsappHref = buildWhatsAppLink(invoice.clientPhone, buildInvoiceMessage(invoice));
  const payments = invoice.payments ?? [];
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const balanceDue = Math.max(0, invoice.amount - totalPaid);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-col gap-3 print:hidden sm:flex-row sm:items-center sm:justify-between">
        <Link href="/billing" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3.5" />
          Back to Billing
        </Link>
        <div className="flex flex-wrap gap-2">
          <EditInvoiceSheet invoice={invoice} compact={false} />
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.print()}>
            <Printer className="size-3.5" />
            Print
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            render={<a href={whatsappHref} target="_blank" rel="noopener noreferrer" />}
          >
            <MessageCircle className="size-3.5" />
            Send via WhatsApp
          </Button>
          {balanceDue > 0 && <RecordPaymentSheet invoice={invoice} balanceDue={balanceDue} />}
        </div>
      </div>

      <Card className="print:ring-0 print:shadow-none">
        <CardContent className="space-y-6 pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-lg font-semibold tracking-tight">Stitchworks Embroidery</p>
              <p className="text-sm text-muted-foreground">Billing, inventory & stock management</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold tracking-tight">INVOICE</p>
              <p className="text-sm text-muted-foreground">{invoice.id}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Bill To</p>
              <p className="mt-1 text-sm font-medium">{invoice.firm}</p>
              <p className="text-sm text-muted-foreground">{invoice.contact}</p>
              {invoice.clientPhone && <p className="text-sm text-muted-foreground">{invoice.clientPhone}</p>}
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Invoice Date</p>
              <p className="mt-1 text-sm">{invoice.invoiceDate ? formatDateDisplay(invoice.invoiceDate) : "—"}</p>
              <p className="mt-3 text-xs font-medium text-muted-foreground">Due Date</p>
              <p className="mt-1 text-sm">{formatDateDisplay(invoice.dueDate)}</p>
              {invoice.reminderDate && (
                <>
                  <p className="mt-3 text-xs font-medium text-muted-foreground">Reminder Date</p>
                  <p className="mt-1 text-sm">{formatDateDisplay(invoice.reminderDate)}</p>
                </>
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Status</p>
              <Badge variant="outline" className={cn("mt-1 capitalize", invoiceStatusColors[invoice.status])}>
                {invoice.status}
              </Badge>
            </div>
          </div>

          {invoice.orderRef && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
              Linked order:{" "}
              <Link href="/orders" className="font-medium underline-offset-2 hover:underline">
                {invoice.orderRef}
              </Link>
            </div>
          )}

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Description</th>
                  <th className="w-20 px-3 py-2 text-right font-medium">Qty</th>
                  <th className="w-28 px-3 py-2 text-right font-medium">Rate</th>
                  <th className="w-28 px-3 py-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.lineItems?.length ? (
                  invoice.lineItems.map((item, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="px-3 py-2">{item.description}</td>
                      <td className="px-3 py-2 text-right">{item.quantity}</td>
                      <td className="px-3 py-2 text-right">{formatINR(item.rate)}</td>
                      <td className="px-3 py-2 text-right font-medium">{formatINR(item.quantity * item.rate)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-3 py-2 text-muted-foreground" colSpan={4}>
                      No itemized line items recorded for this invoice.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="ml-auto flex w-full max-w-xs flex-col gap-2 text-sm">
            {invoice.subtotal !== undefined && (
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatINR(invoice.subtotal)}</span>
              </div>
            )}
            {invoice.tax !== undefined && (
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Tax{invoice.taxRate !== undefined ? ` (${invoice.taxRate}%)` : ""}</span>
                <span>{formatINR(invoice.tax)}</span>
              </div>
            )}
            <div className="flex items-center justify-between border-t pt-2 text-base font-semibold">
              <span>Total</span>
              <span>{formatINR(invoice.amount)}</span>
            </div>
            {payments.length > 0 && (
              <>
                <div className="flex items-center justify-between text-emerald-700">
                  <span>Amount Paid</span>
                  <span>-{formatINR(totalPaid)}</span>
                </div>
                <div className="flex items-center justify-between border-t pt-2 text-base font-semibold">
                  <span>Balance Due</span>
                  <span>{formatINR(balanceDue)}</span>
                </div>
              </>
            )}
          </div>

          {invoice.notes && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">Notes</p>
              <p className="mt-1 text-sm whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}

          <p className="text-center text-xs text-muted-foreground">Thank you for your business!</p>
        </CardContent>
      </Card>

      {payments.length > 0 && (
        <Card className="print:ring-0 print:shadow-none">
          <CardContent className="space-y-3 pt-6">
            <p className="text-sm font-medium">Payment History</p>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                    <th className="px-3 py-2 font-medium">Date</th>
                    <th className="px-3 py-2 font-medium">Method</th>
                    <th className="px-3 py-2 font-medium">Note</th>
                    <th className="px-3 py-2 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {[...payments]
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .map((payment) => (
                      <tr key={payment.id} className="border-b last:border-0">
                        <td className="px-3 py-2 text-muted-foreground">{formatDateDisplay(payment.date)}</td>
                        <td className="px-3 py-2 text-muted-foreground">{payment.method || "—"}</td>
                        <td className="px-3 py-2 text-muted-foreground">{payment.note || "—"}</td>
                        <td className="px-3 py-2 text-right font-medium">{formatINR(payment.amount)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
