"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useOrders } from "@/lib/firestore/orders";
import { formatDateDisplay } from "@/lib/format";
import { orderStatusColors, orderStatusLabels } from "@/lib/status-colors";
import { cn } from "@/lib/utils";

export function ActiveOrders() {
  const { orders, loading } = useOrders();
  const recent = orders.slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Production Orders</CardTitle>
        <CardDescription>Embroidery jobs currently in the pipeline</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        ) : (
          recent.map((order) => (
            <div key={order.id} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium leading-tight">{order.design}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {order.client} · {order.quantity} pcs · ETA {formatDateDisplay(order.eta)}
                </p>
              </div>
              <Badge variant="outline" className={cn("shrink-0 whitespace-nowrap", orderStatusColors[order.status])}>
                {orderStatusLabels[order.status]}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
