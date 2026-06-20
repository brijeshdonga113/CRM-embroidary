"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useMonthlyRevenue } from "@/lib/firestore/reports";

function formatCurrency(value: number) {
  return `₹${(value / 1000).toFixed(0)}k`;
}

export function RevenueChart() {
  const { data, loading } = useMonthlyRevenue(6);
  const hasData = data.some((d) => d.revenue > 0 || d.outstanding > 0);

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
        <CardDescription>Collected revenue vs. outstanding over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        {loading ? (
          <p className="px-6 py-12 text-center text-sm text-muted-foreground">Loading…</p>
        ) : !hasData ? (
          <p className="px-6 py-12 text-center text-sm text-muted-foreground">
            No invoices yet — this chart will fill in as you create them.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--foreground)" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="var(--foreground)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="outstandingFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--muted-foreground)" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="var(--muted-foreground)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="var(--foreground)"
                strokeWidth={2}
                fill="url(#revenueFill)"
              />
              <Area
                type="monotone"
                dataKey="outstanding"
                name="Outstanding"
                stroke="var(--muted-foreground)"
                strokeWidth={2}
                fill="url(#outstandingFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
