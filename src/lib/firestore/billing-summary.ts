"use client";

import { useMemo } from "react";
import { useInvoices } from "@/lib/firestore/invoices";
import type { ClientBillingTotals } from "@/lib/mock-data";

const EMPTY_TOTALS: ClientBillingTotals = { totalBilled: 0, outstanding: 0 };

/** Live total billed + outstanding per client, derived from the billings collection. */
export function useClientBillingTotals() {
  const { invoices, loading } = useInvoices();

  const totalsByClientId = useMemo(() => {
    const totals: Record<string, ClientBillingTotals> = {};
    for (const invoice of invoices) {
      if (!invoice.clientId) continue;
      const current = totals[invoice.clientId] ?? { totalBilled: 0, outstanding: 0 };
      current.totalBilled += invoice.amount;
      if (invoice.status !== "paid") current.outstanding += invoice.amount;
      totals[invoice.clientId] = current;
    }
    return totals;
  }, [invoices]);

  function getTotals(clientId: string): ClientBillingTotals {
    return totalsByClientId[clientId] ?? EMPTY_TOTALS;
  }

  return { totalsByClientId, getTotals, loading };
}
