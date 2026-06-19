import { PackageSearch } from "lucide-react";
import { ComingSoon } from "@/components/layout/coming-soon";

export default function StockPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Stock Management</h1>
        <p className="text-sm text-muted-foreground">Stock levels, reorder thresholds, and movements</p>
      </div>
      <ComingSoon
        icon={PackageSearch}
        title="Stock management coming soon"
        description="Track stock movements, set reorder points, and get low-stock alerts across warehouses."
      />
    </div>
  );
}
