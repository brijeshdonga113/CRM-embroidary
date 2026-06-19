"use client";

import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useInventoryItems } from "@/lib/firestore/inventory";

export function StockAlerts() {
  const { items, loading } = useInventoryItems();
  const lowStock = items.filter((i) => i.reorderLevel > 0 && i.quantity <= i.reorderLevel);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-semibold">Low Stock Alerts</CardTitle>
          <AlertTriangle className="size-4 text-amber-500" />
        </div>
        <CardDescription>Items below reorder threshold</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : lowStock.length === 0 ? (
          <p className="text-sm text-muted-foreground">All stock levels look healthy.</p>
        ) : (
          lowStock.map((item) => {
            const pct = Math.min(100, Math.round((item.quantity / item.reorderLevel) * 100));
            return (
              <div key={item.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground">
                    {item.quantity} {item.unit}
                  </span>
                </div>
                <Progress value={pct} className="h-1.5" />
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
