import { ClipboardList } from "lucide-react";
import { ComingSoon } from "@/components/layout/coming-soon";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">Embroidery production pipeline</p>
      </div>
      <ComingSoon
        icon={ClipboardList}
        title="Orders module coming soon"
        description="Track jobs from order intake through production stages to delivery."
      />
    </div>
  );
}
