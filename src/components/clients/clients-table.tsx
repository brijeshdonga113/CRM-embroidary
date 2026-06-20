"use client";

import { useMemo, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Client, type ClientType } from "@/lib/mock-data";
import { useClientBillingTotals } from "@/lib/firestore/billing-summary";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

type FilterTab = "all" | ClientType;

export function ClientsTable({ clients }: { clients: Client[] }) {
  const [tab, setTab] = useState<FilterTab>("all");
  const { getTotals } = useClientBillingTotals();

  const filtered = useMemo(
    () => (tab === "all" ? clients : clients.filter((c) => c.type === tab)),
    [clients, tab]
  );

  return (
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={(v) => setTab(v as FilterTab)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="Firm">Firms</TabsTrigger>
          <TabsTrigger value="Individual">Individuals</TabsTrigger>
        </TabsList>
      </Tabs>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead className="text-right">Total Billed</TableHead>
            <TableHead className="text-right">Outstanding</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((client) => {
            const totals = getTotals(client.id);
            return (
              <TableRow key={client.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-7">
                      <AvatarFallback className="text-[11px]">{client.initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium leading-none">{client.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{client.address}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-muted/50">
                    {client.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{client.contactPerson}</p>
                  <p className="text-xs text-muted-foreground">{client.phone}</p>
                </TableCell>
                <TableCell className="text-right text-sm font-medium">
                  {formatINR(totals.totalBilled)}
                </TableCell>
                <TableCell className="text-right text-sm">
                  {totals.outstanding > 0 ? (
                    <span className={cn("font-medium text-amber-700")}>{formatINR(totals.outstanding)}</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
