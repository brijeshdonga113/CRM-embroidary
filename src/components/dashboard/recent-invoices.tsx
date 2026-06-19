import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { invoices, type InvoiceStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusStyles: Record<InvoiceStatus, string> = {
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  overdue: "bg-red-50 text-red-700 border-red-200",
};

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
    amount
  );
}

export function RecentInvoices() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base font-semibold">Recent Invoices</CardTitle>
          <CardDescription>Billing across firms and individual clients</CardDescription>
        </div>
        <Button variant="outline" size="sm" render={<Link href="/billing" />}>
          View all
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Firm / Client</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Due date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-7">
                      <AvatarFallback className="text-[11px]">{invoice.initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium leading-none">{invoice.firm}</p>
                      <p className="truncate text-xs text-muted-foreground">{invoice.contact}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{invoice.id}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{invoice.dueDate}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("capitalize", statusStyles[invoice.status])}>
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-sm font-medium">{formatINR(invoice.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
