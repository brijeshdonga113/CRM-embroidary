import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { recentActivity } from "@/lib/mock-data";

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
        <CardDescription>Latest updates across your workspace</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="space-y-5">
          {recentActivity.map((item, i) => (
            <li key={item.id} className="relative flex gap-3 pl-0.5">
              <div className="flex flex-col items-center">
                <span className="mt-1 size-1.5 rounded-full bg-foreground" />
                {i < recentActivity.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
              </div>
              <div className="pb-1">
                <p className="text-sm font-medium leading-tight">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{item.time}</p>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
