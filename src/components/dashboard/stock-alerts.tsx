import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { lowStockItems } from "@/lib/mock-data";

export function StockAlerts() {
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
        {lowStockItems.map((item) => {
          const pct = Math.round((item.remaining / item.total) * 100);
          return (
            <div key={item.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{item.name}</span>
                <span className="text-muted-foreground">
                  {item.remaining} {item.unit}
                </span>
              </div>
              <Progress value={pct} className="h-1.5" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
