"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InvoiceTable } from "@/components/billing/invoice-table";
import { useInvoices } from "@/lib/firestore/invoices";

export function RecentInvoices() {
  const { invoices, loading } = useInvoices();

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base font-semibold">Recent Invoices</CardTitle>
          <CardDescription>Billing across firms and individual clients</CardDescription>
        </div>
        <Button variant="outline" size="sm" render={<Link href="/billing" />}>
          View all
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
        ) : invoices.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No invoices yet.</p>
        ) : (
          <InvoiceTable invoices={invoices} limit={6} />
        )}
      </CardContent>
    </Card>
  );
}
