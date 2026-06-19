import { Banknote, ClipboardList, PackageX, Receipt } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { StockAlerts } from "@/components/dashboard/stock-alerts";
import { RecentInvoices } from "@/components/dashboard/recent-invoices";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { ActiveOrders } from "@/components/dashboard/active-orders";
import { stats } from "@/lib/mock-data";

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
    amount
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of billing, inventory, and production</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={formatINR(stats.totalRevenue)}
          delta={stats.revenueDelta}
          deltaLabel="vs last month"
          icon={Banknote}
        />
        <StatCard
          label="Outstanding Invoices"
          value={formatINR(stats.outstanding)}
          delta={stats.outstandingDelta}
          deltaLabel="vs last month"
          icon={Receipt}
        />
        <StatCard label="Low Stock Items" value={String(stats.lowStockCount)} icon={PackageX} />
        <StatCard label="Active Orders" value={String(stats.activeOrdersCount)} icon={ClipboardList} />
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
