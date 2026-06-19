import Link from "next/link";
import { AlertTriangle, Boxes, IndianRupee, PackageX, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { InventoryTable } from "@/components/inventory/inventory-table";
import { PageHeader } from "@/components/layout/page-header";
import { inventoryItems } from "@/lib/mock-data";
import { formatINR } from "@/lib/format";

export default function InventoryPage() {
  const totalSkus = inventoryItems.length;
  const lowStock = inventoryItems.filter(
    (i) => i.reorderLevel > 0 && i.quantity > 0 && i.quantity <= i.reorderLevel
  ).length;
  const outOfStock = inventoryItems.filter((i) => i.reorderLevel > 0 && i.quantity === 0).length;
  const inventoryValue = inventoryItems.reduce((sum, i) => sum + i.quantity * i.unitCost, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description="Thread, fabric, and material catalog"
        action={
          <Button render={<Link href="/inventory/new" />} className="gap-1.5">
            <Plus className="size-4" />
            Add Item
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total SKUs" value={String(totalSkus)} icon={Boxes} />
        <StatCard label="Low Stock" value={String(lowStock)} icon={AlertTriangle} />
        <StatCard label="Out of Stock" value={String(outOfStock)} icon={PackageX} />
        <StatCard label="Inventory Value" value={formatINR(inventoryValue)} icon={IndianRupee} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Catalog</CardTitle>
          <CardDescription>Raw materials, accessories, and digitized designs</CardDescription>
        </CardHeader>
        <CardContent>
          <InventoryTable items={inventoryItems} />
        </CardContent>
      </Card>
    </div>
  );
}
