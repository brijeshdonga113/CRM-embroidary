"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Building2, Boxes, Receipt, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useClients } from "@/lib/firestore/clients";
import { useInventoryItems } from "@/lib/firestore/inventory";
import { useInvoices } from "@/lib/firestore/invoices";
import { formatINR } from "@/lib/format";

type ResultType = "client" | "inventory" | "billing";

type SearchResult = {
  id: string;
  type: ResultType;
  title: string;
  subtitle: string;
  href: string;
};

const groupMeta: Record<ResultType, { label: string; icon: typeof Building2 }> = {
  client: { label: "Clients", icon: Building2 },
  inventory: { label: "Inventory", icon: Boxes },
  billing: { label: "Billing", icon: Receipt },
};

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { clients } = useClients();
  const { items } = useInventoryItems();
  const { invoices } = useInvoices();

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const clientResults: SearchResult[] = clients
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.contactPerson.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      )
      .slice(0, 5)
      .map((c) => ({ id: c.id, type: "client", title: c.name, subtitle: c.contactPerson, href: "/clients" }));

    const inventoryResults: SearchResult[] = items
      .filter((i) => i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q))
      .slice(0, 5)
      .map((i) => ({
        id: i.id,
        type: "inventory",
        title: i.name,
        subtitle: `${i.sku} • ${i.quantity} ${i.unit}`,
        href: "/inventory",
      }));

    const billingResults: SearchResult[] = invoices
      .filter(
        (inv) =>
          inv.firm.toLowerCase().includes(q) ||
          inv.contact.toLowerCase().includes(q) ||
          inv.id.toLowerCase().includes(q)
      )
      .slice(0, 5)
      .map((inv) => ({
        id: inv.id,
        type: "billing",
        title: inv.firm,
        subtitle: `${formatINR(inv.amount)} • ${inv.status}`,
        href: `/billing/${inv.id}`,
      }));

    return [...clientResults, ...inventoryResults, ...billingResults];
  }, [query, clients, items, invoices]);

  const grouped = useMemo(
    () => ({
      client: results.filter((r) => r.type === "client"),
      inventory: results.filter((r) => r.type === "inventory"),
      billing: results.filter((r) => r.type === "billing"),
    }),
    [results]
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function closeAndReset() {
    setOpen(false);
    setQuery("");
  }

  return (
    <div ref={containerRef} className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search invoices, clients, inventory…"
        className="pl-9"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />
      {open && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-96 overflow-y-auto rounded-lg border bg-popover p-1.5 text-popover-foreground shadow-md ring-1 ring-foreground/10">
          {results.length === 0 ? (
            <p className="px-2.5 py-4 text-center text-sm text-muted-foreground">No results for &ldquo;{query}&rdquo;</p>
          ) : (
            (["client", "inventory", "billing"] as ResultType[]).map((type) =>
              grouped[type].length > 0 ? (
                <div key={type} className="mb-1 last:mb-0">
                  <p className="px-1.5 py-1 text-xs font-medium text-muted-foreground">{groupMeta[type].label}</p>
                  {grouped[type].map((item) => (
                    <Link
                      key={`${item.type}-${item.id}`}
                      href={item.href}
                      onClick={closeAndReset}
                      className="flex items-center gap-2.5 rounded-md px-1.5 py-1.5 text-sm hover:bg-accent"
                    >
                      {(() => {
                        const Icon = groupMeta[type].icon;
                        return <Icon className="size-3.5 shrink-0 text-muted-foreground" />;
                      })()}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium leading-tight">{item.title}</p>
                        <p className="truncate text-xs text-muted-foreground">{item.subtitle}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : null
            )
          )}
        </div>
      )}
    </div>
  );
}
