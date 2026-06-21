"use client";

import { useMemo } from "react";
import { useInvoices } from "@/lib/firestore/invoices";
import { useClients } from "@/lib/firestore/clients";
import { useInventoryItems } from "@/lib/firestore/inventory";
import { useOrders } from "@/lib/firestore/orders";
import { useClientBillingTotals } from "@/lib/firestore/billing-summary";
import { type Order } from "@/lib/mock-data";

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function useMonthlyRevenue(months = 6) {
  const { invoices, loading } = useInvoices();

  const data = useMemo(() => {
    const now = new Date();
    const buckets: { key: string; month: string; revenue: number; outstanding: number }[] = [];
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({ key: monthKey(d), month: d.toLocaleString("en-US", { month: "short" }), revenue: 0, outstanding: 0 });
    }
    const byKey = new Map(buckets.map((b) => [b.key, b]));

    for (const invoice of invoices) {
      const raw =
        invoice.invoiceDate || (invoice.createdAt ? new Date(invoice.createdAt).toISOString().slice(0, 10) : undefined);
      if (!raw) continue;
      const d = new Date(`${raw}T00:00:00`);
      if (Number.isNaN(d.getTime())) continue;
      const bucket = byKey.get(monthKey(d));
      if (!bucket) continue;
      if (invoice.status === "paid") bucket.revenue += invoice.amount;
      else bucket.outstanding += invoice.amount;
    }

    return buckets;
  }, [invoices, months]);

  return { data, loading };
}

export function useTopClients(limit = 5) {
  const { clients, loading: clientsLoading } = useClients();
  const { totalsByClientId, loading: totalsLoading } = useClientBillingTotals();

  const data = useMemo(() => {
    return clients
      .map((c) => ({ id: c.id, name: c.name, totalBilled: totalsByClientId[c.id]?.totalBilled ?? 0 }))
      .filter((c) => c.totalBilled > 0)
      .sort((a, b) => b.totalBilled - a.totalBilled)
      .slice(0, limit);
  }, [clients, totalsByClientId, limit]);

  return { data, loading: clientsLoading || totalsLoading };
}

export function useInventoryValueByCategory() {
  const { items, loading } = useInventoryItems();

  const data = useMemo(() => {
    const byCategory = new Map<string, number>();
    for (const item of items) {
      byCategory.set(item.category, (byCategory.get(item.category) ?? 0) + item.quantity * item.unitCost);
    }
    return Array.from(byCategory.entries())
      .map(([category, value]) => ({ category, value }))
      .sort((a, b) => b.value - a.value);
  }, [items]);

  return { data, loading };
}

/**
 * Estimated profit & loss from paid invoices: revenue is what's actually
 * collected, cost of goods sold is the current unit cost of every
 * inventory-linked line item sold (an approximation — we don't track
 * historical cost, only the inventory item's cost as of today).
 */
export function useProfitAndLoss() {
  const { invoices, loading: invoicesLoading } = useInvoices();
  const { items, loading: itemsLoading } = useInventoryItems();

  const data = useMemo(() => {
    const costById = new Map(items.map((i) => [i.id, i.unitCost]));
    let revenue = 0;
    let cogs = 0;

    for (const invoice of invoices) {
      if (invoice.status !== "paid") continue;
      revenue += invoice.amount;
      for (const li of invoice.lineItems ?? []) {
        if (li.inventoryItemId) {
          cogs += (costById.get(li.inventoryItemId) ?? 0) * li.quantity;
        }
      }
    }

    return { revenue, cogs, profit: revenue - cogs };
  }, [invoices, items]);

  return { data, loading: invoicesLoading || itemsLoading };
}

export function useOrderStatusBreakdown() {
  const { orders, loading } = useOrders();

  const data = useMemo(() => {
    const counts: Record<Order["status"], number> = {
      "in-production": 0,
      queued: 0,
      completed: 0,
      delayed: 0,
    };
    for (const order of orders) counts[order.status] += 1;
    return counts;
  }, [orders]);

  return { data, loading };
}
