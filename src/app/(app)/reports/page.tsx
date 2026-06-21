"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import {
  useTopClients,
  useInventoryValueByCategory,
  useOrderStatusBreakdown,
  useProfitAndLoss,
} from "@/lib/firestore/reports";
import { orderStatusColors, orderStatusLabels, financialTone } from "@/lib/status-colors";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function formatCurrencyShort(value: number) {
  return `₹${(value / 1000).toFixed(0)}k`;
}

export default function ReportsPage() {
  const { data: topClients, loading: topClientsLoading } = useTopClients(5);
  const { data: inventoryByCategory, loading: inventoryLoading } = useInventoryValueByCategory();
  const { data: orderStatus, loading: orderStatusLoading } = useOrderStatusBreakdown();
  const { data: pnl, loading: pnlLoading } = useProfitAndLoss();

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Revenue, clients, inventory, and production at a glance" />

      <RevenueChart />

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Profit &amp; Loss</CardTitle>
          <CardDescription>
            Based on paid invoices; cost of goods sold uses each item&rsquo;s current unit cost (an estimate, not
            historical cost)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pnlLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">Revenue</p>
                <p className={cn("mt-1 text-xl font-semibold tracking-tight", financialTone.positive)}>
                  {formatINR(pnl.revenue)}
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">Cost of Goods Sold</p>
                <p className={cn("mt-1 text-xl font-semibold tracking-tight", financialTone.negative)}>
                  {formatINR(pnl.cogs)}
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">Profit</p>
                <p
                  className={cn(
                    "mt-1 text-xl font-semibold tracking-tight",
                    pnl.profit >= 0 ? financialTone.positive : financialTone.negative
                  )}
                >
                  {formatINR(pnl.profit)}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Top Clients by Billing</CardTitle>
            <CardDescription>Your highest-billed clients to date</CardDescription>
          </CardHeader>
          <CardContent>
            {topClientsLoading ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
            ) : topClients.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No billing data yet.</p>
            ) : (
              <div className="space-y-3">
                {topClients.map((client, i) => (
                  <div key={client.id} className="flex items-center justify-between gap-3 text-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                        {i + 1}
                      </span>
                      <span className="font-medium">{client.name}</span>
                    </div>
                    <span className="text-muted-foreground">{formatINR(client.totalBilled)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Inventory Value by Category</CardTitle>
            <CardDescription>Stock on hand, valued at unit cost</CardDescription>
          </CardHeader>
          <CardContent>
            {inventoryLoading ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
            ) : inventoryByCategory.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No inventory yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={inventoryByCategory} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid horizontal={false} stroke="var(--border)" />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    tickFormatter={formatCurrencyShort}
                  />
                  <YAxis
                    type="category"
                    dataKey="category"
                    axisLine={false}
                    tickLine={false}
                    width={80}
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  />
                  <Tooltip
                    formatter={(value) => formatINR(Number(value))}
                    contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", fontSize: 12 }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {inventoryByCategory.map((entry, i) => (
                      <Cell key={entry.category} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Order Status Breakdown</CardTitle>
          <CardDescription>Where production orders currently stand</CardDescription>
        </CardHeader>
        <CardContent>
          {orderStatusLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {Object.entries(orderStatus).map(([status, count]) => (
                <div key={status} className="rounded-lg border p-4 text-center">
                  <p className="text-2xl font-semibold tracking-tight">{count}</p>
                  <Badge
                    variant="outline"
                    className={cn("mt-2", orderStatusColors[status as keyof typeof orderStatusColors])}
                  >
                    {orderStatusLabels[status as keyof typeof orderStatusLabels] ?? status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
