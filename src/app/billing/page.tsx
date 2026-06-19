import { AlertCircle, Banknote, CircleCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { InvoiceTable } from "@/components/billing/invoice-table";
import { invoices } from "@/lib/mock-data";
import { formatINR } from "@/lib/format";

export default function BillingPage() {
  const outstanding = invoices
    .filter((i) => i.status !== "paid")
    .reduce((sum, i) => sum + i.amount, 0);
  const overdueCount = invoices.filter((i) => i.status === "overdue").length;
  const paidTotal = invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Billing</h1>
        <p className="text-sm text-muted-foreground">
          Collect payments across firms and individual clients
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Outstanding" value={formatINR(outstanding)} icon={Banknote} />
        <StatCard label="Overdue Invoices" value={String(overdueCount)} icon={AlertCircle} />
        <StatCard label="Collected" value={formatINR(paidTotal)} icon={CircleCheck} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Invoices</CardTitle>
          <CardDescription>Send payment reminders for pending and overdue invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <InvoiceTable invoices={invoices} showTabs />
        </CardContent>
      </Card>
    </div>
  );
}
