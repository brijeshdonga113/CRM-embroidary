import { Settings } from "lucide-react";
import { ComingSoon } from "@/components/layout/coming-soon";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Workspace, team, and billing preferences</p>
      </div>
      <ComingSoon
        icon={Settings}
        title="Settings coming soon"
        description="Configure tax rates, invoice templates, user roles, and integrations."
      />
    </div>
  );
}
