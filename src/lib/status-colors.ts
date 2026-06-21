import { type InvoiceStatus, type OrderStatus, type PurchaseOrderStatus } from "@/lib/mock-data";

// Centralized status -> color mapping so every table/page uses the same
// palette: emerald = good/complete, amber = needs attention, red = bad/overdue,
// blue = in progress, slate = neutral/not started.

export const invoiceStatusColors: Record<InvoiceStatus, string> = {
  paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  overdue: "border-red-200 bg-red-50 text-red-700",
};

export const orderStatusColors: Record<OrderStatus, string> = {
  "in-production": "border-blue-200 bg-blue-50 text-blue-700",
  queued: "border-slate-200 bg-slate-50 text-slate-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  delayed: "border-red-200 bg-red-50 text-red-700",
};

export const orderStatusLabels: Record<OrderStatus, string> = {
  "in-production": "In production",
  queued: "Queued",
  completed: "Completed",
  delayed: "Delayed",
};

export const purchaseOrderStatusColors: Record<PurchaseOrderStatus, string> = {
  draft: "border-slate-200 bg-slate-50 text-slate-700",
  ordered: "border-blue-200 bg-blue-50 text-blue-700",
  received: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cancelled: "border-red-200 bg-red-50 text-red-700",
};

export const purchaseOrderStatusLabels: Record<PurchaseOrderStatus, string> = {
  draft: "Draft",
  ordered: "Ordered",
  received: "Received",
  cancelled: "Cancelled",
};

export const inventoryStatusColors = {
  inStock: "border-emerald-200 bg-emerald-50 text-emerald-700",
  lowStock: "border-amber-200 bg-amber-50 text-amber-700",
  outOfStock: "border-red-200 bg-red-50 text-red-700",
  notApplicable: "border-slate-200 bg-slate-50 text-slate-700",
};

/** Financial positive/negative (profit & loss) text tone, used wherever a number represents a gain or a cost/loss. */
export const financialTone = {
  positive: "text-emerald-700",
  negative: "text-red-700",
  neutral: "text-muted-foreground",
};
