import { type LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  icon: LucideIcon;
};

export function StatCard({ label, value, delta, deltaLabel, icon: Icon }: StatCardProps) {
  const isPositive = (delta ?? 0) >= 0;

  return (
    <Card>
      <CardContent className="flex items-start justify-between p-5">
        <div className="space-y-1.5">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          {delta !== undefined && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                isPositive ? "text-emerald-600" : "text-destructive"
              )}
            >
              {isPositive ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
              <span>{Math.abs(delta)}%</span>
              {deltaLabel && <span className="font-normal text-muted-foreground">{deltaLabel}</span>}
            </div>
          )}
        </div>
        <div className="flex size-9 items-center justify-center rounded-md bg-muted text-foreground">
          <Icon className="size-5" strokeWidth={1.75} />
        </div>
      </CardContent>
    </Card>
  );
}
