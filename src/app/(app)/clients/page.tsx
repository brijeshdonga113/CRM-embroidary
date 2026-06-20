"use client";

import Link from "next/link";
import { Banknote, Building2, Plus, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { ClientsTable } from "@/components/clients/clients-table";
import { PageHeader } from "@/components/layout/page-header";
import { useClients } from "@/lib/firestore/clients";
import { useClientBillingTotals } from "@/lib/firestore/billing-summary";
import { formatINR } from "@/lib/format";

export default function ClientsPage() {
  const { clients, loading } = useClients();
  const { totalsByClientId } = useClientBillingTotals();

  const firmCount = clients.filter((c) => c.type === "Firm").length;
  const individualCount = clients.filter((c) => c.type === "Individual").length;
  const totalOutstanding = Object.values(totalsByClientId).reduce((sum, t) => sum + t.outstanding, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients & Firms"
        description="Companies and individuals you bill and ship to"
        action={
          <Button render={<Link href="/clients/new" />} className="gap-1.5">
            <Plus className="size-4" />
            Add Client
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Firms" value={String(firmCount)} icon={Building2} />
        <StatCard label="Individuals" value={String(individualCount)} icon={User} />
        <StatCard label="Total Outstanding" value={formatINR(totalOutstanding)} icon={Banknote} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Directory</CardTitle>
          <CardDescription>Firm and individual client profiles</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading clients…</p>
          ) : clients.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No clients yet. Add your first firm or individual client.
            </p>
          ) : (
            <ClientsTable clients={clients} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
