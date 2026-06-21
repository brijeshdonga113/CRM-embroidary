"use client";

import Link from "next/link";
import { Boxes, ClipboardList, Receipt, ArrowLeftRight, Building2, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { useRecentActivity, type ActivityType } from "@/lib/firestore/activity";
import { formatTimeAgo } from "@/lib/format";

const typeIcons: Record<ActivityType, typeof Receipt> = {
  invoice: Receipt,
  client: Building2,
  inventory: Boxes,
  stock: ArrowLeftRight,
  order: ClipboardList,
  "purchase-order": Truck,
};

export default function ActivityPage() {
  const { entries, loading } = useRecentActivity();

  return (
    <div className="space-y-6">
      <PageHeader backHref="/" title="Recent Activity" description="Everything that's happened across your workspace" />

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Activity Log</CardTitle>
          <CardDescription>Most recent first</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
          ) : entries.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No activity yet.</p>
          ) : (
            <ol className="space-y-1">
              {entries.map((item) => {
                const Icon = typeIcons[item.type];
                return (
                  <li key={item.id}>
                    <Link href={item.href} className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-accent">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                        <Icon className="size-4 text-muted-foreground" strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{item.title}</p>
                        <p className="truncate text-xs text-muted-foreground">{item.description}</p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">{formatTimeAgo(item.createdAt)}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
