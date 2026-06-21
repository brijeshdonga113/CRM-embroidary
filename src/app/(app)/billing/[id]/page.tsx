"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ClipboardList,
  MessageCircle,
  Printer,
  Scissors,
  Wallet,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EditInvoiceSheet } from "@/components/billing/edit-invoice-sheet";
import { RecordPaymentSheet } from "@/components/billing/record-payment-sheet";
import { useInvoice } from "@/lib/firestore/invoices";
import { formatINR, formatDateDisplay } from "@/lib/format";
import { buildWhatsAppLink, buildInvoiceMessage } from "@/lib/whatsapp";
import { financialTone } from "@/lib/status-colors";
import { getBalanceDue, getTotalPaid } from "@/lib/invoice-status";
import { type InvoiceStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusBannerColors: Record<InvoiceStatus, string> = {
  paid: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  overdue: "bg-red-50 text-red-700",
};

const statusIconColors: Record<InvoiceStatus, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  overdue: "bg-red-100 text-red-700",
};

const statusIcons: Record<InvoiceStatus, typeof CheckCircle2> = {
  paid: CheckCircle2,
  pending: Clock,
  overdue: AlertTriangle,
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
  const payments = invoice.payments ?? [];
  const totalPaid = getTotalPaid(invoice);
  const balanceDue = getBalanceDue(invoice);
  const percentPaid = invoice.amount > 0 ? Math.min(100, Math.round((totalPaid / invoice.amount) * 100)) : 0;
  const StatusIcon = statusIcons[invoice.status];

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
            size="sm"
            className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
            render={<a href={whatsappHref} target="_blank" rel="noopener noreferrer" />}
          >
            <MessageCircle className="size-3.5" />
            Send via WhatsApp
          </Button>
          {balanceDue > 0 && <RecordPaymentSheet invoice={invoice} balanceDue={balanceDue} />}
        </div>
      </div>

      <Card className="overflow-hidden print:ring-0 print:shadow-none">
        <div className="bg-gradient-to-br from-slate-900 to-slate-700 px-6 py-7 text-white print:bg-white print:p-0 print:pb-4 print:text-foreground">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-md bg-white/15 print:bg-muted">
                  <Scissors className="size-4" strokeWidth={2} />
                </div>
                <p className="text-lg font-semibold tracking-tight">Stitchworks Embroidery</p>
              </div>
              <p className="mt-1.5 text-sm text-white/70 print:text-muted-foreground">
                Billing, inventory &amp; stock management
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold tracking-tight">INVOICE</p>
              {invoice.invoiceDate && (
                <p className="text-sm text-white/70 print:text-muted-foreground">
                  {formatDateDisplay(invoice.invoiceDate)}
                </p>
              )}
            </div>
          </div>
        </div>

        <div
          className={cn(
            "flex flex-wrap items-center justify-between gap-2 px-6 py-3 text-sm font-medium print:border-b",
            statusBannerColors[invoice.status]
          )}
        >
          <span className="flex items-center gap-1.5 capitalize">
            <StatusIcon className="size-4" />
            {invoice.status}
          </span>
          {payments.length > 0 && (
            <span className="text-xs font-normal">
              {percentPaid}% paid · {formatINR(balanceDue)} remaining
            </span>
          )}
        </div>

        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-blue-100 text-blue-700">
                <Building2 className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">Bill To</p>
                <p className="mt-1 truncate text-sm font-medium">{invoice.firm}</p>
                <p className="truncate text-sm text-muted-foreground">{invoice.contact}</p>
                {invoice.clientPhone && (
                  <p className="truncate text-sm text-muted-foreground">{invoice.clientPhone}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-violet-100 text-violet-700">
                <Calendar className="size-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Invoice Date</p>
                <p className="mt-1 text-sm">{invoice.invoiceDate ? formatDateDisplay(invoice.invoiceDate) : "—"}</p>
                <p className="mt-2 text-xs font-medium text-muted-foreground">Due Date</p>
                <p className="mt-1 text-sm">{formatDateDisplay(invoice.dueDate)}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-md",
                  statusIconColors[invoice.status]
                )}
              >
                <Wallet className="size-4" />
              </div>
              <div className="w-full min-w-0">
                <p className="text-xs font-medium text-muted-foreground">Amount</p>
                <p className="mt-1 text-lg font-semibold tracking-tight">{formatINR(invoice.amount)}</p>
                {payments.length > 0 && (
                  <div className="mt-1.5 space-y-1">
                    <Progress value={percentPaid} className="h-1.5" />
                    <p className="text-xs text-muted-foreground">{percentPaid}% collected</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {invoice.reminderDate && (
            <p className="text-xs text-muted-foreground">Reminder set for {formatDateDisplay(invoice.reminderDate)}</p>
          )}

          {invoice.orderRef && (
            <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
              <ClipboardList className="size-4 shrink-0" />
              <span>
                Linked order:{" "}
                <Link href="/orders" className="font-medium underline-offset-2 hover:underline">
                  {invoice.orderRef}
                </Link>
              </span>
            </div>
          )}

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left text-xs text-muted-foreground">
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

          <div className="ml-auto flex w-full max-w-xs flex-col gap-2 rounded-lg bg-muted/40 p-4 text-sm">
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
              <div className={cn("flex items-center justify-between", financialTone.positive)}>
                <span>Amount Paid</span>
                <span>-{formatINR(totalPaid)}</span>
              </div>
            )}
            <div
              className={cn(
                "flex items-center justify-between rounded-md px-2.5 py-2 text-base font-semibold",
                balanceDue > 0 ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
              )}
            >
              <span>{balanceDue > 0 ? "Balance Due" : "Paid in Full"}</span>
              <span>{formatINR(balanceDue)}</span>
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

      {payments.length > 0 && (
        <Card className="print:ring-0 print:shadow-none">
          <CardContent className="pt-6">
            <p className="mb-4 text-sm font-medium">Payment History</p>
            <ol className="space-y-5">
              {[...payments]
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((payment, i, arr) => (
                  <li key={payment.id} className="relative flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                        <CheckCircle2 className="size-3.5" />
                      </span>
                      {i < arr.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
                    </div>
                    <div className="flex flex-1 items-center justify-between gap-3 pb-1">
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{payment.method || "Payment"}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {formatDateDisplay(payment.date)}
                          {payment.note ? ` · ${payment.note}` : ""}
                        </p>
                      </div>
                      <span className={cn("shrink-0 text-sm font-semibold", financialTone.positive)}>
                        +{formatINR(payment.amount)}
                      </span>
                    </div>
                  </li>
                ))}
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
