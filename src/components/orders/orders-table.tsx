"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Order } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type FilterTab = "all" | Order["status"];

const statusStyles: Record<Order["status"], string> = {
  "in-production": "bg-blue-50 text-blue-700 border-blue-200",
  queued: "bg-slate-50 text-slate-700 border-slate-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  delayed: "bg-red-50 text-red-700 border-red-200",
};

const statusLabel: Record<Order["status"], string> = {
  "in-production": "In production",
  queued: "Queued",
  completed: "Completed",
  delayed: "Delayed",
};

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [tab, setTab] = useState<FilterTab>("all");

  const filtered = useMemo(
    () => (tab === "all" ? orders : orders.filter((o) => o.status === tab)),
    [orders, tab]
  );

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
            <TableHead>Order</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Design</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>ETA</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="text-sm text-muted-foreground">{order.id}</TableCell>
              <TableCell className="text-sm font-medium">{order.client}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{order.design}</TableCell>
              <TableCell className="text-right text-sm">{order.quantity} pcs</TableCell>
              <TableCell>
                <Badge variant="outline" className={cn(statusStyles[order.status])}>
                  {statusLabel[order.status]}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{order.eta}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
