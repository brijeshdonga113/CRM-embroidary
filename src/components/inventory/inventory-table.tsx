"use client";

import { useMemo, useState } from "react";
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
import { type InventoryCategory, type InventoryItem } from "@/lib/mock-data";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

type FilterTab = "all" | InventoryCategory;

const categories: InventoryCategory[] = ["Thread", "Fabric", "Backing", "Accessory", "Design"];

function stockStatus(item: InventoryItem) {
  if (item.reorderLevel === 0) return { label: "N/A", className: "bg-slate-50 text-slate-600 border-slate-200" };
  if (item.quantity === 0) return { label: "Out of stock", className: "bg-red-50 text-red-700 border-red-200" };
  if (item.quantity <= item.reorderLevel)
    return { label: "Low stock", className: "bg-amber-50 text-amber-700 border-amber-200" };
  return { label: "In stock", className: "bg-emerald-50 text-emerald-700 border-emerald-200" };
}

export function InventoryTable({ items }: { items: InventoryItem[] }) {
  const [tab, setTab] = useState<FilterTab>("all");

  const filtered = useMemo(
    () => (tab === "all" ? items : items.filter((i) => i.category === tab)),
    [items, tab]
  );

  return (
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={(v) => setTab(v as FilterTab)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.map((c) => (
            <TabsTrigger key={c} value={c}>
              {c}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Reorder Level</TableHead>
            <TableHead className="text-right">Unit Cost</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((item) => {
            const status = stockStatus(item);
            return (
              <TableRow key={item.id}>
                <TableCell>
                  <p className="text-sm font-medium leading-none">{item.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.sku}</p>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{item.category}</TableCell>
                <TableCell className="text-right text-sm">
                  {item.quantity} {item.unit}
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {item.reorderLevel || "—"}
                </TableCell>
                <TableCell className="text-right text-sm">
                  {item.unitCost ? formatINR(item.unitCost) : "—"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{item.supplier}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(status.className)}>
                    {status.label}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
