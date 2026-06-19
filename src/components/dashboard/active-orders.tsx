import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { activeOrders, type Order } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusStyles: Record<Order["status"], string> = {
  "in-production": "bg-blue-50 text-blue-700 border-blue-200",
  queued: "bg-slate-50 text-slate-700 border-slate-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  delayed: "bg-red-50 text-red-700 border-red-200",
};

const statusLabel: Record<Order["status"], string> = {
  "in-production": "In production",
  queued: "Queued",
  completed: "Completed",
  delayed: "Delayed",
};

export function ActiveOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Production Orders</CardTitle>
        <CardDescription>Embroidery jobs currently in the pipeline</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeOrders.map((order) => (
          <div key={order.id} className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium leading-tight">{order.design}</p>
              <p className="truncate text-xs text-muted-foreground">
                {order.client} · {order.quantity} pcs · ETA {order.eta}
              </p>
            </div>
            <Badge variant="outline" className={cn("shrink-0 whitespace-nowrap", statusStyles[order.status])}>
              {statusLabel[order.status]}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
