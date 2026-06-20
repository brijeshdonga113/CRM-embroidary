// Shared domain types, consumed by the Firestore service layer in lib/firestore/.
// `createdAt` (epoch millis) is populated from each document's Firestore
// serverTimestamp() and used to merge/sort activity across collections.

export type InvoiceStatus = "paid" | "pending" | "overdue";

export type InvoiceLineItem = {
  description: string;
  quantity: number;
  rate: number;
  inventoryItemId?: string;
};

export type Invoice = {
  id: string;
  firm: string;
  contact: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
  initials: string;
  clientId?: string;
  clientPhone?: string;
  invoiceDate?: string;
  lineItems?: InvoiceLineItem[];
  subtotal?: number;
  taxRate?: number;
  tax?: number;
  notes?: string;
  reminderDate?: string;
  createdAt?: number;
};

export type InventoryCategory = "Thread" | "Fabric" | "Backing" | "Accessory" | "Design";

export type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  category: InventoryCategory;
  unit: string;
  quantity: number;
  reorderLevel: number;
  unitCost: number;
  supplier: string;
  createdAt?: number;
};

export type StockMovementType = "in" | "out" | "adjustment";

export type StockMovement = {
  id: string;
  itemName: string;
  type: StockMovementType;
  quantity: number;
  unit: string;
  date: string;
  reference: string;
  performedBy: string;
  notes?: string;
  createdAt?: number;
};

export type ClientType = "Firm" | "Individual";

export type Client = {
  id: string;
  name: string;
  type: ClientType;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  initials: string;
  createdAt?: number;
};

// Billing totals are not stored on the client record — they're derived
// live from the billings collection via useClientBillingTotals().
export type ClientBillingTotals = {
  totalBilled: number;
  outstanding: number;
};

export type Order = {
  id: string;
  client: string;
  design: string;
  quantity: number;
  status: "in-production" | "queued" | "completed" | "delayed";
  eta: string;
  notes?: string;
  createdAt?: number;
};
