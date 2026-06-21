import { type Invoice, type InvoiceStatus } from "@/lib/mock-data";

export function getTotalPaid(invoice: Invoice): number {
  return (invoice.payments ?? []).reduce((sum, p) => sum + p.amount, 0);
}

export function getBalanceDue(invoice: Invoice): number {
  return Math.max(0, invoice.amount - getTotalPaid(invoice));
}

function isPastDue(dueDate: string): boolean {
  if (!dueDate) return false;
  const due = new Date(`${dueDate}T00:00:00`);
  if (Number.isNaN(due.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due.getTime() < today.getTime();
}

/**
 * Status as it should be treated right now: a "pending" invoice whose due
 * date has passed is effectively overdue, even before anyone touches it.
 * One-directional only — never auto-reverts a manually set "overdue" back
 * to "pending", and never overrides "paid".
 */
export function getEffectiveStatus(invoice: Invoice): InvoiceStatus {
  if (invoice.status === "pending" && isPastDue(invoice.dueDate)) {
    return "overdue";
  }
  return invoice.status;
}
