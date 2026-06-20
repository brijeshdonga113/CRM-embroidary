"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRecentActivity } from "@/lib/firestore/activity";
import { formatTimeAgo } from "@/lib/format";

export function RecentActivity() {
  const { entries, loading } = useRecentActivity(6);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
          <CardDescription>Latest updates across your workspace</CardDescription>
        </div>
        <Button variant="outline" size="sm" render={<Link href="/activity" />}>
          View all
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity yet.</p>
        ) : (
          <ol className="space-y-5">
            {entries.map((item, i) => (
              <li key={item.id} className="relative flex gap-3 pl-0.5">
                <div className="flex flex-col items-center">
                  <span className="mt-1 size-1.5 rounded-full bg-foreground" />
                  {i < entries.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
                </div>
                <Link href={item.href} className="pb-1 hover:opacity-80">
                  <p className="text-sm font-medium leading-tight">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{formatTimeAgo(item.createdAt)}</p>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
