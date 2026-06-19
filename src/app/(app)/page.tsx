"use client";

import { Banknote, ClipboardList, PackageX, Receipt } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { StockAlerts } from "@/components/dashboard/stock-alerts";
import { RecentInvoices } from "@/components/dashboard/recent-invoices";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { ActiveOrders } from "@/components/dashboard/active-orders";
import { PageHeader } from "@/components/layout/page-header";
import { useInvoices } from "@/lib/firestore/invoices";
import { useInventoryItems } from "@/lib/firestore/inventory";
import { useOrders } from "@/lib/firestore/orders";
import { formatINR } from "@/lib/format";

export default function DashboardPage() {
  const { invoices } = useInvoices();
  const { items } = useInventoryItems();
  const { orders } = useOrders();

  const totalRevenue = invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.amount, 0);
  const outstanding = invoices
    .filter((i) => i.status !== "paid")
    .reduce((sum, i) => sum + i.amount, 0);
  const lowStockCount = items.filter(
    (i) => i.reorderLevel > 0 && i.quantity > 0 && i.quantity <= i.reorderLevel
  ).length;
  const activeOrdersCount = orders.filter((o) => o.status !== "completed").length;

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Overview of billing, inventory, and production" />

      <QuickActions />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Revenue Collected" value={formatINR(totalRevenue)} icon={Banknote} />
        <StatCard label="Outstanding Invoices" value={formatINR(outstanding)} icon={Receipt} />
        <StatCard label="Low Stock Items" value={String(lowStockCount)} icon={PackageX} />
        <StatCard label="Active Orders" value={String(activeOrdersCount)} icon={ClipboardList} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RevenueChart />
        <StockAlerts />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RecentInvoices />
        <div className="flex flex-col gap-4">
          <ActiveOrders />
        </div>
      </div>

      <RecentActivity />
    </div>
  );
}
