"use client";

import Link from "next/link";
import { CheckCircle2, IndianRupee, Plus, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { PurchaseOrderTable } from "@/components/purchase-orders/purchase-order-table";
import { PageHeader } from "@/components/layout/page-header";
import { usePurchaseOrders } from "@/lib/firestore/purchase-orders";
import { formatINR } from "@/lib/format";

export default function PurchaseOrdersPage() {
  const { purchaseOrders, loading } = usePurchaseOrders();

  const openCount = purchaseOrders.filter((po) => po.status === "ordered" || po.status === "draft").length;
  const receivedCount = purchaseOrders.filter((po) => po.status === "received").length;
  const openValue = purchaseOrders
    .filter((po) => po.status === "ordered" || po.status === "draft")
    .reduce((sum, po) => sum + po.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Orders"
        description="Stock and materials you're buying in from suppliers"
        action={
          <Button render={<Link href="/purchase-orders/new" />} className="gap-1.5">
            <Plus className="size-4" />
            New Purchase Order
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Open Orders" value={String(openCount)} icon={Truck} />
        <StatCard label="Received" value={String(receivedCount)} icon={CheckCircle2} />
        <StatCard label="Open Order Value" value={formatINR(openValue)} icon={IndianRupee} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Orders</CardTitle>
          <CardDescription>Mark an order "Received" to add its items back into inventory</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading purchase orders…</p>
          ) : purchaseOrders.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No purchase orders yet. Create one when you order stock from a supplier.
            </p>
          ) : (
            <PurchaseOrderTable purchaseOrders={purchaseOrders} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
