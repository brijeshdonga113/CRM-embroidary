import { Building2 } from "lucide-react";
import { ComingSoon } from "@/components/layout/coming-soon";

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Clients & Firms</h1>
        <p className="text-sm text-muted-foreground">Companies and individuals you bill and ship to</p>
      </div>
      <ComingSoon
        icon={Building2}
        title="Client directory coming soon"
        description="Maintain firm and individual client profiles, billing addresses, and contact history."
      />
    </div>
  );
}
