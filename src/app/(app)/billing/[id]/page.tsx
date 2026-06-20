"use client";

import Link from "next/link";
import { ArrowLeft, MessageCircle, Printer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useInvoice } from "@/lib/firestore/invoices";
import { formatINR, formatDateDisplay } from "@/lib/format";
import { buildWhatsAppLink, buildInvoiceMessage } from "@/lib/whatsapp";
import { type InvoiceStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusStyles: Record<InvoiceStatus, string> = {
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  overdue: "bg-red-50 text-red-700 border-red-200",
};

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

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-col gap-3 print:hidden sm:flex-row sm:items-center sm:justify-between">
        <Link href="/billing" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3.5" />
          Back to Billing
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.print()}>
            <Printer className="size-3.5" />
            Print
          </Button>
          <Button
            size="sm"
            className="gap-1.5"
            render={<a href={whatsappHref} target="_blank" rel="noopener noreferrer" />}
          >
            <MessageCircle className="size-3.5" />
            Send via WhatsApp
          </Button>
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
              <Badge variant="outline" className={cn("mt-1 capitalize", statusStyles[invoice.status])}>
                {invoice.status}
              </Badge>
            </div>
          </div>

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
    </div>
  );
}
