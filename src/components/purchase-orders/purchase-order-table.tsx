"use client";

import { useMemo, useState } from "react";
import { NativeSelect } from "@/components/ui/native-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updatePurchaseOrderStatus } from "@/lib/firestore/purchase-orders";
import { type PurchaseOrder, type PurchaseOrderStatus } from "@/lib/mock-data";
import { formatINR, formatDateDisplay } from "@/lib/format";
import { purchaseOrderStatusColors, purchaseOrderStatusLabels } from "@/lib/status-colors";
import { cn } from "@/lib/utils";

type FilterTab = "all" | PurchaseOrderStatus;

export function PurchaseOrderTable({ purchaseOrders }: { purchaseOrders: PurchaseOrder[] }) {
  const [tab, setTab] = useState<FilterTab>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = useMemo(
    () => (tab === "all" ? purchaseOrders : purchaseOrders.filter((po) => po.status === tab)),
    [purchaseOrders, tab]
  );

  async function handleStatusChange(id: string, status: PurchaseOrderStatus) {
    setUpdatingId(id);
    try {
      await updatePurchaseOrderStatus(id, status);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={(v) => setTab(v as FilterTab)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="ordered">Ordered</TabsTrigger>
          <TabsTrigger value="received">Received</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Supplier</TableHead>
            <TableHead>Expected</TableHead>
            <TableHead className="w-40">Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((po) => (
            <TableRow key={po.id}>
              <TableCell>
                <p className="text-sm font-medium leading-none">{po.supplier}</p>
                {po.supplierContact && (
                  <p className="mt-1 text-xs text-muted-foreground">{po.supplierContact}</p>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {po.expectedDate ? formatDateDisplay(po.expectedDate) : "—"}
              </TableCell>
              <TableCell>
                <NativeSelect
                  value={po.status}
                  disabled={updatingId === po.id}
                  onChange={(e) => handleStatusChange(po.id, e.target.value as PurchaseOrderStatus)}
                  className={cn("h-7 text-xs font-medium capitalize", purchaseOrderStatusColors[po.status])}
                >
                  <option value="draft">{purchaseOrderStatusLabels.draft}</option>
                  <option value="ordered">{purchaseOrderStatusLabels.ordered}</option>
                  <option value="received">{purchaseOrderStatusLabels.received}</option>
                  <option value="cancelled">{purchaseOrderStatusLabels.cancelled}</option>
                </NativeSelect>
              </TableCell>
              <TableCell className="text-right text-sm font-medium">{formatINR(po.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
