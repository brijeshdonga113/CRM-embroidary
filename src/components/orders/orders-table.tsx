"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { updateOrderStatus } from "@/lib/firestore/orders";
import { type Order } from "@/lib/mock-data";
import { formatDateDisplay } from "@/lib/format";
import { orderStatusColors, orderStatusLabels } from "@/lib/status-colors";
import { cn } from "@/lib/utils";

type FilterTab = "all" | Order["status"];

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [tab, setTab] = useState<FilterTab>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = useMemo(
    () => (tab === "all" ? orders : orders.filter((o) => o.status === tab)),
    [orders, tab]
  );

  async function handleStatusChange(orderId: string, status: Order["status"]) {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, status);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={(v) => setTab(v as FilterTab)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="in-production">In production</TabsTrigger>
          <TabsTrigger value="queued">Queued</TabsTrigger>
          <TabsTrigger value="delayed">Delayed</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Design</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="w-44">Status</TableHead>
            <TableHead>ETA</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="text-sm font-medium">{order.client}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{order.design}</TableCell>
              <TableCell className="text-right text-sm">{order.quantity} pcs</TableCell>
              <TableCell>
                <NativeSelect
                  value={order.status}
                  disabled={updatingId === order.id}
                  onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                  className={cn("h-7 text-xs font-medium capitalize", orderStatusColors[order.status])}
                >
                  <option value="queued">{orderStatusLabels.queued}</option>
                  <option value="in-production">{orderStatusLabels["in-production"]}</option>
                  <option value="delayed">{orderStatusLabels.delayed}</option>
                  <option value="completed">{orderStatusLabels.completed}</option>
                </NativeSelect>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{formatDateDisplay(order.eta)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  render={<Link href={`/billing/new?orderId=${order.id}`} />}
                  aria-label="Create invoice for this order"
                >
                  <Receipt className="size-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
