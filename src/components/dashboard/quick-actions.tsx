import Link from "next/link";
import { Boxes, Building2, ClipboardList, PackageSearch, Receipt, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const actions = [
  { label: "New Invoice", href: "/billing/new", icon: Receipt },
  { label: "Add Client", href: "/clients/new", icon: Building2 },
  { label: "New Order", href: "/orders/new", icon: ClipboardList },
  { label: "Add Inventory Item", href: "/inventory/new", icon: Boxes },
  { label: "New Purchase Order", href: "/purchase-orders/new", icon: Truck },
  { label: "New Stock Entry", href: "/stock/new", icon: PackageSearch },
];

export function QuickActions() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-4 text-center transition-colors hover:border-solid hover:border-foreground hover:bg-accent"
            >
              <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                <action.icon className="size-5 text-foreground" strokeWidth={1.75} />
              </div>
              <span className="text-xs font-medium leading-tight">{action.label}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
