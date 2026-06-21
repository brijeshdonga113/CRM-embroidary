import { type LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "positive" | "warning" | "negative";

const toneStyles: Record<Tone, string> = {
  neutral: "bg-muted text-foreground",
  positive: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  negative: "bg-red-50 text-red-700",
};

type StatCardProps = {
  label: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  icon: LucideIcon;
  tone?: Tone;
};

export function StatCard({ label, value, delta, deltaLabel, icon: Icon, tone = "neutral" }: StatCardProps) {
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
        <div className={cn("flex size-9 items-center justify-center rounded-md", toneStyles[tone])}>
          <Icon className="size-5" strokeWidth={1.75} />
        </div>
      </CardContent>
    </Card>
  );
}
