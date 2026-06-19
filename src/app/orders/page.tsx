import Link from "next/link";
import { AlertOctagon, CircleCheck, ClipboardList, Plus, Timer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { OrdersTable } from "@/components/orders/orders-table";
import { PageHeader } from "@/components/layout/page-header";
import { activeOrders } from "@/lib/mock-data";

export default function OrdersPage() {
  const inProduction = activeOrders.filter((o) => o.status === "in-production").length;
  const queued = activeOrders.filter((o) => o.status === "queued").length;
  const delayed = activeOrders.filter((o) => o.status === "delayed").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="Embroidery production pipeline"
        action={
          <Button render={<Link href="/orders/new" />} className="gap-1.5">
            <Plus className="size-4" />
            New Order
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Orders" value={String(activeOrders.length)} icon={ClipboardList} />
        <StatCard label="In Production" value={String(inProduction)} icon={Timer} />
        <StatCard label="Queued" value={String(queued)} icon={CircleCheck} />
        <StatCard label="Delayed" value={String(delayed)} icon={AlertOctagon} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Production Orders</CardTitle>
          <CardDescription>Jobs across intake, production, and delivery</CardDescription>
        </CardHeader>
        <CardContent>
          <OrdersTable orders={activeOrders} />
        </CardContent>
      </Card>
    </div>
  );
}
