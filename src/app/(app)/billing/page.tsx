"use client";

import Link from "next/link";
import { AlertCircle, Banknote, CircleCheck, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { InvoiceTable } from "@/components/billing/invoice-table";
import { PageHeader } from "@/components/layout/page-header";
import { useInvoices } from "@/lib/firestore/invoices";
import { formatINR } from "@/lib/format";

export default function BillingPage() {
  const { invoices, loading } = useInvoices();

  const outstanding = invoices
    .filter((i) => i.status !== "paid")
    .reduce((sum, i) => sum + i.amount, 0);
  const overdueCount = invoices.filter((i) => i.status === "overdue").length;
  const paidTotal = invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing"
        description="Collect payments across firms and individual clients"
        action={
          <Button render={<Link href="/billing/new" />} className="gap-1.5">
            <Plus className="size-4" />
            New Invoice
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Outstanding" value={formatINR(outstanding)} icon={Banknote} tone="warning" />
        <StatCard
          label="Overdue Invoices"
          value={String(overdueCount)}
          icon={AlertCircle}
          tone={overdueCount > 0 ? "negative" : "neutral"}
        />
        <StatCard label="Collected" value={formatINR(paidTotal)} icon={CircleCheck} tone="positive" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Invoices</CardTitle>
          <CardDescription>Send payment reminders for pending and overdue invoices</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading invoices…</p>
          ) : invoices.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No invoices yet. Create your first one to get started.
            </p>
          ) : (
            <InvoiceTable invoices={invoices} showTabs />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
