"use client";

import { useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, SlidersHorizontal } from "lucide-react";
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
import { type StockMovement, type StockMovementType } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type FilterTab = "all" | StockMovementType;

const typeMeta: Record<StockMovementType, { label: string; className: string; icon: typeof ArrowDownLeft }> = {
  in: { label: "Stock In", className: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: ArrowDownLeft },
  out: { label: "Stock Out", className: "bg-red-50 text-red-700 border-red-200", icon: ArrowUpRight },
  adjustment: { label: "Adjustment", className: "bg-slate-50 text-slate-700 border-slate-200", icon: SlidersHorizontal },
};

export function StockMovementsTable({ movements }: { movements: StockMovement[] }) {
  const [tab, setTab] = useState<FilterTab>("all");

  const filtered = useMemo(
    () => (tab === "all" ? movements : movements.filter((m) => m.type === tab)),
    [movements, tab]
  );

  return (
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={(v) => setTab(v as FilterTab)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="in">Stock In</TabsTrigger>
          <TabsTrigger value="out">Stock Out</TabsTrigger>
          <TabsTrigger value="adjustment">Adjustment</TabsTrigger>
        </TabsList>
      </Tabs>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Performed By</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((movement) => {
            const meta = typeMeta[movement.type];
            return (
              <TableRow key={movement.id}>
                <TableCell className="text-sm font-medium">{movement.itemName}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("gap-1", meta.className)}>
                    <meta.icon className="size-3" />
                    {meta.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-sm">
                  {movement.quantity > 0 ? `+${movement.quantity}` : movement.quantity} {movement.unit}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{movement.reference}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{movement.date}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{movement.performedBy}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
