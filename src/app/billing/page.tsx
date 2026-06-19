import { Receipt } from "lucide-react";
import { ComingSoon } from "@/components/layout/coming-soon";

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Billing</h1>
        <p className="text-sm text-muted-foreground">Invoices and payments across firms and individual clients</p>
      </div>
      <ComingSoon
        icon={Receipt}
        title="Billing module coming soon"
        description="Create and track invoices per firm or client, set payment terms, and reconcile payments here."
      />
    </div>
  );
}
