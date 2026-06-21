"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FollowUpSheet } from "@/components/billing/follow-up-sheet";
import { EditInvoiceSheet } from "@/components/billing/edit-invoice-sheet";
import { type Invoice, type InvoiceStatus } from "@/lib/mock-data";
import { markReminderSent } from "@/lib/firestore/invoices";
import { buildWhatsAppLink, buildInvoiceMessage } from "@/lib/whatsapp";
import { formatINR, formatDateDisplay } from "@/lib/format";
import { cn } from "@/lib/utils";

const statusStyles: Record<InvoiceStatus, string> = {
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  overdue: "bg-red-50 text-red-700 border-red-200",
};

type FilterTab = "all" | InvoiceStatus;

export function InvoiceTable({
  invoices,
  limit,
  showTabs = false,
}: {
  invoices: Invoice[];
  limit?: number;
  showTabs?: boolean;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<FilterTab>("all");
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const base = tab === "all" ? invoices : invoices.filter((i) => i.status === tab);
    return limit ? base.slice(0, limit) : base;
  }, [invoices, tab, limit]);

  const counts = useMemo(
    () => ({
      all: invoices.length,
      pending: invoices.filter((i) => i.status === "pending").length,
      overdue: invoices.filter((i) => i.status === "overdue").length,
      paid: invoices.filter((i) => i.status === "paid").length,
    }),
    [invoices]
  );

  return (
    <div className="space-y-4">
      {showTabs && (
        <Tabs value={tab} onValueChange={(v) => setTab(v as FilterTab)}>
          <TabsList>
            <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
            <TabsTrigger value="overdue">Overdue ({counts.overdue})</TabsTrigger>
            <TabsTrigger value="paid">Paid ({counts.paid})</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Firm / Client</TableHead>
            <TableHead>Due date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((invoice) => (
            <TableRow
              key={invoice.id}
              onClick={() => router.push(`/billing/${invoice.id}`)}
              className="cursor-pointer"
            >
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
              <TableCell className="text-sm text-muted-foreground">
                {formatDateDisplay(invoice.dueDate)}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={cn("capitalize", statusStyles[invoice.status])}>
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right text-sm font-medium">
                {formatINR(invoice.amount)}
              </TableCell>
              <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-end gap-1">
                  {invoice.status !== "paid" && (
                    <FollowUpSheet
                      invoice={invoice}
                      sent={sentIds.has(invoice.id)}
                      onSent={() => {
                        setSentIds((prev) => {
                          const next = new Set(prev);
                          next.add(invoice.id);
                          return next;
                        });
                        void markReminderSent(invoice.id);
                      }}
                    />
                  )}
                  <EditInvoiceSheet invoice={invoice} />
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    render={
                      <a
                        href={buildWhatsAppLink(invoice.clientPhone, buildInvoiceMessage(invoice))}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                    aria-label="Send invoice via WhatsApp"
                  >
                    <MessageCircle className="size-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
