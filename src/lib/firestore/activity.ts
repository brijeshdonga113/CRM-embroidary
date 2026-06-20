"use client";

import { useMemo } from "react";
import { useInvoices } from "@/lib/firestore/invoices";
import { useClients } from "@/lib/firestore/clients";
import { useInventoryItems } from "@/lib/firestore/inventory";
import { useStockMovements } from "@/lib/firestore/stock";
import { useOrders } from "@/lib/firestore/orders";
import { formatINR } from "@/lib/format";

export type ActivityType = "invoice" | "client" | "inventory" | "stock" | "order";

export type ActivityEntry = {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  createdAt: number;
  href: string;
};

export function useRecentActivity(limit?: number) {
  const { invoices, loading: invoicesLoading } = useInvoices();
  const { clients, loading: clientsLoading } = useClients();
  const { items, loading: itemsLoading } = useInventoryItems();
  const { movements, loading: movementsLoading } = useStockMovements();
  const { orders, loading: ordersLoading } = useOrders();

  const loading = invoicesLoading || clientsLoading || itemsLoading || movementsLoading || ordersLoading;

  const entries = useMemo<ActivityEntry[]>(() => {
    const all: ActivityEntry[] = [];

    for (const invoice of invoices) {
      if (!invoice.createdAt) continue;
      all.push({
        id: `invoice-${invoice.id}`,
        type: "invoice",
        title: `Invoice ${formatINR(invoice.amount)} — ${invoice.firm}`,
        description: `Status: ${invoice.status}`,
        createdAt: invoice.createdAt,
        href: `/billing/${invoice.id}`,
      });
    }

    for (const client of clients) {
      if (!client.createdAt) continue;
      all.push({
        id: `client-${client.id}`,
        type: "client",
        title: "New client added",
        description: `${client.name} (${client.type})`,
        createdAt: client.createdAt,
        href: "/clients",
      });
    }

    for (const item of items) {
      if (!item.createdAt) continue;
      all.push({
        id: `inventory-${item.id}`,
        type: "inventory",
        title: "Inventory item added",
        description: `${item.name} — ${item.quantity} ${item.unit}`,
        createdAt: item.createdAt,
        href: "/inventory",
      });
    }

    for (const movement of movements) {
      if (!movement.createdAt) continue;
      const verb = movement.type === "in" ? "received" : movement.type === "out" ? "issued" : "adjusted";
      all.push({
        id: `stock-${movement.id}`,
        type: "stock",
        title: `Stock ${verb}`,
        description: `${movement.itemName} • ${movement.quantity} ${movement.unit}`,
        createdAt: movement.createdAt,
        href: "/stock",
      });
    }

    for (const order of orders) {
      if (!order.createdAt) continue;
      all.push({
        id: `order-${order.id}`,
        type: "order",
        title: `New order — ${order.design}`,
        description: `${order.client} • ${order.quantity} pcs`,
        createdAt: order.createdAt,
        href: "/orders",
      });
    }

    all.sort((a, b) => b.createdAt - a.createdAt);
    return limit ? all.slice(0, limit) : all;
  }, [invoices, clients, items, movements, orders, limit]);

  return { entries, loading };
}
