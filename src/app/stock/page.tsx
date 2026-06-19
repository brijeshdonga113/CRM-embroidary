import Link from "next/link";
import { ArrowLeftRight, IndianRupee, PackageX, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { StockAlerts } from "@/components/dashboard/stock-alerts";
import { StockMovementsTable } from "@/components/stock/stock-movements-table";
import { PageHeader } from "@/components/layout/page-header";
import { inventoryItems, stockMovements } from "@/lib/mock-data";
import { formatINR } from "@/lib/format";

export default function StockPage() {
  const lowStockCount = inventoryItems.filter(
    (i) => i.reorderLevel > 0 && i.quantity > 0 && i.quantity <= i.reorderLevel
  ).length;
  const outOfStockCount = inventoryItems.filter((i) => i.reorderLevel > 0 && i.quantity === 0).length;
  const stockValue = inventoryItems.reduce((sum, i) => sum + i.quantity * i.unitCost, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Management"
        description="Stock levels, reorder thresholds, and movements"
        action={
          <Button render={<Link href="/stock/new" />} className="gap-1.5">
            <Plus className="size-4" />
            New Stock Entry
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Stock Value" value={formatINR(stockValue)} icon={IndianRupee} />
        <StatCard label="Low Stock Items" value={String(lowStockCount)} icon={ArrowLeftRight} />
        <StatCard label="Out of Stock" value={String(outOfStockCount)} icon={PackageX} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Recent Stock Movements</CardTitle>
            <CardDescription>Stock in, stock out, and manual adjustments</CardDescription>
          </CardHeader>
          <CardContent>
            <StockMovementsTable movements={stockMovements} />
          </CardContent>
        </Card>
        <StockAlerts />
      </div>
    </div>
  );
}
