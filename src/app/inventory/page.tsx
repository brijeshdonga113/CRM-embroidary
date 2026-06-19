import { Boxes } from "lucide-react";
import { ComingSoon } from "@/components/layout/coming-soon";

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Inventory</h1>
        <p className="text-sm text-muted-foreground">Thread, fabric, and material catalog</p>
      </div>
      <ComingSoon
        icon={Boxes}
        title="Inventory module coming soon"
        description="Manage raw materials, designs, and finished goods with SKU-level detail and supplier info."
      />
    </div>
  );
}
